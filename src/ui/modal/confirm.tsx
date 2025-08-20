import { ReactNode, createContext, useContext, useState } from 'react';
import { createPortal } from 'react-dom';

import { Dialog } from '@ark-ui/react/dialog';

import { CloseIcon } from '@/shared/icons';
import { cls } from '@/shared/utils';

import S_Button from '../button';
import { ModalSize } from './index';
import styles from './modal.module.css';

interface ConfirmOptions {
    message: string;
    confirmText: string;
    cancelText: string;
    title: string;
    size: ModalSize;
}

interface ConfirmContextType {
    confirm: (options: Partial<ConfirmOptions>) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | null>(null);
const initialConfirmTexts = {
    message: '',
    title: '',
    confirmText: 'Ok',
    cancelText: 'Cancel',
    size: 'default',
};
export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [texts, setTexts] = useState(initialConfirmTexts);
    const [resolveCallback, setResolveCallback] = useState<(result: boolean) => void>(() => {});

    const confirm = ({ message, title, cancelText, confirmText, size }: Partial<ConfirmOptions>): Promise<boolean> => {
        return new Promise((resolve) => {
            setTexts({
                message: message || initialConfirmTexts.message,
                title: title || initialConfirmTexts.title,
                cancelText: cancelText || initialConfirmTexts.cancelText,
                confirmText: confirmText || initialConfirmTexts.confirmText,
                size: size || initialConfirmTexts.size,
            });
            setResolveCallback(() => resolve);
            setIsOpen(true);
        });
    };

    const handleConfirm = () => {
        resolveCallback(true);
        setIsOpen(false);
    };

    const handleCancel = () => {
        resolveCallback(false);
        setIsOpen(false);
    };
    const modalClasses = cls(styles.confirmPositioner, styles[`${texts.size}Size`]);
    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}
            {isOpen && (
                <Dialog.Root open={isOpen}>
                    {createPortal(
                        <>
                            <Dialog.Backdrop className={styles.confirmBackdrop} />
                            <Dialog.Positioner className={modalClasses}>
                                <Dialog.Content className={styles.dialogContent}>
                                    {texts.title && (
                                        <Dialog.Title className={styles.confirmTitle}>
                                            {texts.title}
                                            <Dialog.CloseTrigger className={styles.closeButton} onClick={handleCancel}>
                                                <CloseIcon />
                                            </Dialog.CloseTrigger>
                                        </Dialog.Title>
                                    )}
                                    <p>{texts.message}</p>
                                    <div className={styles.confirmButtons}>
                                        <S_Button variant="outlined-10" onClick={handleCancel}>
                                            {texts.cancelText}
                                        </S_Button>
                                        <S_Button variant="main-10" onClick={handleConfirm}>
                                            {texts.confirmText}
                                        </S_Button>
                                    </div>
                                </Dialog.Content>
                            </Dialog.Positioner>
                        </>,
                        document.body
                    )}
                </Dialog.Root>
            )}
        </ConfirmContext.Provider>
    );
};

export const useConfirm = () => {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error('useConfirm must be used within a ConfirmProvider');
    }
    return context.confirm;
};
