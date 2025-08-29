import { useEffect, useState } from 'react';

import { S_Input } from '@/ui';
import S_Button from '@/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/ui/dialog/shared';

import { FolderItem } from '../types';

interface RenameDialogProps {
    item: FolderItem;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onRename: (newName: string) => void;
}

export function RenameDialog({ item, open, onOpenChange, onRename }: RenameDialogProps) {
    const [newName, setNewName] = useState(item.name);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setNewName(item.name);
    }, [item]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        onRename(newName.trim());
        onOpenChange(false);
        setIsLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-xl">
                <DialogHeader>
                    <DialogTitle>Adını dəyiş</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="!space-y-4">
                    <div className="">
                        <label htmlFor="name" className="!text-sm !font-medium block !text-blue-900 !mb-1">
                            {item.type === 'folder' ? 'Qovluq adı' : 'Fayl adı'}
                        </label>
                        <S_Input
                            id="name"
                            value={newName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewName(e.target.value)}
                            placeholder={item.type === 'folder' ? 'Qovluq adı daxil edin' : 'Fayl adı daxil edin'}
                            autoFocus
                        />
                    </div>
                    <DialogFooter>
                        <S_Button
                            type="button"
                            variant="outlined-20"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                        >
                            Ləğv et
                        </S_Button>
                        <S_Button type="submit" disabled={!newName.trim() || newName === item.name} variant="main-20">
                            Ok
                        </S_Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
