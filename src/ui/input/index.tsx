import { DetailedHTMLProps, HTMLAttributes, forwardRef } from 'react';

import { Field } from '@ark-ui/react';

import { cls } from '@/shared/utils';

import styles from './input.module.css';

export type InputSize = 'default' | 'medium' | 'small';
interface I_InputProps extends Field.InputProps {
    label?: string;
    labelProps?: Field.LabelProps;
    details?: string;
    detailsProps?: DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
    description?: string;
    descriptionProps?: Field.HelperTextProps;
    errorText?: string;
    inputSize?: InputSize;
    rootProps?: Field.RootProps;
    textarea?: boolean;
    rows?: number;
    resize?: 'both' | 'horizontal' | 'vertical' | 'none';
    icon?: any;
    fieldClassName?: string;
    iconPosition?: 'left' | 'right';
}

const S_Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, I_InputProps>((props, ref) => {
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
        fieldClassName,
        rootProps,
        autoComplete = 'off',
        textarea = false,
        resize = 'both',
        rows = 1,
        icon,
        iconPosition = 'right',
        ...inputProps
    } = props;
    const isError = errorText ? 'true' : 'false';

    return (
        <Field.Root {...rootProps} aria-invalid={isError} className={cls(styles.input, className)}>
            {label && (
                <div data-part="input-header-wrapper">
                    <Field.Label {...labelProps} data-error={isError}>
                        {label}
                    </Field.Label>
                    {details && (
                        <span {...detailsProps} data-error={isError}>
                            {details}
                        </span>
                    )}
                </div>
            )}
            {textarea ? (
                <Field.Textarea
                    ref={ref as React.Ref<HTMLTextAreaElement>}
                    className={cls(styles.field, styles.textarea)}
                    rows={rows}
                    autoresize={resize === 'none'}
                    style={{ resize: resize }}
                />
            ) : (
                <Field.Input
                    ref={ref as React.Ref<HTMLInputElement>}
                    className={cls(styles.field, fieldClassName)}
                    data-error={isError}
                    data-size={inputSize}
                    data-icon={!!icon}
                    autoComplete={autoComplete}
                    {...inputProps}
                />
            )}
            {icon && (
                <div className={styles.iconContainer} data-position={iconPosition}>
                    {icon}
                </div>
            )}
            {!errorText && description && <Field.HelperText {...descriptionProps}>{description}</Field.HelperText>}
            {errorText && (
                <Field.HelperText {...descriptionProps} data-error={isError} data-part="error-text">
                    {errorText}
                </Field.HelperText>
            )}
        </Field.Root>
    );
});

export default S_Input;
