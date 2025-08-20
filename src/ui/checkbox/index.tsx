'use client';

import { FC } from 'react';

import { Checkbox, CheckboxLabelProps, CheckboxRootProps } from '@ark-ui/react/checkbox';
import { Remove } from '@mui/icons-material';

import { TickIcon } from '@/shared/icons';
import { cls } from '@/shared/utils';

import styles from './checkbox.module.css';

interface I_CheckboxProps extends CheckboxRootProps {
    label?: string;
    labelProps?: CheckboxLabelProps;
    color?: 'primary' | 'blue' | 'primary-blue';
    variant?: 'default' | 'ghost';
    size?: '100' | '200' | '300';
    checked?: boolean;
    indeterminate?: boolean;
}

const S_Checkbox: FC<I_CheckboxProps> = ({
    label,
    labelProps,
    color = 'primary',
    variant = 'default',
    size = '200',
    disabled,
    checked,
    className,
    indeterminate = false,
    ...props
}) => {
    return (
        <Checkbox.Root
            className={cls(styles.checkbox, styles[`variant-${disabled ? 'disabled' : variant}`], className)}
            data-color={color}
            disabled={disabled}
            checked={checked}
            onCheckedChange={props.onCheckedChange}
            {...props}
            data-size={size}
        >
            <Checkbox.Control>
                <Checkbox.Indicator>{indeterminate ? <Remove /> : <TickIcon />}</Checkbox.Indicator>
            </Checkbox.Control>
            {label && <Checkbox.Label {...labelProps}>{label}</Checkbox.Label>}
            <Checkbox.HiddenInput className={styles.hiddenInputFixed} />
        </Checkbox.Root>
    );
};

export default S_Checkbox;
