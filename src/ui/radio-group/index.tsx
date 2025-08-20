import { FC } from 'react';

import { RadioGroup as RGroup, RadioGroupRootProps } from '@ark-ui/react/radio-group';

import { cls } from '@/shared/utils';

import styles from './radio-group.module.css';

interface IRadioGroupItemValue {
    id: string | number;
    label: string | number;
    disabled?: boolean;
    checked?: boolean;
}
interface IRadioGroupItemLabel {
    value: string | number;
    label: string | number;
    disabled?: boolean;
}
interface I_RadioGroupProps extends RadioGroupRootProps {
    groupData: Array<string | IRadioGroupItemValue | IRadioGroupItemLabel>;
    label?: string;
    color?: 'primary' | 'secondary';
    variant?: 'default' | 'primary';
    className?: string;
}

const S_RadioGroup: FC<I_RadioGroupProps> = ({
    label,
    groupData,
    color = 'secondary',
    variant = 'default',
    className,
    ...props
}) => {
    return (
        <RGroup.Root
            className={cls(styles['radioGroup'], styles[`variant-${variant}`], className)}
            data-color={color}
            data-variant={variant}
            {...props}
        >
            {label && <RGroup.Label>{label}</RGroup.Label>}
            {groupData.map((item) => {
                const value =
                    typeof item === 'string' ? item : 'id' in item ? item.id.toString() : item.value.toString();
                const label = typeof item === 'string' ? item : item.label.toString();
                const disabled = typeof item !== 'string' && item?.disabled;
                return (
                    <RGroup.Item key={value} value={value} disabled={disabled}>
                        <RGroup.ItemControl />
                        <RGroup.ItemText>{label}</RGroup.ItemText>
                        <RGroup.ItemHiddenInput />
                    </RGroup.Item>
                );
            })}
        </RGroup.Root>
    );
};

export default S_RadioGroup;
