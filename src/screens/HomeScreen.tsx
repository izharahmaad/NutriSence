import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../config/firebaseConfig'; // Firestore configuration

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [user, setUser] = useState<any>({ name: 'Guest', imageUrl: null });
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('profileData');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUser({ name: parsed.name || 'Guest', imageUrl: parsed.imageUrl || null });
          return;
        }

        // Fallback to Firestore
        const usersCollectionRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollectionRef);

        let foundUser = null;
        usersSnapshot.forEach((doc) => {
          if (doc.id.startsWith('profile')) {
            foundUser = { id: doc.id, ...doc.data() };
          }
        });

        if (foundUser) {
          setUser({
            name: foundUser.name || 'Guest',
            imageUrl: foundUser.imageUrl || null,
          });
        }
      } catch (error) {
        console.log('Failed to load user data:', error);
      }
    };

    loadUser();
  }, [route.params]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image
              source={{ uri: user.imageUrl || 'https://i.pravatar.cc/100' }}
              style={styles.avatar}
            />
          </TouchableOpacity>
          <Text style={styles.greeting}>Hi, {user?.name || 'Guest'}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
            <Ionicons name="notifications-outline" size={28} color="#333" />
          </TouchableOpacity>
        </View>

        {/* My Plan For Today */}
        <TouchableOpacity style={styles.planCard} onPress={() => navigation.navigate('MyPlanToday')}>
          <Image source={require('../../assets/plan.jpg')} style={styles.planImage} />
          <View style={styles.planContent}>
            <Text style={styles.planTitle}>My Plan For Today</Text>
            <AnimatedCircularProgress
              size={120}
              width={12}
              fill={70}
              tintColor="#356D35"
              backgroundColor="#e0e0e0"
              rotation={0}
              lineCap="round"
            >
              {() => <Text style={styles.planPercent}>82%</Text>}
            </AnimatedCircularProgress>
          </View>
        </TouchableOpacity>

        {/* Stat Cards */}
        <View style={styles.statsRow}>
          <StatCard icon="flame-outline" label="Calories" value="46%" colorStyle={styles.caloriesCard} onPress={() => navigation.navigate('Calories')} />
          <StatCard icon="heart-outline" label="Heart" value="72 bpm" colorStyle={styles.heartCard} onPress={() => navigation.navigate('Heart')} />
        </View>
        <View style={styles.statsRow}>
          <StatCard icon="water-outline" label="Water" value="2.5 L" colorStyle={styles.waterCard} onPress={() => navigation.navigate('Water')} />
          <StatCard icon="walk-outline" label="Steps" value="10,000" colorStyle={styles.stepsCard} onPress={() => navigation.navigate('Steps')} />
        </View>
        <View style={styles.statsRow}>
          <StatCard icon="moon-outline" label="Sleep" value="7.5 h" colorStyle={styles.sleepCard} onPress={() => navigation.navigate('Sleep')} />
        </View>

        {/* Waist Workout */}
        <TouchableOpacity style={styles.workoutCard} onPress={() => navigation.navigate('WaistWorkout')}>
          <Image source={require('../../assets/waist.jpg')} style={styles.workoutImage} />
          <View style={styles.workoutContent}>
            <Text style={styles.workoutTitle}>Waist Workout</Text>
            <Text style={styles.workoutSubtitle}>Target your core with precision</Text>
            <View style={styles.workoutBtn}>
              <Text style={styles.workoutBtnText}>Continue</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Recommended Diet Plan */}
        <TouchableOpacity style={styles.workoutCard} onPress={() => navigation.navigate('DietPlan')}>
          <Image source={require('../../assets/diet.jpg')} style={styles.workoutImage} />
          <View style={styles.workoutContent}>
            <Text style={styles.workoutTitle}>Recommended Diet Plan</Text>
            <Text style={styles.workoutSubtitle}>Meals based on your region & religion</Text>
            <View style={styles.workoutBtn}>
              <Text style={styles.workoutBtnText}>Explore</Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <FooterTab icon="home" label="Home" current={route.name === 'Home'} onPress={() => navigation.navigate('Home')} />
        <FooterTab icon="flame-outline" label="Calories" current={route.name === 'Calories'} onPress={() => navigation.navigate('Calories')} />
        <View style={styles.scannerSpacing}>
          <TouchableOpacity style={styles.scannerBtn} onPress={() => navigation.navigate('Camera')}>
            <Ionicons name="scan" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
        <FooterTab icon="barbell-outline" label="Activity" current={route.name === 'Activity'} onPress={() => navigation.navigate('Activity')} />
        <FooterTab icon="person-outline" label="Profile" current={route.name === 'Profile'} onPress={() => navigation.navigate('Profile')} />
      </View>
    </View>
  );
}

const StatCard = ({ icon, label, value, colorStyle, onPress }: any) => (
  <TouchableOpacity style={[styles.statCard, colorStyle]} onPress={onPress}>
    <Ionicons name={icon} size={24} color="#356D35" />
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </TouchableOpacity>
);

const FooterTab = ({ icon, label, current, onPress }: any) => (
  <TouchableOpacity style={styles.footerItem} onPress={onPress}>
    <Ionicons name={icon} size={22} color={current ? '#356D35' : '#bbb'} />
    <Text style={[styles.footerLabel, current && { color: '#356D35', fontWeight: 'bold' }]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20, paddingBottom: 120 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 20,
    gap: 10,
  },
  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 10 },
  greeting: { flex: 1, fontSize: 18, fontWeight: '600', color: '#121212' },

  planCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  planImage: { width: '100%', height: 160 },
  planContent: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(53, 109, 53, 0.08)',
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
    color: '#121212',
    textAlign: 'center',
  },
  planPercent: { marginTop: 10, fontSize: 22, fontWeight: 'bold', color: '#356D35' },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    gap: 14,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
  },
  caloriesCard: {
    backgroundColor: '#FFF9E6',
    borderColor: '#FFD700',
  },
  heartCard: {
    backgroundColor: '#FFECEC',
    borderColor: '#FF4444',
  },
  waterCard: {
    backgroundColor: '#E6F7FF',
    borderColor: '#4FC3F7',
  },
  stepsCard: {
    backgroundColor: '#E9F9E8',
    borderColor: '#2E7D32',
  },
  sleepCard: {
    backgroundColor: '#F3E6FA',
    borderColor: '#AB47BC',
  },
  statLabel: { fontSize: 14, fontWeight: '600', marginTop: 6, color: '#333' },
  statValue: { fontSize: 13, color: '#666', marginTop: 2 },

  workoutCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 30,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  workoutImage: { width: '100%', height: 160 },
  workoutContent: { padding: 16 },
  workoutTitle: { fontSize: 18, fontWeight: '700', color: '#121212', marginBottom: 4 },
  workoutSubtitle: { fontSize: 14, color: '#666', marginBottom: 12 },
  workoutBtn: {
    backgroundColor: '#356D35',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  workoutBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },

  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 70,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
  },
  footerItem: { alignItems: 'center', flex: 1 },
  footerLabel: { fontSize: 12, color: '#bbb', marginTop: 2 },
  scannerSpacing: { width: 70, alignItems: 'center' },
  scannerBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#356D35',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
});
