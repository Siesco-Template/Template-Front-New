const BASE_URL = import.meta.env.VITE_BASE_URL;

const GATEWAY = {
    auth: `${BASE_URL}/auth/Auth`,
    permission: `${BASE_URL}/permission/Permissions`,
    user: `${BASE_URL}/afmis/User`,
    excel: `${BASE_URL}/Excel`,
    fakeEndpoints: `${BASE_URL}/auth/FakeEndpoints`,
    config: `${BASE_URL}/auth/Config`,
    filter: `${BASE_URL}/auth/Filter`,
} as const;

const API_CONTROLLER = {
    auth: (url = '') => `${GATEWAY.auth}${url}`,
    permission: (url = '') => `${GATEWAY.permission}${url}`,
    user: (url = '') => `${GATEWAY.user}${url}`,
    excel: (url = '') => `${GATEWAY.excel}${url}`,
    fakeEndpoints: (url = '') => `${GATEWAY.fakeEndpoints}${url}`,
    config: (url = '') => `${GATEWAY.config}${url}`,
    filter: (url = '') => `${GATEWAY.filter}${url}`,
};

export default API_CONTROLLER;
