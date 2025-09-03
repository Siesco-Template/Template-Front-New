import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { useAuthStore } from '@/store/authStore';

import { APP_URLS } from '@/services/config/url.config';
import { excelService } from '@/services/import/export/excel.service';

import { DownloadIcon, DownloadIconn, LeftIcon, RightIcon, SettingIcon, StarIcon } from '@/shared/icons';
import companyLogo from '@/shared/images/company.png';
import { cls } from '@/shared/utils';

import { S_Avatar, S_Button, S_SidePanel } from '@/ui';

import { SETTINGS_URL } from '../../settings.config';
import styles from './header-content.module.css';

const Header_Content = () => {
    const navigate = useNavigate();
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const [selectedPanel, setSelectedPanel] = useState<'notifications' | 'history' | 'favorites' | 'downloads'>(
        'notifications'
    );

    const [downloadItems, setDownloadItems] = useState<any[]>([]);

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
                            <S_Button variant="primary" color="secondary" onClick={() => navigate(-1)}>
                                <LeftIcon color="var(--content-secondary-brand-bold)" width={16} height={16} />
                            </S_Button>
                            <S_Button variant="primary" color="secondary" onClick={() => navigate(+1)}>
                                <RightIcon color="var(--content-secondary-brand-bold)" width={16} height={16} />
                            </S_Button>
                        </div>
                    </div>
                </div>

                <ul className={styles.sideNav}>
                    <li>
                        <S_Button
                            variant="primary"
                            color="secondary"
                            aria-label="Endirilənlər"
                            onClick={() => {
                                fetchItems();
                                setSelectedPanel('downloads');
                                setIsPanelOpen(true);
                            }}
                        >
                            <DownloadIcon color="var(--content-secondary-brand-bold)" width={16} height={16} />
                        </S_Button>
                    </li>
                    <li>
                        <S_Button
                            variant="primary"
                            color="secondary"
                            aria-label="Tənzimləmələr"
                            onClick={() => navigate(SETTINGS_URL.interfaceSettings())}
                        >
                            <SettingIcon color="var(--content-secondary-brand-bold)" width={16} height={16} />
                        </S_Button>
                    </li>

                    <li>
                        <div className={styles.profile}>
                            <Link className={styles.profile} to={'/profil'}>
                                <S_Avatar />
                            </Link>
                        </div>
                    </li>
                </ul>
            </div>

            <S_SidePanel
                open={isPanelOpen}
                onOpenChange={(open) => setIsPanelOpen(open)}
                title="Endirilənlər"
                children=""
            />
        </>
    );
};

export default Header_Content;
