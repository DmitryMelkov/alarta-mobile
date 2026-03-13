import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, useTheme, List } from 'react-native-paper';
import type { TopProblemItem } from '../utils/topProblemsStats';

interface TopProblemsCardProps {
  problems: TopProblemItem[];
  loading?: boolean;
  error?: string | null;
}

export const TopProblemsCard = ({ problems, loading, error }: TopProblemsCardProps) => {
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
      <Card.Title title="Топ 5 проблем" titleVariant="titleMedium" />
      <Card.Content>
        {loading ? (
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Загрузка…
          </Text>
        ) : !problems.length ? (
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Нет данных
          </Text>
        ) : (
          <View style={styles.list}>
            {problems.map((p, i) => (
              <List.Item
                key={`${p.name}-${i}`}
                title={p.name}
                description={`Машин: ${p.count}`}
                titleNumberOfLines={2}
                style={styles.item}
              />
            ))}
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
  list: {
    marginHorizontal: -16,
  },
  item: {
    paddingVertical: 4,
  },
});
