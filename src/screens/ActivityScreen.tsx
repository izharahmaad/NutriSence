import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const { width } = Dimensions.get('window');
const PRIMARY_COLOR = '#356D35';
const LIGHT_GREEN_BG = '#CFE7CE';

const ActivityScreen = () => {
  const navigation = useNavigation();

  const [user, setUser] = useState({
    name: 'User',
    date: new Date().toDateString(),
    avatar: '',
  });

  const workouts = [
    {
      title: 'Warm up',
      time: '25 min',
      kcal: '230 Kcal',
      image: require('../../assets/workouts/warmup.jpg'),
    },
    {
      title: 'Warm up',
      time: '25 min',
      kcal: '230 Kcal',
      image: require('../../assets/workouts/warmup1.jpg'),
    },
  ];

  const goals = [
    {
      title: 'Arm Raises',
      duration: '00:53',
      progress: 37,
      image: require('../../assets/workouts/goal.jpg'),
    },
    {
      title: 'Arm Raises',
      duration: '00:53',
      progress: 37,
      image: require('../../assets/workouts/goal1.jpg'),
    },
  ];

  const schedule = {
    title: 'Day 01 – Warm Up',
    time: '07:00 – 08:00 AM',
    image: require('../../assets/workouts/schedule.jpg'),
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Search Firestore for a document starting with "profile_"
        const usersCollection = collection(db, 'users');
        const q = query(usersCollection, where('__name__', '>=', 'profile_'), where('__name__', '<', 'profile_~'));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();

          setUser((prev) => ({
            ...prev,
            name: userData.name || 'User',
            avatar: userData.imageUrl || 'https://via.placeholder.com/100',
          }));
        } else {
          console.log('Error', 'No user profile found. Please ensure your profile is set up.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to fetch user data. Please try again.');
      }
    };

    fetchUserData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.date}>{user.date}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
          <Ionicons name="notifications-outline" size={24} color="#333" style={styles.bell} />
        </TouchableOpacity>
      </View>

      {/* Weekly Progress */}
      <Text style={styles.sectionTitle}>Weekly progress</Text>
      <View style={styles.progressRow}>
        <View style={styles.progressCard}>
          <Ionicons name="barbell" size={18} color={PRIMARY_COLOR} />
          <Text style={styles.progressLabel}>Weight</Text>
          <Text style={styles.progressValue}>95 kg</Text>
        </View>
        <View style={styles.progressCard}>
          <Ionicons name="flame" size={18} color={PRIMARY_COLOR} />
          <Text style={styles.progressLabel}>Cal Burn</Text>
          <Text style={styles.progressValue}>3.400</Text>
        </View>
        <View style={styles.progressCard}>
          <Ionicons name="fitness" size={18} color={PRIMARY_COLOR} />
          <Text style={styles.progressLabel}>Workouts</Text>
          <Text style={styles.progressValue}>45</Text>
        </View>
      </View>

      {/* Waist Workout */}
      <View style={styles.waistBox}>
        <View>
          <Text style={styles.waistTitle}>Waist Workout</Text>
          <Text style={styles.waistProgress}>25% Completed</Text>
          <View style={styles.waistBar}>
            <View style={styles.waistBarFill} />
          </View>
        </View>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => navigation.navigate('WaistWorkout')}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>

      {/* Today’s workout */}
      <View style={styles.rowHeader}>
        <Text style={styles.sectionTitle}>Today’s workout</Text>
        <Ionicons name="chevron-forward" size={18} color="#333" />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {workouts.map((w, i) => (
          <TouchableOpacity
            key={i}
            style={styles.workoutCard}
            onPress={() => navigation.navigate('TodayWorkout')}
          >
            <Image source={w.image} style={styles.workoutImage} />
            <View style={styles.workoutInfo}>
              <Text style={styles.workoutText}>{w.title}</Text>
              <Text style={styles.workoutSub}>{w.time} · {w.kcal}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Workout goals */}
      <View style={styles.rowHeader}>
        <Text style={styles.sectionTitle}>Workout goals</Text>
        <Ionicons name="chevron-forward" size={18} color="#333" />
      </View>
      {goals.map((g, i) => (
        <TouchableOpacity
          key={i}
          style={styles.goalItem}
          onPress={() => navigation.navigate('WorkoutGoal')}
        >
          <Image source={g.image} style={styles.goalImg} />
          <View style={{ flex: 1 }}>
            <Text style={styles.goalText}>{g.title}</Text>
            <Text style={styles.goalTime}>{g.duration}</Text>
          </View>
          <AnimatedCircularProgress
            size={40}
            width={4}
            fill={g.progress}
            tintColor={PRIMARY_COLOR}
            backgroundColor="#eee"
          >
            {(fill: number) => <Text style={styles.goalPercent}>{Math.round(fill)}%</Text>}
          </AnimatedCircularProgress>
        </TouchableOpacity>
      ))}

      {/* Schedule Card - now shows clearly */}
      <TouchableOpacity
        style={[styles.scheduleCard, { marginTop: 30, marginBottom: 80 }]}
        onPress={() => navigation.navigate('TodayWorkout')}
      >
        <Image source={schedule.image} style={styles.scheduleImg} />
        <View style={{ padding: 10 }}>
          <Text style={styles.goalText}>{schedule.title}</Text>
          <Text style={styles.goalTime}>{schedule.time}</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 50,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 40,

  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginTop: 5,
  },
  bell: {
    marginTop: 20,
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
    marginTop: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#121212',
  },
  date: {
    fontSize: 13,
    color: '#999',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  progressCard: {
    backgroundColor: '#f6f6f6',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    width: (width - 60) / 3,
  },
  progressLabel: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
  },
  progressValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#121212',
    marginTop: 4,
  },
  waistBox: {
    backgroundColor: PRIMARY_COLOR,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  waistTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  waistProgress: {
    color: '#fff',
    fontSize: 12,
    marginVertical: 6,
  },
  waistBar: {
    width: 140,
    height: 6,
    backgroundColor: LIGHT_GREEN_BG,
    borderRadius: 10,
  },
  waistBarFill: {
    width: '25%',
    height: 6,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  continueBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 20,
  },
  continueText: {
    color: PRIMARY_COLOR,
    fontWeight: '600',
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  workoutCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 14,
    width: 160,
  },
  workoutImage: {
    width: '100%',
    height: 110,
  },
  workoutInfo: {
    padding: 10,
  },
  workoutText: {
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 4,
    color: '#121212',
  },
  workoutSub: {
    fontSize: 12,
    color: '#666',
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    backgroundColor: '#f7f7f7',
    padding: 12,
    borderRadius: 12,
  },
  goalImg: {
    width: 46,
    height: 46,
    borderRadius: 10,
    marginRight: 12,
  },
  goalText: {
    fontWeight: '700',
    fontSize: 14,
    color: '#121212',
  },
  goalTime: {
    fontSize: 12,
    color: '#999',
  },
  goalPercent: {
    fontSize: 12,
    color: '#333',
  },
  scheduleCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  scheduleImg: {
    width: '100%',
    height: 140,
  },
});

export default ActivityScreen;