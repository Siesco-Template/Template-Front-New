import { ReactNode, useState } from 'react';

import { XIcon } from '@/shared/icons';

import { ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from '../toast/icons';
import styles from './style.module.css';

type BannerType = 'success' | 'info' | 'warning' | 'error';
type Direction = 'horizontal' | 'vertical';
type Device = 'web' | 'mobile';

interface S_BannerProps {
    type?: BannerType;
    title: string;
    description?: string;
    icon?: ReactNode;
    action?: ReactNode;
    closable?: boolean;
    onClose?: () => void;
    direction?: Direction;
    device?: Device;
}

const S_Banner = ({
    type = 'info',
    title,
    description,
    icon,
    action,
    closable = true,
    onClose,
    direction = 'horizontal',
    device = 'web',
}: S_BannerProps) => {
    const [visible, setVisible] = useState(true);
    if (!visible) return null;

    const defaultIcon = getDefaultIcon(type);

    const handleClose = () => {
        setVisible(false);
        onClose?.();
    };

    return (
        <div className={`${styles.banner} ${styles[type]} ${styles[device]}`}>
            <div className={styles.left}>
                <span className={styles.icon}>{icon ?? defaultIcon}</span>
            </div>

            <div className={styles.content}>
                <div className={styles.title}>{title}</div>
                {description && <div className={styles.description}>{description}</div>}
            </div>

            {action && <div className={`${styles.action} ${styles[direction]}`}>{action}</div>}

            {closable && (
                <button className={styles.close} onClick={handleClose} aria-label="Close">
                    <XIcon width={16} height={16} color="var(--content-secondary, #333)" />
                </button>
            )}
        </div>
    );
};

const getDefaultIcon = (type: BannerType) => {
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

export default S_Banner;
