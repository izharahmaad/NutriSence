import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const screenWidth = Dimensions.get('window').width;

export default function SleepScreen() {
  const [sleepHours, setSleepHours] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let data: number[] = [];

    interval = setInterval(() => {
      const hour = 6 + Math.random() * 3; // 6–9 hours
      data.push(parseFloat(hour.toFixed(1)));
      setSleepHours([...data]);

      if (data.length === 7) {
        clearInterval(interval);
        setLoading(false);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const average =
    sleepHours.reduce((sum, val) => sum + val, 0) / (sleepHours.length || 1);
  const max = Math.max(...sleepHours);
  const min = Math.min(...sleepHours);

  const theme = {
    bg: isDark ? '#121212' : '#ffffff',
    text: isDark ? '#ffffff' : '#121212',
    card: isDark ? '#1e1e1e' : '#f8f1fb',
    sub: isDark ? '#aaa' : '#444',
    tipBg: isDark ? '#1c1c1c' : '#f4f9f4',
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content}>
      <Text style={[styles.heading, { color: theme.text }]}>Sleep Tracker</Text>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#356D35" />
          <Text style={[styles.loadingText, { color: theme.sub }]}>Analyzing recent sleep data...</Text>
        </View>
      ) : (
        <>
          {/* Sleep Goal Progress */}
          <View style={styles.goalBox}>
            <Text style={[styles.goalLabel, { color: theme.sub }]}>Sleep Goal</Text>
            <AnimatedCircularProgress
              size={140}
              width={10}
              fill={(average / 8) * 100}
              tintColor="#356D35"
              backgroundColor="#e0e0e0"
            >
              {(_: number) => (
                <Text style={styles.goalValue}>{average.toFixed(1)} / 8 hrs</Text>
              )}
            </AnimatedCircularProgress>
          </View>

          {/* Sleep Stats */}
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Ionicons name="moon" size={38} color="#8e44ad" />
            <Text style={[styles.label, { color: theme.sub }]}>Last Night</Text>
            <Text style={styles.value}>{sleepHours[sleepHours.length - 1]} hrs</Text>
          </View>

          <View style={styles.statsRow}>
            <StatBox label="Avg" value={`${average.toFixed(1)} hrs`} color={theme.card} textColor={theme.text} />
            <StatBox label="Max" value={`${max.toFixed(1)} hrs`} color={theme.card} textColor={theme.text} />
            <StatBox label="Min" value={`${min.toFixed(1)} hrs`} color={theme.card} textColor={theme.text} />
          </View>

          {/* Sleep Phase */}
          <View style={[styles.phaseBox, { backgroundColor: theme.card }]}>
            <Text style={[styles.phaseTitle, { color: theme.text }]}>Night Summary</Text>
            <Text style={[styles.phaseLine, { color: theme.sub }]}>Deep Sleep: 3.2 hrs</Text>
            <Text style={[styles.phaseLine, { color: theme.sub }]}>Light Sleep: 3.8 hrs</Text>
            <Text style={[styles.phaseLine, { color: theme.sub }]}>Awake: 0.4 hrs</Text>
          </View>

          {/* Chart */}
          <LineChart
            data={{
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              datasets: [{ data: sleepHours }],
            }}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundGradientFrom: theme.bg,
              backgroundGradientTo: theme.bg,
              color: () => '#356D35',
              labelColor: () => theme.sub,
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: '#356D35',
              },
            }}
            style={styles.chart}
            bezier
          />

          <View style={[styles.tips, { backgroundColor: theme.tipBg }]}>
            <Text style={[styles.tipHeading, { color: '#356D35' }]}>Sleep Tips</Text>
            <Text style={[styles.tip, { color: theme.sub }]}>• Maintain a consistent sleep schedule</Text>
            <Text style={[styles.tip, { color: theme.sub }]}>• Avoid screens before bed</Text>
            <Text style={[styles.tip, { color: theme.sub }]}>• Limit caffeine after 4 PM</Text>
            <Text style={[styles.tip, { color: theme.sub }]}>• Ensure a cool, quiet sleep environment</Text>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const StatBox = ({ label, value, color, textColor }: any) => (
  <View style={[styles.statBox, { backgroundColor: color }]}>
    <Text style={[styles.statLabel, { color: textColor }]}>{label}</Text>
    <Text style={[styles.statValue, { color: textColor }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { alignItems: 'center', paddingVertical: 30 },
  heading: { fontSize: 24, fontWeight: '800', marginBottom: 20 },
  loading: { alignItems: 'center', marginTop: 40 },
  loadingText: { fontSize: 16, marginTop: 12 },
  goalBox: { alignItems: 'center', marginBottom: 30 },
  goalLabel: { fontSize: 14, marginBottom: 10 },
  goalValue: { fontSize: 18, fontWeight: '700', color: '#356D35', marginTop: 10 },
  card: {
    width: '90%',
    borderRadius: 16,
    alignItems: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 20,
  },
  label: { fontSize: 14, marginTop: 8 },
  value: { fontSize: 26, fontWeight: '700', color: '#8e44ad', marginTop: 6 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginBottom: 20,
  },
  statBox: {
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 6,
  },
  statLabel: { fontSize: 13 },
  statValue: { fontSize: 16, fontWeight: '700' },
  phaseBox: {
    width: '90%',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  phaseTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  phaseLine: { fontSize: 14, marginBottom: 4 },
  chart: { marginTop: 20, borderRadius: 16 },
  tips: {
    padding: 18,
    borderRadius: 16,
    width: '90%',
    marginTop: 30,
  },
  tipHeading: { fontSize: 16, fontWeight: '700', marginBottom: 10 },
  tip: { fontSize: 14, marginBottom: 6 },
});
