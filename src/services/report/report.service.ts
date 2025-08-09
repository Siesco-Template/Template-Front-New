import { httpRequest } from '../api/httpsRequest';
import API_CONTROLLER from '../config/api.config';

interface ReportDetail {
    detailId: string;
    estimateAmount: number;
    financingAmount: number;
    checkoutAmount: number;
    actualAmount: number;
}

interface CreateReportPayload {
    number: string;
    compileDate: string;
    startDate: string;
    endDate: string;
    term: number;
    organizationId: string;
    reportDetails: ReportDetail[];
}

class ReportService {
    private reportUrl = (endpoint = '') => API_CONTROLLER.report(endpoint);

    async createReport(body: CreateReportPayload) {
        return httpRequest<any>(this.reportUrl('/CreateReport'), {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    async getAllReports(tableId?: string, columns?: string, queryParams?: Record<string, any>) {
        return httpRequest<any>(API_CONTROLLER.report('/GetAllReports'), {
            method: 'GET',
            queryParams: {
                tableId,
                columns,
                ...queryParams,
            },
        });
    }

    async getReportById(reportId: string) {
        return httpRequest<any>(API_CONTROLLER.report('/GetReportById'), {
            method: 'GET',
            queryParams: {
                reportId,
            },
        });
    }
}

export const reportService = new ReportService();
