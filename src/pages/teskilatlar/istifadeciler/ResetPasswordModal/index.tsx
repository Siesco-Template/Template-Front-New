import { useState } from 'react';
import toast from 'react-hot-toast';

import { authService } from '@/modules/auth/services/auth.service';

import { S_Button, S_Input } from '@/ui';
import Modal from '@/ui/dialog';
import { showToast } from '@/ui/toast/showToast';

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
        } catch (error: any) {
            showToast({
                label:
                    error?.data?.message || 'Şifrə sıfırlama əməliyyatı uğursuz oldu. Xahiş edirik yenidən cəhd edin.',
                type: 'error',
            });
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
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title="Şifrəni sıfırla"
            footer={
                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <S_Button
                        type="button"
                        variant="primary"
                        color="secondary"
                        onClick={() => onOpenChange(false)}
                        disabled={false}
                    >
                        Ləğv et
                    </S_Button>
                    <S_Button
                        type="submit"
                        variant="primary"
                        color="primary"
                        disabled={isLoading || !!error}
                        isLoading={isLoading}
                    >
                        Təsdiqlə
                    </S_Button>
                </div>
            }
        >
            <form onSubmit={handleSubmit} className={styles.form}>
                <S_Input
                    label="Yeni şifrə"
                    value={newPassword}
                    onChange={handleInput}
                    errorText={error}
                    placeholder="Yeni şifrəni daxil edin"
                />
            </form>
        </Modal>
    );
}
