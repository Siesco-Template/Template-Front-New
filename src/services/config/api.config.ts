const BASE_URL = import.meta.env.VITE_BASE_URL;

console.log(BASE_URL, 'bbb');

const GATEWAY = {
    auth: `${BASE_URL}/auth/Auth`,
    permission: `${BASE_URL}/permission/Permissions`,
    user: `${BASE_URL}/auth/User`,
    excel: `${BASE_URL}/template/Excel`,
    fakeEndpoints: `${BASE_URL}/template/FakeEndpoints`,
    config: `${BASE_URL}/template/Config`,
    filter: `${BASE_URL}/template/Filter`,
    report: `${BASE_URL}/template/Report`,
} as const;

const API_CONTROLLER = {
    auth: (url = '') => `${GATEWAY.auth}${url}`,
    permission: (url = '') => `${GATEWAY.permission}${url}`,
    user: (url = '') => `${GATEWAY.user}${url}`,
    excel: (url = '') => `${GATEWAY.excel}${url}`,
    fakeEndpoints: (url = '') => `${GATEWAY.fakeEndpoints}${url}`,
    config: (url = '') => `${GATEWAY.config}${url}`,
    filter: (url = '') => `${GATEWAY.filter}${url}`,
    report: (url = '') => `${GATEWAY.report}${url}`,
};

export default API_CONTROLLER;
