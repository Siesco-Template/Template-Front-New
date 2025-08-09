import { lazy } from 'react';

import { Route } from '@/app/routing';
import { LazyLoadable } from '@/app/routing/routing.helpers';

import { transformUrlForRouting } from '@/shared/utils';

import SettingsPageLayout from './pages';
import PersonalizationMenu from './pages/personalization-menu';
import { SETTINGS_URL } from './settings.config';

const InterfaceSettings = lazy(() => import('./pages/interface-settings'));
const VisualSettings = lazy(() => import('./pages/visual-settings'));
const Typography = lazy(() => import('./pages/typography'));

const Settings_Route: Route[] = [
    {
        path: SETTINGS_URL.root(),
        element: <SettingsPageLayout />,
        isAuth: true,
        roles: [],
        children: [
            {
                path: transformUrlForRouting(SETTINGS_URL.visualSettings()),
                element: <LazyLoadable page={<VisualSettings />} />,
                isAuth: true,
                roles: [],
            },
            {
                path: transformUrlForRouting(SETTINGS_URL.typography()),
                element: <LazyLoadable page={<Typography />} />,
                isAuth: true,
                roles: [],
            },
            {
                path: transformUrlForRouting(SETTINGS_URL.interfaceSettings()),
                element: <LazyLoadable page={<InterfaceSettings />} />,
                isAuth: true,
                roles: [],
            },
            {
                path: transformUrlForRouting(SETTINGS_URL.personalizationMenu()),
                element: <LazyLoadable page={<PersonalizationMenu />} />,
                isAuth: true,
                roles: [],
            },
        ],
    },
];

export default Settings_Route;
