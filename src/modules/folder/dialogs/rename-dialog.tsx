import { useEffect, useState } from 'react';

import { S_Input } from '@/ui';
import S_Button from '@/ui/button';
import Modal from '@/ui/dialog';

import { FolderItem } from '../types';
import styles from './style.module.css'
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
        <Modal
            title="Adını dəyiş"
            open={open}
            size="sm"
            onOpenChange={onOpenChange}
            footer={
                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <S_Button
                        type="button"
                        variant="primary"
                        color="secondary"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        Ləğv et
                    </S_Button>
                    <S_Button
                        type="submit"
                        disabled={!newName.trim() || newName === item.name}
                        variant="primary"
                        color="primary"
                    >
                        Ok
                    </S_Button>
                </div>
            }
        >
            <form onSubmit={handleSubmit} className="!space-y-4">
                <div className="">
                    <label htmlFor="name" className={styles.title}>
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
            </form>
        </Modal>
    );
}
