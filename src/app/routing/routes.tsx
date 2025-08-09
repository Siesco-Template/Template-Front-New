import { lazy, useEffect } from 'react';
import { Outlet } from 'react-router';

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
import NotificationPage from '@/modules/notifications';
import Profile from '@/modules/profile';

import { Route } from './index';
import ProtectedRoute from './protectedRoute';
import { LazyLoadable } from './routing.helpers';

const Qeydiyyat = lazy(() => import('@/pages/teskilatlar/qeydiyyat'));
const UsersPage = lazy(() => import('@/pages/teskilatlar/istifadeciler'));
const Huquqlar = lazy(() => import('@/pages/teskilatlar/huquqlar'));
const Budce_hesabatlari_table = lazy(() => import('@/pages/hesabatlar/budce-hesabatlari/budce_hesabatlari_table'));
const Budce_hesabati_yeni = lazy(() => import('@/pages/hesabatlar/budce-hesabatlari/budce_hesabati_yeni'));
const HomePage = lazy(() => import('@/pages/ana-sehife'));
const Budce_hesabatlari = lazy(() => import('@/pages/hesabatlar/budce-hesabatlari'));
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
                path: APP_URLS.hesabatlar(),
                element: <Outlet />,
                isAuth: false,
                roles: [],
                children: [
                    {
                        path: APP_URLS.budceHesabatlari(),
                        element: <LazyLoadable page={<Budce_hesabatlari />} />,
                        isAuth: true,
                        roles: [],
                        permissionKey: ['report/getAll'],
                    },
                    {
                        path: APP_URLS.budceHesabatlariEtrafli(':id'),
                        element: <LazyLoadable page={<Budce_hesabatlari_table />} />,
                        isAuth: true,
                        roles: [],
                        permissionKey: ['report/getAll'],
                    },
                    {
                        path: APP_URLS.budceHesabatlariYeni(':slug'),
                        element: <LazyLoadable page={<Budce_hesabati_yeni />} />,
                        isAuth: true,
                        roles: [],
                        permissionKey: ['report/getAll', 'report/create'],
                    },
                ],
            },
            {
                path: APP_URLS.anaSehife(),
                element: <HomePage />,
                isAuth: false,
                roles: [],
            },
            {
                path: APP_URLS.notifications(),
                element: <NotificationPage />,
                isAuth: false,
                roles: [],
                permissionKey: ['notification/getAll'],
            },
            {
                path: APP_URLS.profile(),
                element: <Profile />,
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
                        path: APP_URLS.qeydiyyat(),
                        element: <LazyLoadable page={<Qeydiyyat />} />,
                        isAuth: true,
                        roles: [],
                        permissionKey: ['organization/getReyestr'],
                    },
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
                path: APP_URLS.set_password(),
                element: <LazyLoadable page={<SetPassword />} />,
                isAuth: false,
                roles: [],
            },
            {
                path: APP_URLS.reset_password(),
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
        ],
    },
];

export const AppInitializer = ({ config }: { config: any }) => {
    useEffect(() => {
        if (config) {
            console.log(config, 'Config from context');
            const layoutState = getLayoutFromContext(config.extraConfig?.interfaceSettings);
            const viewAndContentState = getViewAndContentFromContext(config.extraConfig?.visualSettings);
            const typographyState = getTypographyFromContext(config.extraConfig?.textSettings);
            const items = convertPersonalizationToNavigation(config.extraConfig?.personalizationMenu);

            useSettingsStore.getState().setNavigationLinks(items);
            useLayoutStore.setState(layoutState);
            useViewAndContentStore.setState(viewAndContentState);
            useTypographyStore.setState(typographyState);

            const visualSettings = config.extraConfig?.visualSettings || {};

            const themeEntries = Object.entries(visualSettings)
                .filter(([key]) => /^themes\[\d+\]$/.test(key))
                .sort(([a], [b]) => {
                    const ia = Number(a.match(/^themes\[(\d+)\]$/)![1]);
                    const ib = Number(b.match(/^themes\[(\d+)\]$/)![1]);
                    return ia - ib;
                });

            const themeArray = themeEntries.map(([_, themeObj]) => themeObj);

            // console.log(themeArray, 'Theme List from config');
            const currentThemeId = config.extraConfig?.visualSettings.currentTheme;
            const previousThemeId = config.extraConfig?.visualSettings.previousTheme;

            const normalizedThemeList = (themeArray || [])?.map((t: any) => ({
                name: t?.name,
                id: t?.id,
                type: t?.type ?? 'light',
                primary: {
                    '50': t?.primary?.['50'] ?? '',
                    '100': t?.primary?.['100'] ?? '',
                    '200': t?.primary?.['200'] ?? '',
                    '300': t?.primary?.['300'] ?? '',
                    '400': t?.primary?.['400'] ?? '',
                    '500': t?.primary?.['500'] ?? '',
                    '600': t?.primary?.['600'] ?? '',
                    '700': t?.primary?.['700'] ?? '',
                    '800': t?.primary?.['800'] ?? '',
                    '900': t?.primary?.['900'] ?? '',
                },
                secondary: {
                    '50': t?.secondary?.['50'] ?? '',
                    '100': t?.secondary?.['100'] ?? '',
                    '200': t?.secondary?.['200'] ?? '',
                    '300': t?.secondary?.['300'] ?? '',
                    '400': t?.secondary?.['400'] ?? '',
                    '500': t?.secondary?.['500'] ?? '',
                    '600': t?.secondary?.['600'] ?? '',
                    '700': t?.secondary?.['700'] ?? '',
                    '800': t?.secondary?.['800'] ?? '',
                    '900': t?.secondary?.['900'] ?? '',
                },
                background: t?.background ?? '',
                foreground: t?.foreground ?? '',
            }));

            const currentTheme = normalizedThemeList?.find((t: any) => t.id === currentThemeId);
            const cssTheme = transformThemeToCss(currentTheme);
            if (cssTheme) {
                addThemeOnHtmlRoot(cssTheme);
            }

            useThemeStore.setState({
                themes: normalizedThemeList,
                currentTheme: currentThemeId,
                previousTheme: previousThemeId ?? currentThemeId ?? null,
            });
        }
    }, [config]);

    return null;
};
