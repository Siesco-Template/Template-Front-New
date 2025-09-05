import { useEffect, useState } from 'react';

import { S_Input } from '@/ui';
import S_Button from '@/ui/button';
import Modal from '@/ui/dialog';

import { folderService } from '../services/folder.service';
import { FolderItem } from '../types';

interface NewFileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (formData: { name: string; surname: string; email: string }) => Promise<void>;
    itemToCopy: FolderItem;
}

export function NewFileDialog({ open, onOpenChange, onSubmit, itemToCopy }: NewFileDialogProps) {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await folderService.getUserDetail(itemToCopy.id || '');
                if (!data) {
                    return;
                }
                setFormData({
                    name: data.firstName,
                    surname: data.lastName,
                    email: data.email,
                });
            } catch (error) {
                // @ts-expect-error
                toast.error(error?.data?.message || 'Xəta baş verdi, yenidən cəhd edin');
            }
        };

        if (itemToCopy) {
            fetchData();
        }
    }, [open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await onSubmit(formData);
        onOpenChange(false);
        setIsLoading(false);
    };

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            size="sm"
            title="Yeni istifadəçi"
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
                        variant="primary"
                        color="primary"
                        type="submit"
                        onSubmit={handleSubmit}
                        disabled={!formData?.name?.trim() || !formData?.surname?.trim() || !formData?.email?.trim()}
                    >
                        Təsdiqlə
                    </S_Button>
                </div>
            }
        >
            <form className="!flex !flex-col gap-4">
                <div>
                    <S_Input
                        placeholder="Ad daxil edin"
                        value={formData?.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={isLoading}
                        maxLength={100}
                        label="Ad"
                        autoFocus
                    />
                </div>
                <div>
                    <S_Input
                        placeholder="Soyad daxil edin"
                        value={formData?.surname}
                        onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                        disabled={isLoading}
                        label="Soyad"
                        maxLength={100}
                        autoFocus
                    />
                </div>
                <div>
                    <S_Input
                        placeholder="Email daxil edin"
                        value={formData?.email}
                        label="Email"
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={isLoading}
                        maxLength={100}
                        autoFocus
                    />
                </div>
            </form>
        </Modal>
    );
}
