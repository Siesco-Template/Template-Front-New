import { useAuthStore } from '@/store/authStore';

import { authService } from '../auth/auth.service';

export type Error = {
    status: number;
    data: {
        message: string;
    };
};

export async function httpRequest<T>(
    url: string,
    options: RequestInit & { queryParams?: Record<string, any>; filterParams?: Record<string, any> }
): Promise<T | undefined> {
    const { logout, user: { accessToken, ...user } = {} } = useAuthStore.getState();
    const filterParamString = options?.filterParams
        ? 'filterData=' + encodeURIComponent(JSON.stringify(options.filterParams))
        : undefined;
    const queryData = { ...options.queryParams };
    if (filterParamString) {
        queryData.filterData = filterParamString;
    }

    const isFormData = options.body instanceof FormData;
    const queryString = options.queryParams && new URLSearchParams(queryData).toString();
    const fullFetchUrl = queryString && queryString.length > 0 ? `${url}?${queryString}` : url;

    const fetchData = async (accessToken: string | null) => {
        const response = await fetch(fullFetchUrl, {
            ...options,
            headers: {
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
                ...options.headers,
            },
        });

        if (response.status === 401) {
            console.warn('Token müddəti bitdi və ya etibarsızdır.');
            const newToken = await authService.refreshToken();

            if (newToken) {
                return fetchData(newToken);
            } else {
                logout();
                return undefined;
            }
        }

        if (!response.ok) {
            let errorBody;
            try {
                errorBody = await response.json();
            } catch {
                errorBody = { message: 'Xəta baş verdi.' };
            }

            throw {
                status: response.status,
                data: errorBody,
            };
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return response.json();
        }

        return undefined;
    };

    return fetchData(accessToken || null);
}
