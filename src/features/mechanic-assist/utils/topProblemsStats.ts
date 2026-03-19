import type { DTCVehicleWithActive } from '@shared/types/dtc';

export interface TopProblemItem {
  name: string;
  count: number;
}

//Топ проблем по SPN+FMI: количество уникальных машин с каждой проблемой.
export const calculateTopProblems = (
  activeVehicles: DTCVehicleWithActive[],
  limit = 5,
): TopProblemItem[] => {
  const map = new Map<string, { description: string; vehicleIds: Set<number> }>();

  activeVehicles.forEach((vehicle) => {
    vehicle.active_dtc.forEach((error) => {
      const key = `${error.spn}-${error.fmi}`;
      const name = error.text_name ?? `DTC ${error.spn} (${error.fmi})`;
      const existing = map.get(key);
      if (existing) {
        existing.vehicleIds.add(vehicle.wln_id);
      } else {
        map.set(key, { description: name, vehicleIds: new Set([vehicle.wln_id]) });
      }
    });
  });

  return Array.from(map.values())
    .map((p) => ({ name: p.description, count: p.vehicleIds.size }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};
