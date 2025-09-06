import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { authService } from '@/modules/auth/services/auth.service';
import { CreateUserBody, UpdateUserBody } from '@/modules/auth/services/auth.service.types';

import Catalog from '@/shared/catalog';
import { UserRole, userRoleOptions } from '@/shared/constants/enums';
import { cls } from '@/shared/utils';

import { S_Button, S_Input } from '@/ui';
import Modal from '@/ui/dialog';
import { showToast } from '@/ui/toast/showToast';

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
                console.log(error?.data?.message || 'İşçi məlumatları alınarkən xəta baş verdi');
            }
        };

        fetchData();
    }, [selectedUserId]);

    const updateUser = async (data: UpdateUserBody) => {
        setIsProcessing(true);
        try {
            await authService.updateUser(data);
            onSubmit?.();
        } catch (error: any) {
            showToast({
                label: error?.data?.message || 'Işçi yenilənərkən xəta baş verdi',
                type: 'error',
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const createUser = async (data: CreateUserBody) => {
        setIsProcessing(true);
        try {
            await authService.createUser(data);
            onSubmit?.();
        } catch (error: any) {
            showToast({ label: error?.data?.message || 'Işçi yaradılarkən xəta baş verdi', type: 'success' });
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
    const roleItems = userRoleOptions.map((o) => ({
        ...o,
        value: typeof o.value === 'string' ? Number(o.value) : o.value,
    }));
    const selectedRole = watch('userRole');
    const selectedRoleObj = roleItems.find((i) => i.value === Number(selectedRole)) || null;

    return (
        <>
            <Modal
                open={open}
                onOpenChange={onOpenChange}
                className={cls(styles.modalContent, isConfirmOpen ? styles.hidden : styles.visible)}
                title={mode === 'create' ? 'Yeni istifadəçi' : 'Düzəliş'}
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
                            disabled={isProcessing}
                            isLoading={isProcessing}
                        >
                            Yadda saxla
                        </S_Button>
                    </div>
                }
            >
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
                            <Catalog
                                key="userRole"
                                items={roleItems}
                                getLabel={(i: any) => i?.label}
                                getRowId={(i: any) => String(i?.value)}
                                value={selectedRoleObj ? [selectedRoleObj] : []}
                                onChange={(sel) => {
                                    const picked = Array.isArray(sel) ? sel[0] : sel;
                                    const newVal = picked ? Number((picked as any).value) : '';
                                    setValue('userRole', Number(newVal), { shouldDirty: true, shouldValidate: true });
                                }}
                                multiple={false}
                                enableModal={false}
                                sizePreset="md-lg"
                                totalItemCount={roleItems.length}
                                onRefetch={undefined}
                                onClickNew={undefined}
                                isLoading={false}
                                label="Vəzifə"
                                showMoreColumns={[]}
                            />
                        </div>
                    </div>
                </form>
            </Modal>
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
