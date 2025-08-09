import { UserRole } from '@/shared/constants/enums';

export interface ILoginBody {
    email: string;
    password: string;
    token?: string;
    accessToken?: string;
    refreshToken?: string;
}
export interface ILoginResponse {
    token?: string;
    user?: { name: string; email: string };
    accessToken?: string;
    refreshToken?: string;
    roleName: string;
}
export interface ITokens {
    accessToken?: string;
    refreshToken?: string;
}

export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    isBlock: boolean;
    appUserRole: UserRole;
}

export interface UserForPermission {
    userId: string;
    fullName: string;
    isBlocked: boolean;
    companyGroupId: string | null;
    adminGroupIds: string[] | null;
}

export interface IUsersFilter {
    userRole: UserRole;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    skip: number;
    take: number;
}

export interface IBlockUserFormData {
    userId: string;
    blockInformation?: string;
    lockDownDate?: string;
}

export interface ICreateUserBody {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    userRole: UserRole;
}

export interface IUpdateUserBody {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    userRole: UserRole;
}
