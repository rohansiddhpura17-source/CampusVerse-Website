import { apiClient } from './client';
import { MarketplaceProduct } from '@/types/student';

export const marketplaceApi = {
  async getItems(params?: { search?: string; category?: string; condition?: string }): Promise<MarketplaceProduct[]> {
    return apiClient.get('/marketplace', { params });
  },

  async getItemById(id: string): Promise<MarketplaceProduct> {
    return apiClient.get(`/marketplace/${id}`);
  },

  async createItem(data: {
    title: string;
    description: string;
    price: number;
    category: string;
    condition: string;
  }): Promise<MarketplaceProduct> {
    return apiClient.post('/marketplace', data);
  },

  async updateItem(id: string, data: Partial<MarketplaceProduct>): Promise<MarketplaceProduct> {
    return apiClient.patch(`/marketplace/${id}`, data);
  },

  async deleteItem(id: string): Promise<boolean> {
    return apiClient.delete(`/marketplace/${id}`);
  },
};
