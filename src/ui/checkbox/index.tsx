import { FC } from 'react';

import { Checkbox, CheckboxLabelProps, CheckboxRootProps } from '@ark-ui/react/checkbox';
import { Remove } from '@mui/icons-material';

import { TickIconn } from '@/shared/icons';
import { cls } from '@/shared/utils';

import styles from './checkbox.module.css';

type CheckboxSize = '14' | '16' | '20';

interface I_CheckboxProps extends CheckboxRootProps {
    label?: string;
    labelProps?: CheckboxLabelProps;
    size?: CheckboxSize;
    checked?: boolean;
    indeterminate?: boolean;
}

const S_Checkbox: FC<I_CheckboxProps> = ({
    label,
    labelProps,
    size = '16',
    disabled,
    checked,
    className,
    indeterminate = false,
    onCheckedChange,
    ...props
}) => {
    return (
        <Checkbox.Root
            {...props}
            className={cls(styles.checkbox, disabled && styles.disabled, className)}
            data-size={size}
            disabled={disabled}
            checked={checked}
            onCheckedChange={onCheckedChange}
        >
            <Checkbox.Control data-part="control" className={styles.control}>
                <Checkbox.Indicator data-part="indicator" className={styles.indicator}>
                    {indeterminate ? <Remove /> : <TickIconn width="currentWidth" />}
                </Checkbox.Indicator>
            </Checkbox.Control>

            {label && (
                <Checkbox.Label data-part="label" className={styles.label} {...labelProps}>
                    {label}
                </Checkbox.Label>
            )}

            <Checkbox.HiddenInput className={styles.hiddenInputFixed} />
        </Checkbox.Root>
    );
};

export default S_Checkbox;
