import { useCallback } from 'react';

import { FolderItem } from '../types';

interface FolderOperationsProps {
    items: FolderItem[];
    setItems: React.Dispatch<React.SetStateAction<FolderItem[]>>;
    currentPath: string;
}

function useFolderOperations({ items, setItems, currentPath }: FolderOperationsProps) {
    const deleteItems = useCallback((items: FolderItem[], itemsToDelete: FolderItem[]): FolderItem[] => {
        return items
            .filter((item) => !itemsToDelete.includes(item))
            .map((item) => ({
                ...item,
                children: item.children ? deleteItems(item.children, itemsToDelete) : item.children,
            }));
    }, []);

    const updateItem = useCallback(
        (items: FolderItem[], itemId: string, newItem: FolderItem): FolderItem[] => {
            return items.map((i) => {
                if (i.id === itemId) {
                    return newItem;
                }

                if (i.children) {
                    return { ...i, children: updateItem(i.children, itemId, newItem) };
                }
                return i;
            });
        },
        [items]
    );

    const moveItems = useCallback(
        (
            items: FolderItem[],
            movingItems: FolderItem[],
            destinationPath: string,
            action: 'Move' | 'Copy'
        ): FolderItem[] => {
            // recursively remove moved items
            const prune = (nodes: FolderItem[]): FolderItem[] =>
                nodes
                    .filter((n) => !movingItems.includes(n))
                    .map((n) => ({
                        ...n,
                        children: n.children ? prune(n.children) : [],
                    }));

            // rebase a node (clone + update path)
            const rebase = (node: FolderItem, parentPath: string): FolderItem => {
                const newPath = node.type === 'folder' ? `${parentPath}/${node.name}` : parentPath;
                return {
                    ...node,
                    path: newPath,
                    children: node.children?.map((child) => rebase(child, newPath)),
                };
            };

            // prepare items to insert (always clones with new paths)
            const inserts = movingItems.map((item) => rebase(item, destinationPath));

            // if moving, prune originals
            const baseTree = action === 'Move' ? prune(items) : items;

            // special case: inserting into root
            if (destinationPath === currentPath) {
                return [...baseTree, ...inserts];
            }

            // otherwise, insert under the matching folder
            const insertAt = (nodes: FolderItem[]): FolderItem[] =>
                nodes.map((n) => {
                    if (n.path === destinationPath) {
                        return {
                            ...n,
                            children: [...(n.children ?? []), ...inserts],
                        };
                    }
                    return {
                        ...n,
                        children: n.children ? insertAt(n.children) : [],
                    };
                });

            return insertAt(baseTree);
        },
        []
    );

    const searchItems = async (query: string) => {
        const items = await fetch(
            `${import.meta.env.VITE_BASE_URL}/template/UserFolders/SearchInFolder?path=${currentPath}&keyword=${query}`
        );
        const data = await items.json();
        const itemsList = [
            ...data.folders.map((folder: any) => ({
                id: crypto.randomUUID(),
                name: folder.name,
                type: 'folder',
                path: folder.path,
                icon: folder.icon,
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
                children: [],
                createDate: folder.createDate,
            })),
            ...data.files.map((file: any) => ({
                id: file.id,
                name: file.fileName,
                type: 'file',
                path: file.folderPath,
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
                createDate: file.createDate,
            })),
        ];
        setItems(itemsList);
    };

    return { deleteItems, updateItem, moveItems, searchItems };
}

export default useFolderOperations;
