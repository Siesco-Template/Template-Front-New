import { httpRequest } from "@/services/api/httpsRequest";
import API_CONTROLLER from "@/services/config/api.config";
import Cookies from "js-cookie";

class ExcelService {
    private excelUrl = (endpoint = '') => API_CONTROLLER.excel(endpoint);
   

    async uploadExcelFile(file: File) {
        const formData = new FormData();
        formData.append('file', file);

        return httpRequest<any>(this.excelUrl('/UploadFile'), {
            method: 'POST',
            body: formData,
        });
    }

    async validateExcelData(payload: {
        tableName: string;
        records: Record<string, string>[];
        mappings: Record<string, string>;
    }) {
        return httpRequest<any>(this.excelUrl('/Validate'), {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async getValidationRules(tableName: string) {
        return httpRequest<any>(
            this.excelUrl(`/GetValidationRules?tableName=${encodeURIComponent(tableName)}`),
            {
                method: 'GET',
            }
        );
    }

  async startExportManual(payload: {
    connectionId?: string;
    tableRequest: {
        tableId: string;
        columns: string;
        filters: {
            column: string;
            value: string;
            filterOperation: string;
            filterKey: string;
        }[];
        pagination: {
            page: number;
            take: number;
            isInfiniteScroll: boolean;
        };
        sortBy: string;
        sortDirection: boolean;
    };
    columns: {
        propertyName: string;
        header: string;
    }[];
}) {
    const userCookie = Cookies.get('user');
    const token = userCookie ? JSON.parse(userCookie).accessToken : null;

    if (!token) {
        throw new Error('Token tapılmadı');
    }

    return fetch('https://afmis-api.siesco.studio/afmis/Excel/startExportManual', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    }).then(async (response) => {
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Status: ${response.status} – ${errorText}`);
        }

        return response.json();
    });
}
    async getItemsManual() {
        const userCookie = Cookies.get('user');
        const token = userCookie ? JSON.parse(userCookie).accessToken : null;

        return fetch(this.excelUrl('/GetItems'), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        }).then(async (response) => {
            if (!response.ok) {
                throw new Error(`Status: ${response.status}`);
            }
            return response.json();
        });
    }

}

export const excelService = new ExcelService();
