import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function HeartScreen() {
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataPoints, setDataPoints] = useState<number[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let count = 0;
    let tempData: number[] = [];

    interval = setInterval(() => {
      const rate = 68 + Math.floor(Math.random() * 10); // 68-77 bpm
      tempData.push(rate);
      setDataPoints([...tempData]);
      setHeartRate(rate);
      count++;
      if (count >= 10) {
        clearInterval(interval);
        setLoading(false);
      }
    }, 800); // slower animation

    return () => clearInterval(interval);
  }, []);

  const average = dataPoints.length
    ? dataPoints.reduce((sum, val) => sum + val, 0) / dataPoints.length
    : 0;

  const max = Math.max(...dataPoints);
  const min = Math.min(...dataPoints);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Heart Rate Overview</Text>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#356D35" />
          <Text style={styles.loadingText}>Syncing with device...</Text>
        </View>
      ) : (
        <>
          <View style={styles.card}>
            <MaterialCommunityIcons name="heart-pulse" size={40} color="#f44336" />
            <Text style={styles.currentLabel}>Current Rate</Text>
            <Text style={styles.currentValue}>{heartRate} bpm</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Average</Text>
              <Text style={styles.statValue}>{average.toFixed(1)} bpm</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Max</Text>
              <Text style={styles.statValue}>{max} bpm</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Min</Text>
              <Text style={styles.statValue}>{min} bpm</Text>
            </View>
          </View>

          <LineChart
            data={{
              labels: dataPoints.map((_, i) => `T${i + 1}`),
              datasets: [{ data: dataPoints }],
            }}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: () => '#356D35',
              labelColor: () => '#999',
              propsForDots: {
                r: '5',
                strokeWidth: '2',
                stroke: '#356D35',
              },
            }}
            bezier
            style={styles.chart}
          />

          <View style={styles.tips}>
            <Text style={styles.tipHeading}>Health Tips</Text>
            <Text style={styles.tipText}>- Stay calm and hydrated.</Text>
            <Text style={styles.tipText}>- Track regularly for accuracy.</Text>
            <Text style={styles.tipText}>- Rest if heart rate is above 100 bpm when inactive.</Text>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  content: { alignItems: 'center', paddingVertical: 30 },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#121212',
    marginBottom: 20,
  },
  loadingBox: { alignItems: 'center', marginTop: 50 },
  loadingText: { fontSize: 16, color: '#666', marginTop: 10 },
  card: {
    alignItems: 'center',
    backgroundColor: '#fdfdfd',
    padding: 22,
    borderRadius: 16,
    elevation: 3,
    width: '90%',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  currentLabel: { fontSize: 14, color: '#444', marginTop: 6 },
  currentValue: { fontSize: 28, fontWeight: 'bold', color: '#f44336', marginTop: 4 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#f0f4f3',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  statLabel: { fontSize: 13, color: '#666' },
  statValue: { fontSize: 16, fontWeight: '700', color: '#121212' },
  chart: {
    marginTop: 30,
    borderRadius: 16,
  },
  tips: {
    marginTop: 30,
    width: '90%',
    backgroundColor: '#f1f5f3',
    padding: 18,
    borderRadius: 16,
  },
  tipHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#356D35',
    marginBottom: 10,
  },
  tipText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 6,
  },
});
