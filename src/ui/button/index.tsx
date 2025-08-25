import {
    ButtonHTMLAttributes,
    DetailedHTMLProps,
    FC,
    ReactNode,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';

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
    isLoading?: boolean;
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
    isLoading = false,
    showTooltip = false,
    ...props
}) => {
    const btnRef = useRef<HTMLButtonElement>(null);
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);
    const [tooltipTimeout, setTooltipTimeout] = useState<NodeJS.Timeout | null>(null);
    const [fixedWidth, setFixedWidth] = useState<number | undefined>();

    useEffect(() => {
        if (btnRef.current && !fixedWidth) {
            setFixedWidth(btnRef.current.offsetWidth);
        }
    }, [btnRef?.current]);

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
                style={{ position: 'absolute', left: '-9999px', width: isLoading ? fixedWidth : undefined }}
            >
                {children}
            </button>

            <div className={styles.btnContainer}>
                <button
                    tabIndex={1}
                    {...(props as ButtonElementProps)}
                    className={buttonClasses}
                    disabled={disabled}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    style={{ width: isLoading ? fixedWidth : undefined }}
                >
                    {isLoading ? <div className={styles['dot-carousel']}></div> : children}
                    {notification && <div className={styles.notification}></div>}
                </button>
                {isTooltipOpen && <div className={styles.tooltip}>{props['aria-label'] || props.title || ''}</div>}
            </div>
        </>
    );
};

export default S_Button;
