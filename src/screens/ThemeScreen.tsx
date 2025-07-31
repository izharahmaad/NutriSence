import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Switch, useColorScheme,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ThemeScreen() {
  const scheme = useColorScheme();
  const [darkMode, setDarkMode] = useState(scheme === 'dark');

  const theme = {
    bg: darkMode ? '#121212' : '#f3f5f4',
    card: darkMode ? '#1e1e1e' : '#fff',
    text: darkMode ? '#fff' : '#222',
    sub: darkMode ? '#aaa' : '#666',
  };

  useEffect(() => {
    setDarkMode(scheme === 'dark');
  }, [scheme]);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.title, { color: theme.text }]}>Theme Mode</Text>

        <View style={styles.row}>
          <MaterialCommunityIcons name="theme-light-dark" size={24} color={theme.text} />
          <Text style={[styles.label, { color: theme.text }]}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={() => setDarkMode(!darkMode)} // visual only
          />
        </View>

        <Text style={[styles.note, { color: theme.sub }]}>
          {darkMode
            ? 'Dark theme enabled for low-light environments.'
            : 'Light theme enabled for daytime use.'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  card: { borderRadius: 14, padding: 20 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 20 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  label: {
    fontSize: 16,
    flex: 1,
    marginLeft: 12,
  },
  note: {
    marginTop: 10,
    fontSize: 14,
  },
});
