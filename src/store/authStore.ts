import Cookies from 'universal-cookie';
import { create } from 'zustand';

import { UserRole } from '@/shared/constants/enums';

export type IUser = {
    userId: string;
    fullName: string;
    userRole: UserRole;
    accessToken: string;
    expires: string;
    refreshToken: string;
};

type AuthState = {
    user: IUser;
    login: (user: IUser) => void;
    logout: () => void;
};

const cookies = new Cookies();

export const useAuthStore = create<AuthState>((set) => ({
    user: (cookies.get('user') as AuthState['user']) || undefined,
    login: (user) => {
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 100);
        cookies.set('user', user, { expires: futureDate });
        set({ user });
    },
    logout: () => {
        cookies.remove('user', { path: '/' });
        set({ user: undefined });
    },
}));
