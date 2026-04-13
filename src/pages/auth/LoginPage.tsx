import React, {useState} from "react"
import {Link, useNavigate} from "react-router-dom"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Alert, AlertDescription} from "@/components/ui/alert"
import {Eye, EyeOff, Mail, Lock, Shield, Copy, RefreshCw} from "lucide-react"
import {useAuth} from "@/contexts/AuthContext"
import authService from "@/services/auth/auth.service"
import {useApp} from "@/contexts/AppContext.tsx";
import type {UserTypes} from "@/types/user/user.types";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {QRCodeSVG} from "qrcode.react";
import {toast} from "@/components/ui/use-toast";

interface LoginPageProps {
    onLogin: (email: string, pass: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
    const navigate = useNavigate()
    const {login, confirm2FA} = useAuth()
    const {setIsLoading: setAppLoading} = useApp()

    const [isTwoFactorDialogOpen, setIsTwoFactorDialogOpen] = useState(false)
    const [qrCodeUrl, setQrCodeUrl] = useState('')
    const [backupCode, setBackupCode] = useState('')
    const [verificationCode, setVerificationCode] = useState('')

    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")

    const [isTwoFactor, setIsTwoFactor] = useState(false)
    const [twoFactorCode, setTwoFactorCode] = useState("")
    const [currentUser, setCurrentUser] = useState<UserTypes | null>(null)

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading) return;

        setIsLoading(true);
        setError("");

        try {
            if (!isTwoFactor) {
                const authData = await login({
                    email: formData.email,
                    password: formData.password,
                })

                if (authData?.otpauth_url) {
                    setQrCodeUrl(authData.otpauth_url || "")
                    setBackupCode(authData.otp_secret || "")

                    localStorage.setItem("temp_auth_token", authData.access_token || "")
                    setIsTwoFactorDialogOpen(true)
                    return
                }

                if (authData?.token_role === "mfa") {
                    localStorage.setItem("temp_auth_token", authData.access_token);
                    setCurrentUser(authData.user ?? null);
                    setIsTwoFactor(true);
                    return;
                }

                navigate("/");
                return;
            }

            if (!twoFactorCode) throw new Error("Digite o código de verificação.");
            if (!/^\d{6}$/.test(twoFactorCode))
                throw new Error("O código deve ter 6 dígitos.");

            const finalData = await authService.verify2FA(twoFactorCode);
            await confirm2FA(finalData);

            navigate("/");
        } catch (err: any) {
            const status = err?.response?.status ?? err?.status;

            if (status === 404) {
                setError("E-mail ou senha incorretos.");
            } else {
                setError(err.message || "Falha no login. Tente novamente.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleTwoFactorSetup = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!verificationCode) {
            toast({
                title: "Código obrigatório",
                description: "Digite o código de verificação do seu aplicativo",
                variant: "destructive"
            })
            return
        }

        if (verificationCode.length !== 6) {
            toast({
                title: "Código inválido",
                description: "O código deve ter 6 dígitos",
                variant: "destructive"
            })
            return
        }

        try {
            const data = await authService.verify2FA(verificationCode);
            toast({
                title: '2FA Ativado',
                description: 'Autenticação de dois fatores foi ativada com sucesso.'
            });

            setIsTwoFactor(true)
            setIsTwoFactorDialogOpen(false)

            if (data.user) {
                localStorage.setItem('auth_user', JSON.stringify(data.user));
            }

        } catch (error: any) {
            toast({
                title: "Erro ao ativar o 2FA",
                description: error.message || "",
                variant: "destructive"
            });
        }
    }

    const generateNewSecret = async () => {
        try {
            const data = await authService.getQRCodeUrl()

            setQrCodeUrl(data.otpauth_url)
            setBackupCode(data.otp_secret)
        } catch (error) {
            console.error('Erro ao gerar nova chave secreta', error)
        }
    }


    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast({
            title: "Copiado",
            description: "Código copiado para a área de transferência"
        })
    }

    const handleBackToLogin = () => {
        setIsTwoFactor(false);
        setTwoFactorCode("");
        setCurrentUser(null);
        setError("");
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/20 p-4">
            <Card className="w-full max-w-md py-10">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-48 h-16 flex items-center justify-center">
                            {/* SVG Logo Office Chat conforme solicitado */}
                            
                        </div>
                    </div>
                    {isTwoFactor && (
                        <CardTitle className="text-2xl font-bold">
                            Verificação de Segurança
                        </CardTitle>
                    )}
                    <CardDescription>
                        {isTwoFactor
                            ? "Digite o código de 6 dígitos do seu aplicativo de autenticação"
                            : "Digite suas credenciais para acessar o painel"
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!isTwoFactor ? (
                        // Formulário de login principal
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email">E-mail</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        placeholder="seu@email.com"
                                        className="pl-9"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Senha</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        placeholder="••••••••"
                                        className="pl-9 pr-9"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                                    </button>
                                </div>
                            </div>

                            <Button type="submit" className="w-full text-white font-bold" disabled={isLoading}>
                                {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin"/> : "Entrar"}
                            </Button>
                        </form>
                    ) : (
                        // Formulário de 2FA
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="twoFactorCode">Código de Verificação</Label>
                                <div className="relative">
                                    <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                                    <Input
                                        id="twoFactorCode"
                                        type="text"
                                        maxLength={6}
                                        value={twoFactorCode}
                                        onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ""))}
                                        placeholder="000000"
                                        className="pl-9 text-center tracking-widest text-lg font-bold"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Button type="submit" className="w-full text-white font-bold" disabled={isLoading}>
                                    {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin"/> : "Verificar"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={handleBackToLogin}
                                    className="w-full font-bold"
                                >
                                    Voltar para o Login
                                </Button>
                            </div>
                        </form>
                    )}
                </CardContent>

                {/* Diálogo de Configuração de 2FA (Opcional, baseado no exemplo) */}
                <Dialog open={isTwoFactorDialogOpen} onOpenChange={setIsTwoFactorDialogOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-white">Configurar Autenticação 2FA</DialogTitle>
                            <DialogDescription className="text-white/80">
                                Escaneie o código QR abaixo com seu aplicativo de autenticação (Google Authenticator, Authy, etc.)
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="flex flex-col items-center space-y-4 p-4">
                            {qrCodeUrl && (
                                <div className="bg-white p-4 rounded-lg shadow-sm border">
                                    <QRCodeSVG value={qrCodeUrl} size={200} />
                                </div>
                            )}
                            
                            <div className="w-full space-y-2">
                                <Label>Código de Backup (Se não conseguir escanear)</Label>
                                <div className="flex gap-2">
                                    <Input value={backupCode} readOnly className="bg-muted font-mono" />
                                    <Button size="icon" variant="outline" onClick={() => copyToClipboard(backupCode)}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="w-full space-y-2 pt-4 border-t">
                                <Label htmlFor="verificationCode">Digite o código gerado para confirmar</Label>
                                <Input
                                    id="verificationCode"
                                    placeholder="000000"
                                    maxLength={6}
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                                    className="text-center text-lg tracking-widest font-bold"
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setIsTwoFactorDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={handleTwoFactorSetup} disabled={isLoading} className="text-white font-bold">
                                Ativar 2FA
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </Card>
        </div>
    )
}
