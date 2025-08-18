import { TinyColor } from '@ctrl/tinycolor';

import { cls } from '@/shared/utils';

import ChevronDownIcon from '../../shared/icons/chevron-down.svg?react';
import ChevronRightIcon from '../../shared/icons/chevron-right.svg?react';
import FileIcon from '../../shared/icons/file 04.svg?react';
import FolderIcon from '../../shared/icons/folders.svg?react';
import { FolderGridProps, FolderItem } from '../../types';
import { FolderContextMenu } from '../ContextMenu';
import styles from './style.module.css';

const viewModeToItemClass = {
    list: styles.itemList,
    small: styles.itemSmall,
    medium: styles.itemMedium,
    large: styles.itemLarge,
    tree: styles.itemTree,
};

const viewModeToIconSize = {
    list: styles.iconList,
    small: styles.iconSmall,
    medium: styles.iconMedium,
    large: styles.iconLarge,
    tree: styles.iconTree,
};

interface TreeItemProps {
    item: FolderGridProps['items'][0];
    level: number;
    isExpanded: boolean;
    isSelected: boolean;
    onToggle: () => void;
    onItemClick: (item: FolderGridProps['items'][0], event: React.MouseEvent) => void;
    onItemDoubleClick?: (item: FolderGridProps['items'][0]) => void;
    selectedItems: FolderItem[];
    allSelectedHavePermission: (permission: keyof NonNullable<FolderItem['permissions']>) => boolean;
    onRename?: () => void;
    onDelete?: () => void;
    onCopy?: () => void;
    onMove?: () => void;
    onDetails?: () => void;
    onCopyPath?: (item: FolderItem) => void;
    onComment?: (item: FolderItem) => void;
    onChangeIcon?: (item: FolderItem) => void;
}

function TreeItem({
    item,
    level,
    isExpanded,
    isSelected,
    onToggle,
    onItemClick,
    onItemDoubleClick,
    selectedItems,
    allSelectedHavePermission,
    onRename,
    onDelete,
    onCopy,
    onMove,
    onDetails,
    onCopyPath,
    onComment,
    onChangeIcon,
}: TreeItemProps) {
    const IconComponent = item.type === 'folder' ? FolderIcon : FileIcon;
    const currentColor = new TinyColor(item.icon);
    const style =
        item.type === 'folder'
            ? {
                  '--lip-color': currentColor.mix('#fff', -50).toHexString(),
                  '--folder-color': currentColor.toHexString(),
              }
            : {};

    return (
        <FolderContextMenu
            item={item}
            onRename={onRename}
            onDelete={onDelete}
            onCopy={onCopy}
            onMove={onMove}
            onDetails={onDetails}
            onCopyPath={onCopyPath}
            onComment={onComment ? () => onComment(item) : undefined}
            onChangeIcon={onChangeIcon ? () => onChangeIcon(item) : undefined}
            selectedItems={selectedItems}
            showMultipleSelectionMenu={selectedItems.length > 1}
            canDelete={allSelectedHavePermission('canDelete')}
            canCopy={allSelectedHavePermission('canCopy')}
            canMove={allSelectedHavePermission('canMove')}
        >
            <div
                className={cls(styles.treeRow, isSelected && styles.treeRowSelected)}
                style={{ paddingLeft: level * 16 }}
                onClick={(e) => {
                    return onItemClick(item, e);
                }}
                onDoubleClick={() => onItemDoubleClick?.(item)}
                tabIndex={0}
                role="treeitem"
                aria-expanded={item.type === 'folder' ? isExpanded : undefined}
                aria-selected={isSelected}
                data-item-id={item.id}
            >
                {item.type === 'folder' ? (
                    <button
                        className={styles.toggleBtn}
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggle();
                        }}
                    >
                        {isExpanded ? (
                            <ChevronDownIcon className={styles.chevronIcon} />
                        ) : (
                            <ChevronRightIcon className={styles.chevronIcon} />
                        )}
                    </button>
                ) : (
                    <span className={styles.toggleBtn} /> // spacer for files (same width/height)
                )}
                <IconComponent className={viewModeToIconSize['tree']} style={style as React.CSSProperties} />
                <span className={cls(styles.treeName, styles.textTruncate)}>{item.name}</span>
                <div className={styles.flex1} />
                <span className={styles.treeType}>{item.type === 'folder' ? 'Qovluq' : 'Fayl'}</span>
                <span className={styles.treeDate}>{new Date(item?.createDate!).toLocaleDateString('tr-TR')}</span>
            </div>
        </FolderContextMenu>
    );
}

export function FolderGrid({
    items,
    viewMode,
    onItemClick,
    onItemDoubleClick,
    selectedItems = [],
    className,
    onRename,
    onDelete,
    onCopy,
    onMove,
    onDetails,
    onCopyPath,
    onComment,
    onChangeIcon,
    itemRefs,
    onItemsChange,
    isSearchMode,
}: FolderGridProps) {
    const allSelectedHavePermission = (permission: keyof NonNullable<FolderItem['permissions']>) => {
        return selectedItems.every((item) => item.permissions?.[permission]);
    };

    const renderGridItem = (item: FolderItem, index: number) => {
        const IconComponent = item.type === 'folder' ? FolderIcon : FileIcon;
        const currentColor = new TinyColor(item.icon);
        const style =
            item.type === 'folder'
                ? {
                      '--lip-color': currentColor.mix('#fff', -50).toHexString(),
                      '--folder-color': currentColor.toHexString(),
                  }
                : {};

        return (
            <FolderContextMenu
                key={index}
                item={item}
                onRename={onRename}
                onDelete={onDelete}
                onCopy={onCopy}
                onMove={onMove}
                onDetails={onDetails ? () => onDetails(item) : undefined}
                onCopyPath={onCopyPath}
                selectedItems={selectedItems}
                showMultipleSelectionMenu={selectedItems.length > 1}
                canDelete={allSelectedHavePermission('canDelete')}
                canCopy={allSelectedHavePermission('canCopy')}
                canMove={allSelectedHavePermission('canMove')}
                onComment={onComment ? () => onComment(item) : undefined}
                onChangeIcon={onChangeIcon ? () => onChangeIcon(item) : undefined}
            >
                <div
                    ref={(el) => {
                        if (el) {
                            itemRefs?.push({ el, item });
                        } else {
                            itemRefs?.splice(
                                itemRefs.findIndex((ref) => ref.item.id === item.id),
                                1
                            );
                        }
                    }}
                    data-item-id={item.id}
                    className={cls(
                        viewModeToItemClass[viewMode],
                        styles.gridItem,
                        selectedItems.includes(item) && styles.gridItemSelected
                    )}
                    onClick={(e) => onItemClick(item, e)}
                    onDoubleClick={() => onItemDoubleClick?.(item)}
                    tabIndex={0}
                    role="button"
                    aria-selected={selectedItems.includes(item)}
                >
                    <IconComponent className={cls(viewModeToIconSize[viewMode])} style={style as React.CSSProperties} />
                    <span className={styles.itemName}>{item.name}</span>
                    {viewMode === 'list' && (
                        <>
                            <div className={styles.flex1} />
                            <span className={styles.typeLabel}>{item.type === 'folder' ? 'Qovluq' : 'Fayl'}</span>

                            {isSearchMode && <span className={styles.pathLabel}>{item.path}</span>}

                            <span className={styles.dateLabel}>
                                {new Date(item?.createDate!).toLocaleDateString('tr-TR')}
                            </span>
                        </>
                    )}
                </div>
            </FolderContextMenu>
        );
    };

    if (viewMode === 'tree') {
        const renderTreeItems = (items: FolderGridProps['items'], level: number = 0) => {
            return items.map((item) => (
                <div key={item.id}>
                    <TreeItem
                        item={item}
                        level={level}
                        isExpanded={item?.isExpanded ?? false}
                        isSelected={selectedItems?.includes(item) || false}
                        onToggle={async () => {
                            if (item?.type === 'folder') {
                                const isAppend = typeof item.isExpanded === 'boolean' ? false : true;
                                onItemsChange?.(item.path, isAppend);
                            }
                        }}
                        onItemClick={onItemClick}
                        onItemDoubleClick={onItemDoubleClick}
                        selectedItems={selectedItems}
                        allSelectedHavePermission={allSelectedHavePermission}
                        onRename={onRename}
                        onDelete={onDelete}
                        onCopy={onCopy}
                        onMove={onMove}
                        onDetails={onDetails ? () => onDetails(item) : undefined}
                        onCopyPath={onCopyPath}
                        onComment={onComment ? () => onComment(item) : undefined}
                        onChangeIcon={onChangeIcon ? () => onChangeIcon(item) : undefined}
                    />
                    {item?.isExpanded && item?.type === 'folder' && item?.children && item?.children?.length > 0 && (
                        <div role="group">{renderTreeItems(item.children, level + 1)}</div>
                    )}
                </div>
            ));
        };

        return (
            <div
                className={cls(styles.treeWrap, className)}
                style={{ maxHeight: 'calc(100vh - 260px)' }}
                onClick={(e) => {
                    if (e.currentTarget === e.target) {
                        onItemClick(null, e, 'clear');
                    }
                }}
                onContextMenu={(e) => {
                    if (e.currentTarget === e.target) {
                        onItemClick(null, e, 'clear');
                    }
                }}
            >
                <div className={styles.treeHeader}>
                    <span className={cls(styles.treeHeaderName, styles.treeHeaderNameFlex)}>Ad</span>
                    <span className={styles.treeHeaderType}>Tipi</span>
                    <span className={styles.treeHeaderDate}>Yaradılma tarixi</span>
                </div>
                <div className={styles.treeBody}>{renderTreeItems(items)}</div>
            </div>
        );
    }

    return (
        <div
            className={cls(styles.gridWrap, className, viewMode === 'list' && styles.gridWrapList)}
            onClick={(e) => {
                if (e.currentTarget === e.target && !e.ctrlKey) {
                    onItemClick(null, e, 'clear');
                }
            }}
            onContextMenu={(e) => {
                if (e.currentTarget === e.target) {
                    onItemClick(null, e, 'clear');
                }
            }}
        >
            {items.map(renderGridItem)}
        </div>
    );
}

export default FolderGrid;
