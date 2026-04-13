import {Config} from "@config"
import authService from "@/services/auth/auth.service"

export class ApiError extends Error {
    status: number
    payload?: unknown

    constructor(status: number, message: string, payload?: unknown) {
        super(message)
        this.status = status
        this.payload = payload
    }
}

type RequestOptions = Omit<RequestInit, "body"> & {
    body?: any
    auth?: boolean
    baseURL?: string
    params?: Record<string, string | number | boolean | undefined | null>
}

type UploadOptions = Omit<RequestOptions, "body"> & {
    onProgress?: (ev: ProgressEvent) => void
}

class ApiService {
    private defaultBase = Config.API_BASE_URL

    private getToken() {
        return authService.getToken()
    }

    private buildUrl(path: string, baseURL?: string, params?: RequestOptions["params"]) {
        const base = (baseURL ?? this.defaultBase).replace(/\/$/, "")
        const url = new URL(`${base}${path}`)
        if (params) {
            Object.entries(params).forEach(([k, v]) => {
                if (v !== undefined && v !== null) url.searchParams.set(k, String(v))
            })
        }
        return url.toString()
    }

    private options(options: RequestOptions = {}): RequestInit {
        const token = this.getToken()
        const headers = new Headers(options.headers as HeadersInit)

        const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData
        const isURLEncoded = typeof URLSearchParams !== "undefined" && options.body instanceof URLSearchParams
        if (!isFormData && !isURLEncoded && options.body && typeof options.body === "object") {
            headers.set("Content-Type", "application/json")
        }

        const useAuth = options.auth !== false
        if (useAuth && token) headers.set("Authorization", `Bearer ${token}`)

        return {
            ...options,
            headers,
            body:
                isFormData || isURLEncoded
                    ? options.body
                    : options.body && typeof options.body === "object"
                        ? JSON.stringify(options.body)
                        : options.body,
        }
    }

    private async handleResponse<T>(res: Response): Promise<T> {
        if (res.status === 401) {
            authService.clearSession()
            window.location.replace("/login")
            throw new ApiError(401, "Sessão expirada")
        }

        const text = await res.text()
        const maybeJson = text ? safeJson(text) : undefined

        if (!res.ok) {
            let msg: string = res.statusText || "Erro na requisição"

            if (maybeJson && typeof maybeJson === "object") {
                const d = (maybeJson as any).detail

                if (typeof d === "string") {
                    msg = d
                } else if (Array.isArray(d)) {
                    msg = d
                        .map((item: any) =>
                            item?.loc?.length
                                ? `${item.loc[item.loc.length - 1]}: ${item.msg}`
                                : item.msg || JSON.stringify(item)
                        )
                        .join(" | ")
                } else if (typeof (maybeJson as any).message === "string") {
                    msg = (maybeJson as any).message
                }
            }

            throw new ApiError(res.status, msg, maybeJson)
        }

        if (!text) return undefined as T
        return maybeJson as T
    }

    private async handleBlob(res: Response): Promise<Blob> {
        if (res.status === 401) {
            authService.clearSession();
            window.location.replace("/login");
            throw new ApiError(401, "Sessão expirada");
        }
        if (!res.ok) {
            const text = await res.text();
            const payload = text ? safeJson(text) : undefined;
            const msg =
                (payload)?.detail ||
                (payload)?.message ||
                res.statusText ||
                "Erro na requisição";
            throw new ApiError(res.status, msg, payload);
        }
        return res.blob();
    }

    async request<T = unknown>(path: string, options: RequestOptions = {}) {
        const url = this.buildUrl(path, options.baseURL, options.params)
        const init = this.options(options)
        const res = await fetch(url, init)
        return this.handleResponse<T>(res)
    }

    uploadFile<T = unknown>(path: string, form: FormData, options: UploadOptions = {}): Promise<T> {
        const url = this.buildUrl(path, options.baseURL, options.params)
        const token = this.getToken()
        const useAuth = options.auth !== false

        return new Promise<T>((resolve, reject) => {
            const xhr = new XMLHttpRequest()
            xhr.open("POST", url, true)

            if (useAuth && token) xhr.setRequestHeader("Authorization", `Bearer ${token}`)
            const extraHeaders = options.headers as Record<string, string> | undefined
            if (extraHeaders) {
                Object.entries(extraHeaders).forEach(([k, v]) => xhr.setRequestHeader(k, v as string))
            }

            if (options.onProgress) {
                xhr.upload.onprogress = options.onProgress
            }

            xhr.onload = async () => {
                const status = xhr.status
                const text = xhr.responseText ?? ""
                const payload = text ? safeJson(text) : undefined

                if (status === 401) {
                    authService.clearSession()
                    window.location.replace("/login")
                    reject(new ApiError(401, "Sessão expirada"))
                    return
                }
                if (status < 200 || status >= 300) {
                    const msg =
                        (payload)?.detail ||
                        (payload)?.message ||
                        xhr.statusText ||
                        "Erro na requisição"
                    reject(new ApiError(status, msg, payload))
                    return
                }

                resolve((payload as T) ?? (undefined as T))
            }

            xhr.onerror = () => {
                reject(new ApiError(0, "Falha de rede durante upload"))
            }

            xhr.send(form)
        })
    }

    getBlob(path: string, options: Omit<RequestOptions, "body"> = {}) {
        const url = this.buildUrl(path, options.baseURL, options.params);
        const init = this.options({...options, method: "GET"});
        return fetch(url, init).then(this.handleBlob);
    }

    postBlob(path: string, body?: unknown, options: Omit<RequestOptions, "body"> = {}) {
        const url = this.buildUrl(path, options.baseURL, options.params);
        const init = this.options({...options, method: "POST", body});
        return fetch(url, init).then(this.handleBlob);
    }

    get<T = unknown>(path: string, options: Omit<RequestOptions, "body"> = {}) {
        return this.request<T>(path, {...options, method: "GET"})
    }

    post<T = unknown>(path: string, body?: unknown, options: Omit<RequestOptions, "body"> = {}) {
        return this.request<T>(path, {...options, method: "POST", body})
    }

    put<T = unknown>(path: string, body?: unknown, options: Omit<RequestOptions, "body"> = {}) {
        return this.request<T>(path, {...options, method: "PUT", body})
    }

    delete<T = unknown>(path: string, options: Omit<RequestOptions, "body"> = {}) {
        return this.request<T>(path, {...options, method: "DELETE"})
    }
}

function safeJson(text: string) {
    try {
        return JSON.parse(text)
    } catch {
        return text
    }
}

export default new ApiService()
