import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

import Cookies from 'universal-cookie';

import { APP_URLS } from '@/services/config/url.config';

import { S_Button } from '@/ui';
import { showToast } from '@/ui/toast/showToast';

import SuccessSection from '../../components/SuccessSection/SuccessSection';
import InputPassword from '../../components/input/input.password';
import { authService } from '../../services/auth.service';
import IconDefault from '../../shared/icons/validation default.svg?react';
import IconError from '../../shared/icons/validation error.svg?react';
import IconSuccess from '../../shared/icons/validation success.svg?react';
import { UserData } from '../../types';
import styles from './style.module.css';

interface IInputs {
    oldPassword: string;
    newPassword: string;
    newConfirmPassword: string;
}

interface IPasswordValidation {
    minLength: 'default' | 'success' | 'error';
    uppercase: 'default' | 'success' | 'error';
    number: 'default' | 'success' | 'error';
    symbol: 'default' | 'success' | 'error';
}

const cookies = new Cookies();

const ChangePassword = () => {
    const [isFinish, setIsFinish] = useState<boolean>(false);
    const userData: UserData = cookies.get('user');

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
            oldPassword: '',
            newPassword: '',
            newConfirmPassword: '',
        },
    });

    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

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
        if (data.newPassword !== data.newConfirmPassword) {
            setError('newConfirmPassword', {
                type: 'manual',
                message: 'Şifrələr eyni deyil',
            });
            return;
        }

        setLoading(true);

        try {
            await authService.changePassword({
                oldPassword: data.oldPassword,
                newPassword: data.newPassword,
                newConfirmPassword: data.newConfirmPassword,
            });

            showToast({ label: 'Şifrə uğurla dəyişdirildi', type: 'success' });
            setIsFinish(true);
        } catch (error) {
            // @ts-expect-error
            showToast({ label: res?.data?.message || 'Şifrə dəyişdirmək uğursuz oldu', type: 'error' });
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
            <div className="validationWrapper">
                <div className="validationItem">
                    {validationIcons[passwordValidation.minLength]}
                    <p className={`validationText ${passwordValidation.minLength ? 'valid' : 'invalid'}`}>
                        Minimum 8 simvol
                    </p>
                </div>
                <div className="validationItem">
                    {validationIcons[passwordValidation.uppercase]}
                    <p className={`validationText ${passwordValidation.uppercase ? 'valid' : 'invalid'}`}>
                        Ən azı 1 böyük hərf (A–Z)
                    </p>
                </div>
                <div className="validationItem">
                    {validationIcons[passwordValidation.number]}
                    <p className={`validationText ${passwordValidation.number ? 'valid' : 'invalid'}`}>
                        Ən azı 1 rəqəm (0–9)
                    </p>
                </div>
                <div className="validationItem">
                    {validationIcons[passwordValidation.symbol]}
                    <p className={`validationText ${passwordValidation.symbol ? 'valid' : 'invalid'}`}>
                        1 xüsusi simvol (!@#$%^&*)
                    </p>
                </div>
            </div>
        );
    };

    if (isFinish) {
        return <SuccessSection description="Şifrə dəyişikliyi uğurla tamamlandı, sistemə daxil ola bilərsiniz" />;
    }

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Şifrəni yenilə</h3>
            <p className={styles.description}>
                Şifrəni dəyişmək istəyirsiniz? Zəhmət olmasa köhnə şifrənizi və yeni şifrənizi aşağıda qeyd edin.
            </p>

            <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)}>
                <div className={styles.inputGroup}>
                    <InputPassword
                        label="Şifrə"
                        labelClassName="font-inter"
                        placeholder="********"
                        isPasswordInputWithEye
                        {...register('oldPassword', {
                            required: 'Yeni şifrə daxil edin',
                        })}
                        description={errors.oldPassword?.message}
                        state={errors.oldPassword?.message ? 'error' : 'default'}
                    />

                    <div>
                        <InputPassword
                            label="Yeni şifrə"
                            labelClassName="font-inter"
                            placeholder="********"
                            isPasswordInputWithEye
                            {...register('newPassword', {
                                validate: (value) => {
                                    const isMinLength = value.trim().length >= 8;
                                    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
                                    const hasNumber = /\d/.test(value);
                                    const hasUppercase = /[A-Z]/.test(value);

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
                        <div className={styles.validationMessage}>{errors.newPassword?.message}</div>
                    </div>

                    <InputPassword
                        label="Yeni şifrə təkrarla"
                        labelClassName="font-inter"
                        placeholder="********"
                        isPasswordInputWithEye
                        {...register('newConfirmPassword', {
                            required: 'Yeni şifrə daxil edin',
                        })}
                        description={errors.newConfirmPassword?.message}
                        state={errors.newConfirmPassword?.message ? 'error' : 'default'}
                    />
                </div>

                <div className={styles.buttonsWrapper}>
                    <S_Button type="button" variant="primary" color="secondary" to={APP_URLS.login()} as="link">
                        Giriş səhifəsinə qayıt
                    </S_Button>
                    <S_Button type="submit" variant="primary" color="primary" isLoading={loading}>
                        Göndər
                    </S_Button>
                </div>
            </form>
        </div>
    );
};

export default ChangePassword;
