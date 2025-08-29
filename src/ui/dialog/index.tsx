import { ReactNode } from 'react';

import { cls } from '@/shared/utils';

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './shared';
import styles from './style.module.css';

export type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children?: ReactNode;
    title?: ReactNode;
    size?: ModalSize;
    footer?: ReactNode;
}

function Modal({ open, onOpenChange, children, title, size = 'md', footer }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={cls(styles.modalContent, styles[size])}>
                <DialogHeader className={cls(styles.modalHeader, styles[size])}>
                    <DialogTitle className={cls(styles.modalTitle, styles[size])}>{title}</DialogTitle>
                </DialogHeader>
                <div className={styles.modalBody}>{children}</div>
                <DialogFooter className={cls(styles.modalFooter, styles[size])}>{footer}</DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default Modal;
