import { FC } from 'react';

import { Checkbox, CheckboxLabelProps, CheckboxRootProps } from '@ark-ui/react/checkbox';

import { MinusIcon, TickIconn } from '@/shared/icons';

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
            className={className}
            data-size={size}
            disabled={disabled}
            checked={checked}
            onCheckedChange={onCheckedChange}
        >
            <Checkbox.Control>
                <Checkbox.Indicator>{indeterminate ? <MinusIcon /> : <TickIconn />}</Checkbox.Indicator>
            </Checkbox.Control>

            {label && <Checkbox.Label {...labelProps}>{label}</Checkbox.Label>}

            <Checkbox.HiddenInput className={styles.hiddenInputFixed} />
        </Checkbox.Root>
    );
};

export default S_Checkbox;
