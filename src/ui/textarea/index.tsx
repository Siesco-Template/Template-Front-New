import React from 'react';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

import { Field } from '@ark-ui/react/field';

import { InformationIcon } from '@/shared/table/icons';
import { cls } from '@/shared/utils';

import styles from './textarea.module.css';

export type TextareaPixelSize = 100 | 120 | 140 | 160 | 200;
export type TextareaStatus = 'default' | 'success' | 'error';

interface I_TextareaProps extends Field.TextareaProps {
    label?: string;
    labelProps?: Field.LabelProps;
    details?: string;
    detailsProps?: DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
    description?: string;
    descriptionProps?: Field.HelperTextProps;
    errorText?: string;
    height?: TextareaPixelSize;
    status?: TextareaStatus;
    rootProps?: Field.RootProps;
    rows?: number;
    resize?: 'both' | 'horizontal' | 'vertical' | 'none';
    labelInfo?: string;
    fieldInfo?: string;
    maxLength?: number;
    showCounter?: boolean;
}

const S_Textarea = (props: I_TextareaProps) => {
    const {
        height = 200,
        status = 'default',
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
        labelInfo,
        fieldInfo,
        maxLength,
        showCounter = true,
        onChange,
        value,
        defaultValue,
        ...textareaProps
    } = props;

    const hasError = !!errorText || status === 'error';
    const ariaInvalid = hasError ? 'true' : 'false';
    const dataStatus: TextareaStatus = hasError ? 'error' : status;

    const isControlled = value !== undefined;
    const [inner, setInner] = React.useState<string>(String(defaultValue ?? ''));

    const currentValue = isControlled ? String(value ?? '') : inner;
    const currentLen = currentValue.length;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!isControlled) setInner(e.target.value);
        onChange?.(e);
    };

    return (
        <Field.Root
            {...rootProps}
            aria-invalid={ariaInvalid}
            className={cls(styles.textarea, className)}
            data-status={dataStatus}
        >
            {label && (
                <div data-part="textarea-header-wrapper" className={styles.header}>
                    <div className={styles.labelWithIcon}>
                        <Field.Label {...labelProps} data-error={ariaInvalid}>
                            {label}
                        </Field.Label>
                        {labelInfo && (
                            <span className={styles.labelInfo} title={labelInfo} aria-label="Info">
                                <InformationIcon width={14} height={14} color=" var(--content-secondary)" />
                            </span>
                        )}
                    </div>

                    {details && (
                        <span {...detailsProps} data-error={ariaInvalid} className={styles.details}>
                            {details}
                        </span>
                    )}
                </div>
            )}

            <div className={styles.fieldWrapper}>
                <Field.Textarea
                    className={cls(styles.field, styles.textareaField)}
                    rows={rows}
                    style={{ resize }}
                    data-error={ariaInvalid}
                    data-height={height}
                    data-status={dataStatus}
                    maxLength={maxLength}
                    value={isControlled ? value : undefined}
                    defaultValue={defaultValue}
                    onChange={handleChange}
                    {...textareaProps}
                />

                {fieldInfo && (
                    <span className={styles.fieldInfo} title={fieldInfo} aria-label="Info">
                        <InformationIcon width={20} height={20} color=" var(--content-secondary)" />
                    </span>
                )}

                {showCounter && (
                    <span className={styles.counter}>{maxLength ? `${currentLen}/${maxLength}` : `${currentLen}`}</span>
                )}
            </div>

            {!hasError && description && (
                <Field.HelperText {...descriptionProps} className={styles.helper}>
                    {description}
                </Field.HelperText>
            )}

            {hasError && (
                <Field.HelperText
                    {...descriptionProps}
                    data-error={ariaInvalid}
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
