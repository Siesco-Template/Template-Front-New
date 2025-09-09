import { type ForwardedRef, forwardRef } from 'react';

import { cls } from '@/shared/utils';

import inputStyles from './input.styles';
import type InputProps from './input.types';
import styles from './style.module.css'
const Input = forwardRef<HTMLInputElement, InputProps>((allProps, ref: ForwardedRef<HTMLInputElement>) => {
    const {
        label,
        name,
        state = 'default',
        size = 48,
        borderRadius = 12,
        gap,
        description,
        details,
        icon,
        pref,
        disabled,
        forOTP,
        className,
        labelClassName,
        ...props
    } = allProps;

    const { inputSizeStyles, inputStateStyles, inputDescriptionStyles, inputDisabledStyle } = inputStyles;

    const renderLabel = () =>
        (label || description) && (
            <div className="flex justify-between !text-[12px] font-semibold ">
                {label && (
                    <label htmlFor={name} className={`${styles.label} ${labelClassName}`}>
                        {label}
                    </label>
                )}

                {details && typeof details === 'string' ? (
                    <span className="text-primary-500">{details}</span>
                ) : (
                    details && details
                )}
            </div>
        );

    const renderDescription = () =>
        description && (
            <div>
                <p className={cls('!m-[0]', inputDescriptionStyles[state])}>{description}</p>
            </div>
        );

    const renderPref = () =>
        pref && <div className="min-w-[62px] h-full bg-neutral-50 text-neutral-400 text-center">{pref}</div>;

    return (
        <div className={cls(`flex flex-col gap-[4px] ${gap ? `gap-[${gap}px]` : ''}  w-full text-neutral-500`)}>
            {renderLabel()}
            <div
                className={cls(
                    'flex flex-row items-center border has-[:empty]-border-primary-50 bg-light !h-[42px]',
                    forOTP ? 'aspect-square' : '',
                    inputSizeStyles[size],
                    `rounded-[${borderRadius}px]`,
                    disabled ? inputDisabledStyle : inputStateStyles[state]
                )}
            >
                {renderPref()}
                <div className={cls(`flex ${forOTP ? '' : '!px-[16px]'} h-full flex-1 gap-2 items-center`)}>
                    <input
                        disabled={disabled}
                        ref={ref}
                        id={name}
                        name={name}
                        aria-label={name}
                        className={cls('outline-none bg-transparent w-full  text-16 h-full', className)}
                        {...props}
                    />
                    {icon && icon}
                </div>
            </div>
            {renderDescription()}
        </div>
    );
});

export default Input;
