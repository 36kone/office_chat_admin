import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    Sheet,
    SheetContent,
    SheetFooter,
    Button,
    Input,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Checkbox,
    Avatar,
    AvatarFallback,
    AvatarImage
} from '@/components';
import { Camera, Eye, EyeOff } from 'lucide-react';
import type { UserTypes } from '@/types/user/user.types';

interface UserSheetProps {
    user?: UserTypes | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    onDelete?: (userId: string) => Promise<void>;
}

export function UserSheet({ user, isOpen, onClose, onSave, onDelete }: UserSheetProps) {
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            cellphone: "",
            isActive: true,
            isAdmin: false,
            mfaEnabled: false,
            singleSession: false,
            avatar: ""
        }
    });

    const formData = watch();

    useEffect(() => {
        if (isOpen) {
            if (user) {
                reset({
                    ...user,
                    password: "", 
                    isActive: user.isActive ?? true,
                    mfaEnabled: user.mfaEnabled ?? false,
                } as any);
            } else {
                reset({
                    name: "",
                    email: "",
                    password: "",
                    cellphone: "",
                    isActive: true,
                    mfaEnabled: false,
                    singleSession: false,
                });
            }
        }
    }, [user, isOpen, reset]);

    const onFormSubmit = async (data: any) => {
        console.log("Submetendo dados:", data);
        try {
            await onSave(data);
        } catch (error) {
            console.error("Erro ao salvar formulário:", error);
        }
    };

    const onFormError = (errors: any) => {
        console.error("Erros de validação no formulário:", errors);
    };

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent side="right" className="sm:max-w-[500px] p-0 flex flex-col h-full border-none">
                {/* Dark Header */}
                <div className="bg-[#1a1a1a] h-32 relative flex-shrink-0">
                    <div className="absolute -bottom-12 left-8">
                        <div className="relative group">
                            <Avatar className="w-24 h-24 border-4 border-white shadow-lg bg-gray-200">
                                <AvatarImage src={formData.avatar} />
                                <AvatarFallback className="text-2xl bg-gray-400 text-white">
                                    {formData.name?.charAt(0).toUpperCase() || '?'}
                                </AvatarFallback>
                            </Avatar>
                            <button type="button" className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="w-8 h-8 text-white" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-8 pt-16 pb-8">
                    <form id="user-form" onSubmit={handleSubmit(onFormSubmit, onFormError)} className="space-y-6">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold text-background-900">
                                {user ? formData.name : 'Novo Usuário'}
                            </h2>
                        </div>

                        <div className="grid gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-bold">Nome*</Label>
                                <Input
                                    id="name"
                                    {...register("name", { required: "Nome é obrigatório" })}
                                    placeholder="Nome completo"
                                    className={`h-12 rounded-lg ${errors.name ? 'border-red-500' : ''}`}
                                />
                                {errors.name && <span className="text-xs text-red-500">{errors.name.message as string}</span>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-sm font-bold">Telefone</Label>
                                <Input
                                    id="phone"
                                    {...register("cellphone")}
                                    placeholder="(00) 00000-0000"
                                    className="h-12 rounded-lg"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-bold">Email*</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    {...register("email", { 
                                        required: "E-mail é obrigatório",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "E-mail inválido"
                                        }
                                    })}
                                    placeholder="email@empresa.com"
                                    className={`h-12 rounded-lg ${errors.email ? 'border-red-500' : ''}`}
                                />
                                {errors.email && <span className="text-xs text-red-500">{errors.email.message as string}</span>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-bold">
                                    {user ? 'Nova Senha (deixe em branco para manter)' : 'Senha*'}
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        {...register("password", { 
                                            required: user ? false : "Senha é obrigatória" 
                                        })}
                                        placeholder="••••••••"
                                        className={`h-12 rounded-lg pr-12 ${errors.password ? 'border-red-500' : ''}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.password && <span className="text-xs text-red-500">{errors.password.message as string}</span>}
                            </div>

                            <div className="space-y-1">
                                <Label className="text-sm font-bold">2 Fatores de autenticação*</Label>
                                <Select 
                                    value={formData.mfaEnabled ? "active" : "inactive"}
                                    onValueChange={(val) => setValue("mfaEnabled", val === "active")}
                                >
                                    <SelectTrigger className="h-12 rounded-lg">
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Ativo</SelectItem>
                                        <SelectItem value="inactive">Inativo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-4 pt-4s border-t border-gray-100">
                                <div className="flex items-center space-x-3">
                                    <Checkbox 
                                        id="single-login" 
                                        checked={formData.singleSession}
                                        onCheckedChange={(checked) => setValue("singleSession", !!checked)}
                                    />
                                    <Label htmlFor="single-login" className="text-sm font-medium leading-none cursor-pointer">
                                        Login único
                                    </Label>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Checkbox 
                                        id="single-login" 
                                        checked={formData.isAdmin}
                                        onCheckedChange={(checked) => setValue("isAdmin", !!checked)}
                                    />
                                    <Label htmlFor="single-login" className="text-sm font-medium leading-none cursor-pointer">
                                        Administrador
                                    </Label>
                                </div>
                            </div>

                        </div>
                    </form>
                </div>

                <SheetFooter className="p-6 bg-gray-50 border-t border-gray-100 flex-row justify-between items-center sm:justify-between">
                    <div>
                        {user && (
                            <Button
                                type="button"
                                variant="ghost"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 font-bold gap-2"
                                onClick={() => user.id && onDelete?.(user.id)}
                            >
                                Apagar
                            </Button>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="font-bold text-gray-600"
                        >
                            Cancelar
                        </Button>
                        <Button
                            form="user-form"
                            type="submit"
                            className="bg-[#1a1a1a] hover:bg-black text-white px-8 rounded-full font-bold"
                            onClick={() => {
                                if (Object.keys(errors).length > 0) {
                                    console.log("Erros detectados no clique:", errors);
                                }
                            }}
                        >
                            Salvar
                        </Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
