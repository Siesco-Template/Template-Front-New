import { IUser, useAuthStore } from '@/store/authStore';

import { httpRequest } from '@/services/api/httpsRequest';
import API_CONTROLLER from '@/services/config/api.config';

import {
    ChangePasswordBody,
    CheckUserExistQuery,
    CreateUserBody,
    GetAllUsersQuery,
    GetAllUsersResponse,
    LoginBody,
    RegisterBody,
    ResetPasswordBody,
    SetPasswordBody,
    ToggleBlockUserBody,
    UpdateUserBody,
} from './auth.service.types';

class AuthService {
    authUrl = (endpoint = '') => API_CONTROLLER.auth(endpoint);
    userUrl = (endpoint = '') => API_CONTROLLER.user(endpoint);

    async changePassword(body: ChangePasswordBody) {
        return httpRequest(this.authUrl('/ChangePassword'), {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    async checkUserExist(queryParams: CheckUserExistQuery) {
        return httpRequest(this.authUrl('/CheckUserExist'), {
            method: 'GET',
            queryParams,
        });
    }

    async createUser(body: CreateUserBody) {
        return httpRequest(this.authUrl('/CreateUser'), {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    async forgetPassword(email: string) {
        return httpRequest(this.authUrl('/ForgetPassword'), {
            method: 'POST',
            queryParams: { email },
        });
    }

    async generatePassword() {
        return httpRequest<string>(this.authUrl('/GeneratePassword'), {
            method: 'GET',
        });
    }

    async getAllUsersForPermission() {
        return httpRequest(this.authUrl('/GetAllUsersForPermission'), {
            method: 'GET',
        });
    }

    async getUserDetail(userId: string) {
        return httpRequest(this.authUrl('/GetUserDetail'), {
            method: 'GET',
            queryParams: { userId },
        });
    }

    async login(body: LoginBody) {
        return httpRequest<IUser>(this.authUrl('/Login'), {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    async loginWithRefreshToken() {
        const {
            user: { accessToken, refreshToken },
            login,
        } = useAuthStore.getState();

        if (!accessToken) return null;

        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 100);

        try {
            const response = await httpRequest<IUser>(this.authUrl('/LoginWithRefreshToken'), {
                method: 'POST',
                queryParams: { refreshToken },
            });

            if (!response?.accessToken) {
                console.error('Access Token alınmadı, Refresh Token uğursuz oldu.');
                return null;
            }

            login(response);
            return response.accessToken;
        } catch (error) {
            console.error('Refresh Token uğursuz oldu:', error);
            return null;
        }
    }

    async register(body: RegisterBody) {
        return httpRequest(this.authUrl('/Register'), {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    async resetPassword(body: ResetPasswordBody) {
        return httpRequest(this.authUrl('/ResetPassword'), {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    async setPassword(body: SetPasswordBody) {
        return httpRequest(this.authUrl('/SetPassword'), {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    async toggleBlockUser(body: ToggleBlockUserBody) {
        return httpRequest(this.authUrl('/ToggleBlockUser'), {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    async updateUser(body: UpdateUserBody) {
        return httpRequest(this.authUrl('/UpdateUser'), {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    async getAllUsers<T>(queryParams: GetAllUsersQuery<T>) {
        return httpRequest<GetAllUsersResponse<T>>(this.userUrl('/GetAllUsers'), {
            method: 'GET',
            queryParams,
        });
    }

    async deleteUser(userId: string) {
        return httpRequest<IUser>(this.authUrl('/DeleteUser'), {
            method: 'DELETE',
            queryParams: { userId },
        });
    }

    async getProfile() {
        return httpRequest<IUser>(this.authUrl('/GetProfile'), {
            method: 'GET',
        });
    }

    async updateProfile(body: { firstName: string; lastName: string; phoneNumber: string; email: string }) {
        return httpRequest<IUser>(this.authUrl('/UpdateProfile'), {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }
}

export const authService = new AuthService();
