import { httpRequest } from '../api/httpsRequest';
import API_CONTROLLER from '../config/api.config';

class UserService {
    permissionUrl = (endpoint = '') => API_CONTROLLER.user(endpoint);

    async getAllUsers(tableId?: string, queryParams?: Record<string, any>) {
        return httpRequest<any>(API_CONTROLLER.user('/GetAllUsers'), {
            method: 'GET',
            queryParams: {
                tableId,
                ...queryParams,
            },
        });
    }
}

export const userService = new UserService();
