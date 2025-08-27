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
    showIcon?: boolean;
    icon?: ReactNode;
}

const S_Badge: FC<I_BadgeProps> = ({
    status = 'default',
    text,
    type = 1,
    showIcon = true,
    icon,
    className,
    ...props
}) => {
    const statusClass = styles[`variant-${status}`];

    const renderIcon = (): ReactNode => {
        if (type === 1) {
            if (!showIcon) return null;

            const finalTimeIcon = icon ?? <TimeIcon width="16" height="16" color="currentColor" />;
            const finalQuarterIcon = icon ?? <TimeQuarterIconn width="16" height="16" color="currentColor" />;

            switch (status) {
                case 'success':
                case 'processing':
                    return <span className={styles.icon}>{finalTimeIcon}</span>;
                default:
                    return <span className={styles.icon}>{finalQuarterIcon}</span>;
            }
        }

        if (type === 2) {
            return <span className={cls(styles.iconType2)} />;
        }

        if (type === 3) {
            return <span className={cls(styles.iconType3)} />;
        }

        return null;
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
