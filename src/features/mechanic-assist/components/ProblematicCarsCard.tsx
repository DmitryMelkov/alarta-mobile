import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, useTheme, List } from 'react-native-paper';

interface ProblematicCarsCardProps {
  cars: string[];
  loading?: boolean;
  error?: string | null;
}

export const ProblematicCarsCard = ({ cars, loading, error }: ProblematicCarsCardProps) => {
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
      <Card.Title title="Топ проблемных авто" titleVariant="titleMedium" />
      <Card.Content>
        {loading ? (
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Загрузка…
          </Text>
        ) : !cars.length ? (
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Нет данных
          </Text>
        ) : (
          <View style={styles.list}>
            {cars.map((name, i) => (
              <List.Item
                key={`${name}-${i}`}
                title={name}
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
