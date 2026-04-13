import {Config} from "@config"
import type {
    AuthResponse,
    ChangePasswordData,
    ConfirmResetPasswordData,
    LoginCredentials,
    ResetPasswordData,
} from "@/types/auth/auth.types"
import type {UserTypes} from "@/types/user/user.types"
import apiService from "@/services/api.service"

class AuthService {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const form = new URLSearchParams()
        form.set("grant_type", "password")
        form.set("username", credentials.email)
        form.set("password", credentials.password)
        form.set("scope", "")
        form.set("client_id", "")
        form.set("client_secret", "")

        const data = await apiService.post<AuthResponse>(
            "/v1/auth/login",
            form,
            {baseURL: Config.API_BASE_URL, auth: false}
        )
        return data
    }

    async logout(): Promise<void> {
        localStorage.removeItem("auth_token")
        localStorage.removeItem("auth_user")
        localStorage.removeItem("refresh_token")
    }

    clearSession() {
        localStorage.removeItem("auth_token")
        localStorage.removeItem("auth_user")
        localStorage.removeItem("refresh_token")
    }

    getToken(): string | null {
        return localStorage.getItem("auth_token")
    }

    getAuthUser(): UserTypes | null {
        return JSON.parse(localStorage.getItem("auth_user") ?? "{}")
    }

    async getCurrentUser(): Promise<UserTypes | null> {
        const token = this.getToken()
        if (!token) return null

        const user = await apiService
            .get<UserTypes>("/v1/auth/me", {baseURL: Config.API_BASE_URL})
            .catch(() => null)

        if (user?.id) {
            localStorage.setItem("auth_user", JSON.stringify(user))
            return user
        }
        localStorage.removeItem("auth_user")
        return null
    }

    async forgotPassword(data: ResetPasswordData): Promise<void> {
        await apiService.post("/v1/auth/forgot-password", {email: data.email}, {baseURL: Config.API_BASE_URL})
    }

    async confirmPasswordReset(data: ConfirmResetPasswordData): Promise<void> {
        await apiService.post("/v1/auth/reset-password", {
            new_password: data.newPassword,
            token: data.token,
        }, {baseURL: Config.API_BASE_URL})
    }

    async changePassword(data: ChangePasswordData): Promise<void> {
        await apiService.put("/v1/auth/change-password", {
            current_password: data.currentPassword,
            new_password: data.newPassword,
        }, {baseURL: Config.API_BASE_URL})
    }

    async updateProfile(userData: Partial<UserTypes>): Promise<UserTypes> {
        const currentUser = await this.getCurrentUser()
        if (!currentUser) throw new Error("Usuário não autenticado")

        const updated = await apiService.put<UserTypes>(
            "/v1/auth/update-me",
            {...userData, id: currentUser.id},
            {baseURL: Config.API_BASE_URL}
        )

        localStorage.setItem("auth_user", JSON.stringify(updated))
        return updated
    }

    async verify2FA(code: string): Promise<AuthResponse> {
        const tempToken = localStorage.getItem("temp_auth_token")
        const data = await apiService.post<AuthResponse>(
            `/v1/auth/verify-2fa/${code}`,
            undefined,
            {
                baseURL: Config.API_BASE_URL,
                auth: false,
                headers: {Authorization: `Bearer ${tempToken}`, "Content-Type": "application/json"},
            }
        )
        localStorage.removeItem("temp_auth_token")
        localStorage.setItem("auth_token", data.access_token)
        if (data.user) localStorage.setItem("auth_user", JSON.stringify(data.user))
        return data
    }

    verifyUserByPassword(password: string): Promise<boolean> {
        return apiService.post("/v1/auth/verify-by-password", `{"password": "${password}"}`,
            {baseURL: Config.API_BASE_URL}
        )
    }

    // hasPermission(_permission: string): boolean {
    //     const user = localStorage.getItem("auth_user")
    //     if (!user) return false
    //     const parsed = JSON.parse(user) as UserTypes
    //     if (parsed.role === "admin") return true
    //     return true
    // }

    getQRCodeUrl(): Promise<{ otp_secret: string; otpauth_url: string }> {
        return apiService.post<{ otp_secret: string; otpauth_url: string }>("/v1/auth/setup-2fa", undefined, {
            baseURL: Config.API_BASE_URL,
        })
    }

    enable2FA(code: string, token: string): Promise<void> {
        return apiService.post<void>(
            "/v1/auth/enable-2fa",
            {code},
            {
                baseURL: Config.API_BASE_URL,
                headers: {
                    Authorization: `Bearer ${token}`
                },
                auth: false
            }
        )
    }

    disable2FA(): Promise<void> {
        return apiService.post<void>("/v1/auth/disable-2fa", undefined, {baseURL: Config.API_BASE_URL})
    }
}

export default new AuthService()
