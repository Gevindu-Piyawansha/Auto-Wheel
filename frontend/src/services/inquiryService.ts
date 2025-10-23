import apiClient from './apiClient';
import { Inquiry } from '../components/CarListing';

export interface InquiryFilters {
  status?: Inquiry['status'];
  carId?: number;
  startDate?: string;
  endDate?: string;
}

class InquiryService {
  private endpoint = '/inquiries';

  // Get all inquiries (admin only)
  async getInquiries(filters?: InquiryFilters): Promise<Inquiry[]> {
    const response = await apiClient.get(this.endpoint, {
      params: filters,
    });
    return response.data;
  }

  // Get single inquiry by ID
  async getInquiryById(id: string): Promise<Inquiry> {
    const response = await apiClient.get(`${this.endpoint}/${id}`);
    return response.data;
  }

  // Create new inquiry
  async createInquiry(inquiry: Omit<Inquiry, 'id' | 'timestamp' | 'status'>): Promise<Inquiry> {
    const response = await apiClient.post(this.endpoint, inquiry);
    return response.data;
  }

  // Update inquiry status (admin only)
  async updateInquiryStatus(id: string, status: Inquiry['status'], adminNotes?: string): Promise<Inquiry> {
    const response = await apiClient.patch(`${this.endpoint}/${id}/status`, {
      status,
      adminNotes,
    });
    return response.data;
  }

  // Delete inquiry (admin only)
  async deleteInquiry(id: string): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${id}`);
  }

  // Get inquiry statistics (admin only)
  async getStatistics(): Promise<{
    total: number;
    byStatus: Record<Inquiry['status'], number>;
    byType: Record<Inquiry['inquiryType'], number>;
  }> {
    const response = await apiClient.get(`${this.endpoint}/statistics`);
    return response.data;
  }
}

export default new InquiryService();
