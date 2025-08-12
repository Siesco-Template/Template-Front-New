import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import { Folder } from '@/modules/file-explorer';
import { FolderItem, ViewMode } from '@/modules/file-explorer/types';

function FolderPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [items, setItems] = useState<FolderItem[]>([]);
    const [currentPath, setCurrentPath] = useState(searchParams.get('path') || '/Users');
    const [viewMode, setViewMode] = useState<ViewMode>('medium');

    const fetchItems = useCallback(
        async (path: string) => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_BASE_URL}/auth/UserFolders/GetFoldersAndFiles?path=${path}`
                );
                const data = await res.json();
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
                        path: path,
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
                return itemsList;
            } catch (error) {
                console.error('Failed to fetch items:', error);
                return [];
            }
        },
        [currentPath]
    );

    const updateItemChildren = useCallback(
        (items: FolderItem[], targetPath: string, isAppend: boolean, newChildren?: FolderItem[]): FolderItem[] => {
            return items.map((item) => {
                if (item.path === targetPath) {
                    if (!isAppend) {
                        return {
                            ...item,
                            children: [...(item.children || [])],
                            isExpanded: !item.isExpanded,
                        };
                    }
                    return {
                        ...item,
                        children: newChildren,
                        isExpanded: true,
                    };
                } else if (item.children && item.children.length > 0) {
                    return {
                        ...item,
                        children: updateItemChildren(item.children, targetPath, isAppend, newChildren),
                    };
                }
                return item;
            });
        },
        []
    );

    const handleItemsChange = useCallback(
        async (path: string, isAppend: boolean = false) => {
            if (viewMode === 'tree' && path !== currentPath) {
                if (!isAppend) {
                    setItems((prevItems) => {
                        const updatedItems = updateItemChildren(prevItems, path, isAppend);
                        return updatedItems;
                    });

                    return;
                }
                const newItems = await fetchItems(path);

                setItems((prevItems) => {
                    const updatedItems = updateItemChildren(prevItems, path, isAppend, newItems);
                    return updatedItems;
                });
            } else {
                const newItems = await fetchItems(path);
                setItems(newItems);
            }
        },
        [fetchItems, updateItemChildren, viewMode]
    );

    useEffect(() => {
        if (currentPath !== searchParams.get('path')) {
            const params = new URLSearchParams(window.location.search);
            params.set('path', currentPath);
            navigate(`?${params.toString()}`);
        }
        handleItemsChange(currentPath);
    }, [currentPath]);

    useEffect(() => {
        if (searchParams.get('path') !== currentPath) {
            setCurrentPath(searchParams.get('path') || '/Users');
        }
    }, [searchParams]);

    return (
        <Folder
            items={items}
            setItems={setItems}
            currentPath={currentPath}
            setCurrentPath={setCurrentPath}
            onItemsChange={handleItemsChange}
            className="bg-white h-full flex flex-col !p-4 !rounded-4"
            viewMode={viewMode}
            onViewModeChange={setViewMode}
        />
    );
}

export default FolderPage;
