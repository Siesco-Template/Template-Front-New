import { Permission } from '@/services/permission/permission.service.types';

export type PermissionContextType = {
    isLoading: boolean;
    permissions: Permission[] | null;
};
