import {useState} from "react";
import {Link} from "react-router-dom";
import {Button, Input, Label, Card, CardContent, CardDescription, CardHeader, CardTitle, Alert, AlertDescription} from "@/components";
import {Mail, ArrowLeft, CheckCircle} from "lucide-react";
import authService from "@/services/auth/auth.service";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Informe um e-mail válido.");
            return;
        }

        try {
            setIsLoading(true);
            await authService.forgotPassword({email});
            setIsSubmitted(true);
        } catch (err) {
            // const message = err instanceof Error ? err.message : "Falha ao enviar o e-mail de redefinição.";
            setError("E-mail não encontrado");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div
                className="min-h-screen flex items-center justify-center bg-white p-4">
                <Card className="w-full max-w-md border-none shadow-lg">
                    <CardHeader className="space-y-1 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-accent"/>
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold">E-mail Enviado</CardTitle>
                        <CardDescription>
                            Se o e-mail for válido, você receberá um link para redefinir sua senha
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Alert className="bg-accent/5 border-accent/20">
                            <Mail className="h-4 w-4 text-accent"/>
                            <AlertDescription className="text-accent/80">
                                Verifique sua caixa de entrada e spam. O link será válido por 1 hora.
                            </AlertDescription>
                        </Alert>

                        <div className="mt-6 space-y-4">
                            <Button asChild className="w-full bg-black hover:bg-gray-800 text-white">
                                <Link to="/login">Voltar ao Login</Link>
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full border-gray-200"
                                onClick={() => {
                                    setIsSubmitted(false);
                                    setEmail("");
                                    setError(null);
                                }}
                            >
                                Enviar para outro e-mail
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-white p-4">
            <Card className="w-full max-w-md border-none shadow-lg">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                            <Mail className="w-8 h-8 text-white"/>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Esqueci minha senha</CardTitle>
                    <CardDescription>Digite seu e-mail para receber um link de redefinição de senha</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="font-medium">E-mail</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="seu@email.com"
                                    className="pl-9 h-11 border-gray-200 focus:border-accent focus:ring-accent"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white h-11" disabled={isLoading}>
                            {isLoading ? "Enviando..." : "Enviar Link de Redefinição"}
                        </Button>

                        <Button variant="outline" asChild className="w-full h-11 border-gray-200">
                            <Link to="/login">
                                <ArrowLeft className="w-4 h-4 mr-2"/>
                                Voltar ao Login
                            </Link>
                        </Button>
                    </form>

                    <div className="mt-6 p-4 bg-accent/5 border border-accent/10 rounded-lg text-center">
                        <p className="text-sm text-accent/80">
                            <strong>Dica:</strong> Verifique também sua pasta de spam. Caso não receba o e-mail em
                            alguns minutos,
                            entre em contato com o administrador do sistema.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
