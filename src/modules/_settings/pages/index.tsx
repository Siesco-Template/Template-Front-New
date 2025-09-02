import React, { MouseEventHandler, useState } from 'react';
import toast from 'react-hot-toast';
import { NavLink, Outlet, useLocation } from 'react-router';

import { getFullConfigDiff, useTableConfig } from '@/shared/table/tableConfigContext';
import { cls } from '@/shared/utils';

import { S_Button } from '@/ui';

import SectionHeader from '../components/section-header';
import { useLayoutStore } from '../layout/layout.store';
import { SettingsNavigationLinks } from '../settings.contants';
import { useThemeStore } from '../theme/theme.store';
import { useTypographyStore } from '../typography/typography.store';
import { useViewAndContentStore } from '../view-and-content/view-and-content.store';
import styles from './settings-layout.module.css';

interface SettingsPageNavProps {
    onClick?: MouseEventHandler<HTMLAnchorElement>;
    className?: string;
}
const SettingsPageNavigation = ({ className = styles.sideNavbar, ...props }: SettingsPageNavProps) => {
    const location = useLocation();

    return (
        <ul className={cls(styles.settingsNavbar, className)}>
            {SettingsNavigationLinks.map((link) => (
                <li key={link.href}>
                    <NavLink
                        to={link.href}
                        className={({ isActive }) =>
                            cls(
                                styles.navLink,
                                isActive && styles.active,
                                link.href?.slice(0, -1) === location.pathname && styles.active
                            )
                        }
                        end
                        {...props}
                    >
                        {link.Icon}
                        <span className={styles.sidebarItemTitle}>{link.title}</span>
                    </NavLink>
                </li>
            ))}
        </ul>
    );
};

// const SettingsDrawerNavbar = () => {
//     const [isOpenNavbar, setOpenNavbar] = useState(false);
//     return (
//         <div className={styles.settingsHeaderRightSide}>
//             <S_Button
//                 onClick={() => setOpenNavbar(true)}
//                 isIcon
//                 variant="outlined-10"
//                 iconBtnSize="10"
//                 className={styles.drawerOpenIcon}
//             >
//                 <MenuOpenIcon />
//             </S_Button>
//             <S_Drawer
//                 isOpen={isOpenNavbar}
//                 onClose={() => setOpenNavbar(false)}
//                 width={280}
//                 contentClassName={styles.drawerContent}
//             >
//                 <div className={styles.drawerHeader}>
//                     <h2>Tənzimləmələr</h2>
//                     <S_Button variant="ghost-20" isIcon color="secondary" onClick={() => setOpenNavbar(false)}>
//                         <CloseIcon />
//                     </S_Button>
//                 </div>
//                 <SettingsPageNavigation className={styles.settingsDrawerNav} onClick={() => setOpenNavbar(false)} />
//             </S_Drawer>
//         </div>
//     );
// };
const SettingsPageHeader = ({ rightSide }: { rightSide: React.ReactNode }) => {
    return <SectionHeader withIcon={false} title="Parametrlər" titleAs="h1" rightSide={rightSide} />;
};

const SettingsPageLayout = () => {
    const [hasChange, setHasChange] = useState(false);

    const { saveSizes, discardSizes } = useTypographyStore();
    const { discardViewAndContent, saveViewAndContent } = useViewAndContentStore();

    const { saveConfigToApi, defaultConfig, config } = useTableConfig();

    const { saveChangesOnLayout, discardChangesOnLayout } = useLayoutStore();

    return (
        <div className={styles.settingsPageLayout}>
            <SettingsPageHeader
                rightSide={
                    hasChange ? (
                        <div className={styles.buttonContainer}>
                            <S_Button
                                variant="primary"
                                color="secondary"
                                children={'Ləğv et'}
                                onClick={() => {
                                    discardSizes();
                                    discardViewAndContent();
                                    discardChangesOnLayout();
                                    setHasChange(false);
                                }}
                            />
                            <S_Button
                                variant="primary"
                                color="primary"
                                children={'Yadda Saxla'}
                                onClick={async () => {
                                    const mergedDiff = getFullConfigDiff(undefined, defaultConfig, config);

                                    //birinci post edirik
                                    await saveConfigToApi(mergedDiff);

                                    // daha sonra storeda save evvele etsek çünki diff itəcək, save zamanı reset olunacaq.
                                    useThemeStore.getState().saveTheme();
                                    useLayoutStore.getState().saveChangesOnLayout();
                                    useTypographyStore.getState().saveSizes();
                                    useViewAndContentStore.getState().saveViewAndContent();
                                    useThemeStore.getState().saveTheme();

                                    toast.success('Konfiqurasiya uğurla yadda saxlanıldı');
                                    setHasChange(false);
                                }}
                            />
                        </div>
                    ) : null
                }
            />
            <div className={styles.settingsContainer}>
                <div className={styles.navbarContainer}>
                    {/* <div style={{ maxHeight: '38px' }}>
                        <S_Input placeholder="Axtar" iconPosition="left" icon={<SearchIcon />} />
                    </div> */}
                    <SettingsPageNavigation />
                </div>
                <div className={styles.main}>
                    <Outlet context={{ setHasChange }} />
                </div>
            </div>
        </div>
    );
};
export default SettingsPageLayout;
