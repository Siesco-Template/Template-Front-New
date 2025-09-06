import { httpRequest } from '@/services/api/httpsRequest';
import API_CONTROLLER from '@/services/config/api.config';

class CatalogService {
    private detailUrl = (endpoint = '') => API_CONTROLLER.catalog(endpoint);

    async getCatalogsByTableId(tableId: string) {
        return httpRequest<any>(this.detailUrl('/GetCatalogs'), {
            method: 'GET',
            queryParams: { tableId },
        });
    }
}

export const catalogService = new CatalogService();
