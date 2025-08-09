import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link } from 'react-router';

import Cookies from 'universal-cookie';

import { APP_URLS } from '@/services/config/url.config';

import { Button } from '../../components/Button';
import SuccessSection from '../../components/SuccessSection/SuccessSection';
import Input from '../../components/input/input';
import RegisterForm from './RegisterForm';
import RegisterPassword from './RegisterPassword';

interface IRegisterInputs {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
}

interface IPasswordInputs {
    password: string;
    confirmPassword: string;
}

enum RegisterStep {
    Form = 1,
    Password = 2,
}

const cookies = new Cookies();

const Register = () => {
    const [isFinish, setIsFinish] = useState<boolean>(false);

    const [registerStep, setRegisterStep] = useState<RegisterStep>(RegisterStep.Form);
    const [loading, setLoading] = useState<boolean>(false);

    const [formData, setFormData] = useState<IRegisterInputs | null>(null);
    const [passwordData, setPasswordData] = useState<IPasswordInputs | null>(null);

    function handleNextStep(data: IRegisterInputs | null) {
        setFormData(data);
        setRegisterStep(RegisterStep.Password);
    }
    function handlePrevStep(data: IPasswordInputs | null) {
        setPasswordData(data);
        setRegisterStep(RegisterStep.Form);
    }

    async function handleRegister(data: IPasswordInputs) {
        setPasswordData(data);
        setLoading(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/Auth/Register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    ...data,
                }),
            });
            if (!res.ok) {
                throw new Error('Qeydiyyat uğursuz oldu');
            }

            toast.success('Uğurla qeydiyyatdan keçdiniz');
            setIsFinish(true);
        } catch (error) {
            toast.error('Qeydiyyat uğursuz oldu');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    if (isFinish) {
        return <SuccessSection description="Qeydiyyatınız uğurla tamamlandı, email və şifrə sistemə daxil" />;
    }

    return (
        <div className="w-full flex flex-col items-center gap-[32px]">
            <h2 className="text-center text-[#002C68] !text-[24px] font-medium">Qeydiyyatdan keç</h2>
            <h3 className="text-center text-[#002C68] !text-[20px] font-medium">Xoş gəlmişsiniz!</h3>
            <p className="text-center text-[#05194AB3] leading-[21px]">
                Əsas missiyasımız kənar dövlət maliyyə nəzarəti vasitəsilə dövlət vəsaitlərinə nəzarət sahəsində
                Azərbaycan Respublikası vətəndaşlarının mənafeyini təmin etmək və dövlət vəsaitlərinin istifadəsində
                qanunauyğunluğu, effektivliyi və hesabatlılığı artırmaqdır.
            </p>

            {registerStep == RegisterStep.Form && (
                <RegisterForm onNextStep={(data) => handleNextStep(data)} initialData={formData} />
            )}
            {registerStep == RegisterStep.Password && (
                <RegisterPassword
                    onPrevStep={(data) => handlePrevStep(data)}
                    onRegister={(data) => handleRegister(data)}
                    initialData={passwordData}
                    loading={loading}
                />
            )}
        </div>
    );
};

export default Register;
