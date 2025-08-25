'use client';

import { FC, useState } from 'react';

import { EyeDisableIcon, EyeIcon } from '@/shared/icons';

import S_Input, { I_InputProps } from '.';

type I_TypeInput = 'password' | 'text';

const S_InputPassword: FC<Omit<I_InputProps, 'icon'>> = ({ type, ...props }) => {
    const [inputType, setInputType] = useState<I_TypeInput>('password');
    const iconsForInputType: Record<I_TypeInput, JSX.Element> = {
        password: <EyeIcon />,
        text: <EyeDisableIcon />,
    };

    const changeIconType = () => {
        setInputType(inputType === 'password' ? 'text' : 'password');
    };
    return <S_Input type={inputType} {...props} onClickIcon={changeIconType} icon={iconsForInputType[inputType]} />;
};

export default S_InputPassword;
