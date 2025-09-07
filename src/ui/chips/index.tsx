import React from 'react';

import { cls } from '@/shared/utils';

import styles from './style.module.css';

type ChipType = 'outline' | 'fill' | 'outlined-fill';

interface S_ChipsProps {
    label: string;
    type?: ChipType;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onLeftIconClick?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
    onRightIconClick?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
    onClick?: () => void;
    photoUrl?: string;
}

const S_Chips: React.FC<S_ChipsProps> = ({
    label,
    type = 'outline',
    leftIcon,
    rightIcon,
    onLeftIconClick,
    onRightIconClick,
    onClick,
    photoUrl,
}) => {
    return (
        <div className={cls(styles.chip, styles[type], onClick && styles.clickable)} onClick={onClick}>
            {photoUrl && (
                <div className={styles.avatar}>
                    <img src={photoUrl} />
                </div>
            )}
            {leftIcon && (
                <button className={styles.left} onClick={onLeftIconClick}>
                    {leftIcon}
                </button>
            )}
            <span className={styles.label}>{label}</span>
            {rightIcon && (
                <button className={styles.right} onClick={onRightIconClick}>
                    {rightIcon}
                </button>
            )}
        </div>
    );
};

export default S_Chips;
