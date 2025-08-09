import { FC } from 'react';

import { Switch as S, SwitchControlProps, SwitchLabelProps, SwitchRootProps, SwitchThumbProps } from '@ark-ui/react';

import { cls } from '@/shared/utils';

import styles from './switch.module.css';

interface I_SwitchProps extends SwitchRootProps {
    label?: string;
    labelProps?: SwitchLabelProps;
    controlProps?: SwitchControlProps;
    thumbProps?: SwitchThumbProps;
    color?: 'primary' | 'blue';
    variant?: 'default' | 'primary';
}

const S_Switch: FC<I_SwitchProps> = ({
    color = 'blue',
    variant = 'default',
    label,
    labelProps,
    controlProps,
    thumbProps,
    className,
    ...props
}) => {
    return (
        <S.Root className={cls(styles.switch, styles[`variant-${variant}`], className)} data-color={color} {...props}>
            <S.Control {...controlProps}>
                <S.Thumb {...thumbProps} />
            </S.Control>
            {label && <S.Label {...labelProps}>{label}</S.Label>}
            <S.HiddenInput className={styles.hiddenInputFixed} />
        </S.Root>
    );
};

export default S_Switch;
