import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  useColorScheme,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function NotificationScreen() {
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(false);
  const [summary, setSummary] = useState(true);

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const theme = {
    bg: isDark ? '#121212' : '#f2f4f3',
    card: isDark ? '#1e1e1e' : '#ffffff',
    text: isDark ? '#ffffff' : '#121212',
    sub: isDark ? '#aaa' : '#666',
    border: isDark ? '#333' : '#ddd',
    active: '#356D35',
    inactive: '#ccc',
  };

  useEffect(() => {
    const loadPrefs = async () => {
      const stored = await AsyncStorage.getItem('notifications');
      if (stored) {
        const parsed = JSON.parse(stored);
        setPush(parsed.push);
        setEmail(parsed.email);
        setSummary(parsed.summary);
      }
    };
    loadPrefs();
  }, []);

  const updateSetting = async (key: 'push' | 'email' | 'summary', value: boolean) => {
    const newSettings = { push, email, summary, [key]: value };
    setPush(newSettings.push);
    setEmail(newSettings.email);
    setSummary(newSettings.summary);
    await AsyncStorage.setItem('notifications', JSON.stringify(newSettings));
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.card, { backgroundColor: theme.card, shadowColor: theme.text }]}>
        <View style={styles.headerRow}>
          <MaterialCommunityIcons name="bell-ring-outline" size={24} color={theme.text} />
          <Text style={[styles.title, { color: theme.text }]}>Notification Preferences</Text>
        </View>

        <ToggleItem
          icon="bell-outline"
          label="Push Notifications"
          sub="Get reminders, updates, and alerts"
          value={push}
          onValueChange={(v: boolean) => updateSetting('push', v)}
          theme={theme}
        />

        <ToggleItem
          icon="email-outline"
          label="Email Updates"
          sub="Receive tips and summaries via email"
          value={email}
          onValueChange={(v: boolean) => updateSetting('email', v)}
          theme={theme}
        />

        <ToggleItem
          icon="chart-bar"
          label="Weekly Summary"
          sub="Insights about your weekly progress"
          value={summary}
          onValueChange={(v: boolean) => updateSetting('summary', v)}
          theme={theme}
        />
      </View>
    </ScrollView>
  );
}

const ToggleItem = ({
  icon,
  label,
  sub,
  value,
  onValueChange,
  theme,
}: any) => (
  <View style={[styles.toggleRow, { borderBottomColor: theme.border }]}>
    <MaterialCommunityIcons name={icon} size={24} color={theme.text} />
    <View style={styles.toggleText}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      <Text style={[styles.sub, { color: theme.sub }]}>{sub}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: theme.inactive, true: theme.active }}
      thumbColor="#fff"
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    borderRadius: 18,
    padding: 20,
    elevation: 4,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingVertical: 16,
  },
  toggleText: {
    flex: 1,
    marginLeft: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  sub: {
    fontSize: 13,
    marginTop: 2,
  },
});

