import { S_Button } from '@/ui';
import Modal from '@/ui/dialog';
import styles from './style.module.css';
interface NotFoundDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    path: string;
}

export function NotFoundDialog({ open, onOpenChange, path }: NotFoundDialogProps) {
    return (
        <Modal
            title="Məlumat tapılmadı"
            open={open}
            size="sm"
            onOpenChange={onOpenChange}
            footer={
                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <S_Button variant="primary" color="secondary" onClick={() => onOpenChange(false)}>
                        Ləğv et
                    </S_Button>
                    <S_Button variant="primary" color="primary" onClick={() => onOpenChange(false)}>
                        Ok
                    </S_Button>
                </div>
            }
        >
            <div className="!mb-4 !text-gray-500">
                <span className={styles.not_found_title}>{path}</span> ünvanı tapılmadı. Zəhmət olmasa daxil etdiyiniz
                ünvanı yenidən yoxlayın
            </div>
        </Modal>
    );
}
