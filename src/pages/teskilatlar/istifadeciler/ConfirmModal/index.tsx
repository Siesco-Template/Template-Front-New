import { S_Button } from '@/ui';
import Modal from '@/ui/dialog';

import styles from './style.module.css';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: () => Promise<void>;
    mode: 'edit' | 'create';
    email?: string;
    isLoading?: boolean;
}

export function ConfirmModal({ open, onOpenChange, onSubmit, mode, email, isLoading }: Props) {
    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title="Blokla"
            footer={
                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <S_Button
                        type="button"
                        variant="primary"
                        color="secondary"
                        onClick={() => onOpenChange(false)}
                        disabled={false}
                    >
                        Ləğv et
                    </S_Button>
                    <S_Button
                        type="submit"
                        variant="primary"
                        color="primary"
                        disabled={isLoading}
                        isLoading={isLoading}
                        onClick={onSubmit}
                    >
                        Təsdiqlə
                    </S_Button>
                </div>
            }
        >
            <div className={styles.body}>
                {mode === 'create' ? (
                    <div className={styles.createWarning}>
                        <p>
                            Avtomatik şifrə sistem tərəfindən yaradılacaq və istifadəçiyə{' '}
                            <span className={styles.strong}>{email}</span> elektron poçtu vasitəsilə göndəriləcək.
                        </p>
                        <p>Mövcud şifrə dərhal etibarsız olacaq. Davam etmək istədiyinizə əminsiniz?</p>
                    </div>
                ) : (
                    <p className={styles.editWarning}>
                        İstifadəçi dəyişikliklərini yadda saxlamaq istədiyinizə əminsiniz?
                    </p>
                )}
            </div>
        </Modal>
    );
}
