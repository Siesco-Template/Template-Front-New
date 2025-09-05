import { useEffect, useState } from 'react';

import S_Button from '@/ui/button';
import Modal from '@/ui/dialog';

import { FolderItem } from '../types';
import styles from './style.module.css'
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
        <Modal
            title="İkonu dəyiş"
            open={open}
            onOpenChange={onOpenChange}
            size="sm"
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
                    <S_Button onClick={handleSubmit} disabled={!selected} variant="primary" color="primary">
                        Təsdiqlə
                    </S_Button>
                </div>
            }
        >
            <form className="flex flex-col !gap-6">
                <h1 className={styles.title}>Qovluq rəngi</h1>
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
            </form>
        </Modal>
    );
}
