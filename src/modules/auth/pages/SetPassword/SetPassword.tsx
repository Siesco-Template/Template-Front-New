import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router';

import { APP_URLS } from '@/services/config/url.config';

import { showToast } from '@/ui/toast/showToast';

import { Button } from '../../components/Button';
import SuccessSection from '../../components/SuccessSection/SuccessSection';
import InputPassword from '../../components/input/input.password';
import { inputDescriptionStyles } from '../../components/input/input.styles';
import { authService } from '../../services/auth.service';
import IconDefault from '../../shared/icons/validation default.svg?react';
import IconError from '../../shared/icons/validation error.svg?react';
import IconSuccess from '../../shared/icons/validation success.svg?react';

interface IInputs {
    password: string;
    confirmPassword: string;
}

interface IPasswordValidation {
    minLength: 'default' | 'success' | 'error';
    uppercase: 'default' | 'success' | 'error';
    number: 'default' | 'success' | 'error';
    symbol: 'default' | 'success' | 'error';
}

const SetPassword = () => {
    const [isFinish, setIsFinish] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        reset,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<IInputs>({
        mode: 'onChange',
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const token = searchParams.get('token');
    const phoneNumber = location?.state?.phoneNumber;

    useEffect(() => {
        if (!token && !phoneNumber) {
            navigate(APP_URLS.login());
        }
    }, [token, phoneNumber]);

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

    async function handleFormSubmit(data: IInputs) {
        if (data.password !== data.confirmPassword) {
            setError('confirmPassword', {
                type: 'manual',
                message: 'Şifrələr eyni deyil',
            });
            return;
        }

        setLoading(true);

        try {
            if (!token) throw { data: { message: 'Token tapılmadı!' } };

            await authService.setPassword({
                token: token,
                newPassword: data.password,
                confirmNewPassword: data.confirmPassword,
            });
            showToast({ label: 'Şifrə uğurla yeniləndi', type: 'success' });
            setIsFinish(true);
        } catch (error: any) {
            showToast({ label: error?.data?.message || 'Əməliyyat uğursuz oldu', type: 'success' });
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

    if (isFinish) {
        return (
            <SuccessSection description="Şifrə dəyişikliyi uğurla tamamlandı, email və şifrə yazaraq sistemə daxil ola bilərsiniz" />
        );
    }

    return (
        <div className="w-full flex flex-col items-center gap-[32px]">
            <h3 className="text-center text-[#002C68] !text-[20px] font-medium">Yeni şifrə təyin et</h3>

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
                    <Link to={APP_URLS.login()} className="w-full">
                        <Button type="button" variant="secondary" className="w-full">
                            Giriş səhifəsinə qayıt
                        </Button>
                    </Link>
                    <Button type="submit" variant="primary" className="w-full" loading={loading}>
                        Şifrəni yenilə
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default SetPassword;
