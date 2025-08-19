import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router';

import { APP_URLS } from '@/services/config/url.config';

import { S_Button } from '@/ui';

import ResendMail from '../../components/ResendMail/ResendMail';
import Input from '../../components/input/input';
import { authService } from '../../services/auth.service';
import styles from './style.module.css';

enum RequestType {
    Email = 1,
    PhoneNumber = 2,
    Both = 3,
}

interface IRequestInputs {
    login: string;
}

const ForgotPassword = () => {
    const [requestType] = useState<RequestType>(RequestType.Email); // "Nömrə / Email / hər ikisi" ile parolu yenilemek olsun?

    const [mailSent, setMailSent] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<IRequestInputs>({
        mode: 'onChange',
        defaultValues: {
            login: '',
        },
    });

    const navigate = useNavigate();

    function handleNavigate() {
        const loginData = getValues('login');

        switch (requestType) {
            case RequestType.Email:
                setMailSent(true);
                break;

            case RequestType.PhoneNumber:
                navigate(APP_URLS.otp(), {
                    state: {
                        phoneNumber: loginData,
                    },
                });
                break;

            case RequestType.Both:
                const isPhone = /^(?:\+\d{1,3})?\d{1,4}\d{7,10}$/i.test(loginData);
                const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData);

                if (isEmail) {
                    setMailSent(true);
                } else if (isPhone) {
                    navigate(APP_URLS.otp(), {
                        state: {
                            phoneNumber: loginData,
                        },
                    });
                }
                break;
        }
    }

    async function handleSendRequest(data: IRequestInputs) {
        setLoading(true);

        try {
            await authService.forgetPassword(data.login);

            toast.success('E-mail ünvanınıza məlumatlar göndərildi');
            !mailSent && handleNavigate();
        } catch (error) {
            // @ts-expect-error
            toast.error(error?.data?.message || 'Əməliyyat uğursuz oldu');
        } finally {
            setLoading(false);
        }
    }

    if (mailSent) {
        return <ResendMail onClick={() => handleSendRequest(getValues())} loading={loading} />;
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Şifrəni unutmusunuz?</h2>
            <p className={styles.description}>
                {requestType == RequestType.Email
                    ? 'Narahat olmayın! Aşağıdakı sahəyə e-poçt ünvanınızı daxil edin və sizə şifrəni sıfırlamaq üçün təlimat göndərək.'
                    : requestType == RequestType.PhoneNumber
                      ? 'Narahat olmayın! Aşağıdakı sahəyə əlaqə nömrənizi daxil edin və sizə şifrəni sıfırlamaq üçün OTP kod göndərək.'
                      : requestType == RequestType.Both &&
                        'Narahat olmayın! Aşağıdakı sahəyə e-poçt ünvanınızı və ya əlaqə nömrənizi daxil edin və sizə şifrəni sıfırlamaq üçün OTP kod göndərək.'}
            </p>

            <form className={styles.form} onSubmit={handleSubmit(handleSendRequest)}>
                <div className={styles.inputContainer}>
                    <Input
                        type="text"
                        label={
                            requestType == RequestType.Email
                                ? 'Email'
                                : requestType == RequestType.PhoneNumber
                                  ? 'Nömrə'
                                  : requestType == RequestType.Both
                                    ? 'Email və ya nömrə'
                                    : ''
                        }
                        placeholder=""
                        {...register('login', {
                            required: 'Məlumatı daxil edin',
                            validate: (value) => {
                                const isPhone = /^(?:\+\d{1,3})?\d{1,4}\d{7,10}$/i.test(value);
                                const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

                                switch (requestType) {
                                    case RequestType.Email:
                                        return isEmail || 'Düzgün email formatı daxil edin';

                                    case RequestType.PhoneNumber:
                                        return isPhone || 'Düzgün nömrə formatı daxil edin';

                                    case RequestType.Both:
                                        return isPhone || isEmail || 'Düzgün format daxil edin';
                                }
                            },
                        })}
                        description={errors.login?.message}
                        state={errors.login?.message ? 'error' : 'default'}
                    />
                </div>

                <div className={styles.buttonGroup}>
                    <Link to={APP_URLS.login()} className={styles.button}>
                        <S_Button type="button" variant="main-20" color="secondary" className={styles.button}>
                            Giriş səhifəsinə qayıt
                        </S_Button>
                    </Link>
                    <S_Button type="submit" variant="main-20" className={styles.button}>
                        Göndər
                    </S_Button>
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;
