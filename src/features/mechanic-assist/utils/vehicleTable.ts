import type { DTCCar, DTCVehicleWithActive, ActiveDTC } from '@shared/types/dtc';

export type MechanicVehicleRow = {
  id: string;
  name: string;
  critical: number;
  important: number;
  minor: number;
  total: number;
  status: string;
  reaction: string;
};

const countBySeverity = (errors: ActiveDTC[]) => {
  const critical = errors.filter((e) => e.severity >= 4).length;
  const important = errors.filter((e) => e.severity >= 2 && e.severity <= 3).length;
  const minor = errors.filter((e) => e.severity >= 0 && e.severity <= 1).length;

  return { critical, important, minor };
};

export const buildMechanicVehicleRows = (
  cars: DTCCar[],
  activeVehicles: DTCVehicleWithActive[],
): MechanicVehicleRow[] => {
  if (!cars.length) return [];

  const activeErrorsMap = new Map<number, ActiveDTC[]>();
  activeVehicles.forEach((vehicle) => {
    activeErrorsMap.set(vehicle.wln_id, vehicle.active_dtc);
  });

  return cars.map((car) => {
    const activeErrors = activeErrorsMap.get(car.wln_id) ?? [];
    const { critical, important, minor } = countBySeverity(activeErrors);
    const total = critical + important + minor;

    let status = 'Активен';
    let reaction = 'Работает нормально';

    if (critical > 0) {
      status = 'В работе';
      reaction = 'Требует внимания';
    } else if (important > 0) {
      status = 'Ожидает';
      reaction = 'Требует проверки';
    }

    return {
      id: String(car.wln_id),
      name: car.wln_name,
      critical,
      important,
      minor,
      total,
      status,
      reaction,
    };
  });
};
