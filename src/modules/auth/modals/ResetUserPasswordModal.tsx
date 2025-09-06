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
import Input from '../components/input/input';
import { inputDescriptionStyles } from '../components/input/input.styles';
import IconDefault from '../shared/icons/validation default.svg?react';
import IconError from '../shared/icons/validation error.svg?react';
import IconSuccess from '../shared/icons/validation success.svg?react';

interface IData {
    userId: string;
    newPassword: string;
}

interface IPasswordValidation {
    minLength: 'default' | 'success' | 'error';
    uppercase: 'default' | 'success' | 'error';
    number: 'default' | 'success' | 'error';
    symbol: 'default' | 'success' | 'error';
}

interface ResetUserPasswordModalProps {
    resetPasswordDataID: string | null;
    closeModal: () => void;
    refreshData: () => void;
    // isBlock?: boolean;
}

const ResetUserPasswordModal = ({
    resetPasswordDataID,
    closeModal,
    refreshData,
    // isBlock,
}: ResetUserPasswordModalProps) => {
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
            userId: resetPasswordDataID || '',
            newPassword: '',
        },
    });

    useEffect(() => {
        resetPasswordDataID && setValue('userId', resetPasswordDataID);
    }, [resetPasswordDataID]);

    const [passwordValidation, setPasswordValidation] = useState<IPasswordValidation>({
        minLength: 'default',
        uppercase: 'default',
        number: 'default',
        symbol: 'default',
    });

    function handlePasswordValidation(key: keyof IPasswordValidation, value: 'default' | 'success' | 'error') {
        setPasswordValidation((prew) => ({
            ...prew,
            [key]: value,
        }));
    }

    function handleClose() {
        closeModal();
        reset();
        setPasswordValidation({
            minLength: 'default',
            uppercase: 'default',
            number: 'default',
            symbol: 'default',
        });
    }

    async function handleResetPassword(data: IData) {
        setLoading(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/Auth/ResetPassword`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
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

    const validationIcons = {
        default: <IconDefault />,
        success: <IconSuccess />,
        error: <IconError />,
    };

    const renderPasswordValidation = () => {
        return (
            <div className="!mt-[12px] flex flex-col gap-[2px]">
                <div className="flex items-center gap-[8px]">
                    {validationIcons[passwordValidation.minLength]}
                    <p className={`${inputDescriptionStyles[passwordValidation.minLength]} font-normal`}>
                        Minimum 8 simvol
                    </p>
                </div>
                <div className="flex items-center gap-[8px]">
                    {validationIcons[passwordValidation.uppercase]}
                    <p className={`${inputDescriptionStyles[passwordValidation.uppercase]} font-normal`}>
                        Ən azı 1 böyük hərf (A–Z)
                    </p>
                </div>
                <div className="flex items-center gap-[8px]">
                    {validationIcons[passwordValidation.number]}
                    <p className={`${inputDescriptionStyles[passwordValidation.number]} font-normal`}>
                        Ən azı 1 rəqəm (0–9)
                    </p>
                </div>
                <div className="flex items-center gap-[8px]">
                    {validationIcons[passwordValidation.symbol]}
                    <p className={`${inputDescriptionStyles[passwordValidation.symbol]} font-normal`}>
                        1 xüsusi simvol (!@#$%^&*)
                    </p>
                </div>
            </div>
        );
    };

    return (
        <Dialog open={!!resetPasswordDataID} onOpenChange={handleClose}>
            <DialogContent className="!gap-[12px] admin__users--auth">
                <DialogHeader>
                    <DialogTitle className="!text-[20px] font-bold !text-[#002C68] !mb-[4px] font-ibm-plex">
                        Şifrəni sıfırla
                    </DialogTitle>
                    <DialogDescription className="sr-only" />
                </DialogHeader>

                <div>
                    <Input
                        type="text"
                        label="Yeni şifrə"
                        placeholder="Yeni şifrə daxil edin"
                        {...register('newPassword', {
                            // required: "Yeni şifrə daxil edin",
                            validate: (value) => {
                                const isMinLength = value.trim().length >= 8;
                                const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value); // Symbol
                                const hasNumber = /\d/.test(value); // Number
                                const hasUppercase = /[A-Z]/.test(value); // UpperCase

                                handlePasswordValidation('minLength', isMinLength ? 'success' : 'error');
                                handlePasswordValidation('uppercase', hasUppercase ? 'success' : 'error');
                                handlePasswordValidation('number', hasNumber ? 'success' : 'error');
                                handlePasswordValidation('symbol', hasSymbol ? 'success' : 'error');

                                return (
                                    (isMinLength && hasUppercase && hasNumber && hasSymbol) ||
                                    'Düzgün format daxil edin'
                                );
                            },
                        })}
                        // description={errors.newPassword?.message}
                        // state={errors.newPassword?.message ? "error": 'default'}
                    />
                    {renderPasswordValidation()}
                </div>

                <DialogFooter className="!mt-[4px]">
                    <Button variant="outline" onClick={() => handleClose()} disabled={loading}>
                        Ləğv et
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        onClick={handleSubmit(handleResetPassword)}
                        loading={loading}
                    >
                        Təsdiqlə
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ResetUserPasswordModal;
