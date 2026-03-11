import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SegmentedButtons, useTheme } from 'react-native-paper';

import { DashboardLayout } from '@components/layout/DashboardLayout';
import { useUiStore } from '@store/uiStore';

type AnalyticsTab = 'kpi' | 'finance' | 'fuel';

export default function HomeScreen() {
  const selectedDashboard = useUiStore((state) => state.selectedDashboard);
  const theme = useTheme();
  const [analyticsTab, setAnalyticsTab] = useState<AnalyticsTab>('kpi');

  return (
    <DashboardLayout>
      {selectedDashboard === 'mechanicAssist' && (
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>Механик Ассист</Text>
          <Text style={[styles.text, { color: theme.colors.onSurfaceVariant }]}>
            Здесь будет интерфейс помощника механика: заявки, ТО, напоминания и состояние техники.
          </Text>
        </View>
      )}

      {selectedDashboard === 'analytics' && (
        <View style={styles.analyticsContainer}>
          <SegmentedButtons
            value={analyticsTab}
            onValueChange={(value) => setAnalyticsTab(value as AnalyticsTab)}
            buttons={[
              { value: 'kpi', label: 'КПД' },
              { value: 'finance', label: 'Финансовая аналитика' },
              { value: 'fuel', label: 'Топливная аналитика' },
            ]}
          />

          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            {analyticsTab === 'kpi' && (
              <>
                <Text style={[styles.title, { color: theme.colors.onSurface }]}>КПД</Text>
                <Text style={[styles.text, { color: theme.colors.onSurfaceVariant }]}>
                  Здесь появятся ключевые метрики эффективности работы транспорта.
                </Text>
              </>
            )}
            {analyticsTab === 'finance' && (
              <>
                <Text style={[styles.title, { color: theme.colors.onSurface }]}>
                  Финансовая аналитика
                </Text>
                <Text style={[styles.text, { color: theme.colors.onSurfaceVariant }]}>
                  Здесь будет аналитика по затратам, выручке и себестоимости.
                </Text>
              </>
            )}
            {analyticsTab === 'fuel' && (
              <>
                <Text style={[styles.title, { color: theme.colors.onSurface }]}>
                  Топливная аналитика
                </Text>
                <Text style={[styles.text, { color: theme.colors.onSurfaceVariant }]}>
                  Здесь будет анализ расхода топлива, заправок и отклонений от нормы.
                </Text>
              </>
            )}
          </View>
        </View>
      )}
    </DashboardLayout>
  );
}

const styles = StyleSheet.create({
  analyticsContainer: {
    gap: 12,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: '#4b5563',
  },
});
