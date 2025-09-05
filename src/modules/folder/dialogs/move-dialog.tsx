import { useCallback, useEffect, useState } from 'react';

import { S_Button } from '@/ui';
import Modal from '@/ui/dialog';

import { Folder } from '..';
import { folderService } from '../services/folder.service';
import { FolderItem, ViewMode } from '../types';

interface MoveDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onMove: (destinationPath: string) => Promise<void>;
    onCopy: (destinationPath: string) => Promise<void>;
    moveOption: 'Move' | 'Copy';
}

export function MoveDialog({ open, onOpenChange, onMove, onCopy, moveOption }: MoveDialogProps) {
    const [currentPath, setCurrentPath] = useState('/Users');
    const [items, setItems] = useState<FolderItem[]>([]);
    const [viewMode, setViewMode] = useState<ViewMode>('medium');
    const [isLoading, setIsLoading] = useState(false);
    const fetchItems = useCallback(async () => {
        const items = await folderService.getOnlyFolders(currentPath);
        if (!items) {
            return [];
        }
        const itemsList = items.map((folder: any) => ({
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
            createDate: folder.createDate,
        }));

        setItems(itemsList);
    }, [currentPath]);

    useEffect(() => {
        fetchItems();
    }, [currentPath]);

    const handleSubmit = () => {
        setIsLoading(true);
        if (moveOption === 'Move') {
            onMove(currentPath);
        } else {
            onCopy(currentPath);
        }
        setIsLoading(false);
    };

    return (
        <Modal
            title={moveOption === 'Move' ? 'Qovluğa köçür' : 'Qovluğu kopyala'}
            open={open}  size="sm"
            onOpenChange={onOpenChange}
            footer={
                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <S_Button
                        variant="primary"
                        color="secondary"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        Ləğv et
                    </S_Button>
                    <S_Button onClick={handleSubmit} disabled={!currentPath} variant="primary" color="primary">
                        {moveOption === 'Move' ? 'Köçür' : 'Kopyala'}
                    </S_Button>
                </div>
            }
        >
            <div className="!flex-1 !overflow-hidden">
                <Folder
                    items={items}
                    setItems={setItems}
                    currentPath={currentPath}
                    setCurrentPath={setCurrentPath}
                    className="h-full"
                    hideContextMenu={true}
                    allowMultipleSelection={false}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    showFilesOnlyButton={false}
                    showViewModeSelector={false}
                />
            </div>
        </Modal>
    );
}
