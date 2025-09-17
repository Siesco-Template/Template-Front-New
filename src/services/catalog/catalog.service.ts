import { httpRequest } from '@/services/api/httpsRequest';
import API_CONTROLLER from '@/services/config/api.config';

class CatalogService {
    private detailUrl = (endpoint = '') => API_CONTROLLER.catalog(endpoint);

    async getCatalogsByTableId(tableId?: string, queryParams?: Record<string, any>) {
        return httpRequest<any>(this.detailUrl('/GetCatalog'), {
            method: 'GET',
            queryParams: {
                tableId,
                ...queryParams,
            },
        });
    }
}

export const catalogService = new CatalogService();
