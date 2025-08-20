import { FC, ReactNode } from 'react';

import { Tooltip, TooltipRootProps } from '@ark-ui/react/tooltip';

import styles from './tooltip.module.css';

type Placement =
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'top'
    | 'top-start'
    | 'top-end';

type ITooltipAxis = {
    mainAxis?: number;
    crossAxis?: number;
};
interface I_TooltipProps extends TooltipRootProps {
    position: Placement;
    offset?: ITooltipAxis;
    content: ReactNode;
}
const S_Tooltip: FC<I_TooltipProps> = ({
    position = 'bottom',
    offset,
    content,
    openDelay = 300,
    closeDelay = 300,
    children,
    ...props
}) => {
    return (
        <Tooltip.Root
            closeDelay={openDelay}
            openDelay={closeDelay}
            positioning={{
                placement: position,
                offset: offset,
            }}
            {...props}
        >
            <Tooltip.Trigger className={styles.trigger}>{children}</Tooltip.Trigger>
            <Tooltip.Positioner>
                <Tooltip.Content className={styles['tooltip-content']}>{content}</Tooltip.Content>
            </Tooltip.Positioner>
        </Tooltip.Root>
    );
};

export default S_Tooltip;
