import { FC } from 'react';

import {
    Switch as S,
    SwitchControlProps,
    SwitchLabelProps,
    SwitchRootProps,
    SwitchThumbProps,
} from '@ark-ui/react/switch';

import styles from './switch.module.css';

type SwitchSize = '14' | '16' | '20';
type LabelPosition = 'left' | 'right';

interface I_SwitchProps extends SwitchRootProps {
    label?: string;
    labelProps?: SwitchLabelProps;
    controlProps?: SwitchControlProps;
    thumbProps?: SwitchThumbProps;
    size?: SwitchSize;
    labelPosition?: LabelPosition;
}

const S_Switch: FC<I_SwitchProps> = ({
    label,
    labelProps,
    controlProps,
    thumbProps,
    className,
    size = '16',
    labelPosition = 'right',
    ...props
}) => {
    return (
        <S.Root className={className} data-size={size} {...props}>
            {label && labelPosition === 'left' && <S.Label {...labelProps}>{label}</S.Label>}
            <S.Control {...controlProps}>
                <S.Thumb {...thumbProps} />
            </S.Control>
            {label && labelPosition === 'right' && <S.Label {...labelProps}>{label}</S.Label>}
            <S.HiddenInput className={styles.hiddenInputFixed} />
        </S.Root>
    );
};

export default S_Switch;
