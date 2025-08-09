import { useState } from 'react';
import toast from 'react-hot-toast';

import { authService } from '@/services/auth/auth.service';

import { S_Button } from '@/ui';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/ui/dialog';

import styles from './style.module.css';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: () => Promise<void>;
    selectedUserId?: string;
}

export function DeleteModal({ open, onOpenChange, onSubmit, selectedUserId }: Props) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (id: string) => {
        if (!id) return;
        setIsDeleting(true);

        try {
            await authService.deleteUser(id);
            onSubmit?.();
        } catch (error) {
            // @ts-expect-error
            toast.error(error?.data?.message || 'Silmə əməliyyatı uğursuz oldu');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={styles.modalContent}>
                <DialogHeader>
                    <DialogTitle>Xəbərdarlıq</DialogTitle>
                </DialogHeader>
                <div className={styles.body}>
                    <p>İstifadəçini silmək istədiyinizə əminsiniz?</p>

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
                            disabled={isDeleting}
                            isLaoding={isDeleting}
                            onClick={() => handleDelete(selectedUserId || '')}
                        >
                            Təsdiqlə
                        </S_Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
