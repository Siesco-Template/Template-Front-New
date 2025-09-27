import { useState } from 'react';

import { S_Button } from '@/ui';
import Modal from '@/ui/dialog';

import { FolderItem } from '../types';
import styles from './style.module.css';

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

    console.log(items, 'items adi')

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title="Xəbərdarlıq"
            size="sm"
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
                    <S_Button variant="primary" color="primary" onClick={handleSubmit} disabled={isLoading}>
                        Təsdiqlə
                    </S_Button>
                </div>
            }
        >
            <p className={styles.title}>
                {isMultiple
                    ? `Siesco qovluğunu silmək istədiyinizdən əminsiniz mi? (${itemCount} element)`
                    : `${items[0]?.type === 'folder' ? 'Qovluğu' : 'Faylı'} silmək istədiyinizdən əminsiniz mi?`}
            </p>
        </Modal>
    );
}
