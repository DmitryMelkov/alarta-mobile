import React, { useMemo } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, IconButton, useTheme, Card } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { DashboardLayout } from '@shared/components/layout/DashboardLayout';
import { LoadingState } from '@shared/components/ui/LoadingState';
import { SimpleTable, SimpleTableColumn } from '@shared/components/table/SimpleTable';
import { useMechanicAssistData } from '../hooks/useMechanicAssistData';
import type { MalfunctionDetailsRow } from '../utils/malfunctionDetails';

type MalfunctionKey = 'critical' | 'important' | 'minor' | 'no-data';

const MALFUNCTION_TITLES: Record<MalfunctionKey, string> = {
  critical: 'Критические неисправности',
  important: 'Важные неисправности',
  minor: 'Незначительные неисправности',
  'no-data': 'Неисправности: без данных',
};

export default function MalfunctionDetailsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { key: rawKey } = useLocalSearchParams<{ key?: string }>();

  const key = (rawKey as MalfunctionKey) ?? 'critical';

  const { loading, error, malfunctionDetailsBySeverity } = useMechanicAssistData();

  const { title, rows, totalCount } = useMemo(() => {
    const screenTitle = MALFUNCTION_TITLES[key] ?? 'Машины по неисправностям';
    const malfunctionRows = malfunctionDetailsBySeverity[key] ?? [];

    return {
      title: screenTitle,
      rows: malfunctionRows,
      totalCount: malfunctionRows.length,
    };
  }, [key, malfunctionDetailsBySeverity]);

  const columns: SimpleTableColumn<MalfunctionDetailsRow>[] = useMemo(
    () => [
      { key: 'vehicleName', title: 'Машина', width: 220 },
      { key: 'errorCount', title: 'Количество ошибок', align: 'center', width: 140 },
      {
        key: 'errorCodes',
        title: 'Коды ошибок',
        width: 260,
        render: (value) =>
          Array.isArray(value) ? (
            <View style={styles.codesContainer}>
              {value.map((code: string) => (
                <View key={code} style={styles.codePill}>
                  <Text variant="bodySmall" style={styles.codePillText}>
                    {code}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            ''
          ),
      },
      { key: 'lastOccurrence', title: 'Последнее обнаружение', width: 180 },
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
                <SimpleTable<MalfunctionDetailsRow>
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
  codesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  codePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)',
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  codePillText: {
    fontSize: 11,
  },
});
