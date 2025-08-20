'use client';

import { FC, useState } from 'react';

import { EyeDisableIcon, EyeIcon } from '@/shared/icons';

import S_InputWithIcon, { I_InputWithIconProps } from './input-with-icon';

type I_TypeInput = 'password' | 'text';

const S_InputPassword: FC<Omit<I_InputWithIconProps, 'icon'>> = ({ type, ...props }) => {
    const [inputType, setInputType] = useState<I_TypeInput>('password');
    const iconsForInputType: Record<I_TypeInput, JSX.Element> = {
        password: <EyeIcon />,
        text: <EyeDisableIcon />,
    };

    const changeIconType = () => {
        setInputType(inputType === 'password' ? 'text' : 'password');
    };
    return (
        <S_InputWithIcon type={inputType} {...props} onClickIcon={changeIconType} icon={iconsForInputType[inputType]} />
    );
};

export default S_InputPassword;
