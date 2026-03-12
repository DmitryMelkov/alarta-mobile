import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SegmentedButtons, Text, useTheme } from 'react-native-paper';

type AnalyticsTab = 'kpi' | 'finance' | 'fuel';

export function AnalyticsScreen() {
  const theme = useTheme();
  const [analyticsTab, setAnalyticsTab] = useState<AnalyticsTab>('kpi');

  return (
    <View style={styles.container}>
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
  );
}

const styles = StyleSheet.create({
  container: {
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
