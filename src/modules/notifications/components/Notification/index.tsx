import { TrashIcon, UserCardIcon } from '@/shared/icons';
import { cls } from '@/shared/utils';

import { S_Button } from '@/ui';

import styles from './style.module.css';

export interface INotification {
    id: string;
    title: string;
    description: string;
    sender: string;
    date: string;
    isSeen: boolean;
}

type Props = {
    notification: INotification;
    onNotificationClick?: (notification: INotification) => void;
    onDelete?: (notificationId: string) => void;
};

const Notification = ({ notification, onNotificationClick, onDelete }: Props) => {
    return (
        <div
            className={cls(styles.notificationItem, notification?.isSeen ? styles.seen : styles.unseen)}
            onClick={() => onNotificationClick?.(notification)}
        >
            <div className={styles.notificationContent} onClick={() => onNotificationClick?.(notification)}>
                <div className={styles.notificationContentLeft}>
                    <div className={styles.notificationIcon}>
                        <UserCardIcon />
                    </div>
                    <div className={styles.text}>
                        <h3>{notification.title}</h3>
                        <p>{notification.sender}</p>
                    </div>
                </div>

                <div className={styles.notificationRight}>
                    <div className={styles.notificationDate}>
                        {new Date(notification.date).toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            // hour: '2-digit',
                            // minute: '2-digit',
                        })}
                    </div>
                    <S_Button
                        variant="none"
                        isIcon
                        aria-label="Sil"
                        iconBtnSize="10"
                        className={styles.deleteButton}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent the click from propagating to the notification item
                            onDelete?.(notification.id);
                        }}
                    >
                        <TrashIcon />
                    </S_Button>
                </div>
            </div>

            <p className={styles.description}>{notification.description}</p>
        </div>
    );
};

export default Notification;
