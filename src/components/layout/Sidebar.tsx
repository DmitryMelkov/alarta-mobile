import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';

import { DashboardId, useUiStore } from '@store/uiStore';

type Item = {
  id: DashboardId;
  label: string;
  icon: string;
};

const items: Item[] = [
  { id: 'mechanicAssist', label: 'Механик Ассист', icon: 'wrench' },
  { id: 'analytics', label: 'Аналитика', icon: 'chart-line' },
];

export function Sidebar() {
  const selectedDashboard = useUiStore((state) => state.selectedDashboard);
  const setSelectedDashboard = useUiStore((state) => state.setSelectedDashboard);
  const isSidebarCollapsed = useUiStore((state) => state.isSidebarCollapsed);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const theme = useTheme();

  const containerWidth = isSidebarCollapsed ? 72 : 220;

  return (
    <View
      style={[
        styles.wrapper,
        {
          width: containerWidth,
          backgroundColor: theme.colors.surfaceVariant,
          borderRightColor: theme.colors.outlineVariant,
        },
      ]}
    >
      <View style={styles.container}>
        {items.map((item) => {
          const active = item.id === selectedDashboard;
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.item,
                active && {
                  backgroundColor: theme.colors.primaryContainer,
                },
              ]}
              onPress={() => setSelectedDashboard(item.id)}
            >
              <IconButton
                icon={item.icon}
                size={22}
                iconColor={active ? theme.colors.onPrimaryContainer : theme.colors.onSurfaceVariant}
              />
              {!isSidebarCollapsed && (
                <Text
                  style={[
                    styles.label,
                    { color: theme.colors.onSurfaceVariant },
                    active && { color: theme.colors.onPrimaryContainer, fontWeight: '600' },
                  ]}
                >
                  {item.label}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={[styles.item, styles.collapseItem]} onPress={toggleSidebar}>
        <IconButton
          icon={isSidebarCollapsed ? 'chevron-right' : 'menu'}
          size={22}
          iconColor={theme.colors.onSurfaceVariant}
        />
        {!isSidebarCollapsed && (
          <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>
            Свернутый вид
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  container: {
    gap: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  collapseItem: {
    marginTop: 'auto',
  },
  label: {
    fontSize: 14,
    marginLeft: 4,
  },
});
