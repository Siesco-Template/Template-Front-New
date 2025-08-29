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
        name: 'Light',
        type: 'light',
        id: '1',
        content: {
            primary: 'var(--clr-neutral-900)',
            secondary: 'var(--clr-neutral-800)',
            tertiary: 'var(--clr-neutral-600)',
            'primary-inverse': 'var(--clr-white)',
            'secondary-inverse': 'var(--clr-neutral-100)',
            'tertiary-inverse': 'var(--clr-neutral-300)',
            disabled: 'var(--clr-neutral-350)',
            'brand-light': 'var(--clr-primary-100)',
            brand: 'var(--clr-primary-500)',
            'brand-bold': 'var(--clr-primary-700)',
            'secondary-brand': 'var(--clr-secondary-500)',
            'secondary-brand-bold': 'var(--clr-secondary-800)',
            'inverse-secondary-brand-bold': 'var(--clr-secondary-500)',
            link: 'var(--clr-blue-500)',
            'link-secondary': 'var(--clr-blue-600)',
            'link-tertiary': 'var(--clr-blue-700)',
            notice: 'var(--clr-yellow-500)',
            'notice-bold': 'var(--clr-yellow-700)',
            negative: 'var(--clr-red-500)',
            'negative-bold': 'var(--clr-red-600)',
            positive: 'var(--clr-green-500)',
            'positive-bold': 'var(--clr-green-600)',
        },
        background: {
            primary: 'var(--clr-white)',
            secondary: 'var(--clr-neutral-100)',
            tertiary: 'var(--clr-neutral-150)',
            subtle: 'var(--clr-neutral-200)',
            strong: 'var(--clr-neutral-250)',
            selected: 'var(--clr-primary-100)',
            'secondary-selected': 'var(--clr-secondary-100)',
            disabled: 'var(--clr-neutral-100)',
            inverse: 'var(--clr-neutral-900)',
            'primary-inverse-50': 'var(--clr-black-50)',
            'primary-inverse-20': 'var(--clr-black-12)',
            'primary-50': 'var(--clr-white-50)',
            'primary-20': 'var(--clr-white-12)',
            brand: 'var(--clr-primary-500)',
            'brand-hover': 'var(--clr-primary-600)',
            'brand-pressed': 'var(--clr-primary-700)',
            'secondary-brand': 'var(--clr-secondary-500)',
            'secondary-brand-hover': 'var(--clr-secondary-600)',
            'secondary-brand-pressed': 'var(--clr-secondary-800)',
            info: 'var(--clr-blue-500)',
            'info-subtle': 'var(--clr-blue-100)',
            notice: 'var(--clr-yellow-500)',
            'notice-subtle': 'var(--clr-yellow-100)',
            negative: 'var(--clr-red-500)',
            'negative-subtle': 'var(--clr-red-100)',
            positive: 'var(--clr-green-500)',
            'positive-subtle': 'var(--clr-green-100)',
        },
        border: {
            primary: 'var(--clr-neutral-600)',
            secondary: 'var(--clr-neutral-400)',
            tertiary: 'var(--clr-neutral-200)',
            subtle: 'var(--clr-neutral-150)',
            strong: 'var(--clr-neutral-100)',
            disabled: 'var(--clr-neutral-200)',
            brand: 'var(--clr-primary-500)',
            'secondary-brand': 'var(--clr-secondary-500)', // new
            inverse: 'var(--clr-white)',
            focus: 'var(--clr-primary-500)',
            'secondary-focus': 'var(--clr-secondary-500)', // new
            info: 'var(--clr-blue-500)',
            positive: 'var(--clr-green-500)',
            notice: 'var(--clr-yellow-500)',
            negative: 'var(--clr-red-500)',
        },
    },
    {
        name: 'Dark',
        type: 'dark',
        id: '2',
        content: {
            primary: 'var(--clr-white)',
            secondary: 'var(--clr-neutral-100)',
            tertiary: 'var(--clr-neutral-300)',
            'primary-inverse': 'var(--clr-neutral-900)',
            'secondary-inverse': 'var(--clr-neutral-800)',
            'tertiary-inverse': 'var(--clr-neutral-600)',
            disabled: 'var(--clr-neutral-600)',
            'brand-light': 'var(--clr-primary-100)',
            brand: 'var(--clr-primary-100)',
            'brand-bold': 'var(--clr-primary-100)',
            'secondary-brand': 'var(--clr-secondary-100)',
            'secondary-brand-bold': 'var(--clr-secondary-100)',
            'inverse-secondary-brand-bold': 'var(--clr-secondary-700)',
            link: 'var(--clr-blue-400)',
            'link-secondary': 'var(--clr-blue-300)',
            'link-tertiary': 'var(--clr-blue-200)',
            notice: 'var(--clr-yellow-400)',
            'notice-bold': 'var(--clr-yellow-300)',
            negative: 'var(--clr-red-400)',
            'negative-bold': 'var(--clr-red-300)',
            positive: 'var(--clr-green-400)',
            'positive-bold': 'var(--clr-green-300)',
        },
        background: {
            primary: 'var(--clr-neutral-900)',
            secondary: 'var(--clr-neutral-800)',
            tertiary: 'var(--clr-neutral-700)',
            subtle: 'var(--clr-neutral-650)',
            strong: 'var(--clr-neutral-600)',
            selected: 'var(--clr-primary-800)',
            'secondary-selected': 'var(--clr-secondary-800)',
            disabled: 'var(--clr-neutral-800)',
            inverse: 'var(--clr-white)',
            'primary-inverse-50': 'var(--clr-white-50)',
            'primary-inverse-20': 'var(--clr-white-12)',
            'primary-50': 'var(--clr-black-50)',
            'primary-20': 'var(--clr-black-12)',
            brand: 'var(--clr-primary-400)',
            'brand-hover': 'var(--clr-primary-300)',
            'brand-pressed': 'var(--clr-primary-200)',
            'secondary-brand': 'var(--clr-secondary-700)',
            'secondary-brand-hover': 'var(--clr-secondary-300)',
            'secondary-brand-pressed': 'var(--clr-secondary-200)',
            info: 'var(--clr-blue-400)',
            'info-subtle': 'var(--clr-blue-800)',
            notice: 'var(--clr-yellow-400)',
            'notice-subtle': 'var(--clr-yellow-800)',
            negative: 'var(--clr-red-400)',
            'negative-subtle': 'var(--clr-red-800)',
            positive: 'var(--clr-green-400)',
            'positive-subtle': 'var(--clr-green-800)',
        },
        border: {
            primary: 'var(--clr-neutral-400)',
            secondary: 'var(--clr-neutral-600)',
            tertiary: 'var(--clr-neutral-800)',
            subtle: 'var(--clr-neutral-850)',
            strong: 'var(--clr-neutral-900)',
            disabled: 'var(--clr-neutral-700)',
            brand: 'var(--clr-primary-400)',
            'secondary-brand': 'var(--clr-secondary-200)',
            inverse: 'var(--clr-neutral-900)',
            focus: 'var(--clr-primary-400)',
            'secondary-focus': 'var(--clr-secondary-400)',
            info: 'var(--clr-blue-400)',
            positive: 'var(--clr-green-400)',
            notice: 'var(--clr-yellow-400)',
            negative: 'var(--clr-red-400)',
        },
    },
    getSystemTheme() === 'light'
        ? {
              name: 'Sistem',
              type: 'light',
              id: '3',
              content: {
                  primary: 'var(--clr-neutral-900)',
                  secondary: 'var(--clr-neutral-800)',
                  tertiary: 'var(--clr-neutral-600)',
                  'primary-inverse': 'var(--clr-white)',
                  'secondary-inverse': 'var(--clr-neutral-100)',
                  'tertiary-inverse': 'var(--clr-neutral-300)',
                  disabled: 'var(--clr-neutral-350)',
                  'brand-light': 'var(--clr-primary-100)',
                  brand: 'var(--clr-primary-500)',
                  'brand-bold': 'var(--clr-primary-700)',
                  'secondary-brand': 'var(--clr-secondary-500)',
                  'secondary-brand-bold': 'var(--clr-secondary-800)',
                  'inverse-secondary-brand-bold': 'var(--clr-secondary-500)',
                  link: 'var(--clr-blue-500)',
                  'link-secondary': 'var(--clr-blue-600)',
                  'link-tertiary': 'var(--clr-blue-700)',
                  notice: 'var(--clr-yellow-500)',
                  'notice-bold': 'var(--clr-yellow-700)',
                  negative: 'var(--clr-red-500)',
                  'negative-bold': 'var(--clr-red-600)',
                  positive: 'var(--clr-green-500)',
                  'positive-bold': 'var(--clr-green-600)',
              },
              background: {
                  primary: 'var(--clr-white)',
                  secondary: 'var(--clr-neutral-100)',
                  tertiary: 'var(--clr-neutral-150)',
                  subtle: 'var(--clr-neutral-200)',
                  strong: 'var(--clr-neutral-250)',
                  selected: 'var(--clr-primary-100)',
                  'secondary-selected': 'var(--clr-secondary-100)',
                  disabled: 'var(--clr-neutral-100)',
                  inverse: 'var(--clr-neutral-900)',
                  'primary-inverse-50': 'var(--clr-black-50)',
                  'primary-inverse-20': 'var(--clr-black-12)',
                  'primary-50': 'var(--clr-white-50)',
                  'primary-20': 'var(--clr-white-12)',
                  brand: 'var(--clr-primary-500)',
                  'brand-hover': 'var(--clr-primary-600)',
                  'brand-pressed': 'var(--clr-primary-700)',
                  'secondary-brand': 'var(--clr-secondary-500)',
                  'secondary-brand-hover': 'var(--clr-secondary-600)',
                  'secondary-brand-pressed': 'var(--clr-secondary-800)',
                  info: 'var(--clr-blue-500)',
                  'info-subtle': 'var(--clr-blue-100)',
                  notice: 'var(--clr-yellow-500)',
                  'notice-subtle': 'var(--clr-yellow-100)',
                  negative: 'var(--clr-red-500)',
                  'negative-subtle': 'var(--clr-red-100)',
                  positive: 'var(--clr-green-500)',
                  'positive-subtle': 'var(--clr-green-100)',
              },
              border: {
                  primary: 'var(--clr-neutral-600)',
                  secondary: 'var(--clr-neutral-400)',
                  tertiary: 'var(--clr-neutral-200)',
                  subtle: 'var(--clr-neutral-150)',
                  strong: 'var(--clr-neutral-100)',
                  disabled: 'var(--clr-neutral-200)',
                  brand: 'var(--clr-primary-500)',
                  'secondary-brand': 'var(--clr-secondary-500)', // new
                  inverse: 'var(--clr-white)',
                  focus: 'var(--clr-primary-500)',
                  'secondary-focus': 'var(--clr-secondary-500)', // new
                  info: 'var(--clr-blue-500)',
                  positive: 'var(--clr-green-500)',
                  notice: 'var(--clr-yellow-500)',
                  negative: 'var(--clr-red-500)',
              },
          }
        : {
              name: 'Sistem',
              type: 'dark',
              id: '3',
              content: {
                  primary: 'var(--clr-white)',
                  secondary: 'var(--clr-neutral-100)',
                  tertiary: 'var(--clr-neutral-300)',
                  'primary-inverse': 'var(--clr-neutral-900)',
                  'secondary-inverse': 'var(--clr-neutral-800)',
                  'tertiary-inverse': 'var(--clr-neutral-600)',
                  disabled: 'var(--clr-neutral-600)',
                  'brand-light': 'var(--clr-primary-100)',
                  brand: 'var(--clr-primary-100)',
                  'brand-bold': 'var(--clr-primary-100)',
                  'secondary-brand': 'var(--clr-secondary-100)',
                  'secondary-brand-bold': 'var(--clr-secondary-100)',
                  'inverse-secondary-brand-bold': 'var(--clr-secondary-700)',
                  link: 'var(--clr-blue-400)',
                  'link-secondary': 'var(--clr-blue-300)',
                  'link-tertiary': 'var(--clr-blue-200)',
                  notice: 'var(--clr-yellow-400)',
                  'notice-bold': 'var(--clr-yellow-300)',
                  negative: 'var(--clr-red-400)',
                  'negative-bold': 'var(--clr-red-300)',
                  positive: 'var(--clr-green-400)',
                  'positive-bold': 'var(--clr-green-300)',
              },
              background: {
                  primary: 'var(--clr-neutral-900)',
                  secondary: 'var(--clr-neutral-800)',
                  tertiary: 'var(--clr-neutral-700)',
                  subtle: 'var(--clr-neutral-650)',
                  strong: 'var(--clr-neutral-600)',
                  selected: 'var(--clr-primary-800)',
                  'secondary-selected': 'var(--clr-secondary-800)',
                  disabled: 'var(--clr-neutral-800)',
                  inverse: 'var(--clr-white)',
                  'primary-inverse-50': 'var(--clr-white-50)',
                  'primary-inverse-20': 'var(--clr-white-12)',
                  'primary-50': 'var(--clr-black-50)',
                  'primary-20': 'var(--clr-black-12)',
                  brand: 'var(--clr-primary-400)',
                  'brand-hover': 'var(--clr-primary-300)',
                  'brand-pressed': 'var(--clr-primary-200)',
                  'secondary-brand': 'var(--clr-secondary-700)',
                  'secondary-brand-hover': 'var(--clr-secondary-300)',
                  'secondary-brand-pressed': 'var(--clr-secondary-200)',
                  info: 'var(--clr-blue-400)',
                  'info-subtle': 'var(--clr-blue-800)',
                  notice: 'var(--clr-yellow-400)',
                  'notice-subtle': 'var(--clr-yellow-800)',
                  negative: 'var(--clr-red-400)',
                  'negative-subtle': 'var(--clr-red-800)',
                  positive: 'var(--clr-green-400)',
                  'positive-subtle': 'var(--clr-green-800)',
              },
              border: {
                  primary: 'var(--clr-neutral-400)',
                  secondary: 'var(--clr-neutral-600)',
                  tertiary: 'var(--clr-neutral-800)',
                  subtle: 'var(--clr-neutral-850)',
                  strong: 'var(--clr-neutral-900)',
                  disabled: 'var(--clr-neutral-700)',
                  brand: 'var(--clr-primary-400)',
                  'secondary-brand': 'var(--clr-secondary-200)',
                  inverse: 'var(--clr-neutral-900)',
                  focus: 'var(--clr-primary-400)',
                  'secondary-focus': 'var(--clr-secondary-400)',
                  info: 'var(--clr-blue-400)',
                  positive: 'var(--clr-green-400)',
                  notice: 'var(--clr-yellow-400)',
                  negative: 'var(--clr-red-400)',
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
