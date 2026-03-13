import { useState, useEffect, useMemo } from 'react';
import { fetchDTCCars, fetchDTCActive } from '../api/dtcApi';
import { calculateMalfunctionsStats } from '@src/features/mechanic-assist/utils/malfunctionsStats';
import { calculateStatusStats } from '@src/features/mechanic-assist/utils/statusStats';
import { calculateMaintenanceStats } from '@src/features/mechanic-assist/utils/maintenanceStats';
import { calculateTopProblems } from '@src/features/mechanic-assist/utils/topProblemsStats';
import type { MalfunctionsStats } from '@src/features/mechanic-assist/utils/malfunctionsStats';
import type { StatusStats } from '@src/features/mechanic-assist/utils/statusStats';
import type { MaintenanceStats } from '@src/features/mechanic-assist/utils/maintenanceStats';

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
  };
};
