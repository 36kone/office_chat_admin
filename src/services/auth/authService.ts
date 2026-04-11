import type { ForgotPasswordData, ConfirmResetPasswordData } from "@/types/auth/authTypes";

export const authService = {
    forgotPassword: async (data: ForgotPasswordData): Promise<void> => {
        console.log("Mocking forgot password for:", data.email);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (data.email === "error@test.com") {
                    reject(new Error("E-mail não encontrado"));
                } else {
                    resolve();
                }
            }, 1000);
        });
    },

    confirmPasswordReset: async (data: ConfirmResetPasswordData): Promise<void> => {
        console.log("Mocking password reset with token:", data.token);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 1000);
        });
    }
};
