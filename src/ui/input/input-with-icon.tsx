import { FC, KeyboardEvent, ReactNode } from 'react';

import { Field } from '@ark-ui/react';

import { cls } from '@/shared/utils';

import { InputSize } from './index';
import styles from './input.module.css';

export interface I_InputWithIconProps extends Field.InputProps {
    label?: string;
    inputSize?: InputSize;
    icon: ReactNode | JSX.Element;
    errorText?: string;
    onClickIcon?: () => void;
}
const S_InputWithIcon: FC<I_InputWithIconProps> = ({
    label,
    inputSize = 'default',
    icon,
    onClickIcon,
    onKeyDown,
    type,
    name,
    errorText,
    autoComplete = 'off',
    placeholder,
    ...props
}) => {
    const isError = errorText ? 'true' : 'false';
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && onClickIcon) onClickIcon();

        if (onKeyDown) onKeyDown(event);
    };
    return (
        <Field.Root
            aria-invalid={isError}
            className={cls(styles.input, styles.inputWithIcon, styles.cont)}
            data-size={inputSize}
            {...props}
        >
            {label && <Field.Label>{label}</Field.Label>}
            <div className={cls(styles.inputWithIconWrapper, errorText && styles.errorBorder)}>
                <Field.Input
                    onKeyDown={handleKeyDown}
                    type={type}
                    autoComplete={autoComplete}
                    name={name}
                    placeholder={placeholder}
                    className={styles.inputWithIconInput}
                />
                <button type="button" className={styles.inputIconContainer} onClick={onClickIcon}>
                    {icon}
                </button>
            </div>
            {errorText && (
                <Field.HelperText data-error={isError} data-part="error-text" className={styles.errorText}>
                    {errorText}
                </Field.HelperText>
            )}
        </Field.Root>
    );
};

export default S_InputWithIcon;
