import { StyleSheet, View } from 'react-native';
import { IconButton, Menu, Text, useTheme } from 'react-native-paper';
import React, { useState } from 'react';

import { useUiStore } from '@shared/store/uiStore';
import { useAuthStore } from '@shared/store/authStore';

export function Header() {
  const [menuVisible, setMenuVisible] = useState(false);
  const isDarkTheme = useUiStore((state) => state.isDarkTheme);
  const toggleTheme = useUiStore((state) => state.toggleTheme);
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);
  const { user, logout } = useAuthStore((state) => ({
    user: state.user,
    logout: state.logout,
  }));
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.outlineVariant,
        },
      ]}
    >
      <View style={styles.left}>
        <IconButton
          icon="menu"
          size={24}
          onPress={() => setSidebarOpen(true)}
          style={styles.menuButton}
        />
      </View>
      <View style={styles.right}>
        <IconButton
          icon={isDarkTheme ? 'weather-night' : 'white-balance-sunny'}
          size={22}
          onPress={toggleTheme}
        />
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <IconButton icon="account-circle" size={24} onPress={() => setMenuVisible(true)} />
          }
        >
          {user?.name ? (
            <View style={styles.menuHeader}>
              <Text>{user.name}</Text>
            </View>
          ) : null}
          <Menu.Item
            onPress={async () => {
              setMenuVisible(false);
              await logout();
            }}
            title="Выйти"
          />
        </Menu>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subtitle: {
    fontSize: 12,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  menuButton: {
    margin: 0,
  },
});
