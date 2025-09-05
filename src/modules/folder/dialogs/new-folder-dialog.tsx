import { useEffect, useState } from 'react';

import { S_Button, S_Input } from '@/ui';
import Modal from '@/ui/dialog';

import styles from './style.module.css';

const ICONS = [
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

interface NewFolderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (name: string, icon: string) => Promise<void>;
}

export function NewFolderDialog({ open, onOpenChange, onSubmit }: NewFolderDialogProps) {
    const [formData, setFormData] = useState({
        name: '',
        icon: ICONS[2],
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setFormData({
                name: '',
                icon: ICONS[2],
            });
        }
    }, [open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name.trim().includes('/')) {
            setError('Qovluq adında "/" simvolu ola bilməz');
            return;
        }
        setError('');
        setIsLoading(true);
        await onSubmit(formData.name.trim(), formData.icon);
        onOpenChange(false);
        setIsLoading(false);
    };

    return (
        <Modal
            title="Yeni qovluq"
            open={open}
            onOpenChange={onOpenChange}
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
                    <S_Button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={!formData.name.trim()}
                        variant="primary"
                        color="primary"
                    >
                        Təsdiqlə
                    </S_Button>
                </div>
            }
        >
            <form className="flex flex-col !gap-6">
                <div className="w-full">
                    <div className={styles.title}>Qovluq adı</div>
                    <S_Input
                        placeholder="Qovluq adı daxil edin"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={isLoading}
                        maxLength={100}
                        errorText={error}
                        autoFocus
                    />
                    {/* {error && <div className="!text-red-500 !text-sm !mt-2">{error}</div>} */}
                </div>
                <div>
                    <div className={styles.title}>Qovluq iconu</div>
                    <div className="flex flex-row flex-nowrap !gap-4 !items-center !justify-start">
                        {ICONS.map((c) => (
                            <button
                                type="button"
                                key={c}
                                className="focus:outline-none"
                                onClick={() => setFormData({ ...formData, icon: c })}
                                aria-label={`Select icon ${c}`}
                            >
                                <span
                                    className="!w-6 !h-6 !rounded-full !inline-block !border-4"
                                    style={{
                                        background: c,
                                        borderColor: formData.icon === c ? 'white' : 'transparent',
                                        borderWidth: formData.icon === c ? '2px' : '0px',
                                        boxShadow: formData.icon === c ? '0 0 0 2px rgba(0,0,0,0.5)' : 'none',
                                        boxSizing: 'border-box',
                                    }}
                                />
                            </button>
                        ))}
                    </div>
                </div>
            </form>
        </Modal>
    );
}
