import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
}

export function calculatePriceFields(value: string) {
    return Math.max(0, Number(value.replace(/\D/g, "")) / 100)
}

export function capitalize(value?: string) {
    if (!value) return "-"
    return value.charAt(0).toUpperCase() + value.slice(1);
}

export function capitalizeFirstOfAll(value?: string) {
    if (!value) return "-"

    const text = value.trim()
    if (!text) return "-"

    return text
        .split(/\s+/g)
        .map((word) => word ? word.charAt(0).toUpperCase() + word.slice(1) : "")
        .filter(Boolean)
        .join(" ")
}

export function formatDate(date: string) {
    const [year, month, day] = date.split("-")
    return `${day}/${month}/${year}`
}

export function formatDateTime(
    value: unknown,
    locale: string = 'pt-BR',
): string {
    if (!value) return '-';

    // Aceita tanto string quanto Date
    const date = value instanceof Date ? value : new Date(value as string);

    if (isNaN(date.getTime())) return '-';

    const datePart = date.toLocaleDateString(locale);
    const timePart = date.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
    });

    return `${datePart} ${timePart}`;
}
function parseYmd(value: string) {
    return parse(value, "yyyy-MM-dd", new Date())
}

export function formatWeekday (dateStr: string) {
    return format(parseYmd(dateStr), "EEEE", {locale: ptBR}).toUpperCase()
}

export function formatDay (dateStr: string) {
    return format(parseYmd(dateStr), "dd", {locale: ptBR})
}

export function formatMonth (dateStr: string) {
    return format(parseYmd(dateStr), "MMMM yyyy", {locale: ptBR})
}


export function onlyDigits (v?: string | null): string {
    return (v ?? "").replace(/\D/g, "")
}

export function removeSpecialCharacters(v?: string): string {
    return (v ?? "").replace(/[^\p{L}\p{N} ]/gu, "")
}

export function formatCPF (value: string) {
    const digits = onlyDigits(value).slice(0, 11)
    return digits
}

export function formatDocument (v?: string | null) {
    const onlyDigits = (v?: string | null) => (v ?? "").replace(/\D/g, "")
    const d = onlyDigits(v)
    if (!d) return "-"
    return d
}

export function getErrorMessage(error: unknown): string {
    if (typeof error === "string") return error;
    if (error instanceof Error) {
        if (error.message && error.message !== "[object Object]") {
            return error.message;
        }
    }
    return "Ocorreu um erro inesperado. Tente novamente.";
}
