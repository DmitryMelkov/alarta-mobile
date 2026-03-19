import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '@src/theme/colors';

interface CardTitleProps {
  title: string;
  iconName: keyof typeof MaterialIcons.glyphMap;
}

export const CardTitle = ({ title, iconName }: CardTitleProps) => {
  const theme = useTheme();
  const iconColor = theme.dark ? COLORS.white : theme.colors.onSurfaceVariant;

  return (
    <View style={styles.container}>
      <MaterialIcons name={iconName} size={18} color={iconColor} style={styles.icon} />
      <Text variant="titleMedium" style={styles.title}>
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  icon: {
    width: 18,
    height: 18,
    marginRight: 8,
  },
  title: {
    fontWeight: '500',
  },
});
