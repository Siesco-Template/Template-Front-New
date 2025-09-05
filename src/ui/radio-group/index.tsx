import { FC } from 'react';

import { RadioGroup as RGroup, RadioGroupRootProps } from '@ark-ui/react/radio-group';

import styles from './radio-group.module.css';

export type RadioGroupSize = '14' | '16' | '20';

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
    className?: string;
    orientation?: 'horizontal' | 'vertical';
    size?: RadioGroupSize;
}

const S_RadioGroup: FC<I_RadioGroupProps> = ({
    label,
    groupData,
    className,
    orientation = 'vertical',
    size,
    ...props
}) => {
    return (
        <RGroup.Root className={className} data-orientation={orientation} data-size={size} {...props}>
            {label && <RGroup.Label>{label}</RGroup.Label>}

            <div className={styles.itemsWrapper}>
                {groupData.map((item) => {
                    const value =
                        typeof item === 'string' ? item : 'id' in item ? item.id.toString() : item.value.toString();

                    const itemLabel = typeof item === 'string' ? item : item.label.toString();
                    const disabled = typeof item !== 'string' && item?.disabled;

                    return (
                        <RGroup.Item key={value} value={value} disabled={disabled}>
                            <RGroup.ItemControl />
                            <RGroup.ItemText>{itemLabel}</RGroup.ItemText>
                            <RGroup.ItemHiddenInput />
                        </RGroup.Item>
                    );
                })}
            </div>
        </RGroup.Root>
    );
};

export default S_RadioGroup;
