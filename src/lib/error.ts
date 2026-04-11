export function getErrorMessage(error: any): string {
    if (error?.response?.data?.message) {
        return error.response.data.message;
    }
    if (error?.message) {
        return error.message;
    }
    return "Ocorreu um erro inesperado. Tente novamente.";
}
