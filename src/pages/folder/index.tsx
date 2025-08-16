import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import { Folder } from '@/modules/folder';
import { folderService } from '@/modules/folder/services/folder.service';
import { FolderItem, ViewMode } from '@/modules/folder/types';

import { useTableConfig } from '@/shared/table/tableConfigContext';

import styles from './style.module.css';

function FolderPage() {
    const { loadConfigFromApi } = useTableConfig();
    useEffect(() => {
        loadConfigFromApi();
    }, []);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [items, setItems] = useState<FolderItem[]>([]);
    const [currentPath, setCurrentPath] = useState(searchParams.get('path') || '/Users');
    const [viewMode, setViewMode] = useState<ViewMode>('medium');

    const fetchItems = useCallback(
        async (path: string) => {
            try {
                const data = await folderService.getFoldersAndFiles(path);
                if (!data) {
                    return [];
                }

                const itemsList = [
                    ...data.folders.map((folder: any) => ({
                        id: crypto.randomUUID(),
                        name: folder.name,
                        type: 'folder' as FolderItem['type'],
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
                        type: 'file' as FolderItem['type'],
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
                // @ts-expect-error
                toast.error(error?.data?.message || 'Xəta baş verdi, yenidən cəhd edin');
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
            className={styles.folder}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
        />
    );
}

export default FolderPage;
