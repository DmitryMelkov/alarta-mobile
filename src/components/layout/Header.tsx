import { Image, StyleSheet, View } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';

import { useUiStore } from '@store/uiStore';

export function Header() {
  const { isDarkTheme, toggleTheme } = useUiStore();
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
        <Image source={require('../../../assets/img/logoSmal.png')} style={styles.logoImage} />
      </View>
      <View style={styles.right}>
        <IconButton
          icon={isDarkTheme ? 'weather-night' : 'white-balance-sunny'}
          size={22}
          onPress={toggleTheme}
        />
        <IconButton icon="account-circle" size={24} onPress={() => {}} />
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
  logoImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 12,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
