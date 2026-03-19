import type { DTCCar, DTCVehicleWithActive, ActiveDTC } from '@shared/types/dtc';

export type StatusKey = 'active' | 'in-work' | 'waiting' | 'completed';

export interface StatusDetailsRow {
  id: string;
  vehicleName: string;
  status: string;
  reaction: string;
  errorCount: number;
  lastService: string | null;
  [key: string]: string | number | null;
}

const countBySeverity = (errors: ActiveDTC[]) => {
  const critical = errors.filter((e) => e.severity >= 4).length;
  const important = errors.filter((e) => e.severity >= 2 && e.severity <= 3).length;
  const minor = errors.filter((e) => e.severity >= 0 && e.severity <= 1).length;

  return { critical, important, minor };
};

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

export const buildStatusDetailsByStatus = (
  cars: DTCCar[],
  activeVehicles: DTCVehicleWithActive[],
): Record<StatusKey, StatusDetailsRow[]> => {
  const result: Record<StatusKey, StatusDetailsRow[]> = {
    active: [],
    'in-work': [],
    waiting: [],
    completed: [],
  };

  const activeErrorsMap = new Map<number, ActiveDTC[]>();
  activeVehicles.forEach((vehicle) => {
    activeErrorsMap.set(vehicle.wln_id, vehicle.active_dtc);
  });

  cars.forEach((car) => {
    const activeErrors = activeErrorsMap.get(car.wln_id) ?? [];
    const { critical, important, minor } = countBySeverity(activeErrors);
    const errorCount = critical + important + minor;

    let status = 'Активен';
    let reaction = 'Работает нормально';
    let statusKey: StatusKey = 'active';

    if (critical > 0) {
      status = 'В работе';
      reaction = 'Требует внимания';
      statusKey = 'in-work';
    } else if (important > 0) {
      status = 'Ожидает';
      reaction = 'Требует проверки';
      statusKey = 'waiting';
    } else if (errorCount === 0) {
      statusKey = 'active';
    }

    const lastService = getLastServiceDate(car);

    result[statusKey].push({
      id: String(car.wln_id),
      vehicleName: car.wln_name,
      status,
      reaction,
      errorCount,
      lastService,
    });
  });

  (['active', 'in-work', 'waiting', 'completed'] as StatusKey[]).forEach((key) => {
    result[key].sort((a, b) => a.vehicleName.localeCompare(b.vehicleName));
  });

  return result;
};
