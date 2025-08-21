import React from 'react';

import { Menu, Portal } from '@ark-ui/react';

import { MoreVerticalIcon } from '../icons';
import {
    AlignCenterIcon,
    DescriptionIcon,
    DiamondIcon,
    DownloadIcon,
    HomeFilterIcon,
    PageSeparatorIcon,
    PencilIcon,
    RotateLockIcon,
    TrashIcon,
    UserBlockIcon,
} from './icons';
import styles from './table.module.css';

interface Props {
    onView?: () => void;
    onCustomize?: () => void;
    onNewItem?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    onBlock?: () => void;
    onExtractSpeed?: () => void;
    onExport?: () => void;
    onPermissions?: () => void;
    onResetPassword?: () => void;
    variant?: 'menu' | 'inline';
}

const TableRowActions: React.FC<Props> = ({
    onView,
    onCustomize,
    onNewItem,
    onEdit,
    onDelete,
    onBlock,
    onExtractSpeed,
    onExport,
    onPermissions,
    onResetPassword,
    variant = 'menu', 
}) => {
    const renderItems = () => (
        <>
            {onView && (
                <div className={styles.menuItem} onClick={onView}>
                    <AlignCenterIcon color="#28303F" width={22} height={22} /> Detallı bax
                </div>
            )}
            {onCustomize && (
                <div className={styles.menuItem} onClick={onCustomize}>
                    <HomeFilterIcon color="#28303F" width={22} height={22} /> Fərdiləşdirmə
                </div>
            )}
            {onNewItem && (
                <div className={styles.menuItem} onClick={onNewItem}>
                    <DescriptionIcon color="#28303F" width={22} height={22} /> Yeni item
                </div>
            )}
            {onEdit && (
                <div className={styles.menuItem} onClick={onEdit}>
                    <PencilIcon color="#28303F" width={16} height={16} /> Düzəliş et
                </div>
            )}
            {onDelete && (
                <div className={styles.menuItem} onClick={onDelete}>
                    <TrashIcon color="#28303F" width={22} height={22} /> Sil
                </div>
            )}
            {onExtractSpeed && (
                <div className={styles.menuItem} onClick={onExtractSpeed}>
                    <PageSeparatorIcon color="#28303F" width={22} height={22} /> Sürətini çıxar
                </div>
            )}
            {onExport && (
                <div className={styles.menuItem} onClick={onExport}>
                    <DownloadIcon color="#28303F" width={22} height={22} /> Endir
                </div>
            )}
        </>
    );

    if (variant === 'inline') {
        return <div className={styles.menuContent}>{renderItems()}</div>;
    }

    return (
        <Menu.Root positioning={{ placement: 'bottom-end' }}>
            <Menu.Trigger className={styles.menuTrigger}>
                <MoreVerticalIcon width={18} height={18} />
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content className={styles.menuContent}>
                        {onView && (
                            <Menu.Item value="view" className={styles.menuItem} onClick={onView}>
                                <AlignCenterIcon color="#28303F" width={22} height={22} /> Detallı bax
                            </Menu.Item>
                        )}
                        {onCustomize && (
                            <Menu.Item value="customize" className={styles.menuItem} onClick={onCustomize}>
                                <HomeFilterIcon color="#28303F" width={22} height={22} /> Fərdiləşdirmə
                            </Menu.Item>
                        )}
                        {onNewItem && (
                            <Menu.Item value="new" className={styles.menuItem} onClick={onNewItem}>
                                <DescriptionIcon color="#28303F" width={22} height={22} /> Yeni item
                            </Menu.Item>
                        )}
                        {onBlock && (
                            <Menu.Item value="block" className={styles.menuItem} onClick={onBlock}>
                                <UserBlockIcon width={16} height={16} /> Blokla
                            </Menu.Item>
                        )}
                        {onPermissions && (
                            <Menu.Item value="permissions" className={styles.menuItem} onClick={onPermissions}>
                                <DiamondIcon width={16} height={16} /> Hüquqlar
                            </Menu.Item>
                        )}
                        {onResetPassword && (
                            <Menu.Item value="resetPassword" className={styles.menuItem} onClick={onResetPassword}>
                                <RotateLockIcon width={16} height={16} /> Şifrəni sıfırla
                            </Menu.Item>
                        )}
                        {onEdit && (
                            <Menu.Item value="edit" className={styles.menuItem} onClick={onEdit}>
                                <PencilIcon width={16} height={16} /> Düzəliş et
                            </Menu.Item>
                        )}
                        {onDelete && (
                            <Menu.Item value="delete" className={styles.menuItem} onClick={onDelete}>
                                <TrashIcon width={16} height={16} /> Sil
                            </Menu.Item>
                        )}
                        {onExtractSpeed && (
                            <Menu.Item value="extract" className={styles.menuItem} onClick={onExtractSpeed}>
                                <PageSeparatorIcon color="#28303F" width={22} height={22} /> Sürətini çıxar
                            </Menu.Item>
                        )}
                        {onExport && (
                            <Menu.Item value="export" className={styles.menuItem} onClick={onExport}>
                                <DownloadIcon color="#28303F" width={22} height={22} /> Endir
                            </Menu.Item>
                        )}
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    );
};

export default TableRowActions;
