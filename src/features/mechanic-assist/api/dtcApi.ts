import { apiClient } from '@api/client';
import type { DTCCar, DTCVehicleWithActive } from '@src/types/dtc';

export interface DTCFilterParams {
  veh_id?: number;
}

const ensureArray = <T>(data: T[] | { cars?: T[] } | { active?: T[] }): T[] => {
  if (Array.isArray(data)) return data;
  if (
    data &&
    typeof data === 'object' &&
    'cars' in data &&
    Array.isArray((data as { cars?: T[] }).cars)
  ) {
    return (data as { cars: T[] }).cars;
  }
  if (
    data &&
    typeof data === 'object' &&
    'active' in data &&
    Array.isArray((data as { active?: T[] }).active)
  ) {
    return (data as { active: T[] }).active;
  }
  return [];
};

export const fetchDTCCars = async (): Promise<DTCCar[]> => {
  const response = await apiClient.post<DTCCar[] | { cars?: DTCCar[] }>('/DTC/get-cars/', {});
  return ensureArray(response.data);
};

export const fetchDTCActive = async (params?: DTCFilterParams): Promise<DTCVehicleWithActive[]> => {
  const response = await apiClient.post<
    DTCVehicleWithActive[] | { active?: DTCVehicleWithActive[] }
  >('/DTC/get-dtc-active/', params ?? {});
  return ensureArray(response.data);
};
