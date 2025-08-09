import { httpRequest } from '../api/httpsRequest';
import API_CONTROLLER from '../config/api.config';

class FakeEndpointsService {
    private detailUrl = (endpoint = '') => API_CONTROLLER.fakeEndpoints(endpoint);

    async getAllInvestmentReports() {
        return httpRequest(this.detailUrl('/GetAllInvestmentReports'), {
            method: 'GET',
        });
    }

    async getAllFinancialReports() {
        return httpRequest(this.detailUrl('/GetAllFinancialReports'), {
            method: 'GET',
        });
    }

    async getAllPurchaseInformation() {
        return httpRequest(this.detailUrl('/GetAllPurchaseInformation'), {
            method: 'GET',
        });
    }

    async getAllMinistryOfFinanceReports() {
        return httpRequest(this.detailUrl('/GetAllMinistryOfFinanceReports'), {
            method: 'GET',
        });
    }

    async getAllComparisonReports() {
        return httpRequest(this.detailUrl('/GetAllComparisonReports'), {
            method: 'GET',
        });
    }

    async getAllOtherInternalReports() {
        return httpRequest(this.detailUrl('/GetAllOtherInternalReports'), {
            method: 'GET',
        });
    }

    async getAllOrganizations() {
        return httpRequest(this.detailUrl('/GetAllOrganizations'), {
            method: 'GET',
        });
    }

    async getDashboard() {
        return httpRequest(this.detailUrl('/GetDashboard'), {
            method: 'GET',
        });
    }

    async getBiAnalitika() {
        return httpRequest(this.detailUrl('/GetBiAnalitika'), {
            method: 'GET',
        });
    }

    async getAllCatalogs() {
        return httpRequest(this.detailUrl('/GetAllCatalogs'), {
            method: 'GET',
        });
    }
}

export const fakeEndpointsService = new FakeEndpointsService();
