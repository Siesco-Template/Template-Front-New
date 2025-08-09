import { httpRequest } from '../api/httpsRequest';
import API_CONTROLLER from '../config/api.config';

class NotificationService {
    private detailUrl = (endpoint = '') => API_CONTROLLER.notifications(endpoint);

    async getAllNotifications() {
        return httpRequest<any>(this.detailUrl('/GetAllNotifications'), {
            method: 'GET',
        });
    }
}

export const notificationService = new NotificationService();
