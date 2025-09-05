import { DetailedHTMLProps, HTMLAttributes, forwardRef } from 'react';

import { Field } from '@ark-ui/react/field';

import { cls } from '@/shared/utils';

import styles from './input.module.css';

export type InputSize = '32' | '36' | '44' | '48' | '52';

export type InputState = 'default' | 'error' | 'success';
export interface I_InputProps extends Omit<Field.InputProps, 'size'> {
    label?: string;
    labelProps?: Field.LabelProps;
    details?: string;
    detailsProps?: DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
    description?: string;
    descriptionProps?: Field.HelperTextProps;
    size?: InputSize;
    rootProps?: Field.RootProps;
    icon?: any;
    iconPosition?: 'left' | 'right';
    onClickIcon?: () => void;
    state?: InputState;
}

const S_Input = forwardRef<HTMLInputElement, I_InputProps>((props, ref) => {
    const {
        size = '36',
        label = '',
        labelProps,
        details,
        detailsProps,
        description,
        descriptionProps,
        className,
        rootProps,
        autoComplete = 'off',
        icon,
        iconPosition = 'right',
        onClickIcon,
        state = 'default',
        ...inputProps
    } = props;

    const inputClasses = cls(
        styles.input,
        styles[`size-${size}`],
        icon && styles['icon-position-' + iconPosition],
        state !== 'default' && styles[state]
    );

    return (
        <Field.Root {...rootProps} aria-invalid={state === 'error'} className={cls(styles.root, className)}>
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

            {description && (
                <Field.HelperText {...descriptionProps} className={cls(styles.helperText, descriptionProps?.className)}>
                    {description}
                </Field.HelperText>
            )}
        </Field.Root>
    );
});

export default S_Input;
