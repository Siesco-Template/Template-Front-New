import { Dispatch, FC, SetStateAction, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router';

import { useAuthStore } from '@/store/authStore';

import { usePermission } from '@/modules/permission/PermissionContext';
import { hasPermission } from '@/modules/permission/PermissionGuard';

import { UserRole } from '@/shared/constants/enums';
import { DirectionDownIcon } from '@/shared/icons';
import { cls } from '@/shared/utils';

import { NavigationItem, getIconById } from '../../settings.contants';
import { useSettingsStore } from '../../settings.store';
import { useLayoutStore } from '../layout.store';
import Sidebar_Content_Pinned from './sidebar-content-pinned';
import styles from './sidebar.module.css';

const IconComponent = ({ link }: { link: NavigationItem }) => {
    const Icon = link.icon || getIconById(link.id);
    return <div>{Icon && <Icon />}</div>;
};

interface Props {
    subMenuOpen: string | null;
    setSubMenuOpen: Dispatch<SetStateAction<string | null>>;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const Sidebar: FC<Props> = ({ subMenuOpen, setSubMenuOpen, open, setOpen }) => {
    const { navigationLinks } = useSettingsStore();

    const navigate = useNavigate();
    const location = useLocation();
    const { pinned, alwaysOpen } = useLayoutStore();
    const { user } = useAuthStore();
    const { permissions } = usePermission();

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

    const toggleSubMenu = (itemHref: string) => {
        setSubMenuOpen((prev) => (prev === itemHref ? null : itemHref));
    };

    useEffect(() => {
        if (open) {
            setSubMenuOpen(null);
            return;
        }

        let activeParentHref: string | null = null;

        const activeParent = filteredNavigationLinks.find((item) =>
            item.subLinks?.some((subLink) => subLink.href === location.pathname)
        );
        if (activeParent) {
            activeParentHref = activeParent.href;
        }

        setSubMenuOpen(activeParentHref);
    }, [location.pathname, open]);

    useEffect(() => {
        if (!open) {
            filteredNavigationLinks.forEach((item) => {
                if (item.subLinks) {
                    const hasActiveChild = item.subLinks.some((subLink) => subLink.href === location.pathname);
                    if (hasActiveChild) {
                        setSubMenuOpen(item.href);
                    }
                }
            });
        }
    }, [location.pathname]);

    const subMenu = (item: NavigationItem) => {
        const isOpen = subMenuOpen === item.href;
        const hasActiveChild = item.subLinks?.some((subLink) => subLink.href === location.pathname);

        return (
            <div className={cls(styles.subMenu, isOpen && styles.open)}>
                <button
                    className={cls(styles.subMenuBtn, (isOpen || hasActiveChild) && styles.parentActive)}
                    onClick={() => toggleSubMenu(item.href)}
                >
                    <span>
                        <IconComponent link={item} />
                        <span className={styles.subMenuTitle}>{item.title}</span>
                    </span>
                    {item.subLinks && item.subLinks.length > 0 && (
                        <div className={cls(styles.subMenuArrow, (isOpen || hasActiveChild) && styles.parentActive)}>
                            <DirectionDownIcon />
                        </div>
                    )}
                </button>
                <div className={cls(styles.subMenuItems, isOpen && styles.active)}>
                    <ul className={styles.subMenuList}>
                        {item.subLinks?.map((subLink, idx) => (
                            <li key={`${item.href}-${subLink.href}-${idx}`} className={styles.subMenuItem}>
                                <NavLink
                                    to={subLink.href}
                                    className={({ isActive }) =>
                                        cls(styles.sidebarSubLink, isActive && styles.subLinkActive)
                                    }
                                    end
                                    onClick={() => setSubMenuOpen(item.href)}
                                >
                                    <span className={styles.subMenuItem}>{subLink.title}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    };

    const pinnedToggleSubMenu = (itemHref: string, navigateToPage: boolean = false) => {
        setSubMenuOpen((prev) => (prev === itemHref ? null : itemHref));

        if (navigateToPage) {
            navigate(itemHref);
        }
    };

    const sidebar = (
        <ul className={styles.sidebar}>
            {filteredNavigationLinks.map((item: any, idx) => (
                <li className={styles.sidebarItem} key={`${item.title}-${item.href}-${idx}`}>
                    {item.subLinks?.length > 0 ? (
                        subMenu(item)
                    ) : item.disabled ? (
                        <div className={styles.sidebarLink}>
                            <IconComponent link={item} />
                            <span>{item.title}</span>
                        </div>
                    ) : (
                        <NavLink
                            to={item.href}
                            className={({ isActive }) => cls(styles.sidebarLink, isActive && styles.linkActive)}
                            onClick={() => setSubMenuOpen(null)}
                        >
                            <IconComponent link={item} />
                            <span>{item.title}</span>
                        </NavLink>
                    )}
                </li>
            ))}
        </ul>
    );

    return (
        <>
            {alwaysOpen ? (
                <div className={cls(styles.sidebarWrapper)}>{sidebar}</div>
            ) : open ? (
                <div className={cls(styles.sidebarPinnedWrapper, !open && styles.disable)}>
                    <Sidebar_Content_Pinned {...{ subMenuOpen, setSubMenuOpen, toggleSubMenu: pinnedToggleSubMenu }} />
                </div>
            ) : (
                <div className={cls(styles.sidebarWrapper, open && styles.disable)}>{sidebar}</div>
            )}
        </>
    );
};

export default Sidebar;
