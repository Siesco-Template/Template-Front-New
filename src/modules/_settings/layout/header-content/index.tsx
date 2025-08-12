import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { useAuthStore } from '@/store/authStore';

import { APP_URLS } from '@/services/config/url.config';
import { excelService } from '@/services/import/export/excel.service';

import {
    DownloadIcon,
    DownloadIconn,
    LeftIcon,
    NotifiIcon,
    OutlineStartIcon,
    RightIcon,
    SettingIcon,
    StarIcon,
    TimeQuarterIconn,
} from '@/shared/icons';
// import logo_img from '@/shared/icons/afmis-logo.svg?url';
import companyLogo from '@/shared/images/company.png';
import { cls } from '@/shared/utils';

import { S_Button, S_SidePanel } from '@/ui';

import { SETTINGS_URL } from '../../settings.config';
import styles from './header-content.module.css';

const Header_Content = () => {
    const navigate = useNavigate();
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const [selectedPanel, setSelectedPanel] = useState<'notifications' | 'history' | 'favorites' | 'downloads'>(
        'notifications'
    );

    // const logoSrc = logo_img as string;

    const { user } = useAuthStore();

    const [downloadItems, setDownloadItems] = useState<any[]>([]);

    const handleNotificationClick = useCallback((notificationId: string) => {
        setIsPanelOpen(false);
        navigate(APP_URLS.notifications('', { notificationId }));
    }, []);

    const handleNotificationDelete = useCallback((notificationId: string) => {
        setNotifications((prevNotifications) =>
            prevNotifications.filter((notification: any) => notification.id !== notificationId)
        );
    }, []);

    const fetchItems = async () => {
        try {
            const items = await excelService.getItemsManual();
            setDownloadItems(items);
        } catch (error) {
            console.error('Fayllar gətirilərkən xəta baş verdi:', error);
        }
    };

    return (
        <>
            <div className={styles.mainHeader}>
                <div className={styles.centralOnTop}>
                    <div className={cls(styles.logo)}>
                        {/* <img
                            src={logoSrc}
                            alt="logo"
                            style={{ transition: 'opacity 0.3s ease-in-out' }}
                            onClick={() => navigate('/')}
                        /> */}
                        <span onClick={() => navigate('/')}>Template</span>
                    </div>
                    <div className={styles.searchWithButtons}>
                        <div className={styles.btngroup}>
                            <button className={styles.leftBtn} onClick={() => navigate(-1)}>
                                <LeftIcon color="hsl(var(--clr-primary-900))" width={16} height={16} />
                            </button>
                            <button className={styles.btnRight} onClick={() => navigate(+1)}>
                                <RightIcon color="hsl(var(--clr-primary-900))" width={16} height={16} />
                            </button>
                        </div>
                        {/* <div className={styles.searchOnTop}>
                            <S_Input
                                icon={<SearchIcon color="#fff" width={15} height={15} />}
                                placeholder="Axtar"
                                inputSize="small"
                                className={styles.inp}
                                fieldClassName={styles.inpField}
                                iconPosition="left"
                            />
                        </div> */}
                    </div>
                </div>

                <ul className={styles.sideNav}>
                    <li>
                        <S_Button
                            variant="main-10"
                            isIcon
                            iconBtnSize="15"
                            color="secondary"
                            aria-label="Endirilənlər"
                            onClick={() => {
                                fetchItems();
                                setSelectedPanel('downloads');
                                setIsPanelOpen(true);
                            }}
                        >
                            <DownloadIcon color="hsl(var(--clr-primary-900))" width={16} height={16} />
                        </S_Button>
                    </li>
                    <li>
                        <S_Button
                            variant="main-10"
                            isIcon
                            iconBtnSize="15"
                            color="secondary"
                            aria-label="Seçilmişlər"
                            onClick={() => {
                                setSelectedPanel('favorites');
                                setIsPanelOpen(!isPanelOpen);
                            }}
                        >
                            <OutlineStartIcon color="hsl(var(--clr-primary-900))" width={16} height={16} />
                        </S_Button>
                    </li>
                    <li>
                        <S_Button
                            variant="main-10"
                            isIcon
                            iconBtnSize="15"
                            color="secondary"
                            aria-label="Tarixçə"
                            onClick={() => {
                                setSelectedPanel('history');
                                setIsPanelOpen(!isPanelOpen);
                            }}
                        >
                            <TimeQuarterIconn color="hsl(var(--clr-primary-900))" width={16} height={16} />
                        </S_Button>
                    </li>
                    <li>
                        <S_Button
                            variant="main-10"
                            isIcon
                            iconBtnSize="15"
                            color="secondary"
                            aria-label="Tənzimləmələr"
                            onClick={() => navigate(SETTINGS_URL.interfaceSettings())}
                        >
                            <SettingIcon color="hsl(var(--clr-primary-900))" width={16} height={16} />
                        </S_Button>
                    </li>

                    <li>
                        <S_Button
                            variant="main-10"
                            isIcon
                            iconBtnSize="15"
                            color="secondary"
                            aria-label="Bildirişlər"
                            onClick={() => {
                                setSelectedPanel('notifications');
                                setIsPanelOpen(!isPanelOpen);
                            }}
                        >
                            <NotifiIcon color="hsl(var(--clr-primary-900))" width={16} height={16} />
                        </S_Button>
                    </li>

                    <li>
                        <div className={styles.profile}>
                            <Link className={styles.profile} to={'/profil'}>
                                <span className={styles.fullName}>{user.fullName}</span>
                                <img src={companyLogo} alt="" />
                            </Link>
                        </div>
                    </li>
                </ul>
            </div>

            <S_SidePanel
                open={isPanelOpen}
                onOpenChange={(open) => setIsPanelOpen(open)}
                title={
                    selectedPanel === 'notifications'
                        ? 'Bildirişlər'
                        : selectedPanel === 'history'
                          ? 'Tarixçə'
                          : selectedPanel === 'favorites'
                            ? 'Seçilmişlər'
                            : 'Endirilənlər'
                }
            >
                <>
                    {selectedPanel === 'notifications' && (
                        <section className={styles.panel}>
                            {/* <h2 className={styles.label}>Dünən</h2> */}

                            {/* {notifications.map((notification) => (
                                <Notification
                                    key={notification.id}
                                    notification={notification}
                                    onNotificationClick={() => handleNotificationClick(notification.id)}
                                    onDelete={() => handleNotificationDelete(notification.id)}
                                />
                            ))} */}
                        </section>
                    )}
                    {selectedPanel === 'history' && (
                        <section className={styles.panel}>
                            <div className={styles.historyItems}>
                                <h2 className={styles.label}>Bu gün</h2>
                                <div className={styles.historyItemsGroup}>
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <div className={styles.historyItem} key={index}>
                                            <p>
                                                Lorem Ipsum is simply dummy text of the printing and typesetting
                                                industry.
                                            </p>
                                            <span>10:50 AM</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.historyItems}>
                                <h2 className={styles.label}>12.04.2025</h2>
                                <div className={styles.historyItemsGroup}>
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <div className={styles.historyItem} key={index}>
                                            <p>
                                                Lorem Ipsum is simply dummy text of the printing and typesetting
                                                industry.
                                            </p>
                                            <span>10:50 AM</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}
                    {selectedPanel === 'favorites' && (
                        <section className={styles.panel}>
                            {Array.from({ length: 5 }).map((_, index) => (
                                <div className={styles.favoriteItem} key={index}>
                                    <StarIcon width={12} height={12} color="hsl(var(--clr-grey-400))" />
                                    <div className={styles.favoriteItemContent}>
                                        <h3>Subtitle</h3>
                                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry</p>
                                    </div>
                                </div>
                            ))}
                        </section>
                    )}
                    {selectedPanel === 'downloads' && (
                        <section className={styles.panel}>
                            <div className={styles.downloadItems}>
                                <h2 className={styles.label}>Bu gün</h2>
                                <div className={styles.downloadItemsGroup}>
                                    {downloadItems.length === 0 ? (
                                        <p style={{ padding: '1rem', textAlign: 'center' }}>Heç bir fayl tapılmadı.</p>
                                    ) : (
                                        downloadItems.map((item, index) => {
                                            const createdAt = new Date(item.createdAt);
                                            const time = createdAt.toLocaleTimeString('az-AZ', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            });

                                            const datePart = createdAt.toLocaleDateString('az-AZ').replace(/\./g, '-');
                                            const timePart = createdAt.toTimeString().slice(0, 5).replace(':', '-');
                                            const generatedFileName = `Hesabat_${datePart}_${timePart}`;

                                            return (
                                                <div className={styles.downloadItem} key={index}>
                                                    <p>
                                                        {generatedFileName}
                                                        {item.extension}
                                                    </p>
                                                    <div className={styles.itemBtnGroup}>
                                                        <span>{time}</span>
                                                        <a
                                                            href={item.fileUrl}
                                                            download={`${generatedFileName}${item.extension}`}
                                                            style={{
                                                                background: 'transparent',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                padding: 0,
                                                            }}
                                                        >
                                                            <DownloadIconn color="#0D3CAF" width={16} height={16} />
                                                        </a>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </section>
                    )}
                </>
            </S_SidePanel>
        </>
    );
};

export default Header_Content;
