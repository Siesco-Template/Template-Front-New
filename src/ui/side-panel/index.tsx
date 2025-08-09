import { Dialog, DialogContent, DialogHeader, DialogTitle } from './side-panel-dialog';
import styles from './style.module.css';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    children: React.ReactNode;
}

function S_SidePanel({ open, onOpenChange, title, children }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={styles.mainContent}>
                <DialogHeader>
                    <DialogTitle className={styles.header}>{title}</DialogTitle>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    );
}

export default S_SidePanel;
