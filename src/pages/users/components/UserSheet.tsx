import { useState, useEffect } from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
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
import { Camera, Eye, EyeOff, Trash2 } from 'lucide-react';
import type { User } from '@/types/types';

interface UserSheetProps {
    user?: User | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (user: Partial<User>) => void;
    onDelete?: (userId: string) => void;
}

export function UserSheet({ user, isOpen, onClose, onSave, onDelete }: UserSheetProps) {
    const [formData, setFormData] = useState<Partial<User>>({
        name: '',
        email: '',
        role: 'user',
        status: 'online',
        avatar: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData(user);
        } else {
            setFormData({
                name: '',
                email: '',
                role: 'user',
                status: 'online',
                avatar: '',
            });
        }
    }, [user, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
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
                            <button className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="w-8 h-8 text-white" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-8 pt-16 pb-8">
                    <form id="user-form" onSubmit={handleSubmit} className="space-y-6">
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
                                    value={formData.name || ''}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Nome completo"
                                    className="h-12 rounded-lg"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-sm font-bold">Telefone</Label>
                                <Input
                                    id="phone"
                                    placeholder="(00) 00000-0000"
                                    className="h-12 rounded-lg"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-bold">Email*</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email || ''}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="email@empresa.com"
                                    className="h-12 rounded-lg"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-bold">Password*</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        className="h-12 rounded-lg pr-12"
                                        required={!user}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-bold">2 Fatores de autenticação*</Label>
                                <Select defaultValue="inactive">
                                    <SelectTrigger className="h-12 rounded-lg">
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Ativo</SelectItem>
                                        <SelectItem value="inactive">Inativo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center space-x-3">
                                    <Checkbox id="single-login" />
                                    <Label htmlFor="single-login" className="text-sm font-medium leading-none cursor-pointer">
                                        Login único
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
                        >
                            Salvar
                        </Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
