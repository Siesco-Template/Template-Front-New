import { APP_URLS } from '@/services/config/url.config';

export const SETTINGS_URL = {
    root: (url = '', urlParams = {}) => APP_URLS.root('settings' + url, urlParams),
    visualSettings: (url = '', urlParams = {}) => SETTINGS_URL.root('/vizual-tenzimlemeler' + url, urlParams),
    typography: (url = '', urlParams = {}) => SETTINGS_URL.root('/metn' + url, urlParams),
    interfaceSettings: (url = '', urlParams = {}) => SETTINGS_URL.root('/interfeys-tenzimlemeler' + url, urlParams),
    personalizationMenu: (url = '', urlParams = {}) => SETTINGS_URL.root('/ferdilesdirme-menyusu' + url, urlParams),
};
