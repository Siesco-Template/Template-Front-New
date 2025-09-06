import { useState } from 'react';
import toast from 'react-hot-toast';

import { showToast } from '@/ui/toast/showToast';

import { Button } from '../components/Button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../components/Dialog';

interface ResetUserPasswordModalProps {
    resetPasswordDataID: string | null;
    closeModal: () => void;
    refreshData: () => void;
    email: string;
    // isBlock?: boolean;
}

const ResetUserPasswordWithEmailModal = ({
    resetPasswordDataID,
    closeModal,
    refreshData,
    email,
    // isBlock,
}: ResetUserPasswordModalProps) => {
    const [loading, setLoading] = useState<boolean>(false);

    function handleClose() {
        closeModal();
    }

    async function handleSubmit() {
        setLoading(true);

        try {
            const res = await fetch(
                `${import.meta.env.VITE_BASE_URL}/api/Auth/ResetPasswordWithEmail?userId=${resetPasswordDataID}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (!res.ok) {
                throw new Error('Əməliyyat uğursuz oldu');
            }
            handleClose();
            showToast({ label: 'Şifrə uğurla sıfırlandı', type: 'success' });
        } catch (error) {
            showToast({ label: 'Əməliyyat uğursuz oldu', type: 'error' });
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={!!resetPasswordDataID} onOpenChange={handleClose}>
            <DialogContent className="!gap-[12px] admin__users--auth">
                <DialogHeader>
                    <DialogTitle className="!text-[20px] font-bold !text-[#002C68] !mb-[4px] font-ibm-plex">
                        Xəbərdarlıq
                    </DialogTitle>
                    <DialogDescription className="!text-[16px] !text-[#1E1E1E] leading-[150%] font-normal !mt-[12px]">
                        Avtomatik şifrə sistem tərəfindən yaradılacaq və istifadəçiyə
                        <span className="!text-[16px] !text-[#1E1E1E] leading-[150%] font-semibold"> {email} </span>
                        vasitəsilə göndəriləcək. Mövcud şifrə dərhal etibarsız olacaq. Davam etmək istədiyinizə
                        əminsiniz?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="!mt-[4px]">
                    <Button variant="outline" onClick={() => handleClose()} disabled={loading}>
                        Ləğv et
                    </Button>
                    <Button type="submit" variant="primary" onClick={handleSubmit} loading={loading}>
                        Təsdiqlə
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ResetUserPasswordWithEmailModal;
