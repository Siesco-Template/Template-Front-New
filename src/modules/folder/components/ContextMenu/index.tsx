import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';

import { cls } from '@/shared/utils';

import AlignCenterIcon from '../../shared/icons/align-center.svg?react';
import AppsAddIcon from '../../shared/icons/apps-add.svg?react';
import ArrowMoveIcon from '../../shared/icons/arrow-move.svg?react';
import CopyIcon from '../../shared/icons/copy.svg?react';
import DescriptionIcon from '../../shared/icons/description.svg?react';
import DownloadIcon from '../../shared/icons/download.svg?react';
import FontSizeIcon from '../../shared/icons/font-size.svg?react';
import ImageCircleIcon from '../../shared/icons/image-circle.svg?react';
import TrashIcon from '../../shared/icons/trash.svg?react';
import { FolderItem } from '../../types';

interface FolderContextMenuProps {
    children: React.ReactNode;
    item?: FolderItem;
    selectedItems?: FolderItem[];
    showMultipleSelectionMenu?: boolean;
    canDelete?: boolean;
    canCopy?: boolean;
    canMove?: boolean;
    onNewFolder?: () => void;
    onNewFile?: () => void;
    onRename?: () => void;
    onDelete?: () => void;
    onCopy?: () => void;
    onMove?: () => void;
    onDetails?: () => void;
    onSelectAll?: () => void;
    onComment?: () => void;
    onChangeIcon?: () => void;
    onCopyPath?: (item: FolderItem) => void;
    hideContextMenu?: boolean;
}

const ContextMenuItem = ({
    children,
    icon: Icon,
    className,
    ...props
}: {
    children: React.ReactNode;
    icon?: React.ComponentType<{ className?: string }>;
} & React.ComponentProps<typeof ContextMenuPrimitive.Item>) => {
    return (
        <ContextMenuPrimitive.Item
            className={cls(
                '!relative !mb-[2px] flex !cursor-pointer !select-none !items-center !gap-[6px] !py-2 !px-6 !text-[14px] !focus:!bg-[#E6F0FE] !transition-colors !outline-none !data-[disabled]:pointer-events-none !data-[disabled]:opacity-50',
                className
            )}
            {...props}
        >
            {Icon && <Icon />}
            {children}
        </ContextMenuPrimitive.Item>
    );
};

const ContextMenuSeparator = ContextMenuPrimitive.Separator;

export function FolderContextMenu({
    children,
    item,
    selectedItems = [],
    showMultipleSelectionMenu = false,
    canDelete = false,
    canCopy = false,
    canMove = false,
    onNewFolder,
    onNewFile,
    onRename,
    onDelete,
    onCopy,
    onMove,
    onDetails,
    onSelectAll,
    onComment,
    onChangeIcon,
    onCopyPath,
    hideContextMenu = false,
}: FolderContextMenuProps) {
    // If hideContextMenu is true, just render the children without the context menu
    if (hideContextMenu) {
        return <>{children}</>;
    }

    const isEmpty = !item && !showMultipleSelectionMenu;
    const isMultipleSelection = showMultipleSelectionMenu && selectedItems.length > 0;
    const isSingleItem = !isEmpty && !isMultipleSelection && item;
    const isFolder = item?.type === 'folder';
    const isFile = item?.type === 'file';

    return (
        <ContextMenuPrimitive.Root
            onOpenChange={(open) => {
                if (open && item && !selectedItems.includes(item)) {
                    // When the context menu opens, ensure the right-clicked item is selected
                    // We need to use a setTimeout to ensure this happens after the context menu is fully rendered
                    setTimeout(() => {
                        const element = document.querySelector(`[data-item-id="${item.id}"]`);
                        if (element) {
                            (element as HTMLElement).click();
                        }
                    }, 0);
                }
            }}
        >
            <ContextMenuPrimitive.Trigger asChild>{children}</ContextMenuPrimitive.Trigger>
            <ContextMenuPrimitive.Portal>
                <ContextMenuPrimitive.Content className="!min-w-[220px] !overflow-hidden !rounded-[12px] !border-1 !border-[#1F180013] !bg-[#FDFDFC] !py-6 !text-[#21201C] !shadow-md !animate-in !fade-in-80 !data-[side=bottom]:slide-in-from-top-2 !data-[side=left]:slide-in-from-right-2 !data-[side=right]:slide-in-from-left-2 !data-[side=top]:slide-in-from-bottom-2">
                    {isEmpty && (
                        <>
                            <ContextMenuItem icon={AppsAddIcon} onClick={onNewFolder}>
                                Yeni qovluq
                            </ContextMenuItem>
                            <ContextMenuItem icon={DescriptionIcon} onClick={onNewFile}>
                                Yeni fayl
                            </ContextMenuItem>
                            <ContextMenuItem icon={AppsAddIcon} onClick={onSelectAll} className="!mb-0">
                                Hamısını seç
                            </ContextMenuItem>
                        </>
                    )}

                    {isMultipleSelection && (
                        <>
                            {canDelete && (
                                <ContextMenuItem icon={TrashIcon} onClick={onDelete}>
                                    Sil ({selectedItems.length})
                                </ContextMenuItem>
                            )}
                            {/* {canCopy && (
                                <ContextMenuItem icon={CopyIcon} onClick={onCopy}>
                                    köçür ({selectedItems.length})
                                </ContextMenuItem>
                            )} */}
                            {canMove && (
                                <ContextMenuItem icon={ArrowMoveIcon} onClick={onMove} className="!mb-0">
                                    Yerini dəyiş ({selectedItems.length})
                                </ContextMenuItem>
                            )}
                        </>
                    )}

                    {isSingleItem && (
                        <>
                            {/* Folder-specific menu items */}
                            {isFolder && (
                                <>
                                    {item.permissions?.canEdit && (
                                        <ContextMenuItem icon={FontSizeIcon} onClick={() => onRename?.()}>
                                            Adını dəyiş
                                        </ContextMenuItem>
                                    )}
                                    {item.permissions?.canDelete && (
                                        <ContextMenuItem icon={TrashIcon} onClick={onDelete}>
                                            Sil
                                        </ContextMenuItem>
                                    )}
                                    {/* {item.permissions?.canCopy && (
                                        <ContextMenuItem icon={CopyIcon} onClick={onCopy}>
                                            Köçür
                                        </ContextMenuItem>
                                    )} */}
                                    {item.permissions?.canMove && (
                                        <ContextMenuItem icon={ArrowMoveIcon} onClick={onMove}>
                                            Yerini dəyiş
                                        </ContextMenuItem>
                                    )}
                                    {item.permissions?.canChangeIcon && (
                                        <ContextMenuItem icon={ImageCircleIcon} onClick={onChangeIcon}>
                                            İkonu dəyiş
                                        </ContextMenuItem>
                                    )}
                                    <ContextMenuItem icon={CopyIcon} onClick={() => onCopyPath?.(item)}>
                                        Yolu kopyala
                                    </ContextMenuItem>
                                    <ContextMenuSeparator className="my-1 h-px bg-border" />
                                    {item.permissions?.canComment && (
                                        <ContextMenuItem icon={DownloadIcon} onClick={onComment}>
                                            Şərh
                                        </ContextMenuItem>
                                    )}
                                    <ContextMenuItem icon={AlignCenterIcon} onClick={onDetails} className="!mb-0">
                                        Detallı bax
                                    </ContextMenuItem>
                                </>
                            )}

                            {/* File-specific menu items */}
                            {isFile && (
                                <>
                                    {item.permissions?.canEdit && (
                                        <ContextMenuItem icon={FontSizeIcon} onClick={() => onRename?.()}>
                                            Adını dəyiş
                                        </ContextMenuItem>
                                    )}
                                    {item.permissions?.canDelete && (
                                        <ContextMenuItem icon={TrashIcon} onClick={onDelete}>
                                            Sil
                                        </ContextMenuItem>
                                    )}
                                    {item.permissions?.canCopy && (
                                        <ContextMenuItem icon={CopyIcon} onClick={onCopy}>
                                            Köçür
                                        </ContextMenuItem>
                                    )}
                                    {item.permissions?.canMove && (
                                        <ContextMenuItem icon={ArrowMoveIcon} onClick={onMove}>
                                            Yerini dəyiş
                                        </ContextMenuItem>
                                    )}
                                    <ContextMenuItem icon={CopyIcon} onClick={() => onCopyPath?.(item)}>
                                        Yolu kopyala
                                    </ContextMenuItem>
                                    <ContextMenuSeparator className="my-1 h-px bg-border" />
                                    <ContextMenuItem icon={AlignCenterIcon} onClick={onDetails} className="!mb-0">
                                        Detallı bax
                                    </ContextMenuItem>
                                </>
                            )}
                        </>
                    )}
                </ContextMenuPrimitive.Content>
            </ContextMenuPrimitive.Portal>
        </ContextMenuPrimitive.Root>
    );
}
