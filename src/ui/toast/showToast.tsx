import { toast } from 'sonner';

import { XCloseIcon } from '@/shared/icons';
import { cls } from '@/shared/utils';

import { ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from './icons';
import styles from './style.module.css';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ShowToastProps {
    label: string;
    type: ToastType;
    showClose?: boolean;
    duration?: number;
}

export const showToast = ({ label, type = 'info', showClose = true, duration = 1700 }: ShowToastProps) => {
    const defaultIcon = getDefaultIcon(type);

    toast.custom(
        (t) => (
            <div className={cls(styles.toast, styles[type])}>
                <div className={styles.content}>
                    <span className={styles.icon}>{defaultIcon}</span>
                    <p className={styles.label}>{label}</p>
                </div>

                <button className={styles.close} onClick={() => toast.dismiss(t)} aria-label="Close">
                    {showClose && <XCloseIcon width={24} height={24} color="currentColor" />}
                </button>
            </div>
        ),
        { duration }
    );
};

const getDefaultIcon = (type: ToastType) => {
    switch (type) {
        case 'success':
            return <SuccessIcon width={20} height={20} />;
        case 'error':
            return <ErrorIcon width={20} height={20} />;
        case 'warning':
            return <WarningIcon width={20} height={20} />;
        case 'info':
        default:
            return <InfoIcon width={20} height={20} />;
    }
};
