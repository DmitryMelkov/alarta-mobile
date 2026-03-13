import type { DTCCar, DTCVehicleWithActive } from '@src/types/dtc';

export interface StatusStats {
  active: { count: number; percentage: number };
  'in-work': { count: number; percentage: number };
  waiting: { count: number; percentage: number };
  completed: { count: number; percentage: number };
}

//Статусы машин по наличию ошибок: critical → в работе, important → ожидает, и т.д.
export const calculateStatusStats = (
  cars: DTCCar[],
  activeVehicles: DTCVehicleWithActive[],
): StatusStats => {
  const errorsMap = new Map<number, DTCVehicleWithActive['active_dtc']>();
  activeVehicles.forEach((v) => errorsMap.set(v.wln_id, v.active_dtc));

  let active = 0;
  let inWork = 0;
  let waiting = 0;
  let completed = 0;

  cars.forEach((car) => {
    const errors = errorsMap.get(car.wln_id) ?? [];
    const hasCritical = errors.some((e) => e.severity >= 4);
    const hasImportant = errors.some((e) => e.severity >= 2 && e.severity <= 3);

    if (hasCritical) inWork++;
    else if (hasImportant) waiting++;
    else if (errors.length > 0) active++;
    else completed++;
  });

  const total = cars.length;
  const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);

  return {
    active: { count: active, percentage: pct(active) },
    'in-work': { count: inWork, percentage: pct(inWork) },
    waiting: { count: waiting, percentage: pct(waiting) },
    completed: { count: completed, percentage: pct(completed) },
  };
};
