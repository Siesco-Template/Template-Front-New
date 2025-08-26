import { DetailedHTMLProps, FC, HTMLAttributes, ReactNode } from 'react';

import { TimeIcon, TimeQuarterIconn } from '@/shared/icons';
import { cls } from '@/shared/utils';

import styles from './badge.module.css';

type I_BadgeStatus = 'default' | 'success' | 'error' | 'processing' | 'warning';
type I_BadgeType = 1 | 2 | 3;

interface I_BadgeProps extends DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
    status?: I_BadgeStatus;
    text: string;
    type?: I_BadgeType;
}

const S_Badge: FC<I_BadgeProps> = ({ status = 'default', text, type = 1, className, ...props }) => {
    const statusClass = styles[`variant-${status}`];

    const renderIcon = (): ReactNode => {
        if (type === 1) {
            switch (status) {
                case 'success':
                case 'processing':
                    return (
                        <span className={styles.icon}>
                            <TimeIcon width="16" height="16" color="currentColor" />
                        </span>
                    );
                case 'default':
                case 'error':
                case 'warning':
                default:
                    return (
                        <span className={styles.icon}>
                            <TimeQuarterIconn width="16" height="16" color="currentColor" />
                        </span>
                    );
            }
        }

        if (type === 3) {
            return <span className={cls(styles.iconType3)} />;
        }

        return <span className={cls(styles.iconType2)} />;
    };

    return (
        <span
            data-type={type}
            className={cls(styles.badge, statusClass, type === 2 && styles['type-2'], className)}
            {...props}
        >
            {renderIcon()}
            {text}
        </span>
    );
};

export default S_Badge;
