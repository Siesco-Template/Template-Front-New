import { lazy, useEffect } from 'react';
import { Outlet } from 'react-router';

import FolderPage from '@/pages/folder';
// import Folder_Table from '@/pages/folder-table';
import Table_Page from '@/pages/table-page';

import { APP_URLS } from '@/services/config/url.config';

import Settings_Route from '@/modules/_settings';
import S_layout from '@/modules/_settings/layout';
import { useLayoutStore } from '@/modules/_settings/layout/layout.store';
import { getLayoutFromContext } from '@/modules/_settings/layout/layout.utils';
import { useSettingsStore } from '@/modules/_settings/settings.store';
import { convertPersonalizationToNavigation } from '@/modules/_settings/settings.utils';
import { useThemeStore } from '@/modules/_settings/theme/theme.store';
import { addThemeOnHtmlRoot, transformThemeToCss } from '@/modules/_settings/theme/theme.utils';
import { useTypographyStore } from '@/modules/_settings/typography/typography.store';
import { getTypographyFromContext } from '@/modules/_settings/typography/typography.utils';
import { useViewAndContentStore } from '@/modules/_settings/view-and-content/view-and-content.store';
import { getViewAndContentFromContext } from '@/modules/_settings/view-and-content/view-and-content.utils';
import AuthLayout from '@/modules/auth/layout/authLayout';
import Register from '@/modules/auth/pages/Register/Register';
import NotificationPage from '@/modules/notifications';
import Profile from '@/modules/profile';

import { Route } from './index';
import ProtectedRoute from './protectedRoute';
import { LazyLoadable } from './routing.helpers';

const UsersPage = lazy(() => import('@/pages/teskilatlar/istifadeciler'));
const Huquqlar = lazy(() => import('@/pages/teskilatlar/huquqlar'));
const HomePage = lazy(() => import('@/pages/ana-sehife'));
const BlockUser = lazy(() => import('@/modules/auth/pages/BlockUser/BlockUser'));
const ChangePassword = lazy(() => import('@/modules/auth/pages/ChangePassword/ChangePassword'));
const ForgotPassword = lazy(() => import('@/modules/auth/pages/ForgotPassword/ForgotPassword'));
const Login = lazy(() => import('@/modules/auth/pages/Login/Login'));
const Otp = lazy(() => import('@/modules/auth/pages/Otp/Otp'));
const ResetPassword = lazy(() => import('@/modules/auth/pages/ResetPassword/ResetPassword'));
const SetPassword = lazy(() => import('@/modules/auth/pages/SetPassword/SetPassword'));

export const routes: Route[] = [
    {
        path: APP_URLS.root(),
        element: <ProtectedRoute element={<S_layout />} />,
        isAuth: true,
        roles: [],
        children: [
            ...Settings_Route,
            {
                path: APP_URLS.anaSehife(),
                element: <LazyLoadable page={<HomePage />} />,
                isAuth: false,
                roles: [],
            },
            {
                path: APP_URLS.table(),
                element: <LazyLoadable page={<Table_Page />} />,
                isAuth: false,
                roles: [],
            },
            {
                path: APP_URLS.folder(),
                element: <LazyLoadable page={<FolderPage />} />,
                isAuth: false,
                roles: [],
            },
            // {
            //     path: APP_URLS.folderAndTable(),
            //     element: <LazyLoadable page={<Folder_Table />} />,
            //     isAuth: false,
            //     roles: [],
            // },
            {
                path: APP_URLS.notifications(),
                element: <LazyLoadable page={<NotificationPage />} />,
                isAuth: false,
                roles: [],
                permissionKey: ['notification/getAll'],
            },
            {
                path: APP_URLS.profile(),
                element: <LazyLoadable page={<Profile />} />,
                isAuth: false,
                roles: [],
            },
            {
                path: APP_URLS.teskilatlar(),
                element: <Outlet />,
                isAuth: false,
                roles: [],
                children: [
                    {
                        path: APP_URLS.istifadeciler(),
                        element: <LazyLoadable page={<UsersPage />} />,
                        isAuth: true,
                        roles: [],
                        permissionKey: ['user/getAll'],
                    },
                    {
                        path: APP_URLS.huquqlar(),
                        element: <LazyLoadable page={<Huquqlar />} />,
                        isAuth: true,
                        roles: [],
                        permissionKey: ['permission/getAll'],
                    },
                ],
            },
        ],
    },
    {
        path: APP_URLS.root(),
        element: <AuthLayout />,
        isAuth: true,
        roles: [],
        children: [
            {
                path: APP_URLS.login(),
                element: <LazyLoadable page={<Login />} />,
                isAuth: false,
                roles: [],
            },
            {
                path: APP_URLS.set_password('/:token'),
                element: <LazyLoadable page={<SetPassword />} />,
                isAuth: false,
                roles: [],
            },
            {
                path: APP_URLS.reset_password('/:token'),
                element: <LazyLoadable page={<ResetPassword />} />,
                isAuth: false,
                roles: [],
            },
            {
                path: APP_URLS.change_password(),
                element: <LazyLoadable page={<ChangePassword />} />,
                isAuth: false,
                roles: [],
            },
            {
                path: APP_URLS.forgot_password(),
                element: <LazyLoadable page={<ForgotPassword />} />,
                isAuth: false,
                roles: [],
            },
            {
                path: APP_URLS.otp(),
                element: <LazyLoadable page={<Otp />} />,
                isAuth: false,
                roles: [],
            },
            {
                path: APP_URLS.block_user(),
                element: <LazyLoadable page={<BlockUser />} />,
                isAuth: false,
                roles: [],
            },
            {
                path: APP_URLS.register(),
                element: <LazyLoadable page={<Register />} />,
                isAuth: false,
                roles: [],
            },
        ],
    },
];

export const AppInitializer = ({ config }: { config: any }) => {
    useEffect(() => {
        if (typeof config === 'object' && config !== null) {
            const layoutState = getLayoutFromContext(config.extraConfig?.interfaceSettings);
            const viewAndContentState = getViewAndContentFromContext(config.extraConfig?.visualSettings);
            const typographyState = getTypographyFromContext(config.extraConfig?.textSettings);
            const items = convertPersonalizationToNavigation(config.extraConfig?.personalizationMenu);

            useSettingsStore.getState().setNavigationLinks(items);
            useLayoutStore.setState(layoutState);
            useViewAndContentStore.setState(viewAndContentState);
            useTypographyStore.setState(typographyState);

            const currentThemeId = config.extraConfig?.visualSettings.currentTheme;
            const normalizedThemeList = config.extraConfig?.visualSettings?.themes || [];

            const currentTheme: any = normalizedThemeList?.find((t: any) => t.id === currentThemeId);
            const cssTheme = transformThemeToCss(currentTheme);
            if (cssTheme) {
                addThemeOnHtmlRoot(cssTheme);
            }

            useThemeStore.setState({
                themes: normalizedThemeList,
                initialThemes: normalizedThemeList,
                currentTheme: currentThemeId,
                previousTheme: currentThemeId,
                initialTheme: currentThemeId,
                newThemeId: undefined,
                editedTheme: undefined,
            });
        }
    }, [config]);

    return null;
};
