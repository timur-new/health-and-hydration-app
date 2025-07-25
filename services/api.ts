import { projectId, publicAnonKey } from '../utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-8769872d`;

class ApiService {
  private accessToken: string | null = null;

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.accessToken || publicAnonKey}`,
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Nutrition API
  async getNutritionData() {
    return this.makeRequest('/nutrition');
  }

  async addNutritionEntry(entry: any) {
    return this.makeRequest('/nutrition', {
      method: 'POST',
      body: JSON.stringify(entry),
    });
  }

  async deleteNutritionEntry(id: string) {
    return this.makeRequest(`/nutrition/${id}`, {
      method: 'DELETE',
    });
  }

  async updateNutritionGoals(goals: any) {
    return this.makeRequest('/nutrition/goals', {
      method: 'PUT',
      body: JSON.stringify(goals),
    });
  }

  // Supplements API
  async getSupplements() {
    return this.makeRequest('/supplements');
  }

  async addSupplement(supplement: any) {
    return this.makeRequest('/supplements', {
      method: 'POST',
      body: JSON.stringify(supplement),
    });
  }

  async toggleSupplement(id: string) {
    return this.makeRequest(`/supplements/${id}/toggle`, {
      method: 'PUT',
    });
  }

  async deleteSupplement(id: string) {
    return this.makeRequest(`/supplements/${id}`, {
      method: 'DELETE',
    });
  }

  // Hydration API
  async getHydrationData() {
    return this.makeRequest('/hydration');
  }

  async addHydrationEntry(entry: any) {
    return this.makeRequest('/hydration', {
      method: 'POST',
      body: JSON.stringify(entry),
    });
  }

  async deleteHydrationEntry(id: string) {
    return this.makeRequest(`/hydration/${id}`, {
      method: 'DELETE',
    });
  }

  async updateHydrationGoal(goal: number) {
    return this.makeRequest('/hydration/goal', {
      method: 'PUT',
      body: JSON.stringify({ goal }),
    });
  }

  // Health check
  async healthCheck() {
    return this.makeRequest('/health');
  }
}

export const apiService = new ApiService();