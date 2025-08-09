import { httpRequest } from '../api/httpsRequest';
import API_CONTROLLER from '../config/api.config';

class DetailService {
    private detailUrl = (endpoint = '') => API_CONTROLLER.detail(endpoint);

    async getAllDetails() {
        return httpRequest<any>(this.detailUrl('/GetAllDetails'), {
            method: 'GET',
        });
    }
}

export const detailService = new DetailService();
