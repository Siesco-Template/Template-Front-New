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
    children?: ReactNode;
    className?: string;
    disabled?: boolean;
    disableAnimation?: boolean;
    isLaoding?: boolean;
    notification?: boolean;
    showTooltip?: boolean;
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
    isLaoding = false,
    showTooltip = false,
    ...props
}) => {
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);
    const [tooltipTimeout, setTooltipTimeout] = useState<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        if (showTooltip) {
            const timeout = setTimeout(() => {
                setIsTooltipOpen(true);
            }, 200);
            setTooltipTimeout(timeout);
        }
    };

    const handleMouseLeave = () => {
        if (tooltipTimeout) {
            clearTimeout(tooltipTimeout);
        }
        setIsTooltipOpen(false);
    };

    useEffect(() => {
        return () => {
            if (tooltipTimeout) clearTimeout(tooltipTimeout);
        };
    }, [tooltipTimeout]);

    const buttonClasses = cls(
        styles.btn,
        !disableAnimation && styles.animation,
        styles[`${variant}-${color}`],
        styles[`${variant}-size-${size}`],
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
                {isLaoding ? <div className="loader"></div> : children}{' '}
                {notification && <div className={styles.notification}></div>}
            </button>
            {isTooltipOpen && <div className={styles.tooltip}>{props['aria-label'] || props.title || ''}</div>}
        </div>
    );
};

export default S_Button;
