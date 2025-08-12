import { useEffect, useState } from 'react';

import { S_Button, S_Textarea } from '@/ui';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/ui/dialog';

import { FolderItem } from '../types';

interface CommentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item?: FolderItem;
    onSubmit: (comment: string) => void;
    loading?: boolean;
}

export function CommentDialog({ open, onOpenChange, item, onSubmit, loading }: CommentDialogProps) {
    const [value, setValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchItem = async () => {
            const res = await fetch(
                `${import.meta.env.VITE_BASE_URL}/auth/UserFolders/GetFolderDetail?path=${item?.path}`
            );
            const data = await res.json();
            setValue(data?.comment || '');
        };
        fetchItem();
    }, [item, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        onSubmit(value);
        onOpenChange(false);
        setIsLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-xl">
                <DialogHeader>
                    <DialogTitle className="!text-2xl !font-extrabold">Komment əlavə et</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="!space-y-4">
                    <S_Textarea
                        id="comment"
                        className=" !text-black "
                        placeholder="Komment əlavə et"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        disabled={loading}
                        maxLength={1000}
                    />
                    <DialogFooter>
                        <S_Button
                            type="button"
                            variant="outlined-20"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Ləğv et
                        </S_Button>
                        <S_Button type="submit" disabled={loading || !value.trim()} variant="main-20">
                            Ok
                        </S_Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
