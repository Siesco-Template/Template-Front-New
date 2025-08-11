import { queryParamsBuilder } from '@/shared/utils';

const URL_CREATOR = (url = '', urlParams = {}) => {
    const params = queryParamsBuilder(urlParams);
    return `${url}${params || ''}`;
};

export const APP_URLS = {
    root: (url = '', urlParams = {}) => URL_CREATOR(url, urlParams),

    anaSehife: (url = '', urlParams = {}) => APP_URLS.root('/' + url, urlParams),
    hesabatlar: (url = '', urlParams = {}) => APP_URLS.root('/hesabatlar' + url, urlParams),
    budceHesabatlari: (url = '', urlParams = {}) => APP_URLS.root('/hesabatlar/budce-hesabatlari' + url, urlParams),
    budceHesabatlariYeni: (slug = '', urlParams = {}) =>
        APP_URLS.root(`/hesabatlar/budce-hesabatlari/${slug}/yeni`, urlParams),
    budceHesabatlariEtrafli: (slug = '', urlParams = {}) =>
        APP_URLS.root(`/hesabatlar/budce-hesabatlari/${slug}`, urlParams),
    budceHesabatlariInfo: (slug = ':slug', reportId = ':reportId', urlParams = {}) =>
        APP_URLS.root(`/hesabatlar/budce-hesabatlari/${slug}/info/${reportId}`, urlParams),

    teskilatlar: (url = '', urlParams = {}) => APP_URLS.root('/teskilatlar' + url, urlParams),
    qeydiyyat: (url = '', urlParams = {}) => APP_URLS.root('/teskilatlar/qeydiyyat' + url, urlParams),
    istifadeciler: (url = '', urlParams = {}) => APP_URLS.root('/teskilatlar/istifadeciler' + url, urlParams),
    huquqlar: (url = '', urlParams = {}) => APP_URLS.root('/teskilatlar/huquqlar' + url, urlParams),

    login: (url = '', urlParams = {}) => APP_URLS.root('/login' + url, urlParams),
    register: (url = '', urlParams = {}) => APP_URLS.root('/register' + url, urlParams),
    set_password: (url = '', urlParams = {}) => APP_URLS.root('/set_password' + url, urlParams),
    reset_password: (url = '', urlParams = {}) => APP_URLS.root('/reset_password/:token' + url, urlParams),
    change_password: (url = '', urlParams = {}) => APP_URLS.root('/change_password' + url, urlParams),
    forgot_password: (url = '', urlParams = {}) => APP_URLS.root('/forgot_password' + url, urlParams),
    block_user: (url = '', urlParams = {}) => APP_URLS.root('/block_user' + url, urlParams),
    usersAdmin: (url = '', urlParams = {}) => APP_URLS.root('/usersAdmin' + url, urlParams),

    changePassword: (url = '', urlParams = {}) => APP_URLS.root('/change-password' + url, urlParams),
    forgotPassword: (url = '', urlParams = {}) => APP_URLS.root('/forgotPassword' + url, urlParams),
    newPassword: (url = '', urlParams = {}) => APP_URLS.root('/newPassword' + url, urlParams),
    otp: (url = '', urlParams = {}) => APP_URLS.root('/otp' + url, urlParams),

    notifications: (url = '', urlParams = {}) => APP_URLS.root('/bildirisler' + url, urlParams),
    profile: (url = '', urlParams = {}) => APP_URLS.root('/profil' + url, urlParams),

    components: (url = '', urlParams = {}) => APP_URLS.root('/components' + url, urlParams),
};
