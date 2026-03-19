import { useState, useEffect, useMemo } from 'react';
import { fetchDTCCars, fetchDTCActive } from '../api/dtcApi';
import { calculateMalfunctionsStats } from '@features/mechanic-assist/utils/malfunctionsStats';
import { calculateStatusStats } from '@features/mechanic-assist/utils/statusStats';
import { calculateMaintenanceStats } from '@features/mechanic-assist/utils/maintenanceStats';
import { calculateTopProblems } from '@features/mechanic-assist/utils/topProblemsStats';
import {
  buildMechanicVehicleRows,
  MechanicVehicleRow,
} from '@features/mechanic-assist/utils/vehicleTable';
import {
  buildMalfunctionDetailsBySeverity,
  MalfunctionDetailsRow,
  MalfunctionSeverityKey,
} from '@features/mechanic-assist/utils/malfunctionDetails';
import {
  buildStatusDetailsByStatus,
  StatusDetailsRow,
  StatusKey,
} from '@features/mechanic-assist/utils/statusDetails';
import {
  buildMaintenanceDetailsByCategory,
  MaintenanceDetailsRow,
} from '@features/mechanic-assist/utils/maintenanceDetails';
import type { MalfunctionsStats } from '@features/mechanic-assist/utils/malfunctionsStats';
import type { StatusStats } from '@features/mechanic-assist/utils/statusStats';
import type {
  MaintenanceStats,
  MaintenanceKey,
} from '@features/mechanic-assist/utils/maintenanceStats';

export const useMechanicAssistData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dtcCars, setDtcCars] = useState<Awaited<ReturnType<typeof fetchDTCCars>> | null>(null);
  const [dtcActive, setDtcActive] = useState<Awaited<ReturnType<typeof fetchDTCActive>> | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [cars, active] = await Promise.all([fetchDTCCars(), fetchDTCActive()]);
        if (!cancelled) {
          setDtcCars(cars);
          setDtcActive(active);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Ошибка загрузки данных');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const malfunctions: MalfunctionsStats | null = useMemo(() => {
    if (!dtcActive) return null;
    return calculateMalfunctionsStats(dtcActive);
  }, [dtcActive]);

  const status: StatusStats | null = useMemo(() => {
    if (!dtcCars || !dtcActive) return null;
    return calculateStatusStats(dtcCars, dtcActive);
  }, [dtcCars, dtcActive]);

  const maintenance: MaintenanceStats | null = useMemo(() => {
    if (!dtcCars) return null;
    return calculateMaintenanceStats(dtcCars);
  }, [dtcCars]);

  const topProblems = useMemo(() => {
    if (!dtcActive) return [];
    return calculateTopProblems(dtcActive, 5);
  }, [dtcActive]);

  const problematicCars = useMemo(() => {
    if (!dtcActive) return [];
    return dtcActive
      .filter((v) => v.active_dtc.length > 0)
      .slice(0, 5)
      .map((v) => v.wln_name);
  }, [dtcActive]);

  const vehicleRows: MechanicVehicleRow[] = useMemo(() => {
    if (!dtcCars || !dtcActive) return [];
    return buildMechanicVehicleRows(dtcCars, dtcActive);
  }, [dtcCars, dtcActive]);

  const malfunctionDetailsBySeverity: Record<MalfunctionSeverityKey, MalfunctionDetailsRow[]> =
    useMemo(() => {
      if (!dtcCars || !dtcActive) {
        return {
          critical: [],
          important: [],
          minor: [],
          'no-data': [],
        };
      }
      return buildMalfunctionDetailsBySeverity(dtcCars, dtcActive);
    }, [dtcCars, dtcActive]);

  const statusDetailsByStatus: Record<StatusKey, StatusDetailsRow[]> = useMemo(() => {
    if (!dtcCars || !dtcActive) {
      return {
        active: [],
        'in-work': [],
        waiting: [],
        completed: [],
      };
    }
    return buildStatusDetailsByStatus(dtcCars, dtcActive);
  }, [dtcCars, dtcActive]);

  const maintenanceDetailsByCategory: Record<MaintenanceKey, MaintenanceDetailsRow[]> =
    useMemo(() => {
      if (!dtcCars) {
        return {
          overdue: [],
          approaching: [],
          planned: [],
          'not-configured': [],
        };
      }
      return buildMaintenanceDetailsByCategory(dtcCars);
    }, [dtcCars]);

  return {
    loading,
    error,
    dtcCars,
    dtcActive,
    malfunctions,
    status,
    maintenance,
    topProblems,
    problematicCars,
    vehicleRows,
    malfunctionDetailsBySeverity,
    statusDetailsByStatus,
    maintenanceDetailsByCategory,
  };
};
