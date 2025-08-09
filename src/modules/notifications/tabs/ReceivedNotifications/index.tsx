import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';

import { cls } from '@/shared/utils';

import S_Pagination from '@/ui/pagination';

import Notification, { INotification } from '../../components/Notification';
import { MOCK_NOTIFICATIONS } from './mock';
import styles from './style.module.css';

const tabs = [
    { name: 'Hamısı', value: '0' },
    { name: 'Oxunmamış', value: '1' },
];

const ITEMS_PER_PAGE = 25;

type Props = {
    onNotificationClick?: (notification: INotification) => void;
};

function ReceivedNotificationsTab({ onNotificationClick }: Props) {
    const [searchParams, setSearchParams] = useSearchParams();

    const [data, setData] = useState<INotification[]>(MOCK_NOTIFICATIONS);
    const [activeTab, setActiveTab] = useState<'0' | '1'>('0');
    const [lineStyle, setLineStyle] = useState({ width: 0, left: 0 });
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
    const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

    useLayoutEffect(() => {
        const idx = Number(activeTab);
        const btn = tabRefs.current[idx];
        if (btn) {
            const rect = btn.getBoundingClientRect();
            const parentRect = btn.parentElement!.getBoundingClientRect();
            setLineStyle({
                width: rect.width,
                left: rect.left - parentRect.left,
            });
        }
    }, [activeTab]);

    const totalCount = useMemo(() => {
        return activeTab === '0' ? data.length : data.filter((notification) => !notification.isSeen).length;
    }, [data, activeTab]);

    const handleNotificationDelete = useCallback(
        (notificationId: string) => {
            setData((prevData) => prevData.filter((notification) => notification.id !== notificationId));
        },
        [data]
    );

    const filteredNotifications = useMemo(() => {
        const notifications = activeTab === '0' ? data : data.filter((notification) => !notification.isSeen);
        return notifications;
    }, [data, activeTab]);

    const handlePageChange = useCallback(
        (page: number) => {
            setCurrentPage(page);
            setSearchParams((prevParams) => {
                const params = new URLSearchParams(prevParams.toString());
                params.set('page', String(page));
                return params;
            });
        },
        [searchParams]
    );

    return (
        <div className={styles.tabWrapper}>
            <div className={styles.tabHeader}>
                <div className={styles.tabButtons}>
                    {tabs.map((tab, i) => (
                        <button
                            key={tab.value}
                            ref={(el) => void (tabRefs.current[i] = el)}
                            onClick={() => setActiveTab(tab.value as '0' | '1')}
                            className={cls(styles.tabButton, activeTab === tab.value ? styles.active : '')}
                        >
                            {tab.name}
                        </button>
                    ))}
                </div>

                <div
                    className={styles.tabBottomLine}
                    style={{
                        width: `${lineStyle.width}px`,
                        transform: `translateX(${lineStyle.left}px)`,
                        transition: 'transform .3s ease, width .3s ease',
                    }}
                />
            </div>

            <div className={styles.tabContent}>
                {filteredNotifications.length > 0
                    ? filteredNotifications.map((notification) => (
                          <Notification
                              key={notification.id}
                              notification={notification}
                              onNotificationClick={onNotificationClick}
                              onDelete={handleNotificationDelete}
                          />
                      ))
                    : null}
            </div>

            <div className={styles.paginationWrapper}>
                {Math.ceil(totalCount / ITEMS_PER_PAGE) <= 1 ? null : (
                    <S_Pagination
                        currentPage={currentPage}
                        setCurrentPage={(page) => handlePageChange(page)}
                        totalCount={totalCount}
                        take={ITEMS_PER_PAGE}
                    />
                )}
            </div>
        </div>
    );
}
export default ReceivedNotificationsTab;
