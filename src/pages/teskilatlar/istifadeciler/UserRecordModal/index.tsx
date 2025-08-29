import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { authService } from '@/modules/auth/services/auth.service';
import { CreateUserBody, UpdateUserBody } from '@/modules/auth/services/auth.service.types';

import { UserRole, userRoleOptions } from '@/shared/constants/enums';
import { cls } from '@/shared/utils';

import { S_Button, S_Input } from '@/ui';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/ui/dialog/shared';
import S_Select_Simple from '@/ui/select/select-simple';

import { ConfirmModal } from '../ConfirmModal';
import styles from './style.module.css';

interface UserRecordDialogDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: () => Promise<void>;
    mode: 'edit' | 'create';
    selectedUserId?: string;
}

interface UserFormData {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    userRole: UserRole;
}

export function UserRecordDialog({ open, onOpenChange, onSubmit, mode, selectedUserId }: UserRecordDialogDialogProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const {
        register,
        formState: { errors },
        handleSubmit,
        watch,
        setValue,
        reset,
    } = useForm<UserFormData>({
        defaultValues: {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
            userRole: UserRole.SIMPLE_USER,
        },
        mode: 'onChange',
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedUserId || mode === 'create') return;

            try {
                const userData = await authService.getUserDetail(selectedUserId);
                if (!userData) throw { data: { message: 'İşçi məlumatları tapılmadı' } };

                reset(userData);
            } catch (error) {
                // @ts-expect-error
                toast.error(error?.data?.message || 'İşçi məlumatları alınarkən xəta baş verdi');
            }
        };

        fetchData();
    }, [selectedUserId]);

    const updateUser = async (data: UpdateUserBody) => {
        setIsProcessing(true);
        try {
            await authService.updateUser(data);
            onSubmit?.();
        } catch (error) {
            // @ts-expect-error
            toast.error(error?.data?.message || 'Işçi yenilənərkən xəta baş verdi');
        } finally {
            setIsProcessing(false);
        }
    };

    const createUser = async (data: CreateUserBody) => {
        setIsProcessing(true);
        try {
            await authService.createUser(data);
            onSubmit?.();
        } catch (error) {
            // @ts-expect-error
            toast.error(error?.data?.message || 'Işçi yaradılarkən xəta baş verdi');
        } finally {
            setIsProcessing(false);
            setIsConfirmOpen(false);
        }
    };

    const handleFormSubmit = async () => {
        if (isProcessing) return;
        setIsConfirmOpen(true);
    };

    const handleCreateUpdateUser = async () => {
        if (mode === 'edit') {
            await updateUser({
                userId: selectedUserId ?? '',
                firstName: watch('firstName'),
                lastName: watch('lastName'),
                email: watch('email'),
                phoneNumber: watch('phoneNumber'),
                userRole: watch('userRole'),
            });
        } else {
            await createUser({
                firstName: watch('firstName'),
                lastName: watch('lastName'),
                email: watch('email'),
                phoneNumber: watch('phoneNumber'),
                userRole: watch('userRole'),
            });
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className={cls(styles.modalContent, isConfirmOpen ? styles.hidden : styles.visible)}>
                    <DialogHeader>
                        <DialogTitle>{mode === 'create' ? 'Yeni istifadəçi' : 'Düzəliş'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(handleFormSubmit)}>
                        <div className={styles.formContent}>
                            <div className={styles.leftColumn}>
                                <S_Input
                                    {...register('firstName', {
                                        required: true,
                                    })}
                                    label="Ad"
                                    placeholder="Adınızı daxil edin"
                                    errorText={errors.firstName ? 'Ad sahəsi tələb olunur' : undefined}
                                />

                                <S_Input
                                    {...register('phoneNumber', {
                                        required: true,
                                        validate: (value) => {
                                            const isPhone = /^(?:\+\d{1,3})?\d{1,4}\d{7,10}$/i.test(value);
                                            return isPhone || 'Düzgün format daxil edin';
                                        },
                                    })}
                                    label="Əlaqə nömrəsi"
                                    placeholder="+994 xx xxx-xx-xx"
                                    errorText={
                                        errors.phoneNumber
                                            ? errors.phoneNumber.message || 'Telefon nömrəsi tələb olunur'
                                            : undefined
                                    }
                                />
                                <S_Input
                                    {...register('email', {
                                        required: true,
                                        validate: (value) => {
                                            const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                                            return isEmail || 'Düzgün e-mail daxil edin';
                                        },
                                    })}
                                    label="E-mail"
                                    placeholder="namesurname@gmail.com"
                                    errorText={errors.email ? errors.email.message || 'E-mail tələb olunur' : undefined}
                                />
                            </div>
                            <div className={styles.rightColumn}>
                                <S_Input
                                    {...register('lastName', {
                                        required: true,
                                    })}
                                    label="Soyad"
                                    placeholder="Soyadınızı daxil edin"
                                    errorText={errors.lastName ? 'Soyad sahəsi tələb olunur' : undefined}
                                />
                                <S_Select_Simple
                                    items={userRoleOptions}
                                    value={[watch('userRole').toString()]}
                                    setSelectedItems={(value) => setValue('userRole', Number(value[0].value))}
                                    itemsContentMinWidth={200}
                                    label="Vəzifə"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <S_Button
                                type="button"
                                variant="outlined-10"
                                onClick={() => onOpenChange(false)}
                                disabled={false}
                            >
                                Ləğv et
                            </S_Button>
                            <S_Button type="submit" variant="main-10" disabled={isProcessing} isLaoding={isProcessing}>
                                Yadda saxla
                            </S_Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            {isConfirmOpen && (
                <ConfirmModal
                    open={isConfirmOpen}
                    onOpenChange={(open) => setIsConfirmOpen(open)}
                    onSubmit={handleCreateUpdateUser}
                    mode={mode}
                    email={watch('email')}
                    isLoading={isProcessing}
                />
            )}
        </>
    );
}
