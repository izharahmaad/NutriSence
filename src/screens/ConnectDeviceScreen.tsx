import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
  Image,
  AppState,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const STORAGE_KEY = 'connectedDevice';

const ConnectDeviceScreen = () => {
  const [scanning, setScanning] = useState(false);
  const [deviceFound, setDeviceFound] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const loadState = async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored === 'true') setConnected(true);
    };
    loadState();

    const sub = AppState.addEventListener('change', async (state) => {
      if (state === 'active') {
        const isConnected = await AsyncStorage.getItem(STORAGE_KEY);
        if (isConnected !== 'true') {
          setConnected(false);
          setDeviceFound(false);
        }
      }
    });

    return () => sub.remove();
  }, []);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setDeviceFound(true);
      setScanning(false);
    }, 2000);
  };

  const handleConnect = async () => {
    await AsyncStorage.setItem(STORAGE_KEY, 'true');
    setConnected(true);
  };

  const handleDisconnect = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setConnected(false);
    setDeviceFound(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center' }}>
      <View style={styles.headerWrapper}>
        <View style={styles.headerCard}>
          <View style={styles.headerIconRow}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="watch-variant" size={22} color="#ffffff" />
            </View>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="bluetooth" size={22} color="#ffffff" />
            </View>
          </View>
          <Text style={styles.headerTitle}>Connect Your Smart Watch</Text>
          <Text style={styles.headerSubtitle}>
            Track heart rate, steps, sleep, and real-time fitness insights by pairing your device.
          </Text>
          <Text style={styles.statusText}>
            {connected
              ? 'Connected via Bluetooth'
              : scanning
              ? 'Scanning...'
              : deviceFound
              ? 'Device Found'
              : 'Not Connected'}
          </Text>
        </View>
      </View>

      <View style={styles.imageCard}>
        <Image
          source={require('../../assets/devices/miband5.jpg')}
          style={styles.bandImage}
          resizeMode="cover"
        />
      </View>

      {!connected && !deviceFound && (
        <TouchableOpacity style={styles.button} onPress={handleScan} disabled={scanning}>
          {scanning ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Ionicons name="bluetooth" size={22} color="#fff" />
          )}
          <Text style={styles.buttonText}>Scan For Smart Watch</Text>
        </TouchableOpacity>
      )}

      {!connected && deviceFound && (
        <TouchableOpacity style={styles.button} onPress={handleConnect}>
          <Ionicons name="link-outline" size={22} color="#fff" />
          <Text style={styles.buttonText}>Connect to Device</Text>
        </TouchableOpacity>
      )}

      {connected && (
        <View style={styles.deviceCard}>
          <Ionicons name="checkmark-circle-outline" size={40} color="#356D35" />
          <Text style={styles.deviceTitle}>Connected to:</Text>
          <Text style={styles.deviceName}>Mi Smart Band 5</Text>
          <Text style={styles.deviceId}>Bluetooth ID: 00:11:22:33:AA:BB</Text>

          <TouchableOpacity style={styles.disconnectBtn} onPress={handleDisconnect}>
            <Ionicons name="close-circle-outline" size={20} color="#fff" />
            <Text style={styles.disconnectText}>Disconnect</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
  },
  headerWrapper: {
    width: '100%',
    backgroundColor: 'transparent',
    marginBottom: 24,
  },
  headerCard: {
    backgroundColor: '#2d5932',
    padding: 28,
    borderRadius: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 10,
    marginBottom: 10,
  },
  headerIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3E8E7E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#d4f0d4',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 10,
  },
  statusText: {
    color: '#c8eac8',
    marginTop: 6,
    fontSize: 14,
  },
  imageCard: {
    backgroundColor: '#fff',
    borderRadius: 100,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 180,
    height: 180,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  bandImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#356D35',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 30,
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  deviceCard: {
    marginTop: 20,
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deviceTitle: {
    fontWeight: '700',
    fontSize: 16,
    marginTop: 8,
    color: '#333',
  },
  deviceName: {
    fontSize: 16,
    marginTop: 4,
    fontWeight: '600',
    color: '#111',
  },
  deviceId: {
    color: '#777',
    fontSize: 13,
    marginTop: 2,
  },
  disconnectBtn: {
    flexDirection: 'row',
    marginTop: 16,
    backgroundColor: '#ff4444',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    alignItems: 'center',
    gap: 8,
  },
  disconnectText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ConnectDeviceScreen;
