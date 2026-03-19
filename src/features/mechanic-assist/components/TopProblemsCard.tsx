import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '@src/theme/colors';
import { CardTitle } from '@shared/components/ui/CardTitle';
import { LoadingState } from '@shared/components/ui/LoadingState';
import type { TopProblemItem } from '../utils/topProblemsStats';

interface TopProblemsCardProps {
  problems: TopProblemItem[];
  loading?: boolean;
  error?: string | null;
  onProblemPress?: (problem: TopProblemItem) => void;
}

const getProblemIcon = (problemName: string): keyof typeof MaterialIcons.glyphMap => {
  const name = problemName.toLowerCase();
  if (name.includes('масл') || name.includes('давление масла')) {
    return 'local-gas-station';
  }
  if (name.includes('температур') || name.includes('двигател')) {
    return 'thermostat';
  }
  if (name.includes('датчик') || name.includes('абс')) {
    return 'sensors';
  }
  if (name.includes('тормоз') || name.includes('колодк')) {
    return 'build';
  }
  if (name.includes('свеч') || name.includes('зажиган')) {
    return 'local-gas-station';
  }
  return 'warning';
};

export const TopProblemsCard = ({
  problems,
  loading,
  error,
  onProblemPress,
}: TopProblemsCardProps) => {
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
      <CardTitle title="Топ 5 проблем" iconName="report-problem" />
      <Card.Content style={styles.content}>
        {loading ? (
          <LoadingState loading />
        ) : !problems.length ? (
          <LoadingState empty />
        ) : (
          <View style={styles.list}>
            {problems.map((p, i) => {
              const iconName = getProblemIcon(p.name);
              const ItemComponent = onProblemPress ? TouchableOpacity : View;

              return (
                <ItemComponent
                  key={`${p.name}-${i}`}
                  style={styles.item}
                  onPress={onProblemPress ? () => onProblemPress(p) : undefined}
                  activeOpacity={0.7}
                >
                  <View style={styles.problemContent}>
                    <MaterialIcons
                      name={iconName}
                      size={20}
                      color={COLORS.clearChill}
                      style={styles.icon}
                    />
                    <Text variant="bodyMedium" style={styles.problemName} numberOfLines={2}>
                      {p.name}
                    </Text>
                  </View>
                  <View style={styles.countContainer}>
                    <Text variant="bodyMedium" style={styles.count}>
                      {p.count}
                    </Text>
                  </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  problemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  icon: {},
  problemName: {
    flex: 1,
    fontSize: 14,
  },
  countContainer: {
    backgroundColor: COLORS.clearChill,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  count: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
