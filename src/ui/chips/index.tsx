import React from 'react';

import { XIcon } from '@/shared/icons';
import { cls } from '@/shared/utils';

import styles from './style.module.css';

type ChipType = 'outline' | 'fill' | 'outlined-fill';

interface S_ChipsProps {
    label: string;
    type?: ChipType;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onClick?: () => void;
    onRightIconClick?: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
}

const S_Chips: React.FC<S_ChipsProps> = ({
    label,
    type = 'outline',
    leftIcon,
    rightIcon,
    onClick,
    onRightIconClick,
}) => {
    const showRightIcon = rightIcon ? rightIcon : <XIcon width={16} />;

    return (
        <div className={cls(styles.chip, styles[type])} onClick={onClick}>
            {leftIcon && <span className={styles.left}>{leftIcon}</span>}
            <span className={styles.label}>{label}</span>
            {showRightIcon && (
                <span className={styles.right} onClick={onRightIconClick}>
                    {showRightIcon}
                </span>
            )}
        </div>
    );
};

export default S_Chips;
