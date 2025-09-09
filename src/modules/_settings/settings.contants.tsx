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
        name: 'Default',
        id: '1',
        isSystemDefault: true,
        primary: {
            100: '#e7eefd',
            200: '#a0b9f8',
            300: '#5985f3',
            400: '#1b58ee',
            500: '#0d3caf',
            600: '#092a7b',
            700: '#061d55',
            800: '#04153e',
            900: '#031030',
        },
        secondary: {
            100: '#ffffff',
            200: '#ffffff',
            300: '#ffffff',
            400: '#ffffff',
            500: '#ecedee',
            600: '#abb0b5',
            700: '#5b6167',
            800: '#484c51',
            900: '#292b2e',
        },
        yellow: {
            100: '#fdf4e0',
            200: '#fbeac1',
            300: '#f8dfa2',
            400: '#f6d583',
            500: '#f4ca64',
            600: '#c3a250',
            700: '#92793c',
            800: '#625128',
            900: '#312814',
        },
        neutral: {
            50: '#fbfbfb',
            100: '#f3f3f3',
            150: '#ebebeb',
            200: '#cccccc',
            250: '#bfbfbf',
            300: '#b2b2b2',
            350: '#a6a6a6',
            400: '#999999',
            450: '#8c8c8c',
            500: '#808080',
            550: '#737373',
            600: '#666666',
            650: '#595959',
            700: '#4d4d4d',
            750: '#404040',
            800: '#333333',
            850: '#262626',
            900: '#1a1a1a',
            950: '#202020',
            1000: '#0d0d0d',
        },
        green: {
            100: '#d7f3e3',
            200: '#afe6c7',
            300: '#88daaa',
            400: '#60cd8e',
            500: '#38c172',
            600: '#2d9a5b',
            700: '#227444',
            800: '#164d2e',
            900: '#0b2717',
        },
        blue: {
            100: '#d6e6f4',
            200: '#adcde9',
            300: '#83b5de',
            400: '#5a9cd3',
            500: '#3183c8',
            600: '#2769a0',
            700: '#1d4f78',
            800: '#143450',
            900: '#0a1a28',
        },
        red: {
            100: '#fdd9d7',
            200: '#fbb4af',
            300: '#f88e86',
            400: '#f6695e',
            500: '#f44336',
            600: '#c3362b',
            700: '#922820',
            800: '#621b16',
            900: '#310d0b',
        },
        white: {
            50: '#ffffff80',
            12: '#ffffff1f',
        },
        black: {
            50: '#00000080',
            12: '#0000001f',
        },
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
