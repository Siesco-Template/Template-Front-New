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
    className?: string;
    orientation?: 'horizontal' | 'vertical';
}

const S_RadioGroup: FC<I_RadioGroupProps> = ({ label, groupData, className, orientation = 'vertical', ...props }) => {
    return (
        <div className={cls(styles.wrapper, className)}>
            {label && <label className={styles.label}>{label}</label>}

            <RGroup.Root
                className={cls(styles.radioGroup)}
                data-orientation={orientation}
                orientation={orientation}
                {...props}
            >
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
            </RGroup.Root>
        </div>
    );
};

export default S_RadioGroup;
