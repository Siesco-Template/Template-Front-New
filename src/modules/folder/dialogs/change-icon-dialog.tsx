import { useEffect, useState } from 'react';

import S_Button from '@/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/ui/dialog/shared';

import { FolderItem } from '../types';

const COLORS = [
    '#EF4444', // red
    '#F97316', // orange
    '#FACC15', // yellow
    '#4ADE80', // green
    '#2DD4BF', // teal
    '#F43F5E', // pinkish red
    '#0EA5E9', // light blue
    '#8B5CF6', // violet
    '#3B82F6', // blue
    '#84CC16', // lime
    '#6366F1', // indigo
    '#EC4899', // pink
    '#D946EF', // magenta
];

interface ChangeIconDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item?: FolderItem;
    onSubmit: (color: string) => void;
}

export function ChangeIconDialog({ open, onOpenChange, item, onSubmit }: ChangeIconDialogProps) {
    const [selected, setSelected] = useState(item?.icon || COLORS[2]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setSelected(item?.icon || COLORS[2]);
    }, [item, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        onSubmit(selected);
        onOpenChange(false);
        setIsLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-xl">
                <DialogHeader>
                    <DialogTitle className="!text-2xl !font-extrabold !mb-4">İkonu dəyiş</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col !gap-6">
                    <div className="!text-lg !font-semibold !text-blue-900 !mb-2">Qovluq rəngi</div>
                    <div className="flex flex-row flex-nowrap !gap-4 !items-center !justify-start">
                        {COLORS.map((c) => (
                            <button
                                type="button"
                                key={c}
                                className="focus:outline-none"
                                onClick={() => setSelected(c)}
                                aria-label={`Select color ${c}`}
                            >
                                <span
                                    className="w-6 h-6 rounded-full inline-block border-4"
                                    style={{
                                        background: c,
                                        borderColor: selected === c ? 'white' : 'transparent',
                                        borderWidth: selected === c ? '2px' : '0px',
                                        boxShadow: selected === c ? '0 0 0 2px rgba(0,0,0,0.5)' : 'none',
                                        boxSizing: 'border-box',
                                    }}
                                />
                            </button>
                        ))}
                    </div>
                    <DialogFooter className="">
                        <S_Button
                            type="button"
                            variant="outlined-20"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                        >
                            Ləğv et
                        </S_Button>
                        <S_Button type="submit" disabled={!selected} variant="main-20">
                            Ok
                        </S_Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
