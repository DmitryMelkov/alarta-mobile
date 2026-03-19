import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';

import { DashboardId, useUiStore } from '@shared/store/uiStore';
import { COLORS } from '@src/theme/colors';

const SIDEBAR_WIDTH_RATIO = 0.75;
const APP_VERSION = '1.0.0';

type NavItem = {
  id: DashboardId;
  label: string;
  icon: string;
};

const ITEMS: NavItem[] = [
  { id: 'mechanicAssist', label: 'Механик Ассист', icon: 'wrench' },
  { id: 'analytics', label: 'Аналитика', icon: 'chart-line' },
];

export function SidebarOverlay() {
  const theme = useTheme();
  const isOpen = useUiStore((state) => state.isSidebarOpen);
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);
  const selectedDashboard = useUiStore((state) => state.selectedDashboard);
  const setSelectedDashboard = useUiStore((state) => state.setSelectedDashboard);
  const [isClosing, setClosing] = useState(false);

  const panelWidth = Dimensions.get('window').width * SIDEBAR_WIDTH_RATIO;
  const panelSlide = useRef(new Animated.Value(-panelWidth)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const useNativeDriver = Platform.OS !== 'web';

  useEffect(() => {
    if (isOpen) {
      setClosing(false);
      const w = Dimensions.get('window').width * SIDEBAR_WIDTH_RATIO;
      panelSlide.setValue(-w);
      backdropOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(panelSlide, {
          toValue: 0,
          duration: 250,
          useNativeDriver,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver,
        }),
      ]).start();
    }
  }, [isOpen, panelSlide, backdropOpacity, useNativeDriver]);

  const handleClose = () => {
    setClosing(true);
    const w = Dimensions.get('window').width * SIDEBAR_WIDTH_RATIO;
    Animated.parallel([
      Animated.timing(panelSlide, {
        toValue: -w,
        duration: 250,
        useNativeDriver,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver,
      }),
    ]).start(() => {
      setSidebarOpen(false);
      setClosing(false);
    });
  };

  const handleSelect = (id: DashboardId) => {
    setSelectedDashboard(id);
    handleClose();
  };

  if (!isOpen && !isClosing) return null;

  return (
    <Modal visible={true} transparent animationType="none" onRequestClose={handleClose}>
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity: backdropOpacity,
            backgroundColor: theme.dark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.4)',
          },
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        <Animated.View
          style={[
            styles.panel,
            {
              width: panelWidth,
              backgroundColor: theme.colors.surface,
              transform: [{ translateX: panelSlide }],
            },
          ]}
        >
          {/* Шапка: логотип + крестик */}
          <View style={styles.header}>
            <View style={styles.logoWrap}>
              <Image
                source={require('../../../../assets/img/logoSmal.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <IconButton
              icon="close"
              size={24}
              onPress={handleClose}
              iconColor={theme.colors.onSurface}
              style={styles.closeBtn}
            />
          </View>

          {/* Пункты меню */}
          <View style={styles.nav}>
            {ITEMS.map((item) => {
              const active = item.id === selectedDashboard;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.navItem, active && styles.navItemActive]}
                  onPress={() => handleSelect(item.id)}
                  activeOpacity={0.7}
                >
                  <IconButton
                    icon={item.icon}
                    size={22}
                    iconColor={active ? COLORS.clearChill : theme.colors.onSurface}
                    style={styles.navIcon}
                  />
                  <Text
                    style={[
                      styles.navLabel,
                      { color: active ? COLORS.clearChill : theme.colors.onSurface },
                      active && styles.navLabelActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Версия */}
          <Text style={[styles.version, { color: theme.colors.outline }]}>v{APP_VERSION}</Text>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    flexDirection: 'row',
  },
  panel: {
    flex: 0,
    height: '100%',
    paddingTop: 8,
    paddingBottom: 16,
    ...(Platform.OS === 'web'
      ? { boxShadow: '2px 0 8px 0 rgba(0,0,0,0.15)' }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 2, height: 0 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 8,
        }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  logoWrap: {
    flex: 1,
  },
  logoImage: {
    width: 32,
    height: 32,
  },
  closeBtn: {
    margin: 0,
  },
  nav: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginBottom: 4,
  },
  navItemActive: {
    backgroundColor: 'rgba(24, 144, 255, 0.1)',
  },
  navIcon: {
    margin: 0,
    marginRight: 8,
  },
  navLabel: {
    fontSize: 14,
  },
  navLabelActive: {
    fontWeight: '600',
  },
  version: {
    fontSize: 10,
    marginHorizontal: 16,
    marginTop: 'auto',
  },
});
