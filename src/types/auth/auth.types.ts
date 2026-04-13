import type {UserTypes} from "@/types/user/user.types.ts";


export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterData {
    name: string
    email: string
    password: string
    phone?: string
}

export interface AuthResponse {
    user: UserTypes
    access_token: string
    token_type: string
    token_role: string
    otpauth_url?: string
    otp_secret?:string
}

export interface ResetPasswordData {
    email: string
}

export interface ConfirmResetPasswordData {
    newPassword: string
    token: string
}

export interface ChangePasswordData {
    currentPassword: string
    newPassword: string
}