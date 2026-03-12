import React from 'react';

import { DashboardLayout } from '@components/layout/DashboardLayout';
import { useUiStore } from '@store/uiStore';
import { useAuthStore } from '@store/authStore';
import { LoginScreen } from '@src/screens/LoginScreen';
import { MechanicAssistScreen } from '@src/features/mechanic-assist/screens/MechanicAssistScreen';
import { AnalyticsScreen } from '@src/features/analytics/screens/AnalyticsScreen';

export default function HomeScreen() {
  const selectedDashboard = useUiStore((state) => state.selectedDashboard);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <DashboardLayout>
      {selectedDashboard === 'mechanicAssist' && <MechanicAssistScreen />}

      {selectedDashboard === 'analytics' && <AnalyticsScreen />}
    </DashboardLayout>
  );
}
