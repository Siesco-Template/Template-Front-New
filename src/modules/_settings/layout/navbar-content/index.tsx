import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';

import { useAuthStore } from '@/store/authStore';

import { usePermission } from '@/modules/permission/PermissionContext';
import { hasPermission } from '@/modules/permission/PermissionGuard';

import { UserRole } from '@/shared/constants/enums';
import { DirectionDownIcon, DirectionUpIcon } from '@/shared/icons';

import { NavigationItem } from '../../settings.contants';
import { useSettingsStore } from '../../settings.store';
import { useLayoutStore } from '../layout.store';
import styles from './navbar-content.module.css';

const Navbar_Content = () => {
    const { navigationLinks } = useSettingsStore();
    const { permissions } = usePermission();
    const { user } = useAuthStore();

    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const location = useLocation();

    const filterRoutesByRoleAndPermission = (routes: NavigationItem[], userRole: UserRole): NavigationItem[] => {
        const roleFilteredRoutes = routes
            .filter((route) => {
                if (route.roles.length === 0 || userRole === 4 || userRole === 5) return true;
                return route.roles.includes(userRole);
            })
            .map((route) => ({
                ...route,
                subLinks: route.subLinks ? filterRoutesByRoleAndPermission(route.subLinks, userRole) : undefined,
            }));

        const permissionFilteredRoutes = roleFilteredRoutes
            .filter((route) => {
                if (!route.permissionKey) return true;
                if (!permissions) return false;
                return route.permissionKey.every((key) => hasPermission(permissions, key));
            })
            .filter((route) => route.show);

        return permissionFilteredRoutes;
    };

    const filteredNavigationLinks = filterRoutesByRoleAndPermission(navigationLinks, user.userRole);

    useEffect(() => {
        setOpenIndex(null);
    }, [location.pathname]);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!event.target || !(event.target as Element).closest(`.${styles.navbar}`)) {
                setOpenIndex(null);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <nav className={styles.navbar}>
            <ul className={styles.navList}>
                {filteredNavigationLinks.map((item, index) => (
                    <NavItem
                        key={index}
                        item={item}
                        isOpen={openIndex === index}
                        onToggle={() => handleToggle(index)}
                    />
                ))}
            </ul>
        </nav>
    );
};

const NavItem = ({ item, isOpen, onToggle }: { item: any; isOpen: boolean; onToggle: () => void }) => {
    const { position } = useLayoutStore();

    const directionClass = position === 'bottom' ? styles.subMenuUp : styles.subMenuDown;

    return (
        <li className={styles.navItem}>
            {item.subLinks ? (
                <div className={styles.navButton} onClick={onToggle}>
                    {item.title}
                    <span className={`${styles.arrow} ${isOpen ? styles.rotated : ''}`}>
                        {position === 'bottom' ? (
                            <DirectionUpIcon className={styles.icon} />
                        ) : (
                            <DirectionDownIcon className={styles.icon} />
                        )}
                    </span>
                </div>
            ) : (
                <Link to={item.href} className={styles.navButton}>
                    {item.title}
                </Link>
            )}

            {item.subLinks && (
                <ul className={`${styles.subMenu} ${directionClass} ${isOpen ? styles.open : ''}`}>
                    {item.subLinks.map((sub: any, i: number) => (
                        <li key={i} className={styles.subMenuItem}>
                            <Link to={sub.href}>{sub.title}</Link>
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );
};

export default Navbar_Content;
