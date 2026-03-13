import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useMechanicAssistData } from '../hooks/useMechanicAssistData';
import { MalfunctionsCard } from '../components/MalfunctionsCard';
import { StatusCard } from '../components/StatusCard';
import { MaintenanceCard } from '../components/MaintenanceCard';
import { ProblematicCarsCard } from '../components/ProblematicCarsCard';
import { TopProblemsCard } from '../components/TopProblemsCard';

export const MechanicAssistScreen = () => {
  const { loading, error, malfunctions, status, maintenance, topProblems, problematicCars } =
    useMechanicAssistData();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <MalfunctionsCard data={malfunctions} loading={loading} error={error} />
      <StatusCard data={status} loading={loading} error={error} />
      <MaintenanceCard data={maintenance} loading={loading} error={error} />
      <ProblematicCarsCard cars={problematicCars} loading={loading} error={error} />
      <TopProblemsCard problems={topProblems} loading={loading} error={error} />
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
