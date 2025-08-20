import { DetailedHTMLProps, HTMLAttributes } from 'react';

import { Field } from '@ark-ui/react/field';

import { cls } from '@/shared/utils';

import styles from './textarea.module.css';

export type TextareaSize = 'default' | 'medium' | 'small';

interface I_TextareaProps extends Field.TextareaProps {
    label?: string;
    labelProps?: Field.LabelProps;
    details?: string;
    detailsProps?: DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
    description?: string;
    descriptionProps?: Field.HelperTextProps;
    errorText?: string;
    textareaSize?: TextareaSize;
    rootProps?: Field.RootProps;
    rows?: number;
    resize?: 'both' | 'horizontal' | 'vertical' | 'none';
}

const S_Textarea = (props: I_TextareaProps) => {
    const {
        textareaSize = 'medium',
        label = '',
        labelProps,
        details,
        detailsProps,
        description,
        descriptionProps,
        errorText,
        className,
        rootProps,
        rows = 4,
        resize = 'both',
        ...textareaProps
    } = props;

    const isError = errorText ? 'true' : 'false';

    return (
        <Field.Root {...rootProps} aria-invalid={isError} className={cls(styles.textarea, className)}>
            {label && (
                <div data-part="textarea-header-wrapper">
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
            <Field.Textarea
                className={cls(styles.field, styles.textareaField)}
                rows={rows}
                style={{ resize: resize }}
                data-error={isError}
                data-size={textareaSize}
                {...textareaProps}
            />
            {!errorText && description && <Field.HelperText {...descriptionProps}>{description}</Field.HelperText>}
            {errorText && (
                <Field.HelperText
                    {...descriptionProps}
                    data-error={isError}
                    data-part="error-text"
                    className={styles.errorText}
                >
                    {errorText}
                </Field.HelperText>
            )}
        </Field.Root>
    );
};

export default S_Textarea;
