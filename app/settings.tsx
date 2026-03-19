import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import { DashboardLayout } from '@shared/components/layout/DashboardLayout';

export default function SettingsScreen() {
  const theme = useTheme();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <DashboardLayout>
        <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>Настройки</Text>
          <Text style={[styles.text, { color: theme.colors.onSurfaceVariant }]}>
            Здесь позже появятся настройки профиля и приложения.
          </Text>
        </View>
      </DashboardLayout>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: '#4b5563',
  },
});
