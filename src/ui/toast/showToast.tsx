import { ReactNode } from 'react';

import { toast } from 'sonner';

import { XIcon } from '@/shared/icons';

import { ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from './icons';
import styles from './style.module.css';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ShowToastProps {
    label: string;
    description?: string;
    type: ToastType;
    icon?: ReactNode;
    rightIcon?: ReactNode;
    duration?: number;
}

export const showToast = ({ label, description, type = 'info', icon, rightIcon, duration = 1700 }: ShowToastProps) => {
    const fallbackIcon = getDefaultIcon(type);

    toast.custom(
        (t) => (
            <div className={`${styles.toast} ${styles[type]}`}>
                <div className={styles.content}>
                    <span className={styles.icon}>{icon ?? fallbackIcon}</span>
                    <div className={styles.text}>
                        <p className={styles.label}>{label}</p>
                        {description && <p className={styles.description}>{description}</p>}
                    </div>
                </div>

                <button className={styles.close} onClick={() => toast.dismiss(t)} aria-label="Close">
                    {rightIcon ?? <XIcon width={16} height={16} color="currentColor" />}
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
