import { useEffect, useState } from 'react';

import { S_Input } from '@/ui';
import S_Button from '@/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/ui/dialog';

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
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="!text-2xl !font-extrabold !mb-4">Yeni istifadəçi</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="!flex !flex-col gap-4">
                    <div>
                        <div className="text-lg !font-semibold !text-blue-900 mb-2">Ad</div>
                        <S_Input
                            placeholder="Ad daxil edin"
                            value={formData?.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            disabled={isLoading}
                            maxLength={100}
                            autoFocus
                        />
                    </div>
                    <div>
                        <div className="text-lg !font-semibold !text-blue-900 mb-2">Soyad</div>
                        <S_Input
                            placeholder="Soyad daxil edin"
                            value={formData?.surname}
                            onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                            disabled={isLoading}
                            maxLength={100}
                            autoFocus
                        />
                    </div>
                    <div>
                        <div className="text-lg !font-semibold !text-blue-900 mb-2">Email</div>
                        <S_Input
                            placeholder="Email daxil edin"
                            value={formData?.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            disabled={isLoading}
                            maxLength={100}
                            autoFocus
                        />
                    </div>

                    <DialogFooter className="!mt-4">
                        <S_Button
                            type="button"
                            variant="outlined-20"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                        >
                            Ləğv et
                        </S_Button>
                        <S_Button
                            variant="main-20"
                            type="submit"
                            disabled={!formData?.name?.trim() || !formData?.surname?.trim() || !formData?.email?.trim()}
                        >
                            Ok
                        </S_Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
