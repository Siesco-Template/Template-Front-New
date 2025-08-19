import { useState } from 'react';
import toast from 'react-hot-toast';

import { authService } from '@/modules/auth/services/auth.service';

import { S_Button, S_Input } from '@/ui';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/ui/dialog';

import styles from './style.module.css';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: () => void;
    selectedUserId?: string;
}

export function ResetPasswordModal({ open, onOpenChange, onSubmit, selectedUserId }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.target.value);

        if (e.target.value) {
            setError('');
        } else {
            setError('Şifrə boş ola bilməz.');
        }
    };

    const resetPassword = async (id: string) => {
        if (!id) return;
        setIsLoading(true);

        try {
            await authService.resetPassword({ userId: id, newPassword });
        } catch (error) {
            toast.error(
                // @ts-expect-error
                error?.data?.message || 'Şifrə sıfırlama əməliyyatı uğursuz oldu. Xahiş edirik yenidən cəhd edin.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newPassword.trim()) {
            setError('Şifrə boş ola bilməz.');
            return;
        }
        setError('');
        if (selectedUserId) {
            await resetPassword(selectedUserId);
            onSubmit?.();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={styles.modalContent}>
                <DialogHeader>
                    <DialogTitle>Şifrəni sıfırla</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <S_Input
                        label="Yeni şifrə"
                        value={newPassword}
                        onChange={handleInput}
                        errorText={error}
                        placeholder="Yeni şifrəni daxil edin"
                    />

                    <DialogFooter>
                        <S_Button
                            type="button"
                            variant="outlined-10"
                            onClick={() => onOpenChange(false)}
                            disabled={false}
                        >
                            Ləğv et
                        </S_Button>
                        <S_Button type="submit" variant="main-10" disabled={isLoading || !!error} isLaoding={isLoading}>
                            Təsdiqlə
                        </S_Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
