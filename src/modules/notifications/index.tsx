import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router';

import { notificationService } from '@/services/notification/detail.service';

import {
    ArchiveDownloadIcon,
    ArchiveIcon,
    FileMinusIcon,
    PlusIcon,
    ReloadIcon,
    SendIcon,
    TelegramIcon,
    TrashIcon,
    UndoIcon,
} from '@/shared/icons';
import { cls } from '@/shared/utils';

import { S_Button } from '@/ui';
import PageHeader from '@/ui/page-header';

import NewNotification from './components/NewNotification';
import { INotification } from './components/Notification';
import NotificationDetails from './components/NotificationDetails';
import styles from './style.module.css';
import ReceivedNotificationsTab from './tabs/ReceivedNotifications';
import { MOCK_NOTIFICATIONS } from './tabs/ReceivedNotifications/mock';

type TabType = 'received' | 'sent' | 'draft' | 'archived' | 'deleted';

const NotificationPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState<TabType>((searchParams.get('tab') as TabType) || 'received');
    const [selectedNotification, setSelectedNotification] = useState<INotification | null>(
        MOCK_NOTIFICATIONS.find((n) => n.id === searchParams.get('notificationId')) || null
    );
    const [isNewNotificationOpen, setIsNewNotificationOpen] = useState(false);
    const [openRightColumn, setOpenRightColumn] = useState(selectedNotification !== null);
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                await notificationService.getAllNotifications();
                setHasPermission(true);
            } catch (error) {
                // @ts-expect-error

                if (error?.status === 403) {
                    setHasPermission(false);
                    toast.error('Bu səhifəyə giriş icazəniz yoxdur.');
                    return;
                }
                // @ts-expect-error
                toast.error(error?.data?.message || 'Bildirişlər yüklənərkən xəta baş verdi.');
                setHasPermission(true);
                return;
            }
        };

        fetchNotifications();
    }, []);

    useEffect(() => {
        const notificationId = searchParams.get('notificationId');
        if (notificationId) {
            const notification = MOCK_NOTIFICATIONS.find((n) => n.id === notificationId);
            if (notification) {
                setSelectedNotification(notification);
                setOpenRightColumn(true);
                setIsNewNotificationOpen(false);
            } else {
                setSelectedNotification(null);
                setOpenRightColumn(false);
            }
        } else {
            setSelectedNotification(null);
            setOpenRightColumn(false);
        }
    }, [searchParams]);

    const changeTab = useCallback(
        (tab: TabType) => {
            if (activeTab === tab) return;
            setActiveTab(tab);
            const searchParams = new URLSearchParams(window.location.search);
            searchParams.set('tab', tab);
            setSearchParams(searchParams);
        },
        [activeTab, setSearchParams]
    );

    const handleNotificationClick = useCallback(
        (notification: INotification) => {
            setOpenRightColumn(true);
            setSelectedNotification(notification);
            setIsNewNotificationOpen(false);

            searchParams.set('notificationId', notification.id);
            setSearchParams(searchParams);
        },
        [selectedNotification]
    );

    const heaerRightContent = useMemo(() => {
        return (
            <div className={styles.headerRightContent}>
                <S_Button variant="main-10" isIcon iconBtnSize="15" color="secondary" aria-label="Geri al">
                    <UndoIcon width={14} height={14} />
                </S_Button>
                <S_Button variant="main-10" isIcon iconBtnSize="15" color="secondary" aria-label="Yenilə">
                    <ReloadIcon width={14} height={14} />
                </S_Button>
                <S_Button variant="main-10" isIcon iconBtnSize="15" color="secondary" aria-label="Yönləndir">
                    <SendIcon width={14} height={14} />
                </S_Button>
                <S_Button variant="main-10" isIcon iconBtnSize="15" color="secondary" aria-label="Arxiv">
                    <ArchiveIcon width={14} height={14} />
                </S_Button>
                <S_Button variant="main-10" isIcon iconBtnSize="15" color="secondary" aria-label="Sil">
                    <TrashIcon width={14} height={14} />
                </S_Button>
                <S_Button
                    variant="main-10"
                    onClick={() => {
                        setIsNewNotificationOpen(true);
                        setSelectedNotification(null);
                        setOpenRightColumn(true);
                    }}
                >
                    <PlusIcon width={14} height={14} />
                    Yeni mesaj
                </S_Button>
            </div>
        );
    }, []);

    const tabs = useMemo(() => {
        return [
            {
                name: 'Gələnlər',
                value: 'received',
                icon: <ArchiveDownloadIcon width={14} height={14} />,
            },
            {
                name: 'Göndərilənlər',
                value: 'sent',
                icon: <TelegramIcon width={14} height={14} />,
            },
            {
                name: 'Qaralamalar',
                value: 'draft',
                icon: <FileMinusIcon width={14} height={14} />,
            },
            {
                name: 'Arxiv',
                value: 'archived',
                icon: <ArchiveIcon width={14} height={14} />,
            },
            {
                name: 'Silinmiş',
                value: 'deleted',
                icon: <TrashIcon width={14} height={14} />,
            },
        ];
    }, [activeTab, changeTab]);

    const renderTabsContent = useCallback(() => {
        if (!hasPermission) {
            return null;
        }

        switch (activeTab) {
            case 'received':
                return <ReceivedNotificationsTab onNotificationClick={handleNotificationClick} />;
            // case 'sent':
            //     return <SentNotificationsTab />;
            // case 'draft':
            //     return <DraftedNotificationsTab />;
            // case 'archived':
            //     return <ArchivedNotificationsTab />;
            // case 'deleted':
            //     return <DeletedNotificationsTab />;
            default:
                return null;
        }
    }, [activeTab, hasPermission]);

    return (
        <>
            <PageHeader title="Bildirişlər" rightSide={heaerRightContent} />

            <div className={styles.notificationContainer}>
                <div className={styles.tabs}>
                    {tabs.map((tab) => (
                        <div
                            key={tab.value}
                            onClick={() => changeTab(tab.value as TabType)}
                            className={cls(styles.tabItem, activeTab === tab.value ? styles.active : '')}
                        >
                            {tab.icon}
                            <p>{tab.name}</p>
                        </div>
                    ))}
                </div>

                {renderTabsContent()}

                <div
                    className={styles.rightColumn}
                    style={{
                        width: openRightColumn ? '100%' : '0px',
                        padding: openRightColumn ? '24px' : '0px',
                    }}
                >
                    {selectedNotification ? (
                        <NotificationDetails
                            selectedNotification={selectedNotification}
                            onClose={() => {
                                setOpenRightColumn(false);
                                setSelectedNotification(null);
                                setIsNewNotificationOpen(false);

                                searchParams.delete('notificationId');
                                setSearchParams(searchParams);
                            }}
                        />
                    ) : null}
                    {isNewNotificationOpen ? (
                        <NewNotification
                            onClose={() => {
                                setIsNewNotificationOpen(false);
                                setOpenRightColumn(false);
                                setSelectedNotification(null);
                            }}
                        />
                    ) : null}
                </div>
            </div>
        </>
    );
};

export default NotificationPage;
