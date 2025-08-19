import { UserRole } from '@/shared/constants/enums';

export interface ChangePasswordBody {
    oldPassword: string;
    newPassword: string;
    newConfirmPassword: string;
}

export interface CheckUserExistQuery {
    email: string;
    phoneNumber: string;
}

export interface CreateUserBody {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    signatureNumber?: string;
    userRole: UserRole;
}

export interface LoginBody {
    emailOrUserName: string;
    password: string;
}

export interface RegisterBody {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
    confirmPassword: string;
    signatureNumber?: string;
}

export interface ResetPasswordBody {
    userId: string;
    newPassword: string;
}

export interface SetPasswordBody {
    token: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface ToggleBlockUserBody {
    userId: string;
    blockInformation: string;
    lockDownDate?: string;
}

export interface UpdateUserBody extends Omit<CreateUserBody, 'signatureNumber'> {
    userId: string;
}

export interface GetAllUsersQuery<T> {
    tableId: string;
    columns: string;
    filters?: Record<string, any>;
    'Pagination.Page'?: number;
    'Pagination.Take'?: number;
    'Pagination.IsInfiniteScroll'?: boolean;
    SortBy?: string;
    SortDirection?: boolean;
}

export interface GetAllUsersResponse<T> {
    items: T[];
    totalCount: number;
    totalPages: number;
    page: number;
    take: number;
}
