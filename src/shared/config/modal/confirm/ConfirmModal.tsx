import { S_Button } from '@/ui';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/ui/dialog/shared';

import styles from './Modal.module.css';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: () => Promise<void>;
    mode?: 'edit' | 'create';
    email?: string;
    isLoading?: boolean;
}

export function ConfirmModal({ open, onOpenChange, onSubmit, mode, email, isLoading }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={styles.modalContent}>
                <DialogHeader>
                    <DialogTitle>Xəbərdarlıq</DialogTitle>
                </DialogHeader>
                <div className={styles.body}>
                    {mode === 'create' ? (
                        <div className={styles.createWarning}>
                            <p>
                                Avtomatik şifrə sistem tərəfindən yaradılacaq və istifadəçiyə{' '}
                                <span className={styles.strong}>{email}</span> elektron poçtu vasitəsilə göndəriləcək.
                            </p>
                        </div>
                    ) : (
                        <p className={styles.editWarning}>Konfiqurasiyanı sıfırlamaq istədiyinizdən əminsiniz mi?</p>
                    )}

                    <DialogFooter>
                        <S_Button
                            type="button"
                            variant="outlined-10"
                            onClick={() => onOpenChange(false)}
                            disabled={false}
                        >
                            Ləğv et
                        </S_Button>
                        <S_Button
                            type="submit"
                            variant="main-10"
                            disabled={isLoading}
                            isLaoding={isLoading}
                            onClick={onSubmit}
                        >
                            Təsdiqlə
                        </S_Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
