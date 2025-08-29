import { useState } from 'react';
import toast from 'react-hot-toast';

import { authService } from '@/modules/auth/services/auth.service';

import { S_Button } from '@/ui';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/ui/dialog/shared';
import S_Textarea from '@/ui/textarea';

import styles from './style.module.css';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: () => Promise<void>;
    selectedUserId?: string;
}

export function BlockModal({ open, onOpenChange, onSubmit, selectedUserId }: Props) {
    const [isBlocking, setIsBlocking] = useState(false);
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReason(e.target.value);

        if (e.target.value) {
            setError('');
        } else {
            setError('Səbəb boş ola bilməz.');
        }
    };

    const toggleBlockUser = async (id: string) => {
        if (!id) return;
        setIsBlocking(true);

        try {
            await authService.toggleBlockUser({ userId: id, blockInformation: reason });
        } catch (error) {
            // @ts-expect-error
            toast.error(error?.data?.message || 'Bloklama əməliyyatı uğursuz oldu. Xahiş edirik yenidən cəhd edin.');
        } finally {
            setIsBlocking(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!reason.trim()) {
            setError('Bloklama səbəbi boş ola bilməz.');
            return;
        }
        setError('');
        if (selectedUserId) {
            await toggleBlockUser(selectedUserId);
            onSubmit?.();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={styles.modalContent}>
                <DialogHeader>
                    <DialogTitle>Blokla</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <S_Textarea
                        value={reason}
                        onChange={handleInput}
                        errorText={error}
                        placeholder="Səbəbi daxil edin"
                        resize="vertical"
                        style={{ maxHeight: '200px' }}
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
                        <S_Button
                            type="submit"
                            variant="main-10"
                            disabled={isBlocking || !!error}
                            isLaoding={isBlocking}
                        >
                            Təsdiqlə
                        </S_Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
