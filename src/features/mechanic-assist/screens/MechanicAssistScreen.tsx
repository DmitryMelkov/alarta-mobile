import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useMechanicAssistData } from '../hooks/useMechanicAssistData';
import { MalfunctionsCard } from '../components/MalfunctionsCard';
import { StatusCard } from '../components/StatusCard';
import { MaintenanceCard } from '../components/MaintenanceCard';
import { ProblematicCarsCard } from '../components/ProblematicCarsCard';
import { TopProblemsCard } from '../components/TopProblemsCard';
import { VehicleErrorsTable } from '../components/VehicleErrorsTable';

export const MechanicAssistScreen = () => {
  const router = useRouter();
  const {
    loading,
    error,
    malfunctions,
    status,
    maintenance,
    topProblems,
    problematicCars,
    vehicleRows,
  } = useMechanicAssistData();

  const openDetails = (params: {
    kind: 'status' | 'malfunctions' | 'maintenance';
    key: string;
  }) => {
    const pathnameMap = {
      status: '/mechanic-assist-details/status',
      malfunctions: '/mechanic-assist-details/malfunction',
      maintenance: '/mechanic-assist-details/maintenance',
    } as const;

    router.push({
      pathname: pathnameMap[params.kind],
      params: { key: params.key },
    });
  };

  const handleStatusPress = (
    key: keyof typeof status | 'active' | 'in-work' | 'waiting' | 'completed',
  ) => {
    openDetails({ kind: 'status', key });
  };

  const handleSeverityPress = (key: 'critical' | 'important' | 'minor' | 'no-data') => {
    openDetails({ kind: 'malfunctions', key });
  };

  const handleMaintenancePress = (
    key: 'overdue' | 'approaching' | 'planned' | 'not-configured',
  ) => {
    openDetails({ kind: 'maintenance', key });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <MalfunctionsCard
        data={malfunctions}
        loading={loading}
        error={error}
        onSeverityPress={handleSeverityPress}
      />
      <StatusCard data={status} loading={loading} error={error} onStatusPress={handleStatusPress} />
      <MaintenanceCard
        data={maintenance}
        loading={loading}
        error={error}
        onCategoryPress={handleMaintenancePress}
      />
      <ProblematicCarsCard cars={problematicCars} loading={loading} error={error} />
      <TopProblemsCard problems={topProblems} loading={loading} error={error} />
      <VehicleErrorsTable rows={vehicleRows} loading={loading} error={error} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingVertical: 16,
    paddingBottom: 32,
  },
});
