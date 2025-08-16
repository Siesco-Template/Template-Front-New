import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import { cls } from '@/shared/utils';

import { S_Button } from '@/ui';

import { AddressBar } from './components/AddressBar';
import { FolderContextMenu } from './components/ContextMenu';
import { FolderGrid } from './components/Grid';
import { SearchBar } from './components/SearchBar';
import { ViewStyleSelector } from './components/ViewStyleSelector';
import { ChangeIconDialog } from './dialogs/change-icon-dialog';
import { CommentDialog } from './dialogs/comment-dialog';
import { DeleteDialog } from './dialogs/delete-dialog';
import { DetailsDialog } from './dialogs/details-dialog';
import { MoveDialog } from './dialogs/move-dialog';
import { NewFileDialog } from './dialogs/new-file-dialog';
import { NewFolderDialog } from './dialogs/new-folder-dialog';
import { NotFoundDialog } from './dialogs/not-found-dialog';
import { RenameDialog } from './dialogs/rename-dialog';
import useDialogState from './hooks/useDialogState';
import useFolderOperations from './hooks/useFolderOperations';
import { folderService } from './services/folder.service';
import styles from './style.module.css';
import { FolderItem, SelectionAction, ViewMode } from './types';

interface FolderProps {
    items: FolderItem[];
    setItems: React.Dispatch<React.SetStateAction<FolderItem[]>>;
    currentPath: string;
    setCurrentPath: React.Dispatch<React.SetStateAction<string>>;
    onItemsChange?: (path: string, isAppend?: boolean) => Promise<void>;
    className?: string;
    hideContextMenu?: boolean;
    allowMultipleSelection?: boolean;
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
    showFilesOnlyButton?: boolean;
    showViewModeSelector?: boolean;
}

export function Folder({
    items,
    setItems,
    currentPath,
    setCurrentPath,
    onItemsChange,
    hideContextMenu = false,
    allowMultipleSelection = true,
    className,
    viewMode,
    onViewModeChange,
    showFilesOnlyButton = true,
    showViewModeSelector = true,
}: FolderProps) {
    const [showFilesOnly, setShowFilesOnly] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedItems, setSelectedItems] = useState<FolderItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [dragStartPoint, setDragStartPoint] = useState<{
        x: number;
        y: number;
    } | null>(null);

    const gridRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<{ el: HTMLDivElement; item: FolderItem }[]>([]);

    const [selectionBox, setSelectionBox] = useState<{
        left: number;
        top: number;
        width: number;
        height: number;
    } | null>(null);

    const { deleteItems, updateItem, moveItems, searchItems } = useFolderOperations({ items, setItems, currentPath });

    const {
        renameDialogOpen,
        deleteDialogOpen,
        commentDialogOpen,
        detailsDialogOpen,
        changeIconDialogOpen,
        newFolderDialogOpen,
        newFileDialogOpen,
        moveDialogOpen,
        notFoundDialogOpen,
        handlePathNotFound,
        handleDelete,
        handleDetails,
        handleRename,
        handleCopyPath,
        handleNewFolder,
        handleNewFile,
        handleComment,
        handleChangeIcon,
        handleMove,
        handleCopy,
        handleRenameOpenChange,
        handleDeleteOpenChange,
        handleCommentOpenChange,
        handleDetailsOpenChange,
        handleChangeIconOpenChange,
        handleNewFolderOpenChange,
        handleNewFileOpenChange,
        handleMoveOpenChange,
        handleNotFoundOpenChange,
        itemToComment,
        itemToShowDetails,
        itemToChangeIcon,
        itemsToMove,
        itemToRename,
        notFoundPath,
        moveOption,
        handleRenameSubmit,
        handleDeleteConfirm,
        handleNewFolderSubmit,
        handleNewFileSubmit,
        handleCommentSubmit,
        handleChangeIconSubmit,
        handleMoveSubmit,
        handleCopySubmit,
    } = useDialogState({
        selectedItems,
        setSelectedItems,
        currentPath,
        viewMode,
        onItemsChange,
        items,
        setItems,
        searchQuery,
        deleteItems,
        updateItem,
        moveItems,
        searchItems,
    });

    const handleViewModeChange = (mode: ViewMode) => {
        onViewModeChange(mode);
    };

    const handleItemClick = useCallback(
        (item: FolderItem | null, event: React.MouseEvent, action?: SelectionAction) => {
            if (action === 'selectAll') {
                setSelectedItems(items);
                return;
            }

            if (action === 'clear') {
                setSelectedItems([]);
                return;
            }

            if (!item) return;

            if ((event.ctrlKey || action === 'toggle') && allowMultipleSelection) {
                // Toggle selection
                setSelectedItems((prev) => {
                    const newSelected = [...prev];
                    if (newSelected.includes(item)) {
                        newSelected.splice(newSelected.indexOf(item), 1);
                    } else {
                        newSelected.push(item);
                    }
                    return newSelected;
                });
            } else {
                // Single select
                setSelectedItems([item]);
            }
        },
        [items, onItemsChange]
    );

    const handleItemDoubleClick = async (item: FolderItem) => {
        if (item.type === 'folder') {
            setCurrentPath(item.path);
        }
    };

    const handlePathChange = (newPath: string) => {
        if (currentPath === newPath) {
            return;
        }

        setCurrentPath(newPath);
        setSelectedItems([]);
    };

    const handleSearch = async (query: string) => {
        setSearchQuery?.(query);
    };

    useEffect(() => {
        if (searchQuery) {
            searchItems(searchQuery);
            onViewModeChange('list');
        } else if (!searchQuery && viewMode === 'list') {
            //? to prevent fetch in initial render initial
            onItemsChange?.(currentPath);
        }
    }, [searchQuery]);

    const validatePath = async (path: string) => {
        try {
            await folderService.getFoldersAndFiles(path);
            return true;
        } catch (error) {
            return false;
        }
    };

    const handleBackgroundClick = (event: React.MouseEvent) => {
        if (event.currentTarget === event.target && !event.ctrlKey) {
            handleItemClick(null, event, 'clear');
        }
    };

    const handleMouseDown = (event: React.MouseEvent) => {
        if (event.button === 0 && viewMode !== 'tree' && allowMultipleSelection) {
            setIsDragging(true);
            setDragStartPoint({ x: event.pageX, y: event.pageY });
            setSelectionBox({
                left: event.pageX,
                top: event.pageY,
                width: 0,
                height: 0,
            });
        }
    };

    const handleMouseMove = useCallback(
        (event: React.MouseEvent) => {
            if (isDragging && dragStartPoint && gridRef.current && viewMode !== 'tree' && allowMultipleSelection) {
                const rect = gridRef.current.getBoundingClientRect();
                const scrollTop = gridRef.current.scrollTop;
                const scrollLeft = gridRef.current.scrollLeft;

                // Calculate selection box coordinates relative to the grid
                const startX = dragStartPoint.x - rect.left + scrollLeft;
                const startY = dragStartPoint.y - rect.top + scrollTop;
                const currentX = event.pageX - rect.left + scrollLeft;
                const currentY = event.pageY - rect.top + scrollTop;

                const left = Math.min(startX, currentX);
                const top = Math.min(startY, currentY);
                const width = Math.abs(currentX - startX);
                const height = Math.abs(currentY - startY);

                setSelectionBox({
                    left: Math.min(dragStartPoint.x, event.pageX),
                    top: Math.min(dragStartPoint.y, event.pageY),
                    width: Math.abs(event.pageX - dragStartPoint.x),
                    height: Math.abs(event.pageY - dragStartPoint.y),
                });

                if (event.ctrlKey) {
                    var intersectedItems: FolderItem[] = [...selectedItems];
                } else {
                    var intersectedItems: FolderItem[] = [];
                }
                itemRefs.current.forEach(({ el, item }) => {
                    const itemRect = el.getBoundingClientRect();
                    const itemLeft = itemRect.left - rect.left + scrollLeft;
                    const itemTop = itemRect.top - rect.top + scrollTop;
                    const itemRight = itemLeft + itemRect.width;
                    const itemBottom = itemTop + itemRect.height;

                    // Check if the item intersects with the selection box
                    if (itemLeft < left + width && itemRight > left && itemTop < top + height && itemBottom > top) {
                        intersectedItems.push(item);
                    }
                });

                // Update selection
                setSelectedItems((prev) => {
                    const newSelected: FolderItem[] = [];
                    if (intersectedItems.length === 0) {
                        return newSelected;
                    }
                    intersectedItems.forEach((item) => {
                        if (item) {
                            newSelected.push(item);
                        }
                    });
                    return newSelected;
                });
            }
        },
        [isDragging, dragStartPoint, items, handleItemClick]
    );

    const handleMouseUp = () => {
        setTimeout(() => {
            setIsDragging(false);
            setDragStartPoint(null);
            setSelectionBox(null);
        }, 100);
    };

    // Filter items if showFilesOnly is enabled
    const filteredItems = showFilesOnly ? items.filter((item) => item.type === 'file') : items;

    // Context menu action handlers

    const handleSelectAll = useCallback(() => {
        const event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
        });
        handleItemClick(null, event as unknown as React.MouseEvent, 'selectAll');
    }, [filteredItems]);

    return (
        <div className={cls(styles.wrapper, className)}>
            <div className={styles.topBar}>
                <AddressBar
                    path={currentPath}
                    onPathChange={(path: string) => handlePathChange(path)}
                    validatePath={validatePath}
                    onPathNotFound={handlePathNotFound}
                />
                <div className={styles.controls}>
                    <SearchBar onSearch={(query: string) => handleSearch(query)} />
                    <div className={styles.controlsInline}>
                        {showViewModeSelector && !searchQuery && (
                            <ViewStyleSelector
                                currentMode={viewMode}
                                onChange={handleViewModeChange}
                                className={styles.mr2Important}
                            />
                        )}
                        {showFilesOnlyButton && (
                            <S_Button
                                variant="main-20"
                                color="secondary"
                                onClick={() => setShowFilesOnly(!showFilesOnly)}
                            >
                                Yalnız faylları göstər
                            </S_Button>
                        )}
                    </div>
                </div>
            </div>

            <FolderContextMenu onNewFolder={handleNewFolder} onNewFile={handleNewFile} onSelectAll={handleSelectAll}>
                <div
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onClick={handleBackgroundClick}
                    className={styles.gridArea}
                    ref={gridRef}
                >
                    <FolderGrid
                        items={filteredItems}
                        viewMode={viewMode}
                        onItemClick={handleItemClick}
                        onItemDoubleClick={handleItemDoubleClick}
                        selectedItems={selectedItems}
                        isDragging={isDragging}
                        dragStartPoint={dragStartPoint}
                        onRename={handleRename}
                        onDelete={handleDelete}
                        onCopy={handleCopy}
                        onMove={handleMove}
                        onDetails={handleDetails}
                        onCopyPath={handleCopyPath}
                        onComment={handleComment}
                        onChangeIcon={handleChangeIcon}
                        hideContextMenu={hideContextMenu}
                        itemRefs={itemRefs.current}
                        onItemsChange={onItemsChange}
                        isSearchMode={!!searchQuery}
                    />
                    {isDragging && selectionBox && selectionBox.width > 0 && selectionBox.height > 0 && (
                        <div
                            className={styles.selectionBox}
                            style={{
                                left: selectionBox.left,
                                top: selectionBox.top,
                                width: selectionBox.width,
                                height: selectionBox.height,
                            }}
                        />
                    )}
                </div>
            </FolderContextMenu>

            {itemToRename && (
                <RenameDialog
                    item={itemToRename}
                    open={renameDialogOpen}
                    onOpenChange={handleRenameOpenChange}
                    onRename={handleRenameSubmit}
                />
            )}

            <DeleteDialog
                items={selectedItems}
                open={deleteDialogOpen}
                onOpenChange={handleDeleteOpenChange}
                onDelete={handleDeleteConfirm}
            />

            {itemToComment && (
                <CommentDialog
                    open={commentDialogOpen}
                    onOpenChange={handleCommentOpenChange}
                    item={itemToComment}
                    onSubmit={handleCommentSubmit}
                />
            )}

            {itemToShowDetails && (
                <DetailsDialog
                    open={detailsDialogOpen}
                    onOpenChange={handleDetailsOpenChange}
                    item={itemToShowDetails}
                />
            )}

            {itemToChangeIcon && (
                <ChangeIconDialog
                    open={changeIconDialogOpen}
                    onOpenChange={handleChangeIconOpenChange}
                    item={itemToChangeIcon}
                    onSubmit={handleChangeIconSubmit}
                />
            )}

            {newFolderDialogOpen && (
                <NewFolderDialog
                    open={newFolderDialogOpen}
                    onOpenChange={handleNewFolderOpenChange}
                    onSubmit={handleNewFolderSubmit}
                />
            )}

            {newFileDialogOpen && (
                <NewFileDialog
                    open={newFileDialogOpen}
                    onOpenChange={handleNewFileOpenChange}
                    onSubmit={handleNewFileSubmit}
                    itemToCopy={itemsToMove[0] || null}
                />
            )}

            {moveDialogOpen && (
                <MoveDialog
                    open={moveDialogOpen}
                    onOpenChange={handleMoveOpenChange}
                    onMove={handleMoveSubmit}
                    onCopy={handleCopySubmit}
                    moveOption={moveOption}
                />
            )}

            <NotFoundDialog open={notFoundDialogOpen} onOpenChange={handleNotFoundOpenChange} path={notFoundPath} />
        </div>
    );
}
