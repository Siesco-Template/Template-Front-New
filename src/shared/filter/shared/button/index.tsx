import clsx from 'clsx';
import React, { ButtonHTMLAttributes, ReactNode } from 'react';

import styles from './button.module.css';

type ButtonProps = {
    children: ReactNode;
    variant?: 'default' | 'primary' | 'secondary' | 'tertiary';
    className?: string;
    disabled?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ children, variant = 'default', className = '', disabled, ...props }) => {
    return (
        <button
            className={clsx(
                styles.base,
                variant === 'default' && styles.default,
                variant === 'primary' && styles.primary,
                variant === 'secondary' && styles.secondary,
                variant === 'tertiary' && styles.tertiary,
                disabled && styles.disabled,
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
