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
    const stopTriggerToggle = (e: React.PointerEvent | React.MouseEvent | React.KeyboardEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <div className={cls(styles.chip, styles[type], onClick && styles.clickable)} onClick={onClick}>
            {photoUrl && (
                <div className={styles.avatar}>
                    <img src={photoUrl} alt="" />
                </div>
            )}

            {leftIcon && (
                <span
                    role="button"
                    tabIndex={0}
                    aria-label="Action"
                    className={styles.left}
                    onPointerDown={stopTriggerToggle}
                    onClick={(e) => {
                        stopTriggerToggle(e);
                        onLeftIconClick?.(e as any);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            stopTriggerToggle(e);
                            onLeftIconClick?.(e as any);
                        }
                    }}
                >
                    {leftIcon}
                </span>
            )}

            <span className={styles.label}>{label}</span>

            {rightIcon && (
                <span
                    role="button"
                    tabIndex={0}
                    aria-label="Remove"
                    className={styles.right}
                    onPointerDown={stopTriggerToggle}
                    onClick={(e) => {
                        stopTriggerToggle(e);
                        onRightIconClick?.(e as any);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            stopTriggerToggle(e);
                            onRightIconClick?.(e as any);
                        }
                    }}
                >
                    {rightIcon}
                </span>
            )}
        </div>
    );
};

export default S_Chips;
