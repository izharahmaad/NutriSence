// src/screens/ScanDetailsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type ScanItem = {
  id: string;
  title: string;
  date: string;
  result: string;
};

export default function ScanDetailsScreen() {
  const route = useRoute<RouteProp<{ params: { scan: ScanItem } }, 'params'>>();
  const { scan } = route.params;

  const isDark = useColorScheme() === 'dark';
  const theme = {
    bg: isDark ? '#121212' : '#f4f6f5',
    card: isDark ? '#1f1f1f' : '#fff',
    text: isDark ? '#fff' : '#121212',
    sub: isDark ? '#aaa' : '#555',
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <MaterialCommunityIcons name="qrcode-scan" size={50} color="#356D35" style={{ marginBottom: 20 }} />
        <Text style={[styles.title, { color: theme.text }]}>{scan.title}</Text>
        <Text style={[styles.date, { color: theme.sub }]}>{scan.date}</Text>
        <Text style={[styles.result, { color: theme.text }]}>{scan.result}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    marginBottom: 14,
  },
  result: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});
