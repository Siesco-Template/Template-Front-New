import { UserRole } from '@/shared/constants/enums';
import {
    FilterIcon1,
    FontSizeIcon,
    GridIcon,
    MenuAdditionalReportIcon,
    MenuCatalogIcon,
    MenuCompanyIcon,
    MenuHomeIcon,
    MenuReportIcon,
    PaintBucketIcon,
} from '@/shared/icons';
import { getSystemTheme } from '@/shared/utils';

import { LayoutState } from './layout/layout.store';
import { SETTINGS_URL } from './settings.config';
import { Theme } from './theme/theme.store';
import { ViewAndContentState } from './view-and-content/view-and-content.store';

export type NavigationItem = {
    id?: string;
    href: string;
    title: string;
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
    subLinks?: NavigationItem[];
    roles: UserRole[];
    permissionKey: string[];
    show: boolean;
};

// export const NavigationLinks: NavigationItem[] = [
//     {
//         href: APP_URLS.anaSehife(),
//         title: 'Ana səhifə',
//         icon: MenuHomeIcon,
//         roles: [],
//         permissionKey: [],
//         show: true,
//     },
//     {
//         href: APP_URLS.teskilatlar(),
//         title: 'Təşkilatlar',
//         icon: MenuCompanyIcon,
//         roles: [],
//         permissionKey: [],
//         show: true,
//         subLinks: [
//             {
//                 title: 'İstifadəçilər',
//                 href: APP_URLS.istifadeciler(),
//                 roles: [],
//                 permissionKey: ['user/getAll'],
//                 show: true,
//             },
//             {
//                 title: 'Hüquqlar',
//                 href: APP_URLS.huquqlar(),
//                 roles: [],
//                 permissionKey: ['permission/getAll'],
//                 show: true,
//             },
//         ],
//     },
// ];

export const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
    home: MenuHomeIcon,
    reports: MenuReportIcon,
    folder: MenuCatalogIcon,
    foldertable: MenuAdditionalReportIcon,
    organizations: MenuCompanyIcon,
};

export const getIconById = (id?: string) => {
    return id ? iconMap[id] : undefined;
};

export const SettingsNavigationLinks = [
    {
        href: '/' + SETTINGS_URL.interfaceSettings(),
        title: 'İnterfeys tənzimləmələri',
        Icon: <GridIcon width={14} height={14} />,
    },
    {
        href: '/' + SETTINGS_URL?.visualSettings(),
        title: 'Vizual tənzimləmələr',
        Icon: <PaintBucketIcon width={14} height={14} />,
    },
    {
        href: '/' + SETTINGS_URL.typography(),
        title: 'Mətn',
        Icon: <FontSizeIcon width={14} height={14} />,
    },
    {
        href: '/' + SETTINGS_URL.personalizationMenu(),
        title: 'Fərdiləşdirmə menyusu',
        Icon: <FilterIcon1 width={14} height={14} />,
    },
];

export const DefaultThemes: Theme[] = [
    {
        name: 'Light',
        type: 'light',
        id: '1',
        primary: {
            50: '220, 44%, 95%' /* #E7ECF7 */,
            100: '227, 40%, 81%' /* #B4C3E6 */,
            200: '228, 43%, 71%' /* #90A5DA */,
            300: '221, 52%, 58%' /* #5D7CC9 */,
            400: '221, 52%, 50%' /* #3D63BF */,
            500: '233, 84%, 37%' /* #0D3CAF */,
            600: '231, 85%, 35%' /* #0C379F */,
            700: '231, 83%, 27%' /* #092B7C */,
            800: '230, 82%, 20%' /* #072160 */,
            900: '230, 80%, 15%' /* #05194A */,
        },
        secondary: {
            50: '195, 100%, 97%' /* #F0FBFF */,
            100: '195, 100%, 91%' /* #D1F1FF */,
            200: '195, 100%, 86%' /* #BAEAFF */,
            300: '195, 100%, 80%' /* #9BE1FF */,
            400: '195, 100%, 76%' /* #88DBFF */,
            500: '195, 100%, 70%' /* #6AD2FF */,
            600: '195, 69%, 64%' /* #60BFE8 */,
            700: '195, 41%, 51%' /* #4B95B5 */,
            800: '195, 40%, 39%' /* #3A748C */,
            900: '195, 42%, 30%' /* #2D586B */,
        },
        background: '0 0 100',
        foreground: '0 0 15',
    },
    {
        name: 'Dark',
        type: 'dark',
        id: '2',
        primary: {
            50: '206, 54%, 97%',
            100: '205, 52%, 91%',
            200: '207, 53%, 75%',
            300: '208, 54%, 63%',
            400: '208, 54%, 50%',
            500: '208, 82%, 47%',
            600: '208, 88%, 30%',
            700: '208, 92%, 26%',
            800: '207, 89%, 21%',
            900: '208, 89%, 16%',
        },
        secondary: {
            50: '37, 92%, 95%',
            100: '36, 96%, 90%',
            200: '35, 96%, 80%',
            300: '36, 95%, 68%',
            400: '35, 95%, 62%',
            500: '35, 95%, 54%',
            600: '35, 89%, 47%',
            700: '35, 92%, 29%',
            800: '35, 98%, 20%',
            900: '36, 100%, 10%',
        },
        background: '0 0 15',
        foreground: '0 0 100',
    },
    getSystemTheme() === 'light'
        ? {
              name: 'Sistem',
              type: 'light',
              id: '3',
              primary: {
                  50: '220, 44%, 95%' /* #E7ECF7 */,
                  100: '227, 40%, 81%' /* #B4C3E6 */,
                  200: '228, 43%, 71%' /* #90A5DA */,
                  300: '221, 52%, 58%' /* #5D7CC9 */,
                  400: '221, 52%, 50%' /* #3D63BF */,
                  500: '233, 84%, 37%' /* #0D3CAF */,
                  600: '231, 85%, 35%' /* #0C379F */,
                  700: '231, 83%, 27%' /* #092B7C */,
                  800: '230, 82%, 20%' /* #072160 */,
                  900: '230, 80%, 15%' /* #05194A */,
              },
              secondary: {
                  50: '195, 100%, 97%' /* #F0FBFF */,
                  100: '195, 100%, 91%' /* #D1F1FF */,
                  200: '195, 100%, 86%' /* #BAEAFF */,
                  300: '195, 100%, 80%' /* #9BE1FF */,
                  400: '195, 100%, 76%' /* #88DBFF */,
                  500: '195, 100%, 70%' /* #6AD2FF */,
                  600: '195, 69%, 64%' /* #60BFE8 */,
                  700: '195, 41%, 51%' /* #4B95B5 */,
                  800: '195, 40%, 39%' /* #3A748C */,
                  900: '195, 42%, 30%' /* #2D586B */,
              },
              background: '0 0 100',
              foreground: '0 0 15',
          }
        : {
              name: 'Sistem',
              type: 'dark',
              id: '3',
              primary: {
                  50: '206, 54%, 97%',
                  100: '205, 52%, 91%',
                  200: '207, 53%, 75%',
                  300: '208, 54%, 63%',
                  400: '208, 54%, 50%',
                  500: '208, 82%, 47%',
                  600: '208, 88%, 30%',
                  700: '208, 92%, 26%',
                  800: '207, 89%, 21%',
                  900: '208, 89%, 16%',
              },
              secondary: {
                  50: '37, 92%, 95%',
                  100: '36, 96%, 90%',
                  200: '35, 96%, 80%',
                  300: '36, 95%, 68%',
                  400: '35, 95%, 62%',
                  500: '35, 95%, 54%',
                  600: '35, 89%, 47%',
                  700: '35, 92%, 29%',
                  800: '35, 98%, 20%',
                  900: '36, 100%, 10%',
              },
              background: '0 0 15',
              foreground: '0 0 100',
          },
];

export const PermissionSizes = {
    fontSize: {
        min: '14px',
        max: '20px',
    },

    letterSpacing: {
        min: '-0.04em',
        max: '0.3em',
    },
} as const;

export type SidebarSizeOption = 'small' | 'normal' | 'large';
export type NavbarSizeOption = 'small' | 'normal' | 'large';

export interface TypographyState {
    fontSize: string;
    letterSpacing: string;
    highlightLinks: boolean;
    highlightTitles: boolean;
}

export interface SizesState {
    sidebarSize: SidebarSizeOption;
    navbarSize: NavbarSizeOption;
}

export const DefaultSizes = {
    // əvvəlki %/px mapping yeri
    // indi birbaşa keyword saxlayırıq
    sidebarSize: 'normal',
    navbarSize: 'normal',
    fontSize: '16px',
    letterSpacing: '0.00em',
    highlightLinks: false,
    highlightTitles: false,
};

type CursorSizeState = {
    cursorSize: number;
    minSize: number;
    maxSize: number;
    step: number;
};

export const DefaultAlign: ViewAndContentState & CursorSizeState = {
    cursorVariant: 'default',
    cursorSize: 16,
    minSize: 16,
    maxSize: 32,
    step: 4,
};

export const DefaultLayoutNavbar: LayoutState = {
    position: 'left',
    pinned: false,
    openWithButton: true,
    openWithHover: false,
    alwaysOpen: false,
    zoom: 'normal',
};
