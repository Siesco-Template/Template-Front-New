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
    | 'top'
    | 'top-start'
    | 'top-end';

type Size = 'default' | 'sm';

type ITooltipAxis = { mainAxis?: number; crossAxis?: number };

interface I_TooltipProps extends TooltipRootProps {
    position?: Placement;
    offset?: ITooltipAxis;
    content: ReactNode;
    size?: Size;
}

const S_Tooltip: FC<I_TooltipProps> = ({
    position = 'top',
    offset,
    content,
    openDelay = 200,
    closeDelay = 200,
    children,
    size = 'default',
    ...props
}) => {
    return (
        <Tooltip.Root
            openDelay={openDelay}
            closeDelay={closeDelay}
            positioning={{ placement: position, offset }}
            {...props}
        >
            <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>

            <Tooltip.Positioner>
                <Tooltip.Content className={styles.tooltip} data-size={size}>
                    {content}
                    <Tooltip.Arrow>
                        <Tooltip.ArrowTip />
                    </Tooltip.Arrow>
                </Tooltip.Content>
            </Tooltip.Positioner>
        </Tooltip.Root>
    );
};

export default S_Tooltip;
