import type { DTCCar, DTCVehicleWithActive, ActiveDTC } from '@shared/types/dtc';

export type MalfunctionSeverityKey = 'critical' | 'important' | 'minor' | 'no-data';

export interface MalfunctionDetailsRow {
  id: string;
  vehicleName: string;
  errorCount: number;
  errorCodes: string[];
  lastOccurrence: string | null;
  [key: string]: string | number | string[] | null;
}

const convertSeverity = (severity: number): MalfunctionSeverityKey => {
  if (severity >= 4) return 'critical';
  if (severity >= 2) return 'important';
  return 'minor';
};

const buildActiveMap = (activeVehicles: DTCVehicleWithActive[]) => {
  const map = new Map<number, ActiveDTC[]>();
  activeVehicles.forEach((vehicle) => {
    map.set(vehicle.wln_id, vehicle.active_dtc);
  });
  return map;
};

export const buildMalfunctionDetailsBySeverity = (
  cars: DTCCar[],
  activeVehicles: DTCVehicleWithActive[],
): Record<MalfunctionSeverityKey, MalfunctionDetailsRow[]> => {
  const result: Record<MalfunctionSeverityKey, MalfunctionDetailsRow[]> = {
    critical: [],
    important: [],
    minor: [],
    'no-data': [],
  };

  const activeMap = buildActiveMap(activeVehicles);

  cars.forEach((car) => {
    const activeErrors = activeMap.get(car.wln_id) ?? [];

    if (activeErrors.length === 0) {
      result['no-data'].push({
        id: String(car.wln_id),
        vehicleName: car.wln_name,
        errorCount: 0,
        errorCodes: [],
        lastOccurrence: null,
      });
      return;
    }

    const bySeverity: Record<MalfunctionSeverityKey, ActiveDTC[]> = {
      critical: [],
      important: [],
      minor: [],
      'no-data': [],
    };

    activeErrors.forEach((error) => {
      const sev = convertSeverity(error.severity);
      bySeverity[sev].push(error);
    });

    (['critical', 'important', 'minor'] as const).forEach((key) => {
      const errors = bySeverity[key];
      if (!errors.length) return;

      const lastOccurrence = errors.reduce((latest, error) => {
        const ts = error.last_seen * 1000;
        return ts > latest ? ts : latest;
      }, errors[0].last_seen * 1000);

      const errorCodes = Array.from(new Set(errors.map((e) => e.spn.toString()))).sort();

      result[key].push({
        id: `${car.wln_id}-${key}`,
        vehicleName: car.wln_name,
        errorCount: errors.length,
        errorCodes,
        lastOccurrence: new Date(lastOccurrence).toISOString(),
      });
    });
  });

  (['critical', 'important', 'minor', 'no-data'] as const).forEach((key) => {
    result[key].sort(
      (a, b) => b.errorCount - a.errorCount || a.vehicleName.localeCompare(b.vehicleName),
    );
  });

  return result;
};
