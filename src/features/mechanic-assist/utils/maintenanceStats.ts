import type { DTCCar } from '@src/types/dtc';

const OVERDUE_MONTHS = 6;
const APPROACHING_MONTHS = 3;

export type MaintenanceKey = 'overdue' | 'approaching' | 'planned' | 'not-configured';

export interface MaintenanceStats {
  overdue: { count: number; percentage: number };
  approaching: { count: number; percentage: number };
  planned: { count: number; percentage: number };
  'not-configured': { count: number; percentage: number };
}

const getLastServiceDate = (car: DTCCar): string | undefined => {
  const year = car.car_year_of_manufacture;
  if (year == null) return undefined;
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const serviceYear = currentMonth >= 7 ? currentYear : currentYear - 1;
  const actualYear = Math.max(serviceYear, year);
  return new Date(actualYear, 6, 1).toISOString();
};

const getCategory = (lastService: string | undefined): MaintenanceKey => {
  if (!lastService) return 'not-configured';
  const last = new Date(lastService).getTime();
  const now = Date.now();
  const monthsSince = (now - last) / (1000 * 60 * 60 * 24 * 30);
  if (monthsSince > OVERDUE_MONTHS) return 'overdue';
  if (monthsSince >= APPROACHING_MONTHS && monthsSince <= OVERDUE_MONTHS) return 'approaching';
  return 'planned';
};

export const calculateMaintenanceStats = (cars: DTCCar[]): MaintenanceStats => {
  const counts: Record<MaintenanceKey, number> = {
    overdue: 0,
    approaching: 0,
    planned: 0,
    'not-configured': 0,
  };

  cars.forEach((car) => {
    const category = getCategory(getLastServiceDate(car));
    counts[category]++;
  });

  const total = cars.length;
  const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);

  return {
    overdue: { count: counts.overdue, percentage: pct(counts.overdue) },
    approaching: { count: counts.approaching, percentage: pct(counts.approaching) },
    planned: { count: counts.planned, percentage: pct(counts.planned) },
    'not-configured': {
      count: counts['not-configured'],
      percentage: pct(counts['not-configured']),
    },
  };
};
