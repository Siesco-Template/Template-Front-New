import { httpRequest } from '@/services/api/httpsRequest';
import API_CONTROLLER from '@/services/config/api.config';

class ConfigService {
  private configUrl = (endpoint = '') => `${API_CONTROLLER.config(endpoint)}`;

  async resetConfig() {
    return httpRequest<any>(this.configUrl(`/Delete`), {
      method: 'DELETE',
    });
  }

  async createOrUpdateConfig(payload: Record<string, any>) {
    return httpRequest<any>(this.configUrl('/CreateOrUpdate'), {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getDefaultAndUserConfig() {
    return httpRequest<any>(this.configUrl(`/GetDefaultAndUserConfig`), {
      method: 'GET',
    });
  }
}

export const configService = new ConfigService();
