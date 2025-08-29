import { useState } from 'react';

import { S_Button } from '@/ui';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/ui/dialog/shared';

import { FolderItem } from '../types';

interface DeleteDialogProps {
    items: FolderItem[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDelete: () => void;
}

export function DeleteDialog({ items, open, onOpenChange, onDelete }: DeleteDialogProps) {
    const itemCount = items.length;
    const isMultiple = itemCount > 1;
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        onDelete();
        onOpenChange(false);
        setIsLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-xl">
                <DialogHeader>
                    <DialogTitle className="!mb-4">Xəbərdarlıq</DialogTitle>
                    <DialogDescription className="!text-sm text-gray-700">
                        {isMultiple
                            ? `Siesco qovluğunu silmək istədiyinizdən əminsiniz mi? (${itemCount} element)`
                            : `${
                                  items[0]?.type === 'folder' ? 'Qovluğu' : 'Faylı'
                              } silmək istədiyinizdən əminsiniz mi?`}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <S_Button variant="outlined-20" onClick={() => onOpenChange(false)} disabled={isLoading}>
                        Ləğv et
                    </S_Button>
                    <S_Button variant="main-20" onClick={handleSubmit} disabled={isLoading}>
                        Ok
                    </S_Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
