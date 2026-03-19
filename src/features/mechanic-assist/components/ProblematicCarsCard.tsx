import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '@src/theme/colors';
import { CardTitle } from '@shared/components/ui/CardTitle';
import { LoadingState } from '@shared/components/ui/LoadingState';

interface ProblematicCarsCardProps {
  cars: string[];
  loading?: boolean;
  error?: string | null;
  onCarPress?: (car: string) => void;
}

export const ProblematicCarsCard = ({
  cars,
  loading,
  error,
  onCarPress,
}: ProblematicCarsCardProps) => {
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
      <CardTitle title="Топ проблемных авто" iconName="directions-car" />
      <Card.Content style={styles.content}>
        {loading ? (
          <LoadingState loading />
        ) : !cars.length ? (
          <LoadingState empty />
        ) : (
          <View style={styles.list}>
            {cars.map((name, i) => {
              const ItemComponent = onCarPress ? TouchableOpacity : View;

              return (
                <ItemComponent
                  key={`${name}-${i}`}
                  style={styles.item}
                  onPress={onCarPress ? () => onCarPress(name) : undefined}
                  activeOpacity={0.7}
                >
                  <Text variant="bodyMedium" style={styles.number}>
                    {i + 1}.
                  </Text>
                  <MaterialIcons
                    name="directions-car"
                    size={20}
                    color={COLORS.clearChill}
                    style={styles.icon}
                  />
                  <Text variant="bodyMedium" style={styles.carName} numberOfLines={2}>
                    {name}
                  </Text>
                </ItemComponent>
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
  },
  list: {
    gap: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    gap: 10,
  },
  number: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.clearChill,
    minWidth: 20,
  },
  icon: {},
  carName: {
    flex: 1,
    fontSize: 14,
  },
});
