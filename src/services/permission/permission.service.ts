import { httpRequest } from '../api/httpsRequest';
import API_CONTROLLER from '../config/api.config';
import { PageActions, PermissionUpdateBody, UserPermissions } from './permission.service.types';

class PermissionService {
    permissionUrl = (endpoint = '') => API_CONTROLLER.permission(endpoint);

    async getAllPagesAndActions() {
        return httpRequest<PageActions[]>(this.permissionUrl('/GetAllPagesAndActions'), {
            method: 'GET',
        });
    }

    async getAllUserPermissions(filters: { skip: number; take: number } = { skip: 0, take: 10 }) {
        return httpRequest<{ datas: UserPermissions[]; totalCount: number }>(
            this.permissionUrl('/GetAllUserPermissions'),
            {
                method: 'GET',
                queryParams: filters,
            }
        );
    }

    async updateUserPermissions(body: PermissionUpdateBody[]) {
        return httpRequest<boolean>(this.permissionUrl('/UpdateUserPermissions'), {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    async getCurrentUserPermissions() {
        return httpRequest<UserPermissions>(this.permissionUrl('/GetCurrentUserPermissions'), {
            method: 'GET',
        });
    }

    async getUserPermissionsById(userId: string) {
        return httpRequest<UserPermissions>(this.permissionUrl('/GetUserPermissionsById'), {
            method: 'GET',
            queryParams: { userId },
        });
    }
}

export const permissionService = new PermissionService();
