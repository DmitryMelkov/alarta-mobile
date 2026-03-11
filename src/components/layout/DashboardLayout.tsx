import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Header } from './Header';
import { Sidebar } from './Sidebar';

type Props = {
  children: ReactNode;
};

export function DashboardLayout({ children }: Props) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <View
      style={[styles.root, { paddingTop: insets.top, backgroundColor: theme.colors.background }]}
    >
      <Header />
      <View style={styles.contentRow}>
        <Sidebar />
        <View style={styles.main}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  contentRow: {
    flex: 1,
    flexDirection: 'row',
  },
  main: {
    flex: 1,
    padding: 16,
  },
});
