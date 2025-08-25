import { ButtonHTMLAttributes, DetailedHTMLProps, FC, ReactNode, useEffect, useState } from 'react';

import { S_Link } from '@/shared/routing';
import { I_Link } from '@/shared/routing/S_Link';
import { cls } from '@/shared/utils';

import styles from './button.module.css';

type IButtonVariant = 'primary' | 'secondary' | 'ghost';
type Size = '32' | '36' | '44' | '48' | '52';
interface ButtonProps {
    as?: 'button' | 'link';
    variant?: IButtonVariant;
    color?: 'primary' | 'secondary' | 'red' | 'green';
    size?: Size;
    isIcon?: boolean;
    unstyled?: boolean;
    children?: ReactNode;
    className?: string;
    disabled?: boolean;
    disableAnimation?: boolean;
    active?: boolean;
    isLaoding?: boolean;
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
    active,
    isIcon = false,
    unstyled = false,
    className = '',
    notification = false,
    isLaoding = false,
    ...props
}) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipTimeout, setTooltipTimeout] = useState<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        if (isIcon) {
            const timeout = setTimeout(() => {
                setShowTooltip(true);
            }, 200);
            setTooltipTimeout(timeout);
        }
    };

    const handleMouseLeave = () => {
        if (tooltipTimeout) {
            clearTimeout(tooltipTimeout);
        }
        setShowTooltip(false);
    };

    useEffect(() => {
        return () => {
            if (tooltipTimeout) {
                clearTimeout(tooltipTimeout);
            }
        };
    }, [tooltipTimeout]);

    const buttonClasses = cls(
        styles.btn,
        !disableAnimation && styles.animation,
        styles[`${variant}-${color}`],
        styles[`${variant}-size-${size}`],
        unstyled && styles.unstyled,
        active && styles['active-btn'],
        className
    );

    if (as === 'link' && 'to' in props) {
        return (
            //@ts-ignore
            <S_Link to={props.href as string} className={buttonClasses} {...props}>
                {children}
            </S_Link>
        );
    }

    return (
        <div className={styles.btnContainer}>
            <button
                tabIndex={1}
                {...(props as ButtonElementProps)}
                className={buttonClasses}
                disabled={disabled}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {isLaoding && <span className={styles.loader}></span>}
                {children} {notification && <div className={styles.notification}></div>}
            </button>
            {isIcon && showTooltip && <div className={styles.tooltip}>{props['aria-label'] || props.title || ''}</div>}
        </div>
    );
};

export default S_Button;
