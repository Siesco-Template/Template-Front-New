import { ButtonHTMLAttributes, DetailedHTMLProps, FC, ReactNode, useEffect, useRef, useState } from 'react';

import { S_Link } from '@/shared/routing';
import { I_Link } from '@/shared/routing/S_Link';
import { cls } from '@/shared/utils';

import styles from './button.module.css';

type IButtonVariant =
    | 'main-10'
    | 'main-20'
    | 'main-30'
    | 'outlined-10'
    | 'outlined-20'
    | 'outlined-30'
    | 'ghost-10'
    | 'ghost-20'
    | 'ghost-30'
    | 'none';

type IconButtonSize = '0' | '5' | '10' | '15' | '20' | '30';
interface ButtonProps {
    as?: 'button' | 'link';
    variant?: IButtonVariant;
    color?: 'primary' | 'secondary' | 'red' | 'green' | 'none';
    isIcon?: boolean;
    unstyled?: boolean;
    children?: ReactNode;
    className?: string;
    iconBtnSize?: IconButtonSize;
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
    variant = 'main-20',
    color = 'primary',
    disableAnimation = false,
    children,
    disabled,
    active,
    isIcon = false,
    iconBtnSize = '10',
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
        styles[`${variant}-${disabled ? 'disabled' : color}`],
        unstyled && styles.unstyled,
        active && styles['active-btn'],
        className
    );

    if (as === 'link' && 'href' in props) {
        return (
            //@ts-ignore
            <S_Link to={props.href as string} className={buttonClasses} {...props}>
                {children}
            </S_Link>
        );
    }
    const iconStyle = !isIcon
        ? {}
        : {
              //   minWidth: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              //   minWidth: 'fit-content',
              padding: {
                  '0': `0`,
                  '5': `var(--pm-50)`,
                  '10': `var(--pm-100)`,
                  '15': 'var(--pm-200)',
                  '20': 'var(--pm-350)',
                  '30': 'var(--pm-400)',
              }[iconBtnSize],
              borderRadius: {
                  '0': `var(--r-50)`,
                  '5': `var(--pm-100)`,
                  '10': `var(--r-200)`,
                  '15': 'var(--r-300)',
                  '20': 'var(--r-350)',
                  '30': 'var(--r-400)',
              }[iconBtnSize],
          };
    return (
        <div className={styles.btnContainer}>
            <button
                tabIndex={1}
                {...(props as ButtonElementProps)}
                style={iconStyle}
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
