'use client';

import React from 'react';

import { Menu } from '@ark-ui/react/menu';
import type { Placement } from '@floating-ui/dom';

import { MoreIcon } from '@/shared/icons';
import { cls } from '@/shared/utils';

import styles from './context-menu.module.css';

type BaseItem = {
    label: React.ReactNode;
    value: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    disabled?: boolean;
    active?: boolean;
    className?: string;
    onClick?: (context?: unknown) => void;
};

export interface ContextMenuProps<TContext = unknown> {
    context?: TContext;
    items: BaseItem[];
    trigger?: React.ReactNode;

    className?: string; // wrapper extras
    contentClassName?: string; // content extras
    itemClassName?: string; // shared item extras

    placement?: Placement;
}

const ContextMenu = <TContext,>({
    context,
    items,
    trigger,
    className,
    contentClassName,
    itemClassName,
    placement = 'bottom-end',
}: ContextMenuProps<TContext>) => {
    return (
        <Menu.Root positioning={{ placement }}>
            <Menu.Trigger asChild>{trigger ?? <MoreIcon />}</Menu.Trigger>

            <Menu.Positioner>
                <div className={cls(styles.wrapper)}>
                    <Menu.Content className={cls(styles.menu, contentClassName)}>
                        {items.map((it) => (
                            <Menu.Item
                                key={it.value}
                                value={it.value}
                                disabled={it.disabled}
                                className={cls(
                                    styles.item,
                                    it.active && styles.itemActive,
                                    it.disabled && styles.itemDisabled,
                                    itemClassName,
                                    it.className
                                )}
                                onClick={() => it.onClick?.(context)}
                            >
                                <span className={styles.iconLeft}>{it.leftIcon}</span>
                                <span className={styles.label}>{it.label}</span>
                                <span className={styles.iconRight}>{it.rightIcon}</span>
                            </Menu.Item>
                        ))}
                    </Menu.Content>
                </div>
            </Menu.Positioner>
        </Menu.Root>
    );
};

export default ContextMenu;
