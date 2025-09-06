import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
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

interface IData {
    userId: string;
    blockInformation: string;
}

interface BlockUserModalProps {
    blockDataID: string | null;
    closeBlockModal: () => void;
    refreshData: () => void;
    isBlock?: boolean;
}

const BlockUserModal = ({ blockDataID, closeBlockModal, refreshData, isBlock }: BlockUserModalProps) => {
    const [loading, setLoading] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<IData>({
        mode: 'onChange',
        defaultValues: {
            userId: blockDataID || '',
            blockInformation: '',
        },
    });

    useEffect(() => {
        blockDataID && setValue('userId', blockDataID);
    }, [blockDataID]);

    function handleClose() {
        closeBlockModal();
        reset();
    }

    async function handleBlock(data: IData) {
        setLoading(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/Auth/ToggleBlockUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    lockDownDate: new Date().toISOString(),
                }),
            });
            if (!res.ok) {
                throw new Error('Əməliyyat uğursuz oldu');
            }
            handleClose();
            showToast({
                label: isBlock ? 'İstifadəçi uğurla blokdan çıxarıldı' : 'İstifadəçi uğurla bloklandı',
                type: 'success',
            });
            refreshData();
        } catch (error) {
            showToast({ label: 'Əməliyyat uğursuz oldu', type: 'error' });
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={!!blockDataID} onOpenChange={handleClose}>
            <DialogContent className="!gap-[12px] admin__users--auth">
                <DialogHeader>
                    <DialogTitle className="!text-[20px] font-bold !text-[#002C68] !mb-[4px] font-ibm-plex">
                        {isBlock ? 'Blokdan çıxar' : 'Blokla'}
                    </DialogTitle>
                    <DialogDescription className="sr-only" />
                </DialogHeader>
                <textarea
                    id="blockInformation"
                    {...register('blockInformation', {
                        required: 'Blok mesajı qeyd edin',
                    })}
                    placeholder={`${isBlock ? 'Blokdan çıxarma' : 'Bloklama'} mesajı əlavə et`}
                    className="w-full h-[104px] !text-[14px] !p-[16px] border !border-[#B2BBC6] rounded-[12px] !resize-none"
                ></textarea>
                {errors.blockInformation?.message ? (
                    <p className="!text-[12px] text-[#FF3B30] !mt-[4px]">{errors.blockInformation.message}</p>
                ) : null}
                <DialogFooter>
                    <Button variant="outline" onClick={() => handleClose()} disabled={loading}>
                        Ləğv et
                    </Button>
                    <Button type="submit" variant="primary" onClick={handleSubmit(handleBlock)} loading={loading}>
                        Ok
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default BlockUserModal;
