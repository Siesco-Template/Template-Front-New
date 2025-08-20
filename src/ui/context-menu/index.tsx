'use client';

import { Menu } from '@ark-ui/react/menu';

import { MoreIcon } from '@/shared/icons';

import styles from './context-menu.module.css';

interface ContextMenuProps {
    id: string;
    items: { label: string; onClick: (id: string) => void; value: string; icon: React.ReactNode }[];
}

const ContextMenu: React.FC<ContextMenuProps> = ({ id, items }) => {
    return (
        <Menu.Root>
            <Menu.Trigger asChild>
                <MoreIcon />
            </Menu.Trigger>
            <Menu.Content className={styles.contextMenu}>
                {items.map((item, index) => (
                    <Menu.Item
                        key={index}
                        value={item.value}
                        onClick={() => item.onClick(id)}
                        className={styles.contextMenuItem}
                    >
                        <span>{item.icon}</span>
                        {item.label}
                    </Menu.Item>
                ))}
            </Menu.Content>
        </Menu.Root>
    );
};

export default ContextMenu;
