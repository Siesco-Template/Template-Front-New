import { DirectionLeftIcon, UserCardIcon } from '@/shared/icons';

import { INotification } from '../Notification';
import styles from './style.module.css';

type Props = {
    selectedNotification: INotification;
    onClose: () => void;
};

function NotificationDetails({ selectedNotification, onClose }: Props) {
    return (
        <div className={styles.notificationDetailsContent}>
            <div className={styles.notificationHeader}>
                <div className={styles.notificationHeaderLeft}>
                    <div className={styles.backButton} onClick={onClose}>
                        <DirectionLeftIcon width={14} height={14} />
                    </div>
                    <div className={styles.notificationIcon}>
                        <UserCardIcon />
                    </div>
                    <div className={styles.text}>
                        <h3>{selectedNotification?.title}</h3>
                        <p>{selectedNotification?.sender}</p>
                    </div>
                </div>

                <div className={styles.notificationRight}>
                    {new Date(selectedNotification?.date).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </div>
            </div>

            <div className={styles.notificationBody}>
                <h3>{selectedNotification.title}</h3>
                <p>{selectedNotification.description}</p>
            </div>
        </div>
    );
}

export default NotificationDetails;
