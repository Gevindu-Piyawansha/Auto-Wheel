// Central export for all services
export { default as carService } from './carService';
export { default as inquiryService } from './inquiryService';
export { default as authService } from './authService';
export { default as apiClient } from './apiClient';

// Re-export types
export type { CarFilters, PaginatedResponse } from './carService';
export type { InquiryFilters } from './inquiryService';
export type { LoginCredentials, AuthResponse } from './authService';
