import { IUser as UserResponse, useAuthStore } from '@/store/authStore';

import { httpRequest } from '../api/httpsRequest';
import API_CONTROLLER from '../config/api.config';
import { IBlockUserFormData, ICreateUserBody, IUpdateUserBody, IUser } from './auth.service.types';

class AuthService {
    authUrl = (endpoint = '') => API_CONTROLLER.auth(endpoint);

    async refreshToken() {
        const {
            user: { accessToken, refreshToken },
            login,
            logout,
        } = useAuthStore.getState();

        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 100);

        if (!accessToken) return null;

        try {
            const response = await httpRequest<UserResponse>(this.authUrl('/LoginWithRefreshToken'), {
                method: 'POST',
                queryParams: { refreshToken: refreshToken },
            });

            if (response?.accessToken) {
                login(response);
                return response.accessToken;
            }
        } catch (error) {
            console.error('Refresh Token uğursuz oldu:', error);
            logout();
        }
        return null;
    }

    async getUserDetail(userId: string) {
        return httpRequest<IUser>(this.authUrl('/GetUserDetail'), {
            method: 'GET',
            queryParams: { userId },
        });
    }

    async createUser(user: ICreateUserBody) {
        return httpRequest<IUser>(this.authUrl('/CreateUser'), {
            method: 'POST',
            body: JSON.stringify(user),
        });
    }

    async updateUser(user: IUpdateUserBody) {
        return httpRequest<IUser>(this.authUrl('/UpdateUser'), {
            method: 'PUT',
            body: JSON.stringify(user),
        });
    }

    async toggleBlockUser(data: IBlockUserFormData) {
        return httpRequest<IUser>(this.authUrl('/ToggleBlockUser'), {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async deleteUser(userId: string) {
        return httpRequest<IUser>(this.authUrl('/DeleteUser'), {
            method: 'DELETE',
            queryParams: { userId },
        });
    }

    async resetPassword(userId: string, newPassword: string) {
        return httpRequest<IUser>(this.authUrl('/ResetPassword'), {
            method: 'PUT',
            body: JSON.stringify({
                userId,
                newPassword,
            }),
        });
    }
}

export const authService = new AuthService();
