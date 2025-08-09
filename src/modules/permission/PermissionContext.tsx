import { FC, PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';

import { useAuthStore } from '@/store/authStore';

import { permissionService } from '@/services/permission/permission.service';
import { UserPermissions } from '@/services/permission/permission.service.types';

import { PermissionContextType } from './permission.types';

const PermissionContext = createContext<PermissionContextType>({
    isLoading: true,
    permissions: null,
});

export const PermissionProvider: FC<PropsWithChildren> = ({ children }) => {
    const [requestStatus, setRequestStatus] = useState('pending');
    const [permissionData, setPermissionData] = useState<UserPermissions | undefined>(undefined);
    const { user } = useAuthStore();

    const getCurrentUserPermissions = async () => {
        try {
            setRequestStatus('pending');
            const response = await permissionService.getCurrentUserPermissions();

            if (response) {
                setPermissionData(response);
            }
        } catch (error) {
            console.error('Error on getCurrentUserPermissions', error);
        } finally {
            setRequestStatus('initial');
        }
    };

    useEffect(() => {
        if (!user) {
            setPermissionData(undefined);
            setRequestStatus('initial');
            return;
        }
        getCurrentUserPermissions();
    }, [user]);

    return (
        <PermissionContext.Provider
            value={{
                isLoading: requestStatus === 'pending',
                permissions: permissionData?.permissions ?? null,
            }}
        >
            {children}
        </PermissionContext.Provider>
    );
};

export const usePermission = () => {
    const context = useContext(PermissionContext);
    if (!context) {
        throw new Error('usePermission should be use in PermissionProvider');
    }
    return context;
};
