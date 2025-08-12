import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

import { FolderItem, ViewMode } from '../types';

interface IUseDialogStateProps {
    selectedItems: FolderItem[];
    setSelectedItems: React.Dispatch<React.SetStateAction<FolderItem[]>>;
    currentPath: string;
    viewMode: ViewMode;
    onItemsChange: (path: string, isAppend?: boolean) => Promise<void>;
    items: FolderItem[];
    setItems: React.Dispatch<React.SetStateAction<FolderItem[]>>;
    searchQuery: string;
    deleteItems: (items: FolderItem[], itemsToDelete: FolderItem[]) => FolderItem[];
    updateItem: (items: FolderItem[], itemId: string, newItem: FolderItem) => FolderItem[];
    moveItems: (
        items: FolderItem[],
        movingItems: FolderItem[],
        destinationPath: string,
        action: 'Move' | 'Copy'
    ) => FolderItem[];
    searchItems: (query: string) => void;
}

function useDialogState({
    selectedItems,
    currentPath,
    viewMode,
    setSelectedItems,
    onItemsChange,
    items,
    setItems,
    searchQuery,
    deleteItems,
    updateItem,
    moveItems,
    searchItems,
}: IUseDialogStateProps) {
    const [renameDialogOpen, setRenameDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [commentDialogOpen, setCommentDialogOpen] = useState(false);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [changeIconDialogOpen, setChangeIconDialogOpen] = useState(false);
    const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
    const [newFileDialogOpen, setNewFileDialogOpen] = useState(false);
    const [moveDialogOpen, setMoveDialogOpen] = useState(false);
    const [notFoundDialogOpen, setNotFoundDialogOpen] = useState(false);

    const [itemToComment, setItemToComment] = useState<FolderItem | null>(null);
    const [itemToShowDetails, setItemToShowDetails] = useState<FolderItem | null>(null);
    const [itemToChangeIcon, setItemToChangeIcon] = useState<FolderItem | null>(null);
    const [itemsToMove, setItemsToMove] = useState<FolderItem[]>([]);
    const [itemToRename, setItemToRename] = useState<FolderItem | null>(null);
    const [newFilePath, setNewFilePath] = useState('');

    const [notFoundPath, setNotFoundPath] = useState('');
    const [moveOption, setMoveOption] = useState<'Move' | 'Copy'>('Move');

    const handlePathNotFound = (path: string) => {
        setNotFoundPath(path);
        setNotFoundDialogOpen(true);
    };

    const handleDelete = useCallback(() => {
        setDeleteDialogOpen(true);
    }, []);

    const handleDetails = useCallback((item: FolderItem) => {
        setItemToShowDetails(item);
        setDetailsDialogOpen(true);
    }, []);

    const handleRename = useCallback(() => {
        const selectedItem = selectedItems[0];
        if (selectedItem) {
            setItemToRename(selectedItem);
            setRenameDialogOpen(true);
        }
    }, [selectedItems]);

    const handleCopyPath = useCallback(
        (rightClickedItem?: FolderItem) => {
            if (rightClickedItem) {
                navigator.clipboard
                    .writeText(
                        rightClickedItem.type === 'folder'
                            ? rightClickedItem.path
                            : rightClickedItem.path + '/' + rightClickedItem.name
                    )
                    .then(() => {
                        console.log('Path copied to clipboard:', rightClickedItem.path);
                    })
                    .catch((err) => {
                        console.error('Failed to copy path:', err);
                    });
                return;
            }
        },
        [selectedItems]
    );

    const handleNewFolder = useCallback(() => {
        setNewFolderDialogOpen(true);
    }, []);

    const handleNewFile = useCallback(() => {
        setNewFileDialogOpen(true);
        setNewFilePath(currentPath);
    }, [currentPath]);

    const handleComment = useCallback((item: FolderItem) => {
        setItemToComment(item);
        setCommentDialogOpen(true);
    }, []);

    const handleChangeIcon = useCallback((item: FolderItem) => {
        setItemToChangeIcon(item);
        setChangeIconDialogOpen(true);
    }, []);

    const handleMove = useCallback(() => {
        setItemsToMove(selectedItems);
        setMoveDialogOpen(true);
        setMoveOption('Move');
    }, [selectedItems]);

    const handleCopy = useCallback(() => {
        setItemsToMove(selectedItems);
        setMoveDialogOpen(true);
        setMoveOption('Copy');
    }, [selectedItems]);

    const handleRenameOpenChange = useCallback((open: boolean) => {
        setRenameDialogOpen(open);
        if (!open) setItemToRename(null);
    }, []);

    const handleDeleteOpenChange = useCallback((open: boolean) => {
        setDeleteDialogOpen(open);
        if (!open) setSelectedItems([]);
    }, []);

    const handleCommentOpenChange = useCallback((open: boolean) => {
        setCommentDialogOpen(open);
        if (!open) setItemToComment(null);
    }, []);

    const handleDetailsOpenChange = useCallback((open: boolean) => {
        setDetailsDialogOpen(open);
        if (!open) setItemToShowDetails(null);
    }, []);

    const handleChangeIconOpenChange = useCallback((open: boolean) => {
        setChangeIconDialogOpen(open);
        if (!open) setItemToChangeIcon(null);
    }, []);

    const handleNewFolderOpenChange = useCallback((open: boolean) => {
        setNewFolderDialogOpen(open);
        if (!open) setNewFilePath('');
    }, []);

    const handleNewFileOpenChange = useCallback((open: boolean) => {
        setNewFileDialogOpen(open);
        if (!open) setNewFilePath('');
    }, []);

    const handleMoveOpenChange = useCallback((open: boolean) => {
        setMoveDialogOpen(open);
        if (!open) setItemsToMove([]);
    }, []);

    const handleNotFoundOpenChange = useCallback((open: boolean) => {
        setNotFoundDialogOpen(open);
        if (!open) setNotFoundPath('');
    }, []);

    const handleCopySubmit = useCallback(
        async (destinationPath: string) => {
            setNewFileDialogOpen(true);
            setNewFilePath(destinationPath);
        },
        [selectedItems]
    );

    const handleRenameSubmit = useCallback(
        async (newName: string) => {
            if (itemToRename) {
                try {
                    if (itemToRename.type === 'folder') {
                        var res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/UserFolders/RenameFolder`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ currentPath: itemToRename.path, newName }),
                        });
                    } else {
                        var res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/UserFiles/RenameFile`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                folderPath: itemToRename.path,
                                fileId: itemToRename.id,
                                newFileName: newName,
                            }),
                        });
                    }

                    if (!res.ok) {
                        const error = await res.json();
                        throw new Error(error.message);
                    }
                } catch (error) {
                    toast.error((error as Error).message);
                    return;
                }

                if (viewMode === 'tree') {
                    const newItems = updateItem(items, itemToRename?.id, {
                        ...itemToRename,
                        name: newName,
                        path:
                            itemToRename.type === 'folder'
                                ? itemToRename.path.split('/').slice(0, -1).join('/') + '/' + newName
                                : itemToRename.path,
                    });
                    setItems(newItems);
                    setSelectedItems((prev) =>
                        prev.map((item) => {
                            if (item.id === itemToRename.id) {
                                return {
                                    ...item,
                                    name: newName,
                                    path:
                                        item.type === 'folder'
                                            ? item.path.split('/').slice(0, -1).join('/') + '/' + newName
                                            : item.path,
                                };
                            }
                            return item;
                        })
                    );
                } else if (searchQuery) {
                    await searchItems(searchQuery);
                } else {
                    await onItemsChange?.(currentPath);
                }

                setSelectedItems([]);
            }
        },
        [itemToRename, items, onItemsChange]
    );

    const handleDeleteConfirm = useCallback(async () => {
        const foldersToDelete = selectedItems.filter((item) => item.type === 'folder');
        const filesToDelete = selectedItems.filter((item) => item.type === 'file');

        if (viewMode === 'tree' || searchQuery) {
            await fetch(`${import.meta.env.VITE_BASE_URL}/auth/UserFiles/DeleteFromMultipleSources`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    folderPathsToDelete: foldersToDelete.map((folder) => folder.path),
                    filesToDelete: filesToDelete.map((file) => {
                        return {
                            fileId: file.id,
                            folderPath: file.path,
                        };
                    }),
                }),
            });
        } else {
            await fetch(`${import.meta.env.VITE_BASE_URL}/api/UserFiles/BulkDeleteFoldersAndFiles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    folderPaths: foldersToDelete.map((folder) => folder.path),
                    fileIds: filesToDelete.map((file) => file.id),
                    folderPathForFiles: currentPath,
                }),
            });
        }

        if (viewMode === 'tree') {
            const newItems = deleteItems(items, [...foldersToDelete, ...filesToDelete]);
            setItems(newItems);
            setSelectedItems((prev) =>
                prev.filter((item) => !foldersToDelete.includes(item) && !filesToDelete.includes(item))
            );
        } else if (searchQuery) {
            searchItems(searchQuery);
        } else {
            await onItemsChange?.(currentPath);
        }

        // handleItemClick(null, new MouseEvent('click') as unknown as React.MouseEvent, 'clear');
    }, [items, selectedItems, onItemsChange]);

    const handleNewFolderSubmit = useCallback(
        async (name: string, icon: string) => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/UserFolders/CreateFolder`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, icon, parentPath: currentPath }),
                });
                var data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message);
                }
            } catch (error) {
                toast.error((error as Error).message);
                return;
            }

            if (viewMode === 'tree') {
                const newItem = {
                    id: crypto.randomUUID(),
                    name: data.name,
                    type: 'folder',
                    path: data.path,
                    icon: data.icon,
                    createDate: data.createDate,
                    children: [],
                    permissions: {
                        canView: true,
                        canEdit: true,
                        canDelete: true,
                        canMove: true,
                        canCopy: true,
                        canDownload: true,
                        canComment: true,
                        canChangeIcon: true,
                    },
                };
                setItems((prev) => [newItem as FolderItem, ...prev]);
            } else {
                await onItemsChange?.(currentPath);
            }
        },
        [items, currentPath, onItemsChange]
    );

    const handleNewFileSubmit = useCallback(
        async (formData: { name: string; surname: string; email: string }) => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/UserFiles/CreateUser`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        firstName: formData.name,
                        lastName: formData.surname,
                        email: formData.email,
                        folderPath: newFilePath,
                    }),
                });
                var data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message);
                }
            } catch (error) {
                toast.error((error as Error).message);
                return;
            }

            const newItem = {
                id: data.id,
                name: data.fileName,
                type: 'file',
                path: newFilePath,
                createDate: data.createDate,
                updateDate: new Date(),
                children: [],
                permissions: {
                    canView: true,
                    canEdit: true,
                    canDelete: true,
                    canMove: true,
                    canCopy: true,
                    canDownload: true,
                    canComment: true,
                    canChangeIcon: true,
                },
            };

            if (viewMode === 'tree') {
                if (currentPath !== newFilePath) {
                    const newItems = moveItems(items, [newItem as unknown as FolderItem], newFilePath, 'Copy');
                    setItems(newItems);
                } else {
                    setItems((prev) => [newItem as unknown as FolderItem, ...prev]);
                }
            } else if (searchQuery) {
                await searchItems(searchQuery);
            } else {
                await onItemsChange?.(currentPath);
            }
            setMoveDialogOpen(false);
        },
        [items, currentPath, onItemsChange, newFilePath]
    );

    const handleCommentSubmit = useCallback(
        async (comment: string) => {
            if (itemToComment) {
                await fetch(`${import.meta.env.VITE_BASE_URL}/auth/UserFolders/AddComment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ path: itemToComment.path, comment }),
                });
            }
        },
        [itemToComment, items, onItemsChange]
    );

    const handleChangeIconSubmit = useCallback(
        async (color: string) => {
            if (itemToChangeIcon) {
                await fetch(`${import.meta.env.VITE_BASE_URL}/auth/UserFolders/ChangeIcon`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ path: itemToChangeIcon.path, icon: color }),
                });

                if (viewMode === 'tree') {
                    const newItems = updateItem(items, itemToChangeIcon?.id, { ...itemToChangeIcon, icon: color });
                    setItems(newItems);
                    setSelectedItems((prev) =>
                        prev.map((item) => {
                            if (item.id === itemToChangeIcon.id) {
                                return { ...item, icon: color };
                            }
                            return item;
                        })
                    );
                } else if (searchQuery) {
                    await searchItems(searchQuery);
                } else {
                    await onItemsChange?.(currentPath);
                }
            }
        },
        [itemToChangeIcon, items, onItemsChange]
    );

    const handleMoveSubmit = useCallback(
        async (destinationPath: string) => {
            try {
                if (searchQuery || viewMode === 'tree') {
                    var res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/UserFiles/MoveFromMultipleSources`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            targetPath: destinationPath,
                            foldersToCopy: itemsToMove
                                .filter((item) => item.type === 'folder')
                                .map((item) => {
                                    return {
                                        sourcePath: item.path.split('/').slice(0, -1).join('/'),
                                        folderName: item.name,
                                    };
                                }),
                            filesToCopy: itemsToMove
                                .filter((item) => item.type === 'file')
                                .map((item) => {
                                    return {
                                        sourcePath: item.path,
                                        fileId: item.id,
                                    };
                                }),
                        }),
                    });
                } else {
                    var res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/UserFiles/MoveFoldersAndFiles`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            sourcePath:
                                itemsToMove[0].type === 'folder'
                                    ? itemsToMove[0].path.split('/').slice(0, -1).join('/')
                                    : itemsToMove[0].path,
                            targetPath: destinationPath,
                            fileIds: itemsToMove.filter((item) => item.type === 'file').map((item) => item.id),
                            folderNames: itemsToMove.filter((item) => item.type === 'folder').map((item) => item.name),
                        }),
                    });
                }

                if (!res.ok) {
                    const error = await res.json();
                    throw new Error(error.message);
                }
            } catch (error) {
                toast.error((error as Error).message);
            }

            if (viewMode === 'tree') {
                const newItems = moveItems(items, itemsToMove, destinationPath, 'Move');
                setItems(newItems);
            } else if (searchQuery) {
                searchItems(searchQuery);
            } else {
                await onItemsChange?.(currentPath);
            }
            setMoveDialogOpen(false);
            setItemsToMove([]);
        },
        [itemsToMove, onItemsChange]
    );

    return {
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
        handleCopySubmit,
        itemToComment,
        itemToShowDetails,
        itemToChangeIcon,
        itemsToMove,
        itemToRename,
        newFilePath,
        notFoundPath,
        moveOption,
        handleRenameSubmit,
        handleDeleteConfirm,
        handleNewFolderSubmit,
        handleNewFileSubmit,
        handleCommentSubmit,
        handleChangeIconSubmit,
        handleMoveSubmit,
    };
}

export default useDialogState;
