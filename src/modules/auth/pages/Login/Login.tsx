import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router';

import { useAuthStore } from '@/store/authStore';
import Cookies from 'universal-cookie';

import { APP_URLS } from '@/services/config/url.config';

import { S_Button } from '@/ui';
import { showToast } from '@/ui/toast/showToast';

import Input from '../../components/input/input';
import InputPassword from '../../components/input/input.password';
import { authService } from '../../services/auth.service';
import styles from './login.module.css';

const allowRegister = true; // Qeydiyyat butonu olsun?

interface UserData {
    userId: string;
    fullName: string;
    userRole: number;
    accessToken: string;
    expires: string;
    refreshToken: string;
}

interface ILoginInputs {
    emailOrUserName: string;
    password: string;
}

const cookies = new Cookies();

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ILoginInputs>({
        mode: 'onChange',
        defaultValues: {
            emailOrUserName: '',
            password: '',
        },
    });

    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const { login } = useAuthStore();

    async function handleLogin(data: ILoginInputs) {
        setLoading(true);

        try {
            const resData = await authService.login(data);

            if (!resData) throw { data: { message: 'Giriş məlumatları düzgün deyil. Yenidən yoxlayın.' } };

            login(resData);

            showToast({ label: 'Hesaba uğurla giriş olundu', type: 'success' });
            navigate(APP_URLS.anaSehife());
        } catch (error: any) {
            showToast({ label: error?.data?.message || 'Giriş uğursuz oldu', type: 'error' });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>Xoş gəlmişsiniz!</h2>
            <p className={styles.subtitle}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam nulla adipisci incidunt et ratione
                possimus repellat ipsum reiciendis dolor at suscipit iure, facere sunt temporibus sequi sint ex
                accusantium culpa?
            </p>
            <form className={styles.form} onSubmit={handleSubmit(handleLogin)}>
                <div className={styles.inputs}>
                    <Input
                        type="text"
                        label="Telefon nömrəsi və ya email"
                        labelClassName="font-inter"
                        placeholder="Telefon nömrəsi və ya email"
                        {...register('emailOrUserName', {
                            required: 'Telefon nömrəsi və ya email daxil edin',
                            validate: (value) => {
                                const isPhone = /^(?:\+\d{1,3})?\d{1,4}\d{7,10}$/i.test(value);
                                const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                                return isPhone || isEmail || 'Düzgün format daxil edin';
                            },
                        })}
                        description={errors.emailOrUserName?.message}
                        state={errors.emailOrUserName?.message ? 'error' : 'default'}
                    />

                    <InputPassword
                        label="Şifrə"
                        labelClassName="font-inter"
                        placeholder="********"
                        isPasswordInputWithEye
                        {...register('password', {
                            required: 'Şifrə daxil edin',
                        })}
                        description={errors.password?.message}
                        state={errors.password?.message ? 'error' : 'default'}
                    />
                </div>

                <div className={styles.forgotPassword}>
                    <Link to={APP_URLS.forgot_password()}>Şifrəmi unutdum</Link>
                </div>
                <S_Button type="submit" variant="primary" color="primary" isLoading={loading}>
                    Daxil ol
                </S_Button>
            </form>
        </div>
    );
};

export default Login;
