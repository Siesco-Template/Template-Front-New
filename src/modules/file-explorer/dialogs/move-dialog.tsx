import { useCallback, useEffect, useState } from 'react';

import { S_Button } from '@/ui';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/ui/dialog';

import { Folder } from '../';
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
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/UserFolders/GetOnlyFolders?path=${currentPath}`);
        const items = await res.json();
        const itemsList = items.map((folder: any) => ({
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
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-4xl !h-[80vh] !flex !flex-col">
                <DialogHeader>
                    <DialogTitle>{moveOption === 'Move' ? 'Move to folder' : 'Copy to folder'}</DialogTitle>
                </DialogHeader>
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
                <DialogFooter>
                    <S_Button variant="outlined-20" onClick={() => onOpenChange(false)} disabled={isLoading}>
                        Cancel
                    </S_Button>
                    <S_Button onClick={handleSubmit} disabled={!currentPath} variant="main-20">
                        {moveOption === 'Move' ? 'Move here' : 'Copy here'}
                    </S_Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
