import apiClient from './apiClient';
import { Car } from '../components/CarListing';

export interface CarFilters {
  make?: string;
  minPrice?: number;
  maxPrice?: number;
  year?: number;
  fuelType?: string;
  category?: string;
  engineCC?: string;
  transmission?: string;
  isHotDeal?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class CarService {
  private endpoint = '/cars';

  // Get all cars with optional filters
  async getCars(filters?: CarFilters, page = 1, limit = 10): Promise<PaginatedResponse<Car>> {
    const response = await apiClient.get(this.endpoint, {
      params: { ...filters, page, limit },
    });
    return response.data;
  }

  // Get single car by ID
  async getCarById(id: number): Promise<Car> {
    const response = await apiClient.get(`${this.endpoint}/${id}`);
    return response.data;
  }

  // Create new car (admin only)
  async createCar(car: Omit<Car, 'id'>): Promise<Car> {
    const response = await apiClient.post(this.endpoint, car);
    return response.data;
  }

  // Update car (admin only)
  async updateCar(id: number, car: Partial<Car>): Promise<Car> {
    const response = await apiClient.put(`${this.endpoint}/${id}`, car);
    return response.data;
  }

  // Delete car (admin only)
  async deleteCar(id: number): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${id}`);
  }

  // Increment view count
  async incrementViews(id: number): Promise<void> {
    await apiClient.post(`${this.endpoint}/${id}/view`);
  }

  // Search cars
  async searchCars(query: string): Promise<Car[]> {
    const response = await apiClient.get(`${this.endpoint}/search`, {
      params: { q: query },
    });
    return response.data;
  }
}

export default new CarService();
