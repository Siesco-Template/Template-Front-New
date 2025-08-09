import React, { ReactNode } from 'react';

import { Permission } from '@/services/permission/permission.service.types.js';

import { usePermission } from './PermissionContext.js';

export const hasPermission = (permissions: Permission[] | undefined, permissionKey: string): boolean => {
    // '/, \\, _, -, .' simvollarına görə ayırıb
    // requiredPageKey (entity və ya page adı) yoxlayır
    if (typeof permissionKey !== 'string') {
        throw new Error('permissionKey should be string');
    }
    const [requiredPageKey, requiredAction] = permissionKey.split(/[\/._\-\\]/);
    if (!requiredPageKey || !requiredAction) {
        throw new Error('permissionKey should be correct like a "User/getAll" or "Applications-Edit" or etc');
    }
    const perm = permissions?.find((p) => p.pageKey?.toLowerCase() === requiredPageKey?.toLowerCase());

    if (!perm) return false;
    // requiredAction un həmin page(entity) də varsa yəni userin bunu görməyə və işlətməyə icazəsini yoxlayır
    const actionPermission = perm?.actionKeys?.find((action) =>
        action.toLowerCase()?.includes(requiredAction.toLowerCase())
    );
    return !!actionPermission;
};

interface PermissionGuardProps {
    children: ReactNode;
    permissionKey: string;
}

export const PermissionGuard = ({ children, permissionKey }: PermissionGuardProps) => {
    const { permissions } = usePermission();

    if (!permissions) return null;

    // əgər icazəsi yoxdursa ui görünmür və render olmur
    const userHasPermission = hasPermission(permissions, permissionKey);

    if (!userHasPermission) return null;

    return React.createElement(React.Fragment, null, children);
};
