import { httpRequest } from '@/services/api/httpsRequest';
import API_CONTROLLER from '@/services/config/api.config';

class FilterService {
    private detailUrl = (endpoint = '') => API_CONTROLLER.filter(endpoint);

    async createFilter(data: any) {
        return httpRequest<any>(this.detailUrl('/CreateFilter'), {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async getFiltersByTableId(tableId: string) {
        return httpRequest<any>(this.detailUrl('/GetFiltersByTableId'), {
            method: 'GET',
            queryParams: { tableId },
        });
    }

    async getFilterById(filterId: string) {
        return httpRequest<any>(this.detailUrl('/GetFilterById'), {
            method: 'GET',
            queryParams: { filterId },
        });
    }

    async deleteFilter(filterId: string) {
        return httpRequest<any>(this.detailUrl('/DeleteFilter'), {
            method: 'DELETE',
            queryParams: { filterId },
        });
    }

    async setDefaultFilter(filterId: string) {
        return httpRequest<any>(this.detailUrl('/SetDefaultFilter'), {
            method: 'PUT',
            queryParams: { filterId },
        });
    }

    async removeDefaultFilter(filterId: string) {
        return httpRequest<any>(this.detailUrl('/RemoveDefaultFilter'), {
            method: 'PUT',
            queryParams: { filterId },
        });
    }

    async updateFilter(data: any, filterId: string) {
        return httpRequest<any>(this.detailUrl('/UpdateFilter'), {
            method: 'PUT',
            queryParams: { filterId },
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async getDefaultFilter(tableId: string) {
        return httpRequest<any>(this.detailUrl('/GetDefaultFilter'), {
            method: 'GET',
            queryParams: { tableId },
        });
    }
}

export const filterService = new FilterService();
