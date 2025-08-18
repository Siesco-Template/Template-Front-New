import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { cls } from '@/shared/utils';

import { S_Button } from '@/ui';

import DirectionDownIcon from '../../shared/icons/direction-down.svg?react';
import { ViewMode, ViewStyleSelectorProps } from '../../types';
import styles from './style.module.css';

const viewModeLabels: Record<ViewMode, string> = {
    list: 'Siyahı',
    small: 'Kiçik ikonlar',
    medium: 'Orta ikonlar',
    large: 'Böyük ikonlar',
    tree: 'Ağac görünüşü',
};

export function ViewStyleSelector({ currentMode, onChange, className }: ViewStyleSelectorProps) {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <S_Button variant="main-10" color="secondary" className={className}>
                    Görünüş
                    <DirectionDownIcon />
                </S_Button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content className={styles.content} sideOffset={5}>
                    {(Object.keys(viewModeLabels) as ViewMode[]).map((mode) => {
                        return (
                            <DropdownMenu.Item
                                key={mode}
                                className={cls(styles.item, mode === currentMode && styles.itemSelected)}
                                onClick={() => onChange(mode)}
                            >
                                {viewModeLabels[mode]}
                            </DropdownMenu.Item>
                        );
                    })}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}
