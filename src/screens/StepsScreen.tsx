import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Ionicons } from '@expo/vector-icons';

const StepsScreen = () => {
  const [steps, setSteps] = useState(0); // Initial step count
  const [activities, setActivities] = useState<{ time: string; duration: string; distance: string }[]>([]);

  const goal = 10000;
  const fill = (steps / goal) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let count = 0;
    let tempSteps = 0;
    let tempActivities: { time: string; duration: string; distance: string }[] = [];

    const timeSlots = [
      '7 am–8 am',
      '10 am–11 am',
      '1 pm–2 pm',
      '4 pm–5 pm',
    ];

    interval = setInterval(() => {
      const randomSteps = Math.floor(Math.random() * 2000) + 500; // Random steps between 500 and 2500
      const randomDuration = `${Math.floor(Math.random() * 2) + 1}h.${Math.floor(Math.random() * 60)} min`; // Random duration
      const randomDistance = `${(Math.random() * 5 + 1).toFixed(1)} km`; // Random distance between 1 and 6 km

      tempSteps += randomSteps; // Accumulate total steps
      tempActivities.push({
        time: timeSlots[count],
        duration: randomDuration,
        distance: randomDistance,
      });

      setSteps(tempSteps); // Update total steps
      setActivities([...tempActivities]); // Update activities

      count++;
      if (count >= timeSlots.length) {
        clearInterval(interval); // Stop when all time slots are populated
      }
    }, 800); // Simulate data generation every 800ms

    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Step Details</Text>

      <Text style={styles.subtitle}>Your Daily Tasks{'\n'}Almost Done!</Text>

      <AnimatedCircularProgress
        size={180}
        width={12}
        fill={fill}
        tintColor="#356D35"
        backgroundColor="#e0e0e0"
        rotation={0}
        lineCap="round"
        style={styles.progress}
      >
        {() => (
          <View style={{ alignItems: 'center' }}>
            <Ionicons name="walk" size={28} color="#356D35" />
            <Text style={styles.stepCount}>{steps}</Text>
            <Text style={styles.stepLabel}>steps</Text>
          </View>
        )}
      </AnimatedCircularProgress>

      <View style={styles.activitySection}>
        <Text style={styles.sectionTitle}>My Activity</Text>
        <Text style={styles.filterText}>Today ▾</Text>
      </View>

      {activities.map((act, index) => (
        <View key={index} style={styles.activityCard}>
          <View style={styles.row}>
            <Ionicons name="walk-outline" size={20} color="#356D35" />
            <Text style={styles.time}>{act.time}</Text>
          </View>
          <View style={styles.detailRow}>
            <View>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>{act.duration}</Text>
            </View>
            <View>
              <Text style={styles.detailLabel}>Distance</Text>
              <Text style={styles.detailValue}>{act.distance}</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default StepsScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#121212',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    textAlign: 'center',
    marginBottom: 25,
  },
  progress: {
    marginBottom: 40,
  },
  stepCount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#121212',
    marginTop: 8,
  },
  stepLabel: {
    fontSize: 14,
    color: '#666',
  },
  activitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#121212',
  },
  filterText: {
    fontSize: 14,
    color: '#356D35',
    fontWeight: '600',
  },
  activityCard: {
    width: '100%',
    backgroundColor: '#f4f4f4',
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  time: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 13,
    color: '#999',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },
});