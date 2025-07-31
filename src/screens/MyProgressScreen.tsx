import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Share,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ViewShot from 'react-native-view-shot';

const screenWidth = Dimensions.get('window').width;

export default function MyProgressScreen() {
  const [currentWeight, setCurrentWeight] = useState('62.7');
  const [bodyFat, setBodyFat] = useState('14.2');
  const [steps, setSteps] = useState('8450');
  const [filter, setFilter] = useState<'week' | 'month'>('week');
  const [progressPercent, setProgressPercent] = useState('');
  const viewShotRef = useRef(null);

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const theme = {
    bg: isDark ? '#121212' : '#f0f4f2',
    card: isDark ? '#1e1e1e' : '#ffffff',
    text: isDark ? '#fff' : '#121212',
    sub: isDark ? '#aaa' : '#555',
    input: isDark ? '#2a2a2a' : '#fff',
  };

  const chartData = {
    week: [65, 64.5, 64.2, 63.8, 63.5, 63.1, parseFloat(currentWeight)],
    month: [66, 65.5, 65, 64.5, 64, 63.8, 63.5, 63.2, 63.1, parseFloat(currentWeight)],
  };

  useEffect(() => {
    const loadData = async () => {
      const saved = await AsyncStorage.getItem('progress');
      if (saved) {
        const { currentWeight, bodyFat, steps } = JSON.parse(saved);
        if (currentWeight) setCurrentWeight(currentWeight);
        if (bodyFat) setBodyFat(bodyFat);
        if (steps) setSteps(steps);
        const progress = (((65 - parseFloat(currentWeight)) / 65) * 100).toFixed(1);
        setProgressPercent(progress);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(
      'progress',
      JSON.stringify({ currentWeight, bodyFat, steps })
    );
    const progress = (((65 - parseFloat(currentWeight)) / 65) * 100).toFixed(1);
    setProgressPercent(progress);
  }, [currentWeight, bodyFat, steps]);

  const handleShare = async () => {
    const uri = await viewShotRef.current.capture();
    await Share.share({
      message: 'Check out my fitness progress!',
      url: uri,
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}>
      <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.9 }}>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <View style={styles.chartHeader}>
            <MaterialCommunityIcons name="chart-line" size={22} color={theme.text} />
            <Text style={[styles.title, { color: theme.text }]}>Progress ({filter})</Text>
            <View style={styles.filterRow}>
              <TouchableOpacity onPress={() => setFilter('week')} style={filter === 'week' ? styles.activeBtn : styles.inactiveBtn}>
                <Text style={{ color: filter === 'week' ? '#fff' : '#356D35' }}>Week</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setFilter('month')} style={filter === 'month' ? styles.activeBtn : styles.inactiveBtn}>
                <Text style={{ color: filter === 'month' ? '#fff' : '#356D35' }}>Month</Text>
              </TouchableOpacity>
            </View>
          </View>

          <LineChart
            data={{
              labels: filter === 'week'
                ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                : ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'Now'],
              datasets: [{ data: chartData[filter] }],
            }}
            width={screenWidth - 40}
            height={220}
            yAxisSuffix="kg"
            chartConfig={{
              backgroundColor: theme.card,
              backgroundGradientFrom: theme.card,
              backgroundGradientTo: theme.card,
              decimalPlaces: 1,
              color: () => '#356D35',
              labelColor: () => theme.text,
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: '#356D35',
              },
            }}
            style={styles.chart}
          />
        </View>

        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.subtitle, { color: theme.text }]}>Live Stats</Text>
          <Text style={{ color: theme.text, fontWeight: '600', marginBottom: 10 }}>
            Progress: {progressPercent}%
          </Text>

          <InputStat icon="scale-bathroom" label="Current Weight" value={currentWeight} onChangeText={setCurrentWeight} unit="kg" theme={theme} />
          <InputStat icon="heart-pulse" label="Body Fat" value={bodyFat} onChangeText={setBodyFat} unit="%" theme={theme} />
          <InputStat icon="walk" label="Steps Taken" value={steps} onChangeText={setSteps} unit="steps" theme={theme} />
        </View>
      </ViewShot>

      <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
        <MaterialCommunityIcons name="share-variant" size={20} color="#fff" />
        <Text style={styles.shareText}>Share Progress</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const InputStat = ({ icon, label, value, onChangeText, unit, theme }: any) => (
  <View style={styles.inputStatWrapper}>
    <MaterialCommunityIcons name={icon} size={24} color={theme.text} style={styles.inputIcon} />
    <View style={styles.inputArea}>
      <Text style={[styles.statLabel, { color: theme.text }]}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          keyboardType="decimal-pad"
          style={[styles.input, { backgroundColor: theme.input, color: theme.text }]}
        />
        <Text style={[styles.unit, { color: theme.sub }]}>{unit}</Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  card: {
    borderRadius: 20,
    padding: 20,
    elevation: 6,
    marginBottom: 30,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: { fontSize: 18, fontWeight: '800' },
  subtitle: { fontSize: 16, fontWeight: '700', marginBottom: 18 },
  chart: { borderRadius: 16 },
  inputStatWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 22,
    gap: 14,
  },
  inputIcon: { marginTop: 10 },
  inputArea: { flex: 1 },
  statLabel: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  input: {
    flex: 1,
    borderRadius: 30,
    paddingHorizontal: 16,
    fontSize: 16,
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  unit: { fontSize: 14, fontWeight: '600' },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  activeBtn: {
    backgroundColor: '#356D35',
    borderRadius: 30,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  inactiveBtn: {
    borderWidth: 1.5,
    borderColor: '#356D35',
    borderRadius: 30,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  shareBtn: {
    backgroundColor: '#356D35',
    padding: 14,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  shareText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 10,
  },
});
