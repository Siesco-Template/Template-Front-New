import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link } from 'react-router';

import { APP_URLS } from '@/services/config/url.config';

import { Button } from '../../components/Button';
import Input from '../../components/input/input';

interface IRegisterInputs {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
}

interface RegisterFormProps {
    onNextStep: (data: IRegisterInputs | null) => void;
    initialData: IRegisterInputs | null;
}

const RegisterForm = ({ onNextStep, initialData }: RegisterFormProps) => {
    const [loading, setLoading] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        reset,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<IRegisterInputs>({
        mode: 'onChange',
        defaultValues: initialData || {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
        },
    });

    async function handleCheckAndSubmit(data: IRegisterInputs) {
        setLoading(true);

        try {
            const res = await fetch(
                `${import.meta.env.VITE_BASE_URL}/auth/Auth/CheckUserExist?email=${data.email}&phoneNumber=${data.phoneNumber}`
            );
            if (!res.ok) {
                throw new Error('Qeydiyyat uğursuz oldu');
            }

            onNextStep(data);
        } catch (error) {
            toast.error('Qeydiyyat uğursuz oldu');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form className="w-full !p-[20px] bg-[#FFF] rounded-[16px]" onSubmit={handleSubmit(handleCheckAndSubmit)}>
            <div className="w-full flex flex-col gap-[12px]">
                <Input
                    type="text"
                    label="Ad"
                    labelClassName="font-inter"
                    placeholder="Ad"
                    {...register('firstName', {
                        required: 'Adınızı qeyd edin',
                    })}
                    description={errors.firstName?.message}
                    state={errors.firstName?.message ? 'error' : 'default'}
                />

                <Input
                    type="text"
                    label="Soyad"
                    labelClassName="font-inter"
                    placeholder="Telefon nömrəsi və ya email"
                    {...register('lastName', {
                        required: 'Soyadınızı qeyd edin',
                    })}
                    description={errors.lastName?.message}
                    state={errors.lastName?.message ? 'error' : 'default'}
                />

                <Input
                    type="text"
                    label="Email"
                    labelClassName="font-inter"
                    placeholder="Email"
                    {...register('email', {
                        required: 'Email daxil edin',
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Düzgün email formatı daxil edin',
                        },
                    })}
                    description={errors.email?.message}
                    state={errors.email?.message ? 'error' : 'default'}
                />

                <Input
                    type="text"
                    label="Nömrə"
                    labelClassName="font-inter"
                    placeholder="+994 010 011 01 01"
                    {...register('phoneNumber', {
                        required: 'Telefon nömrəsi daxil edin',
                        pattern: {
                            value: /^(?:\+\d{1,3})?\d{1,4}\d{7,10}$/i,
                            message: 'Düzgün nomrə formatı daxil edin',
                        },
                    })}
                    description={errors.phoneNumber?.message}
                    state={errors.phoneNumber?.message ? 'error' : 'default'}
                />
            </div>

            <Button type="submit" variant="primary" className="w-full !mt-[24px]" loading={loading}>
                Qeydiyyatdan keç
            </Button>
            <div className="w-full flex justify-center gap-[4px] !mt-[6px]">
                <span className="text-[14px] !text-[#05194AB3] font-normal">Artıq hesabınız var?</span>
                <Link to={APP_URLS.login()} className="text-[14px] !text-[#003988] font-semibold">
                    Daxil ol
                </Link>
            </div>
        </form>
    );
};

export default RegisterForm;
