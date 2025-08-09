const BASE_URL = import.meta.env.VITE_BASE_URL;

const GATEWAY = {
    auth: `${BASE_URL}/auth/Auth`,
    permission: `${BASE_URL}/permission/Permissions`,
    organization: `${BASE_URL}/afmis/Organization`,
    report: `${BASE_URL}/afmis/Report`,
    detail: `${BASE_URL}/afmis/Detail`,
    notifications: `${BASE_URL}/afmis/Notifications`,
    user: `${BASE_URL}/afmis/User`,
    excel: `${BASE_URL}/afmis/Excel`,
    fakeEndpoints: `${BASE_URL}/afmis/FakeEndpoints`,
    config: `${BASE_URL}/afmis/Config`,
    filter: `${BASE_URL}/afmis/Filter`,
} as const;

const API_CONTROLLER = {
    auth: (url = '') => `${GATEWAY.auth}${url}`,
    permission: (url = '') => `${GATEWAY.permission}${url}`,
    organization: (url = '') => `${GATEWAY.organization}${url}`,
    report: (url = '') => `${GATEWAY.report}${url}`,
    detail: (url = '') => `${GATEWAY.detail}${url}`,
    notifications: (url = '') => `${GATEWAY.notifications}${url}`,
    user: (url = '') => `${GATEWAY.user}${url}`,
    excel: (url = '') => `${GATEWAY.excel}${url}`,
    fakeEndpoints: (url = '') => `${GATEWAY.fakeEndpoints}${url}`,
    config: (url = '') => `${GATEWAY.config}${url}`,
    filter: (url = '') => `${GATEWAY.filter}${url}`,
};

export default API_CONTROLLER;
