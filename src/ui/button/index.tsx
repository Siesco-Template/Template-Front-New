import { ButtonHTMLAttributes, DetailedHTMLProps, FC, ReactNode, useEffect, useRef, useState } from 'react';

import { S_Link } from '@/shared/routing';
import { I_Link } from '@/shared/routing/S_Link';
import { cls } from '@/shared/utils';

import styles from './button.module.css';

type IButtonVariant = 'primary' | 'outlined' | 'ghost' | 'inverse';
type Size = '32' | '36' | '44' | '48' | '52';
interface ButtonProps {
    as?: 'button' | 'link';
    variant?: IButtonVariant;
    color?: 'primary' | 'secondary' | 'red' | 'green';
    size?: Size;
    children?: ReactNode;
    className?: string;
    disabled?: boolean;
    disableAnimation?: boolean;
    isLoading?: boolean;
    notification?: boolean;
}

type ButtonElementProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
type LinkElementProps = I_Link & { as: 'link' };
type I_ButtonComponentProps = (ButtonProps & ButtonElementProps) | (ButtonProps & LinkElementProps);

const S_Button: FC<I_ButtonComponentProps> = ({
    as = 'button',
    variant = 'primary',
    color = 'primary',
    size = '36',
    disableAnimation = false,
    children,
    disabled,
    className = '',
    notification = false,
    isLoading = false,
    ...props
}) => {
    const btnRef = useRef<HTMLButtonElement>(null);
    const [fixedWidth, setFixedWidth] = useState<number | undefined>();

    useEffect(() => {
        if (btnRef.current && !fixedWidth) {
            setFixedWidth(btnRef.current.offsetWidth);
        }
    }, [btnRef?.current]);

    const buttonClasses = cls(
        styles.btn,
        !disableAnimation && styles.animation,
        styles[`${variant}-${color}`],
        styles[`${variant}-size-${size}`],
        isLoading && styles.loading,
        className
    );

    if (as === 'link' && 'to' in props) {
        return (
            <S_Link className={buttonClasses} {...props}>
                {children}
            </S_Link>
        );
    }

    return (
        <>
            <button
                ref={btnRef}
                tabIndex={-1}
                className={buttonClasses}
                style={{ position: 'absolute', left: '-9999px' }}
            >
                {children}
            </button>

            <button
                tabIndex={1}
                {...(props as ButtonElementProps)}
                className={buttonClasses}
                disabled={disabled}
                style={{ width: isLoading ? fixedWidth : undefined }}
            >
                {isLoading ? <div className={styles['dot-carousel']}></div> : children}
                {notification && <div className={styles.notification}></div>}
            </button>
        </>
    );
};

export default S_Button;
