import { useApi } from './useApi';

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  features: ServiceFeature[];
}

export interface ServiceFeature {
  id: string;
  title: string;
  order: number;
  serviceId: string;
}

export function useServices() {
  return useApi<Service[]>('/api/public/services');
}