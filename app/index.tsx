import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppStore } from '../src/store/useAppStore';

export default function HomeScreen() {
  const { count, increment } = useAppStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alarta Mobile</Text>
      <Text style={styles.counter}>Count: {count}</Text>
      <Pressable style={styles.button} onPress={increment}>
        <Text style={styles.buttonText}>Increment</Text>
      </Pressable>

      <Link href="/settings" style={styles.link}>
        Go to settings
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  counter: {
    fontSize: 20,
    fontWeight: '600',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#2563eb',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  link: {
    marginTop: 24,
    color: '#2563eb',
    fontSize: 16,
  },
});

