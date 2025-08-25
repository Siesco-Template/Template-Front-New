import { DetailedHTMLProps, HTMLAttributes, forwardRef } from 'react';

import { Field } from '@ark-ui/react/field';

import { cls } from '@/shared/utils';

import styles from './input.module.css';

export type InputSize = '36' | '44' | '48' | '52';
export interface I_InputProps extends Field.InputProps {
    label?: string;
    labelProps?: Field.LabelProps;
    details?: string;
    detailsProps?: DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
    description?: string;
    descriptionProps?: Field.HelperTextProps;
    errorText?: string;
    inputSize?: InputSize;
    rootProps?: Field.RootProps;
    icon?: any;
    iconPosition?: 'left' | 'right';
    onClickIcon?: () => void;
}

const S_Input = forwardRef<HTMLInputElement, I_InputProps>((props, ref) => {
    const {
        inputSize = 'medium',
        label = '',
        labelProps,
        details,
        detailsProps,
        description,
        descriptionProps,
        errorText,
        className,
        rootProps,
        autoComplete = 'off',
        icon,
        iconPosition = 'right',
        onClickIcon,
        ...inputProps
    } = props;
    const isError = errorText ? 'true' : 'false';

    const inputClasses = cls(
        styles.input,
        styles[`size-${inputSize}`],
        icon && styles['icon-position-' + iconPosition],
        errorText && styles.error
    );

    return (
        <Field.Root {...rootProps} aria-invalid={isError} className={cls(styles.root, className)}>
            {(label || details) && (
                <div className={styles.inputHeader}>
                    {label && (
                        <Field.Label {...labelProps} className={cls(styles.label, labelProps?.className)}>
                            {label}
                        </Field.Label>
                    )}
                    {details && (
                        <span {...detailsProps} className={cls(styles.details, detailsProps?.className)}>
                            {details}
                        </span>
                    )}
                </div>
            )}

            <div className={styles.inputContainer}>
                <Field.Input
                    ref={ref as React.Ref<HTMLInputElement>}
                    className={inputClasses}
                    autoComplete={autoComplete}
                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    onKeyDown={(e) => {
                        if (['e', 'E', '+', '-'].includes(e.key) && inputProps.type === 'number') {
                            e.preventDefault();
                        }
                    }}
                    {...inputProps}
                />
                {icon && (
                    <button
                        type="button"
                        className={cls(styles.icon, styles['icon-position-' + iconPosition])}
                        data-position={iconPosition}
                        onClick={onClickIcon}
                        style={onClickIcon ? { cursor: 'pointer' } : { cursor: 'default' }}
                    >
                        {icon}
                    </button>
                )}
            </div>

            {!errorText && description && (
                <Field.HelperText {...descriptionProps} className={cls(styles.helperText, descriptionProps?.className)}>
                    {description}
                </Field.HelperText>
            )}
            {errorText && (
                <Field.HelperText className={cls(styles.errorText, descriptionProps?.className)}>
                    {errorText}
                </Field.HelperText>
            )}
        </Field.Root>
    );
});

export default S_Input;
