import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Card, Text, ProgressBar, useTheme } from 'react-native-paper';
import { COLORS } from '@src/theme/colors';
import { CardTitle } from '@shared/components/ui/CardTitle';
import { LoadingState } from '@shared/components/ui/LoadingState';
import type { MalfunctionsStats } from '../utils/malfunctionsStats';

const ROWS: { key: keyof MalfunctionsStats; label: string; color: string }[] = [
  { key: 'critical', label: 'Критические', color: COLORS.progressCritical },
  { key: 'important', label: 'Важные', color: COLORS.progressImportant },
  { key: 'minor', label: 'Незначительные', color: COLORS.progressMinor },
  { key: 'no-data', label: 'Без данных', color: COLORS.progressNoData },
];

interface MalfunctionsCardProps {
  data: MalfunctionsStats | null;
  loading?: boolean;
  error?: string | null;
  onSeverityPress?: (key: keyof MalfunctionsStats) => void;
}

export const MalfunctionsCard = ({
  data,
  loading,
  error,
  onSeverityPress,
}: MalfunctionsCardProps) => {
  const theme = useTheme();

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
      <CardTitle title="Неисправности" iconName="warning" />
      <Card.Content style={styles.content}>
        {loading ? (
          <LoadingState loading />
        ) : !data ? (
          <LoadingState empty />
        ) : (
          <View style={styles.rows}>
            {ROWS.map(({ key, label, color }) => {
              const item = data[key];
              const pct = item.percentage / 100;
              const RowComponent = onSeverityPress ? TouchableOpacity : View;

              return (
                <RowComponent
                  key={key}
                  style={styles.row}
                  onPress={onSeverityPress ? () => onSeverityPress(key) : undefined}
                  activeOpacity={0.7}
                >
                  <View style={styles.labelContent}>
                    <View style={[styles.dot, { backgroundColor: color }]} />
                    <Text variant="bodyMedium" style={styles.label}>
                      {label}
                    </Text>
                  </View>
                  <View style={styles.right}>
                    <View style={styles.progressTrack}>
                      <ProgressBar progress={pct} color={color} style={styles.progress} />
                    </View>
                    <Text variant="bodyMedium" style={styles.count}>
                      {item.count}
                    </Text>
                  </View>
                </RowComponent>
              );
            })}
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
  content: {
    paddingTop: 0,
    paddingRight: 4,
  },
  rows: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  label: {
    flex: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    minWidth: 0,
    gap: 8,
    marginLeft: 8,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  progress: {
    height: 6,
  },
  count: {
    minWidth: 28,
    textAlign: 'center',
    marginRight: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
});
