import { RouterProvider, createHashRouter } from 'react-router';

import { useAuthStore } from '@/store/authStore';

import { usePermission } from '@/modules/permission/PermissionContext';
import { hasPermission } from '@/modules/permission/PermissionGuard';

import { UserRole } from '@/shared/constants/enums';

import ErrorBoundary from './error-boundary';
import NotFoundPage from './not-found';
import { routes } from './routes';

export type Route = {
    path: string;
    isAuth: boolean;
    roles: UserRole[];
    element: JSX.Element;
    children?: Route[];
    roleName?: any;
    permissionKey?: string[];
};

const getRoutes = (): Route[] => {
    const { user } = useAuthStore();
    const { permissions } = usePermission();

    if (!permissions && user) {
        return [];
    }

    const filterRoutesByRoleAndPermission = (routes: Route[], userRole: UserRole): Route[] => {
        const roleFilteredRoutes = routes
            .filter((route) => {
                if (route.roles.length === 0 || userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN)
                    return true;
                return route.roles.includes(userRole);
            })
            .map((route) => ({
                ...route,
                children: route.children ? filterRoutesByRoleAndPermission(route.children, userRole) : undefined,
            }));

        const permissionFilteredRoutes = roleFilteredRoutes.filter((route) => {
            if (!route.permissionKey) return true;
            if (!permissions) return false;
            return route.permissionKey.every((key) => hasPermission(permissions, key));
        });

        return permissionFilteredRoutes;
    };

    return [
        ...filterRoutesByRoleAndPermission(routes, user?.userRole || UserRole.SIMPLE_USER),
        {
            path: '*',
            isAuth: false,
            element: <NotFoundPage />,
            roles: [],
        },
    ];
};

export default function Routing() {
    const routeConfig = getRoutes().map((route) => ({
        ...route,
        errorElement: <ErrorBoundary />,
    }));

    if (routeConfig.length === 0) {
        return null;
    }

    const router = createHashRouter(routeConfig);

    return <RouterProvider router={router} />;
}
