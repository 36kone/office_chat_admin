export interface ForgotPasswordData {
    email: string;
}

export interface ConfirmResetPasswordData {
    newPassword: string;
    token: string;
}
