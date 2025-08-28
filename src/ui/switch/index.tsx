import { FC } from 'react';

import {
    Switch as S,
    SwitchControlProps,
    SwitchLabelProps,
    SwitchRootProps,
    SwitchThumbProps,
} from '@ark-ui/react/switch';

import { cls } from '@/shared/utils';

import styles from './switch.module.css';

type SwitchSize = '14' | '16' | '20';

interface I_SwitchProps extends SwitchRootProps {
    label?: string;
    labelProps?: SwitchLabelProps;
    controlProps?: SwitchControlProps;
    thumbProps?: SwitchThumbProps;
    size?: SwitchSize;
}

const S_Switch: FC<I_SwitchProps> = ({
    label,
    labelProps,
    controlProps,
    thumbProps,
    className,
    size = '16',
    ...props
}) => {
    return (
        <S.Root className={cls(styles.switch, className)} data-size={size} {...props}>
            <S.Control {...controlProps}>
                <S.Thumb {...thumbProps} />
            </S.Control>
            {label && <S.Label {...labelProps}>{label}</S.Label>}
            <S.HiddenInput className={styles.hiddenInputFixed} />
        </S.Root>
    );
};

export default S_Switch;
