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

interface IUserData {
    id: string;
    userRole: number | null;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    isBlock: boolean;
}

interface BlockUserModalProps {
    editDataID: string | null;
    userData?: IUserData | null;
    closeEditModal: () => void;
    refreshData: () => void;
}

const EditUserModal = ({ editDataID, userData, closeEditModal, refreshData }: BlockUserModalProps) => {
    const [loading, setLoading] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        reset,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<IUserData>({
        mode: 'onChange',
        defaultValues: {
            id: '',
            userRole: null,
            email: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
        },
    });

    useEffect(() => {
        reset(userData as IUserData);
    }, [userData]);

    function handleClose() {
        closeEditModal();
        reset({
            id: '',
            userRole: null,
            email: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
        });
    }

    async function handleBlock(data: IUserData) {
        setLoading(true);
        const { id: userId, ...userData } = data;

        try {
            const res = await fetch(
                `${import.meta.env.VITE_BASE_URL}/api/Auth/${userId ? 'UpdateUser' : 'CreateUser'}`,
                {
                    method: userId ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                        userId
                            ? {
                                  ...userData,
                                  userRole: +(userData.userRole as number),
                                  userId,
                              }
                            : userData
                    ),
                }
            );
            if (!res.ok) {
                throw new Error('Əməliyyat uğursuz oldu');
            }
            refreshData();
            handleClose();
            showToast({ label: 'Əməliyyat uğurla yerinə yetirildi', type: 'success' });
        } catch (error) {
            showToast({ label: 'Əməliyyat uğursuz oldu', type: 'error' });
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={!!editDataID} onOpenChange={handleClose}>
            <DialogContent className="admin__users--auth max-w-[900px] !gap-[16px]">
                <DialogHeader className="!text-[16px] !leading-[33px] !font-bold !text-[#212121] font-ibm-plex">
                    <DialogTitle className="!text-[16px] !leading-[33px] !font-bold !text-[#212121] !mb-[4px] font-ibm-plex">
                        {userData ? 'Düzəliş et' : 'Yeni istifadəçi'}
                    </DialogTitle>
                    <DialogDescription className="sr-only" />
                </DialogHeader>
                <div className="grid gap-[16px] grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
                    <Input
                        type="text"
                        autoComplete="off"
                        label="İstifadəçinin adı"
                        placeholder="İstifadəçinin adı daxil edin"
                        {...register('firstName', {
                            required: 'İstifadəçinin adı daxil edin',
                        })}
                        description={errors.firstName?.message}
                        state={errors.firstName?.message ? 'error' : 'default'}
                    />

                    <Input
                        type="text"
                        label="İstifadəçinin soyadı"
                        placeholder="İstifadəçinin soyadı daxil edin"
                        {...register('lastName', {
                            required: 'İstifadəçinin soyadı daxil edin',
                        })}
                        description={errors.lastName?.message}
                        state={errors.lastName?.message ? 'error' : 'default'}
                    />

                    <Input
                        type="text"
                        label="Əlaqə nömrəsi"
                        placeholder="Əlaqə nömrəsi daxil edin"
                        {...register('phoneNumber', {
                            required: 'Əlaqə nömrəsi daxil edin',
                            validate: (value) => {
                                const isPhone = /^(?:\+\d{1,3})?\d{1,4}\d{7,10}$/i.test(value);
                                return isPhone || 'Düzgün format daxil edin';
                            },
                        })}
                        description={errors.phoneNumber?.message}
                        state={errors.phoneNumber?.message ? 'error' : 'default'}
                    />

                    <Input
                        type="number"
                        label="İstifadəçinin vəzifəsi"
                        placeholder="İstifadəçinin vəzifəsini daxil edin"
                        {...register('userRole', {
                            required: 'İstifadəçinin vəzifəsini daxil edin',
                        })}
                        description={errors.userRole?.message}
                        state={errors.userRole?.message ? 'error' : 'default'}
                    />

                    <Input
                        type="text"
                        label="Email"
                        placeholder="Email ünvanınızı daxil edin"
                        {...register('email', {
                            required: 'Email ünvanınızı daxil edin',
                            validate: (value) => {
                                const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                                return isEmail || 'Düzgün format daxil edin';
                            },
                        })}
                        description={errors.email?.message}
                        state={errors.email?.message ? 'error' : 'default'}
                    />

                    {/* <Input
            type='text'
            label='İstifadəçinin Username-i'
            placeholder='İstifadəçinin Username-ini daxil edin'
            {...register("username", {
              required: "İstifadəçinin Username-ini daxil edin",
            })}
            description={errors.username?.message}
            state={errors.username?.message ? "error": 'default'}
          /> */}
                </div>
                <DialogFooter className="!mt-[9px]">
                    <Button variant="outline" onClick={() => handleClose()} disabled={loading}>
                        Ləğv et
                    </Button>
                    <Button variant="primary" onClick={handleSubmit(handleBlock)} loading={loading}>
                        Təsdiqlə
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditUserModal;
