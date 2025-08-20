import { FC, ReactNode } from 'react';

import { Dialog, DialogRootProps } from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';

import { CloseIcon } from '@/shared/icons';
import { cls } from '@/shared/utils';

import styles from './modal.module.css';

export type ModalSize = 'large' | 'small' | 'medium' | 'extraLarge';

export interface ModalProps extends DialogRootProps {
    title?: ReactNode;
    size?: ModalSize;
    className?: string;
    children?: ReactNode;
    open: boolean;
    id?: any;
}

const Modal: FC<ModalProps> = ({ title, size = 'large', className, children, open = false, id, ...props }) => {
    const modalClasses = cls(styles.dialogPositioner, styles[`${size}Size`], className);

    return (
        <Dialog.Root open={Boolean(id) || open} {...props} onOpenChange={props.onOpenChange}>
            <Portal>
                <Dialog.Backdrop className={styles.dialogBackdrop} />
                <Dialog.Positioner className={modalClasses}>
                    <Dialog.Content className={styles.dialogContent}>
                        {title && (
                            <Dialog.Title className={styles.dialogTitle}>
                                <div className={styles.title_icon}>{title}</div>

                                <Dialog.CloseTrigger className={styles.closeButton}>
                                    <CloseIcon />
                                </Dialog.CloseTrigger>
                            </Dialog.Title>
                        )}
                        {children}
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default Modal;
