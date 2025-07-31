import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  useColorScheme,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

interface ScanItem {
  id: string;
  type: string; // "scan" or "search"
  timestamp: string;
  image?: string; // URI of the scanned image
  query?: string; // Search query (if applicable)
  nutrition: any; // Nutrition details
}

export default function MyScanScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const navigation = useNavigation();

  const theme = {
    bg: isDark ? '#121212' : '#f3f5f4',
    card: isDark ? '#1e1e1e' : '#ffffff',
    text: isDark ? '#fff' : '#121212',
    sub: isDark ? '#aaa' : '#666',
  };

  const [scans, setScans] = useState<ScanItem[]>([]);

  useEffect(() => {
    const loadScans = async () => {
      try {
        const saved = await AsyncStorage.getItem('scanHistory');
        if (saved) {
          const parsedScans = JSON.parse(saved).map((item: any, index: number) => ({
            id: `${index}`, // Generate a unique ID for each item
            ...item,
          }));
          setScans(parsedScans);
        } else {
          setScans([]);
        }
      } catch (err) {
        console.error('Error loading scan history:', err);
      }
    };
    loadScans();
  }, []);

  const handleDelete = async (id: string) => {
    const updated = scans.filter((item) => item.id !== id);
    setScans(updated);
    try {
      await AsyncStorage.setItem('scanHistory', JSON.stringify(updated));
      Alert.alert('Deleted', 'Scan has been removed.');
    } catch (err) {
      console.error('Error deleting scan:', err);
    }
  };

  const handleDetails = (item: ScanItem) => {
    navigation.navigate('ScanDetails', { scan: item });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Header with Icon */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="qrcode-scan" size={30} color="#356D35" />
        <Text style={[styles.title, { color: theme.text }]}>My Scans</Text>
      </View>

      <FlatList
        data={scans}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 30, paddingTop: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: theme.card, shadowColor: theme.text }]}
            onPress={() => handleDetails(item)}
          >
            <MaterialCommunityIcons name="file-document-outline" size={28} color="#356D35" />
            <View style={styles.content}>
              <Text style={[styles.scanTitle, { color: theme.text }]}>
                {item.type === 'scan' ? 'Scanned Food' : `Search: ${item.query}`}
              </Text>
              {item.image && (
                <Text style={[styles.scanResult, { color: theme.sub }]}>
                  Scanned Image: Available
                </Text>
              )}
              <Text style={[styles.scanResult, { color: theme.sub }]}>
                Calories: {item.nutrition?.calories || 'N/A'} kcal
              </Text>
              <Text style={[styles.scanDate, { color: theme.sub }]}>
                {new Date(item.timestamp).toLocaleString()}
              </Text>
              <View style={styles.actionRow}>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionBtn}>
                  <Feather name="trash-2" size={18} color="#f44336" />
                  <Text style={[styles.actionText, { color: '#f44336' }]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
    elevation: 3,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  content: { marginLeft: 12, flex: 1 },
  scanTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  scanResult: { fontSize: 14, marginBottom: 4 },
  scanDate: { fontSize: 12, fontWeight: '500', marginBottom: 10 },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 14,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});