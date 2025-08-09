import { httpRequest } from '../api/httpsRequest';
import { IUser } from '../auth/auth.service.types';
import API_CONTROLLER from '../config/api.config';
import { IFilterData } from './user.service.types';

class UserService {
    permissionUrl = (endpoint = '') => API_CONTROLLER.user(endpoint);

    async getAllUsers(filterData: IFilterData) {
        return httpRequest<{ datas: IUser[]; totalCount: number }>(this.permissionUrl('/GetAllUsers'), {
            method: 'GET',
            queryParams: filterData,
        });
    }
}

export const userService = new UserService();
