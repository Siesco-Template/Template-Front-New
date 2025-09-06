import { useState } from 'react';
import toast from 'react-hot-toast';

import { showToast } from '@/ui/toast/showToast';

import SuccessSection from '../../components/SuccessSection/SuccessSection';
import { authService } from '../../services/auth.service';
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

const Register = () => {
    const [isFinish, setIsFinish] = useState<boolean>(false);

    const [registerStep, setRegisterStep] = useState<RegisterStep>(RegisterStep.Form);
    const [loading, setLoading] = useState<boolean>(false);

    const [formData, setFormData] = useState<IRegisterInputs>({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
    });
    const [passwordData, setPasswordData] = useState<IPasswordInputs | null>(null);

    function handleNextStep(data: IRegisterInputs) {
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
            await authService.register({
                ...formData,
                ...data,
            });

            showToast({ label: 'Uğurla qeydiyyatdan keçdiniz', type: 'success' });
            setIsFinish(true);
        } catch (error: any) {
            showToast({ label: error?.data?.message || 'Qeydiyyat uğursuz oldu', type: 'success' });
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
