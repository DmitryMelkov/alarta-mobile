import type { DTCVehicleWithActive } from '@shared/types/dtc';

export interface MalfunctionsStats {
  critical: { count: number; percentage: number };
  important: { count: number; percentage: number };
  minor: { count: number; percentage: number };
  'no-data': { count: number; percentage: number };
}

/**
 * Подсчёт статистики неисправностей по severity из active_dtc.
 * severity 5,4 = critical; 3,2 = important; 1,0 = minor.
 * no-data = машины без ошибок.
 */
export const calculateMalfunctionsStats = (
  activeVehicles: DTCVehicleWithActive[],
): MalfunctionsStats => {
  const allErrors = activeVehicles.flatMap((v) => v.active_dtc);
  const critical = allErrors.filter((e) => e.severity >= 4).length;
  const important = allErrors.filter((e) => e.severity >= 2 && e.severity <= 3).length;
  const minor = allErrors.filter((e) => e.severity >= 0 && e.severity <= 1).length;
  const totalCars = activeVehicles.length;
  const carsWithErrors = activeVehicles.filter((v) => v.active_dtc.length > 0).length;
  const noData = totalCars - carsWithErrors;

  const total = critical + important + minor + noData;
  const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);

  return {
    critical: { count: critical, percentage: pct(critical) },
    important: { count: important, percentage: pct(important) },
    minor: { count: minor, percentage: pct(minor) },
    'no-data': { count: noData, percentage: pct(noData) },
  };
};
