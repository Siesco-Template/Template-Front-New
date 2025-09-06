import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { S_Button } from '@/ui';

import InputPassword from '../../components/input/input.password';
import { inputDescriptionStyles } from '../../components/input/input.styles';
import IconDefault from '../../shared/icons/validation default.svg?react';
import IconError from '../../shared/icons/validation error.svg?react';
import IconSuccess from '../../shared/icons/validation success.svg?react';

interface IPasswordInputs {
    password: string;
    confirmPassword: string;
}

interface IPasswordValidation {
    minLength: 'default' | 'success' | 'error';
    uppercase: 'default' | 'success' | 'error';
    number: 'default' | 'success' | 'error';
    symbol: 'default' | 'success' | 'error';
}

interface RegisterPasswordProps {
    onPrevStep: (data: IPasswordInputs | null) => void;
    onRegister: (data: IPasswordInputs) => void;
    initialData: IPasswordInputs | null;
    loading?: boolean;
}

const RegisterPassword = ({ onPrevStep, onRegister, initialData, loading }: RegisterPasswordProps) => {
    const {
        register,
        handleSubmit,
        getValues,
        setError,
        formState: { errors },
    } = useForm<IPasswordInputs>({
        mode: 'onChange',
        defaultValues: initialData || {
            password: '',
            confirmPassword: '',
        },
    });

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

    function handlePrevStep() {
        onPrevStep(getValues());
    }

    function handleFormSubmit(data: IPasswordInputs) {
        if (data.password !== data.confirmPassword) {
            setError('confirmPassword', {
                type: 'manual',
                message: 'Şifrələr eyni deyil',
            });
            return;
        }
        onRegister(data);
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
        <form className="w-full !p-[20px] bg-[#FFF] rounded-[16px]" onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="w-full flex flex-col gap-[12px]">
                <div>
                    <InputPassword
                        label="Yeni şifrə"
                        labelClassName="font-inter"
                        placeholder="********"
                        isPasswordInputWithEye
                        {...register('password', {
                            // required: "Şifrə daxil edin",
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
                    />
                    {renderPasswordValidation()}
                </div>

                <InputPassword
                    label="Yeni şifrə təkrarla"
                    labelClassName="font-inter"
                    placeholder="********"
                    isPasswordInputWithEye
                    {...register('confirmPassword', {
                        required: 'Yeni şifrə daxil edin',
                    })}
                    description={errors.confirmPassword?.message}
                    state={errors.confirmPassword?.message ? 'error' : 'default'}
                />
            </div>

            <div className="w-full flex items-center gap-[12px] !mt-[24px]">
                <S_Button
                    type="button"
                    variant="primary"
                    color="secondary"
                    className="w-full flex-1"
                    onClick={handlePrevStep}
                >
                    Əvvəlki səhifəyə qayıt
                </S_Button>
                <S_Button type="submit" variant="primary" color="primary" className="w-full flex-1" isLoading={loading}>
                    Təsdiqlə
                </S_Button>
            </div>
        </form>
    );
};

export default RegisterPassword;
