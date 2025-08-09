import { httpRequest } from '../api/httpsRequest';
import API_CONTROLLER from '../config/api.config';

interface OrganizationSelectOption {
    id: string;
    name: string;
}

class OrganizationService {
    private organizationUrl = (endpoint = '') => API_CONTROLLER.organization(endpoint);

    async getOrganizationsForSelect(): Promise<OrganizationSelectOption[]> {
        const response = await httpRequest<OrganizationSelectOption[]>(
            this.organizationUrl('/GetOrganizationsForSelect'),
            { method: 'GET' }
        );
        return response || []; 
    }

}

export const organizationService = new OrganizationService();
