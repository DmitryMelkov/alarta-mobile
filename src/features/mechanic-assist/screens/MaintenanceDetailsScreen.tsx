import React, { useMemo } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, IconButton, useTheme, Card } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { DashboardLayout } from '@shared/components/layout/DashboardLayout';
import { LoadingState } from '@shared/components/ui/LoadingState';
import { SimpleTable, SimpleTableColumn } from '@shared/components/table/SimpleTable';
import { useMechanicAssistData } from '../hooks/useMechanicAssistData';
import type { MaintenanceDetailsRow } from '../utils/maintenanceDetails';

type MaintenanceKey = 'overdue' | 'approaching' | 'planned' | 'not-configured';

const MAINTENANCE_TITLES: Record<MaintenanceKey, string> = {
  overdue: 'Техобслуживание: просрочено',
  approaching: 'Техобслуживание: приближается',
  planned: 'Техобслуживание: запланировано',
  'not-configured': 'Техобслуживание: не настроено',
};

export default function MaintenanceDetailsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { key: rawKey } = useLocalSearchParams<{ key?: string }>();

  const key = (rawKey as MaintenanceKey) ?? 'overdue';

  const { loading, error, maintenanceDetailsByCategory } = useMechanicAssistData();

  const { title, rows, totalCount } = useMemo(() => {
    const screenTitle = MAINTENANCE_TITLES[key] ?? 'Машины по техобслуживанию';
    const maintenanceRows = maintenanceDetailsByCategory[key] ?? [];

    return {
      title: screenTitle,
      rows: maintenanceRows,
      totalCount: maintenanceRows.length,
    };
  }, [key, maintenanceDetailsByCategory]);

  const columns: SimpleTableColumn<MaintenanceDetailsRow>[] = useMemo(
    () => [
      { key: 'vehicleName', title: 'Машина', width: 220 },
      {
        key: 'maintenanceStatus',
        title: 'Статус техобслуживания',
        width: 170,
        render: (value) => {
          const status = value as MaintenanceDetailsRow['maintenanceStatus'];
          let label = 'Неизвестно';
          let backgroundColor = '#e5e7eb';
          let textColor = '#111827';

          if (status === 'overdue') {
            label = 'Просрочено';
            backgroundColor = '#fee2e2';
            textColor = '#b91c1c';
          } else if (status === 'approaching') {
            label = 'Приближается';
            backgroundColor = '#fef3c7';
            textColor = '#92400e';
          } else if (status === 'planned') {
            label = 'Запланировано';
            backgroundColor = '#dcfce7';
            textColor = '#166534';
          } else if (status === 'not-configured') {
            label = 'Не настроено';
            backgroundColor = '#e5e7eb';
            textColor = '#374151';
          }

          return (
            <View style={[styles.maintenanceBadge, { backgroundColor }]}>
              <Text variant="bodySmall" style={[styles.maintenanceBadgeText, { color: textColor }]}>
                {label}
              </Text>
            </View>
          );
        },
      },
      {
        key: 'monthsSinceService',
        title: 'Месяцев с последнего обслуживания',
        align: 'center',
        width: 200,
        render: (value) => (
          <Text variant="bodyMedium" style={styles.cellText}>
            {typeof value === 'number' ? `${value} мес.` : 'Нет данных'}
          </Text>
        ),
      },
      {
        key: 'lastServiceDate',
        title: 'Последнее обслуживание',
        width: 180,
        render: (value) => (
          <Text variant="bodyMedium" style={styles.cellText}>
            {value ? String(value).slice(0, 10) : 'Нет данных'}
          </Text>
        ),
      },
    ],
    [],
  );

  return (
    <DashboardLayout>
      <View style={styles.container}>
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => router.back()}
            iconColor={theme.colors.onSurface}
          />
          <View style={styles.headerTextWrapper}>
            <Text variant="titleMedium" style={styles.title}>
              {title}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Всего машин: {totalCount}
            </Text>
          </View>
        </View>

        <Card style={styles.card} mode="elevated">
          <Card.Content>
            {error ? (
              <LoadingState error={error} />
            ) : loading ? (
              <LoadingState loading />
            ) : totalCount === 0 ? (
              <LoadingState empty emptyMessage="Нет машин по выбранному фильтру" />
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tableWrapper}
              >
                <SimpleTable<MaintenanceDetailsRow>
                  data={rows}
                  columns={columns}
                  keyExtractor={(row) => row.id}
                  maxHeight={400}
                />
              </ScrollView>
            )}
          </Card.Content>
        </Card>
      </View>
    </DashboardLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTextWrapper: {
    marginLeft: 4,
  },
  title: {
    fontWeight: '600',
    marginBottom: 2,
  },
  card: {
    borderRadius: 12,
    alignSelf: 'stretch',
  },
  tableWrapper: {
    minWidth: '100%',
  },
  maintenanceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  maintenanceBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  cellText: {
    fontSize: 13,
  },
});
