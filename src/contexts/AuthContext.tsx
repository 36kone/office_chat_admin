import React, {createContext, useContext, useEffect, useState} from "react"
import authService from "@/services/auth/auth.service"
import type {AuthResponse, ChangePasswordData, LoginCredentials,} from "@/types/auth/auth.types"
import type {UserTypes} from "@/types/user/user.types"
import {toast} from "@/components/ui/use-toast.ts";

interface AuthContextType {
    user: UserTypes | null
    loading: boolean
    login: (credentials: LoginCredentials) => Promise<AuthResponse>
    logout: () => Promise<void>
    updateProfile: (userData: Partial<UserTypes>) => Promise<void>
    changePassword: (data: ChangePasswordData) => Promise<void>
    isAuthenticated: boolean
    isAdmin: boolean
    hasPermission: (permission: string) => boolean
    confirm2FA: (data: AuthResponse) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) throw new Error("useAuth must be used within an AuthProvider")
    return context
}

interface AuthProviderProps {
    children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [user, setUser] = useState<UserTypes | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        void me()
    }, [])

    const me = async () => {
        try {
            const currentUser = await authService.getCurrentUser()
            const token = authService.getToken()

            if (currentUser && token) {
                setUser(currentUser)
            } else {
                setUser(null)
                await authService.logout()
            }
        } catch {
            setUser(null)
            await authService.logout()
        } finally {
            setLoading(false)
        }
    }

    const login = async (credentials: LoginCredentials) => {
        try {
            setLoading(true)
            const authData = await authService.login(credentials)

            if (!authData.user) {
                return authData
            }

            if (authData.token_role === "mfa") {
                return authData
            }

            setUser(authData.user)
            localStorage.setItem("auth_token", authData.access_token)
            localStorage.setItem("auth_user", JSON.stringify(authData.user))

            toast({
                title: "Login realizado com sucesso",
                description: `Bem-vindo(a), ${authData.user.name}!`,
            })

            return authData
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erro ao fazer login"
            toast({title: "Erro no login", description: message, variant: "destructive"})
            throw error
        } finally {
            setLoading(false)
        }
    }

    const confirm2FA = async (finalData: AuthResponse) => {
        if (finalData?.access_token && finalData?.user) {
            localStorage.setItem("auth_token", finalData.access_token)
            localStorage.setItem("auth_user", JSON.stringify(finalData.user))
            localStorage.removeItem("temp_auth_token")

            setUser(finalData.user)

            toast({
                title: "Login concluído",
                description: `Bem-vindo(a), ${finalData.user.name}!`,
            })
        }
    }

    const logout = async () => {
        try {
            await authService.logout()
            setUser(null)
            toast({title: "Logout realizado", description: "Você foi desconectado com sucesso."})
        } catch (e) {
            console.error("Erro ao fazer logout:", e)
            setUser(null)
        }
    }

    const updateProfile = async (userData: Partial<UserTypes>) => {
        try {
            const updatedUser = await authService.updateProfile(userData)
            setUser(updatedUser)
            toast({title: "Perfil atualizado", description: "Seus dados foram atualizados com sucesso."})
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erro ao atualizar perfil"
            toast({title: "Erro ao atualizar perfil", description: message, variant: "destructive"})
            throw error
        }
    }

    const changePassword = async (data: ChangePasswordData) => {
        try {
            await authService.changePassword(data)
            toast({title: "Senha alterada", description: "Sua senha foi alterada com sucesso."})
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erro ao alterar senha"
            toast({title: "Erro ao alterar senha", description: message, variant: "destructive"})
            throw error
        }
    }

    const token = authService.getToken()
    const isAuthenticated = !!(user && token)
    const isAdmin = user?.isAdmin || false

    const hasPermission = (_permission: string) => {
        if (!user) return false
        if (user.isAdmin) return true
        return true
    }

    const value: AuthContextType = {
        user,
        loading,
        login,
        logout,
        updateProfile,
        changePassword,
        isAuthenticated,
        isAdmin,
        hasPermission,
        confirm2FA,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
