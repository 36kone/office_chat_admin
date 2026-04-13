import React, {useEffect, useState} from "react"
import {useNavigate, useSearchParams} from "react-router-dom"
import {Button, Input, Label, Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components"
import {Eye, EyeOff, Lock} from "lucide-react"
import type {authService} from "@/services/auth/auth.service"
import type {ConfirmResetPasswordData} from "@/types/auth/auth.types"
import {useToast} from "@/hooks/use-toast.ts"
import type {getErrorMessage} from "@/lib/error.ts";

export default function ResetPassword() {
    const navigate = useNavigate()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [searchParams] = useSearchParams()
    const token = (searchParams.get("token") ?? "").trim()

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    })

    useEffect(() => {
        if (!token) {
            toast({
                title: "Link inválido ou expirado",
                description: "O link de redefinição não possui token.",
                variant: "destructive",
            })
        }
    }, [token])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!token) return

        setLoading(true)

        if (formData.password !== formData.confirmPassword) {
            toast({
                title: "Senhas não coincidem",
                description: "Verifique se as senhas são iguais.",
                variant: "destructive"
            })
            setLoading(false)
            return
        }

        if (formData.password.length < 6) {
            toast({
                title: "Senha muito curta",
                description: "A senha deve ter pelo menos 6 caracteres.",
                variant: "destructive"
            })
            setLoading(false)
            return
        }

        try {
            const payload = {
                newPassword: formData.confirmPassword,
                token: token,
            } as ConfirmResetPasswordData

            await authService.confirmPasswordReset(payload)

            toast({
                title: "Senha redefinida com sucesso",
                description: "Agora você pode fazer login com sua nova senha.",
            })

            navigate("/login")
        } catch (error) {
            toast({
                title: "Erro",
                description: getErrorMessage(error),
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-white p-4">
            <Card className="w-full max-w-md border-none shadow-lg">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                            <Lock className="w-8 h-8 text-white"/>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Redefinir Senha</CardTitle>
                    <CardDescription>
                        Digite sua nova senha
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Nova Senha</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    placeholder="Mínimo 6 caracteres"
                                    className="pl-9 pr-9 h-11 border-gray-200"
                                    required
                                    minLength={6}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                    placeholder="Digite a senha novamente"
                                    className="pl-9 pr-9 h-11 border-gray-200"
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                                </Button>
                            </div>
                        </div>

                        <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white h-11" disabled={loading}>
                            {loading ? "Redefinindo..." : "Redefinir Senha"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}