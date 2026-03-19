import type { DTCCar } from '@shared/types/dtc';
import type { MaintenanceKey } from './maintenanceStats';

export interface MaintenanceDetailsRow {
  id: string;
  vehicleName: string;
  maintenanceStatus: MaintenanceKey;
  monthsSinceService: number | null;
  lastServiceDate: string | null;
  [key: string]: string | number | MaintenanceKey | null;
}

const OVERDUE_MONTHS = 6;
const APPROACHING_MONTHS = 3;

const getLastServiceDate = (car: DTCCar): string | null => {
  const year = car.car_year_of_manufacture;
  if (year == null) return null;
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const serviceYear = currentMonth >= 7 ? currentYear : currentYear - 1;
  const actualYear = Math.max(serviceYear, year);
  return new Date(actualYear, 6, 1).toISOString();
};

const getCategory = (lastService: string | null): MaintenanceKey => {
  if (!lastService) return 'not-configured';
  const last = new Date(lastService).getTime();
  const now = Date.now();
  const monthsSince = (now - last) / (1000 * 60 * 60 * 24 * 30);
  if (monthsSince > OVERDUE_MONTHS) return 'overdue';
  if (monthsSince >= APPROACHING_MONTHS && monthsSince <= OVERDUE_MONTHS) return 'approaching';
  return 'planned';
};

export const buildMaintenanceDetailsByCategory = (
  cars: DTCCar[],
): Record<MaintenanceKey, MaintenanceDetailsRow[]> => {
  const result: Record<MaintenanceKey, MaintenanceDetailsRow[]> = {
    overdue: [],
    approaching: [],
    planned: [],
    'not-configured': [],
  };

  cars.forEach((car) => {
    const lastService = getLastServiceDate(car);
    const category = getCategory(lastService);

    let monthsSinceService: number | null = null;
    if (lastService) {
      const last = new Date(lastService).getTime();
      const now = Date.now();
      monthsSinceService = Math.round((now - last) / (1000 * 60 * 60 * 24 * 30));
    }

    result[category].push({
      id: String(car.wln_id),
      vehicleName: car.wln_name,
      maintenanceStatus: category,
      monthsSinceService,
      lastServiceDate: lastService,
    });
  });

  (['overdue', 'approaching', 'planned', 'not-configured'] as MaintenanceKey[]).forEach((key) => {
    result[key].sort((a, b) => (a.lastServiceDate || '').localeCompare(b.lastServiceDate || ''));
  });

  return result;
};
