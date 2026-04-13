import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, RefreshCw, Shield, ShieldCheck, Loader2 } from 'lucide-react';
import authService from '@/services/auth/auth.service';
import { Badge } from '@/components/ui/badge';

interface ProfileMFADialogProps {
  mfaEnabled: boolean;
  onStatusChange: (enabled: boolean) => void;
}

export function ProfileMFADialog({ mfaEnabled, onStatusChange }: ProfileMFADialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDisableAlertOpen, setIsDisableAlertOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<{ otp_secret: string; otpauth_url: string } | null>(null);
  const [verificationCode, setVerificationCode] = useState('');

  const handleEnableClick = async () => {
    try {
      setIsLoading(true);
      const data = await authService.getQRCodeUrl();
      setQrCodeData(data);
      setIsOpen(true);
    } catch (error: any) {
      toast({
        title: "Erro ao configurar 2FA",
        description: error.message || "Não foi possível gerar o QR Code.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetup2FA = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "Código inválido",
        description: "O código deve ter 6 dígitos.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const token = authService.getToken();
      if (!token) throw new Error("Sessão expirada");

      await authService.enable2FA(verificationCode, token);
      
      toast({
        title: '2FA Ativado',
        description: 'Autenticação de dois fatores ativada com sucesso.',
      });

      onStatusChange(true);
      setIsOpen(false);
      setVerificationCode('');
    } catch (error: any) {
      toast({
        title: "Erro ao ativar o 2FA",
        description: error.message || "Código de verificação incorreto.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    try {
      setIsLoading(true);
      await authService.disable2FA();
      
      toast({
        title: '2FA Desativado',
        description: 'Autenticação de dois fatores desativada com sucesso.',
      });

      onStatusChange(false);
      setIsDisableAlertOpen(false);
    } catch (error: any) {
      toast({
        title: "Erro ao desativar o 2FA",
        description: error.message || "Não foi possível desativar o 2FA.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado",
      description: "Código copiado para a área de transferência",
    });
  };

  const generateNewSecret = async () => {
    await handleEnableClick();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            Autenticação de Dois Fatores
            {mfaEnabled && (
              <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100 text-[9px] font-black uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3 mr-1" />
                Ativo
              </Badge>
            )}
          </h4>
          <p className="text-xs text-gray-500">
            {mfaEnabled 
              ? "Sua conta está protegida com uma camada extra de segurança." 
              : "Adicione mais segurança exigindo um código do seu celular ao entrar."}
          </p>
        </div>
      </div>

      {!mfaEnabled ? (
        <Button 
          variant="outline" 
          className="w-full h-11 rounded-xl gap-2 font-bold border-2 hover:bg-gray-50 transition-all active:scale-[0.98]"
          onClick={handleEnableClick}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="w-4 h-4" />}
          Configurar Autenticação 2FA
        </Button>
      ) : (
        <Button 
          variant="outline" 
          className="w-full h-11 rounded-xl gap-2 font-bold border-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 transition-all active:scale-[0.98]"
          onClick={() => setIsDisableAlertOpen(true)}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="w-4 h-4" />}
          Desativar Autenticação 2FA
        </Button>
      )}

      {/* Dialog de Configuração */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Configurar 2FA</DialogTitle>
            <DialogDescription>
              Aumente a segurança da sua conta configurando o 2FA.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-gray-700">1. Escaneie o QR Code</h4>
              <p className="text-xs text-gray-500">
                Use um app como Google Authenticator ou Authy para escanear.
              </p>
              <div className="bg-gray-50 p-6 rounded-2xl flex items-center justify-center border border-gray-100 shadow-inner">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  {qrCodeData?.otpauth_url ? (
                    <QRCodeSVG 
                      value={qrCodeData.otpauth_url} 
                      size={160}
                      level="H"
                      includeMargin
                    />
                  ) : (
                    <div className="w-[160px] h-[160px] flex items-center justify-center text-gray-400">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-gray-700">2. Código Manual (Alternativa)</h4>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <code className="flex-1 text-xs font-mono font-bold text-indigo-600 text-center tracking-wider">
                  {qrCodeData?.otp_secret || "CARREGANDO..."}
                </code>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-lg"
                  onClick={() => qrCodeData?.otp_secret && copyToClipboard(qrCodeData.otp_secret)}
                >
                  <Copy className="w-4 h-4 text-gray-500" />
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-lg"
                  onClick={generateNewSecret}
                >
                  <RefreshCw className="w-4 h-4 text-gray-500" />
                </Button>
              </div>
            </div>

            <form onSubmit={handleSetup2FA} className="space-y-4">
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-gray-700">3. Digite o código de verificação</h4>
                <Input 
                  value={verificationCode} 
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))} 
                  placeholder="000000" 
                  className="h-12 text-center text-2xl font-black tracking-[0.5em] rounded-xl bg-gray-50 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
                <p className="text-[10px] text-gray-400 text-center italic">
                  Digite o código de 6 dígitos gerado pelo seu aplicativo.
                </p>
              </div>

              <DialogFooter className="flex sm:flex-row gap-2 pt-2">
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="flex-1 h-11 rounded-xl font-bold"
                  onClick={() => setIsOpen(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md"
                  disabled={isLoading || verificationCode.length !== 6}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ShieldCheck className="h-4 w-4 mr-2" />}
                  Confirmar e Ativar
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Alerta de Desativação */}
      <AlertDialog open={isDisableAlertOpen} onOpenChange={setIsDisableAlertOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Desativar Autenticação 2FA?</AlertDialogTitle>
            <AlertDialogDescription>
              Isso tornará sua conta menos segura. Você precisará apenas da sua senha para entrar no sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex sm:flex-row gap-2">
            <AlertDialogCancel className="flex-1 h-11 rounded-xl font-bold border-2">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDisable2FA();
              }}
              className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md"
            >
              Sim, Desativar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
