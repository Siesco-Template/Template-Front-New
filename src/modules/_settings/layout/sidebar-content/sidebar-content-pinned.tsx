import { Dispatch, FC, SetStateAction, useState } from 'react';
import { NavLink } from 'react-router';
import { useLocation } from 'react-router';

import { Route } from '@/app/routing';
import { useAuthStore } from '@/store/authStore';

import { usePermission } from '@/modules/permission/PermissionContext';
import { hasPermission } from '@/modules/permission/PermissionGuard';

import { UserRole } from '@/shared/constants/enums';
import { cls } from '@/shared/utils';

import { S_ContextMenu2 } from '@/ui';

import { NavigationItem, getIconById } from '../../settings.contants';
import { useSettingsStore } from '../../settings.store';
import { useLayoutStore } from '../layout.store';
import styles from './sidebar.module.css';

interface ISidebar_Content_PinnedProps {
    subMenuOpen: string | null;
    setSubMenuOpen: Dispatch<SetStateAction<string | null>>;
    toggleSubMenu: (itemHref: string, navigateToPage?: boolean) => void;
}

const IconComponent = ({ link }: { link: NavigationItem }) => {
    const Icon = link.icon || getIconById(link.id);
    return <>{Icon && <Icon color="white" />}</>;
};
const Sidebar_Content_Pinned: FC<ISidebar_Content_PinnedProps> = ({ subMenuOpen, setSubMenuOpen, toggleSubMenu }) => {
    const { navigationLinks } = useSettingsStore();
    const { position } = useLayoutStore();
    const { permissions } = usePermission();
    const { user } = useAuthStore();
    const location = useLocation();

    const handleClick = (link: NavigationItem) => {
        toggleSubMenu(link.href, true); // Həm submenu açsın, həm səhifəyə yönləndirsin
    };

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

        const permissionFilteredRoutes = roleFilteredRoutes.filter((route) => {
            if (!route.permissionKey) return true;
            if (!permissions) return false;
            return route.permissionKey.every((key) => hasPermission(permissions, key));
        });

        return permissionFilteredRoutes;
    };

    const filteredNavigationLinks = filterRoutesByRoleAndPermission(navigationLinks, user.userRole);

    const sublink = (link: NavigationItem, isOpen: boolean) => {
        const isSubLinkActive = link.subLinks?.some((sublink) => location.pathname === sublink.href);

        return (
            <div className={styles.pinnedSubMenu}>
                <S_ContextMenu2
                    trigger="click"
                    menuPosition={position}
                    isOpen={isOpen}
                    onClose={() => setSubMenuOpen(null)}
                    triggerBox={
                        <button
                            className={cls(styles.pinnedLink, (isOpen || isSubLinkActive) && styles.pinnedParentActive)}
                            onClick={(e) => {
                                e.preventDefault();
                                toggleSubMenu(link.href);
                            }}
                            title={link.title}
                            aria-expanded={isOpen}
                        >
                            <IconComponent link={link} />
                        </button>
                    }
                >
                    <div className={styles.subLinkItemsContainer}>
                        {link.subLinks?.map((sublink, idx) => (
                            <NavLink
                                to={sublink.href}
                                key={`${link.href}-${sublink.href}-${idx}`}
                                className={({ isActive }) => cls(styles.pinnedLink, isActive && styles.linkActive)}
                                onClick={() => {
                                    setSubMenuOpen(null);
                                }}
                            >
                                {sublink.title}
                            </NavLink>
                        ))}
                    </div>
                </S_ContextMenu2>
            </div>
        );
    };

    return (
        <ul className={styles.pinned}>
            {filteredNavigationLinks.map((link: any, idx) => {
                const isOpen = subMenuOpen === link.href;
                const isActive = location.pathname === link.href;
                const hasActiveSubLink = link.subLinks?.some((sublink: any) => location.pathname === sublink.href);

                return (
                    <li className={styles.pinnedItem} key={`${link.href}-${idx}`}>
                        {link.subLinks ? (
                            sublink(link, isOpen)
                        ) : link.disabled ? (
                            link.icon && <link.icon color="white" />
                        ) : (
                            <NavLink
                                to={link.href}
                                className={({ isActive: isNavActive }) =>
                                    cls(styles.pinnedLink, isNavActive && subMenuOpen === null && styles.linkActive)
                                }
                                onClick={() => setSubMenuOpen(null)}
                                title={link.title}
                            >
                                <IconComponent link={link} />
                            </NavLink>
                        )}
                    </li>
                );
            })}
        </ul>
    );
};

export default Sidebar_Content_Pinned;
