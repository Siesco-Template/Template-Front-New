import { TinyColor } from '@ctrl/tinycolor';

import { cls } from '@/shared/utils';

import ChevronDownIcon from '../../shared/icons/chevron-down.svg?react';
import ChevronRightIcon from '../../shared/icons/chevron-right.svg?react';
import FileIcon from '../../shared/icons/file 04.svg?react';
import FolderIcon from '../../shared/icons/folders.svg?react';
import { FolderGridProps, FolderItem } from '../../types';
import { FolderContextMenu } from '../ContextMenu';

const viewModeToItemClass = {
    list: 'flex items-center !gap-2 !pl-1 !pr-14 !py-2',
    small: 'flex flex-col items-center justify-center !gap-2 !p-[6px] w-[68px]',
    medium: 'flex flex-col items-center justify-center !gap-2 !p-[6px] w-[82px]',
    large: 'flex flex-col items-center justify-center !gap-2 !p-[6px] w-[82px]',
    tree: 'flex items-center !gap-1 !py-1 !px-2',
};

const viewModeToIconSize = {
    list: '!w-8 !h-8',
    small: '!w-8 !h-8',
    medium: '!w-10 !h-10',
    large: '!w-16 !h-16',
    tree: '!w-6 !h-6',
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
                className={cls(
                    'flex items-center !gap-1 !py-4 !cursor-pointer !select-none !bg-transparent',
                    '!hover:bg-[#F5F7F9] !rounded-sm',
                    isSelected && '!bg-[#F3F3F3]'
                )}
                style={{ paddingLeft: `${(level + 1) * 16}px` }}
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
                        className="!w-6 !h-6"
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggle();
                        }}
                    >
                        {isExpanded ? (
                            <ChevronDownIcon className="!text-black" />
                        ) : (
                            <ChevronRightIcon className="!text-black" />
                        )}
                    </button>
                ) : (
                    <span className="w-6" /> // Spacer for files
                )}
                <IconComponent className={viewModeToIconSize['tree']} style={style as React.CSSProperties} />
                <span className="!text-sm !truncate !text-[#3D4C5E]">{item.name}</span>
                <div className="!flex-1" />
                <span className="!text-sm !text-[#3D4C5E] text-center !w-12 !mr-4">
                    {item.type === 'folder' ? 'Qovluq' : 'Fayl'}
                </span>
                <span className="!text-sm !text-[#3D4C5E] !w-24 !text-center">
                    {new Date(item?.createDate!).toLocaleDateString('tr-TR')}
                </span>
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
    isDragging,
    dragStartPoint,
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
                        '!rounded-[4px] !hover:bg-[#F5F7F9] !cursor-pointer !select-none !h-fit',
                        selectedItems.includes(item) && '!bg-[#F3F3F3]'
                    )}
                    onClick={(e) => onItemClick(item, e)}
                    onDoubleClick={() => onItemDoubleClick?.(item)}
                    tabIndex={0}
                    role="button"
                    aria-selected={selectedItems.includes(item)}
                >
                    <IconComponent className={cls(viewModeToIconSize[viewMode])} style={style as React.CSSProperties} />
                    <span className="!text-[14px] !text-center !text-[#546881] !break-all">{item.name}</span>
                    {viewMode === 'list' && (
                        <>
                            <div className="flex-1" />
                            <span className="!text-[14px] !text-[#47586E] !text-left !w-16 !mr-4">
                                {item.type === 'folder' ? 'Qovluq' : 'Fayl'}
                            </span>

                            {isSearchMode && (
                                <span className="!text-[14px] !text-[#47586E] lg:!w-[150px] !w-fit lg:!mr-0 !mr-4 !text-left !text-truncate block">
                                    {item.path}
                                </span>
                            )}

                            <span className="!text-[14px] !text-[#47586E] inline-block lg:!w-[100px] !w-fit lg:!mr-0 !mr-4 !text-right">
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
                className={cls('!min-w-full !overflow-auto !pr-4', className)}
                style={{ maxHeight: 'calc(100vh - 260px)' }}
                onClick={(e) => {
                    // If clicking directly on the grid (not on items), clear selection
                    if (e.currentTarget === e.target) {
                        onItemClick(null, e, 'clear');
                    }
                }}
                onContextMenu={(e) => {
                    // If right-clicking directly on the grid (not on items), clear selection
                    if (e.currentTarget === e.target) {
                        onItemClick(null, e, 'clear');
                    }
                }}
            >
                <div className="!flex items-center !gap-1 !py-2 !px-4 !border-b !text-sm !font-medium !sticky !top-0 !z-0">
                    <span className="flex-1 !text-[#3D4C5E]">Ad</span>
                    <span className="!text-center !w-12 !mr-4 !text-[#3D4C5E]">Tipi</span>
                    <span className="!text-center !text-nowrap !text-[#3D4C5E]">Yaradılma tarixi</span>
                </div>
                <div className="!py-1">{renderTreeItems(items)}</div>
            </div>
        );
    }

    return (
        <div
            className={cls(
                'flex !gap-4 !relative !overflow-auto flex-wrap',
                className,
                viewMode === 'list' && 'flex-col'
            )}
            onClick={(e) => {
                // If clicking directly on the grid (not on items), clear selection
                if (e.currentTarget === e.target && !e.ctrlKey) {
                    onItemClick(null, e, 'clear');
                }
            }}
            onContextMenu={(e) => {
                // If right-clicking directly on the grid (not on items), clear selection
                if (e.currentTarget === e.target) {
                    onItemClick(null, e, 'clear');
                }
            }}
        >
            {items.map(renderGridItem)}
        </div>
    );
}
