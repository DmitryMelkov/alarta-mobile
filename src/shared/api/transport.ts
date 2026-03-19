import { apiClient } from './client';

export type TransportAnalytics = {
  id: string;
  name: string;
  value: number;
};

export async function fetchTransportAnalytics(): Promise<TransportAnalytics[]> {
  const response = await apiClient.get<TransportAnalytics[]>('/transport/analytics');
  return response.data;
}
