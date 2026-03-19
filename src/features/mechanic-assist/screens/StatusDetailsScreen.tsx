import React, { useMemo } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, IconButton, useTheme, Card } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { DashboardLayout } from '@shared/components/layout/DashboardLayout';
import { LoadingState } from '@shared/components/ui/LoadingState';
import { SimpleTable, SimpleTableColumn } from '@shared/components/table/SimpleTable';
import { useMechanicAssistData } from '../hooks/useMechanicAssistData';
import type { StatusDetailsRow } from '../utils/statusDetails';

type StatusKey = 'active' | 'in-work' | 'waiting' | 'completed';

const STATUS_TITLES: Record<StatusKey, string> = {
  active: 'Машины со статусом: Активен',
  'in-work': 'Машины со статусом: В работе',
  waiting: 'Машины со статусом: Ожидает',
  completed: 'Машины со статусом: Завершён',
};

export default function StatusDetailsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { key: rawKey } = useLocalSearchParams<{ key?: string }>();

  const key = (rawKey as StatusKey) ?? 'active';

  const { loading, error, statusDetailsByStatus } = useMechanicAssistData();

  const { title, rows, totalCount } = useMemo(() => {
    const screenTitle = STATUS_TITLES[key] ?? 'Машины со статусом';
    const statusRows = statusDetailsByStatus[key] ?? [];

    return {
      title: screenTitle,
      rows: statusRows,
      totalCount: statusRows.length,
    };
  }, [key, statusDetailsByStatus]);

  const columns: SimpleTableColumn<StatusDetailsRow>[] = useMemo(
    () => [
      { key: 'vehicleName', title: 'Машина', width: 220 },
      { key: 'status', title: 'Статус', width: 120 },
      { key: 'reaction', title: 'Реакция', width: 160 },
      { key: 'errorCount', title: 'Количество ошибок', align: 'center', width: 140 },
      {
        key: 'lastService',
        title: 'Последнее обслуживание',
        width: 180,
        align: 'center',
        render: (value) => (
          <Text variant="bodyMedium" style={[styles.cellText, { textAlign: 'center' }]}>
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
                <SimpleTable<StatusDetailsRow>
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
  cellText: {
    fontSize: 13,
  },
});
