import { ReactNode, useState } from 'react';

import { XCloseIcon } from '@/shared/icons';
import { cls } from '@/shared/utils';

import { ErrorIcon, InfoIcon, SuccessIcon, WarningWhiteIcon } from '../toast/icons';
import styles from './style.module.css';

type BannerType = 'success' | 'info' | 'warning' | 'error';
type Direction = 'horizontal' | 'vertical';
type Device = 'web' | 'mobile';

interface S_BannerProps {
    type?: BannerType;
    title: string;
    description?: string;
    action?: ReactNode;
    closable?: boolean;
    onClose?: () => void;
    direction?: Direction;
    device?: Device;
    showIcon?: boolean;
}

const S_Banner = ({
    type = 'info',
    title,
    description,
    action,
    closable = true,
    onClose,
    direction = 'horizontal',
    device = 'web',
    showIcon = true,
}: S_BannerProps) => {
    const [visible, setVisible] = useState(true);
    if (!visible) return null;

    const defaultIcon = getDefaultIcon(type);

    const handleClose = () => {
        setVisible(false);
        onClose?.();
    };

    return (
        <div className={cls(styles.banner, styles[type], styles[device], styles[direction])}>
            <div className={styles.main}>
                <div className={styles.info}>
                    {showIcon && <span className={styles.icon}>{defaultIcon}</span>}

                    <div className={styles.content}>
                        <div className={styles.title}>{title}</div>
                        {description && <p className={styles.description}>{description}</p>}
                    </div>
                </div>

                {action && <div className={styles.action}>{action}</div>}
            </div>

            {closable && (
                <button className={styles.close} onClick={handleClose} aria-label="Close">
                    <XCloseIcon width={16} height={16} />
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
            return (
                <div className={styles.warningIcon}>
                    <WarningWhiteIcon width={20} height={20} />
                </div>
            );
        case 'info':
        default:
            return <InfoIcon width={20} height={20} />;
    }
};

export default S_Banner;
