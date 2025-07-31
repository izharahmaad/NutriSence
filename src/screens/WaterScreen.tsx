import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const WaterScreen = () => {
  const [intake, setIntake] = useState(0); // Total water intake in Liters
  const [history, setHistory] = useState<{ time: string; amount: string }[]>([]);
  const goal = 3.0;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let count = 0;
    let tempData: { time: string; amount: string }[] = [];
    let totalIntake = 0;

    const times = [
      '7:00 AM',
      '9:00 AM',
      '11:30 AM',
      '2:00 PM',
      '4:15 PM',
      '6:30 PM',
    ];

    interval = setInterval(() => {
      const randomAmount = (Math.random() * 0.6 + 0.2).toFixed(1); // Random amount between 0.2L and 0.8L
      totalIntake += parseFloat(randomAmount); // Accumulate total intake
      tempData.push({ time: times[count], amount: `${randomAmount} L` });
      setHistory([...tempData]);
      setIntake(totalIntake);

      count++;
      if (count >= times.length) {
        clearInterval(interval); // Stop when all times are populated
      }
    }, 800); // Simulate data generation every 800ms

    return () => clearInterval(interval);
  }, []);

  const percentage = (intake / goal) * 100;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Water Intake</Text>
      <Text style={styles.subtitle}>Track your hydration levels</Text>

      <View style={{ marginTop: 40 }}>
        <AnimatedCircularProgress
          size={180}
          width={12}
          fill={percentage}
          tintColor="#356D35"
          backgroundColor="#e0e0e0"
          rotation={0}
          lineCap="round"
        >
          {() => (
            <View style={{ alignItems: 'center' }}>
              <Ionicons name="water" size={26} color="#356D35" />
              <Text style={styles.amount}>{intake.toFixed(1)} L</Text>
              <Text style={styles.goalText}>of {goal} L goal</Text>
            </View>
          )}
        </AnimatedCircularProgress>
      </View>

      <Text style={styles.sectionTitle}>Today’s Log</Text>

      {history.map((entry, index) => (
        <View key={index} style={styles.logItem}>
          <Text style={styles.logTime}>{entry.time}</Text>
          <Text style={styles.logAmount}>{entry.amount}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default WaterScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#121212',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#444',
    fontWeight: '500',
  },
  amount: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#121212',
    marginTop: 8,
  },
  goalText: {
    fontSize: 13,
    color: '#777',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#121212',
    alignSelf: 'flex-start',
    marginTop: 40,
    marginBottom: 14,
  },
  logItem: {
    width: '100%',
    backgroundColor: '#f1f8f2',
    padding: 14,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#356D35',
  },
  logTime: {
    fontSize: 15,
    color: '#222',
  },
  logAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: '#356D35',
  },
});