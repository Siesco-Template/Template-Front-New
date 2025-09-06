import { useState } from 'react';
import toast from 'react-hot-toast';

import { authService } from '@/modules/auth/services/auth.service';

import { S_Button } from '@/ui';
import Modal from '@/ui/dialog';
import { showToast } from '@/ui/toast/showToast';

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
        } catch (error: any) {
            showToast({
                label: error?.data?.message || 'Silmə əməliyyatı uğursuz oldu',
                type: 'error',
            });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title="Xəbərdarlıq"
            size="xs"
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
                        disabled={isDeleting}
                        isLoading={isDeleting}
                        onClick={() => handleDelete(selectedUserId || '')}
                    >
                        Təsdiqlə
                    </S_Button>
                </div>
            }
        >
            <p>İstifadəçini silmək istədiyinizə əminsiniz?</p>
        </Modal>
    );
}
