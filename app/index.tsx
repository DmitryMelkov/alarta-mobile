import React from 'react';

import { DashboardLayout } from '@shared/components/layout/DashboardLayout';
import { useUiStore } from '@shared/store/uiStore';
import { useAuthStore } from '@shared/store/authStore';
import { LoginScreen } from '@features/auth/screens/LoginScreen';
import { MechanicAssistScreen } from '@features/mechanic-assist/screens/MechanicAssistScreen';
import { AnalyticsScreen } from '@features/analytics/screens/AnalyticsScreen';

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
