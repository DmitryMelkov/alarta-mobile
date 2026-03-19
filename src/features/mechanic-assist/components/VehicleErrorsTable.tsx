import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { CardTitle } from '@shared/components/ui/CardTitle';
import { LoadingState } from '@shared/components/ui/LoadingState';
import { SimpleTable, SimpleTableColumn } from '@shared/components/table/SimpleTable';
import type { MechanicVehicleRow } from '../utils/vehicleTable';

type Props = {
  rows: MechanicVehicleRow[];
  loading?: boolean;
  error?: string | null;
};

export const VehicleErrorsTable = ({ rows, loading, error }: Props) => {
  const theme = useTheme();

  const columns: SimpleTableColumn<MechanicVehicleRow>[] = [
    { key: 'name', title: 'Авто', width: 200 },
    { key: 'critical', title: 'Крит.', align: 'center', width: 60 },
    { key: 'important', title: 'Важн.', align: 'center', width: 60 },
    { key: 'minor', title: 'Незнач.', align: 'center', width: 70 },
    { key: 'total', title: 'Всего', align: 'center', width: 60 },
    { key: 'status', title: 'Статус', width: 120 },
  ];

  if (error) {
    return (
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <Text variant="titleMedium" style={{ color: theme.colors.error }}>
            {error}
          </Text>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={styles.card} mode="elevated">
      <CardTitle title="Авто с ошибками" iconName="error" />
      <Card.Content>
        {loading ? (
          <LoadingState loading />
        ) : rows.length === 0 ? (
          <LoadingState empty />
        ) : (
          <View style={styles.tableWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <SimpleTable<MechanicVehicleRow>
                data={rows}
                columns={columns}
                keyExtractor={(row) => row.id}
                scrollEnabled={false}
              />
            </ScrollView>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  tableWrapper: {
    marginTop: 8,
    minWidth: '100%',
  },
});
