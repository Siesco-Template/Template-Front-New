import { ReactNode, createContext, useContext, useState } from 'react';

import S_Button from '../button';
import Modal, { ModalSize } from './index';

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
    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}

            {isOpen && (
                <Modal
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    title={texts.title}
                    size="xs"
                    footer={
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-300)' }}>
                            <S_Button variant="outlined" onClick={handleCancel}>
                                {texts.cancelText}
                            </S_Button>
                            <S_Button variant="primary" onClick={handleConfirm}>
                                {texts.confirmText}
                            </S_Button>
                        </div>
                    }
                >
                    <p>{texts.message}</p>
                </Modal>
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
