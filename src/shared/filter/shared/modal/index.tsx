import React, { useState } from 'react';

import { S_Button, S_Input } from '@/ui';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/ui/dialog';

import styles from './style.module.css';

interface BaseProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isLoading?: boolean;
}

interface SaveModeProps extends BaseProps {
    // Filter save mode
    onSave: (name: string) => Promise<void>;
    onSaveAndUse: (name: string) => Promise<void>;
    email?: string;
    mode?: 'create' | 'edit';
}

interface ConfirmModeProps extends BaseProps {
    // Simple confirm mode
    description: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

type Props = SaveModeProps | ConfirmModeProps;

function ConfirmModal(props: Props) {
    const { open, onOpenChange, isLoading = false } = props;
    const isSaveMode = 'onSave' in props;
    const [filterName, setFilterName] = useState('');

    // Handlers for save mode
    const handleSave = async () => {
        if (!filterName.trim()) return;
        await (props as SaveModeProps).onSave(filterName.trim());
        setFilterName('');
        onOpenChange(false);
    };

    const handleSaveAndUse = async () => {
        if (!filterName.trim()) return;
        await (props as SaveModeProps).onSaveAndUse(filterName.trim());
        setFilterName('');
        onOpenChange(false);
    };

    // Handlers for confirm mode
    const handleConfirm = () => {
        (props as ConfirmModeProps).onConfirm();
        onOpenChange(false);
    };

    const handleCancel = () => {
        (props as ConfirmModeProps).onCancel();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={styles.modalContent}>
                <DialogHeader>
                    <DialogTitle>{isSaveMode ? 'Filteri yadda saxla' : 'Təsdiqlə'}</DialogTitle>
                </DialogHeader>

                <div className={styles.body}>
                    {isSaveMode ? (
                        <>
                            {(props as SaveModeProps).mode === 'create' && (props as SaveModeProps).email && (
                                <div className={styles.createWarning}>
                                    <p>Filtri yadda saxlamaq üçün ad daxil edin.</p>
                                </div>
                            )}
                            <S_Input
                                label="Ad"
                                placeholder="Ad daxil edin"
                                value={filterName}
                                onChange={(e) => setFilterName(e.target.value)}
                                errorText={!filterName.trim() && !isLoading ? 'Ad boş ola bilməz' : ''}
                                inputSize="medium"
                            />
                        </>
                    ) : (
                        <p>{(props as ConfirmModeProps).description}</p>
                    )}
                </div>

                <DialogFooter>
                    {isSaveMode ? (
                        <>
                            <div className={styles.footerButtons}>
                                <S_Button
                                    type="button"
                                    variant="outlined-10"
                                    onClick={handleSaveAndUse}
                                    disabled={isLoading || !filterName.trim()}
                                >
                                    Yadda saxla və istifadə et
                                </S_Button>
                                <S_Button
                                    type="button"
                                    variant="main-10"
                                    onClick={handleSave}
                                    disabled={isLoading || !filterName.trim()}
                                >
                                    Yadda saxla
                                </S_Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <S_Button type="button" variant="outlined-10" onClick={handleCancel} disabled={isLoading}>
                                {(props as ConfirmModeProps).cancelText || 'Ləğv et'}
                            </S_Button>
                            <S_Button type="button" variant="main-10" onClick={handleConfirm} disabled={isLoading}>
                                {(props as ConfirmModeProps).confirmText || 'Təsdiqlə'}
                            </S_Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default ConfirmModal;
