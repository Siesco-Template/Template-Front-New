import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './shared';
import styles from './style.module.css';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    maxWidth?: string;
    fullWidth?: boolean;

    closeOnOutsideClick?: boolean;
    closeOnEsc?: boolean;
    onClickOutside?: (event: Event) => void;
}

function S_SidePanel({
    open,
    onOpenChange,
    title,
    children,
    footer,
    maxWidth,
    fullWidth = false,
    closeOnOutsideClick = true,
    closeOnEsc = true,
    onClickOutside,
}: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={styles.mainContent}
                style={{ width: fullWidth ? 'calc(100vw - 80px)' : maxWidth || '480px' }}
                closeOnOutsideClick={closeOnOutsideClick}
                closeOnEsc={closeOnEsc}
                onClickOutside={onClickOutside}
            >
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className={styles.modalBody}>{children}</div>
                {footer && <DialogFooter className={styles.modalFooter}>{footer}</DialogFooter>}
            </DialogContent>
        </Dialog>
    );
}

export default S_SidePanel;
