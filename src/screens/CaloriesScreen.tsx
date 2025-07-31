import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const { width } = Dimensions.get('window');

const mockData = {
  calories: {
    total: 1500,
    carbs: { value: 150, goal: 300 },
    protein: { value: 40, goal: 60 },
    fat: { value: 40, goal: 60 },
  },
  meals: [
    {
      title: 'Breakfast',
      kcal: 230,
      image: require('../../assets/meals/breakfast1.jpg'),
      screen: 'BreakfastMeal',
    },
    {
      title: 'Lunch',
      kcal: 430,
      image: require('../../assets/meals/lunch1.jpg'),
      screen: 'LunchMeal',
    },
    {
      title: 'Dinner',
      kcal: 320,
      image: require('../../assets/meals/dinner1.jpg'),
      screen: 'DinnerMeal',
    },
  ],
};

export default function CaloriesScreen() {
  const navigation = useNavigation();
  const { calories, meals } = mockData;
  const [userName, setUserName] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });

  const getPercentage = (value: number, goal: number) =>
    Math.min(Math.round((value / goal) * 100), 100);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Search for a document starting with "profile_"
        const usersCollection = collection(db, 'users');
        const q = query(usersCollection, where('__name__', '>=', 'profile_'), where('__name__', '<', 'profile_~'));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();

          if (userData.name) setUserName(userData.name);
          if (userData.imageUrl) setUserAvatar(userData.imageUrl);
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
          <Image
            source={{ uri: userAvatar || 'https://via.placeholder.com/100' }}
            style={styles.avatar}
          />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.userName}>Hi, {userName || 'User'}</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
          <Ionicons name="notifications-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Calorie Card */}
      <View style={styles.glassCard}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="local-fire-department" size={20} color="#fff" />
          <Text style={styles.cardTitle}>My Calories</Text>
        </View>
        <AnimatedCircularProgress
          size={160}
          width={12}
          fill={getPercentage(calories.total, 2000)}
          tintColor="#F7DC6F"
          backgroundColor="#ddd"
          rotation={0}
          lineCap="round"
        >
          {() => (
            <Text style={styles.kcalText}>
              {calories.total}
              {'\n'}
              <Text style={styles.kcalLabel}>KCAL</Text>
            </Text>
          )}
        </AnimatedCircularProgress>

        {/* Macros */}
        <View style={styles.macros}>
          {[{
            label: 'Carbohydrates', value: calories.carbs.value, goal: calories.carbs.goal,
            color: '#A3E4D7', icon: 'leaf-outline'
          }, {
            label: 'Protein', value: calories.protein.value, goal: calories.protein.goal,
            color: '#FAD7A0', icon: 'barbell-outline'
          }, {
            label: 'Fat', value: calories.fat.value, goal: calories.fat.goal,
            color: '#F5B7B1', icon: 'ice-cream-outline'
          }].map((item, index) => (
            <View key={index} style={styles.macroItem}>
              <Ionicons name={item.icon as any} size={20} color={item.color} />
              <AnimatedCircularProgress
                size={60}
                width={5}
                fill={getPercentage(item.value, item.goal)}
                tintColor={item.color}
                backgroundColor="#eee"
              >
                {fill => (
                  <Text style={styles.macroValue}>{Math.round(fill)}%</Text>
                )}
              </AnimatedCircularProgress>
              <Text style={styles.macroLabel}>{item.label}</Text>
              <Text style={styles.macroGrams}>
                {item.value}g / {item.goal}g
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Meals Today */}
      <View style={{ marginTop: 24 }}>
        <View style={styles.mealHeader}>
          <Text style={styles.mealTitle}>Meals Today</Text>
          <TouchableOpacity onPress={() => navigation.navigate('BreakfastMeal')}>
            <Text style={styles.mealAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {meals.map((meal, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.mealCard}
            onPress={() => navigation.navigate(meal.screen)}
          >
            <Image source={meal.image} style={styles.mealImage} />
            <Text style={styles.mealText}>{meal.title}</Text>
            <Text style={styles.mealKcal}>{meal.kcal} Kcal</Text>
            <Ionicons name="chevron-forward" size={18} color="#333" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#121212',
  },
  date: {
    fontSize: 13,
    color: '#888',
  },
  glassCard: {
    backgroundColor: 'rgba(53, 109, 53, 0.95)',
    padding: 22,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  kcalText: {
    textAlign: 'center',
    fontSize: 22,
    color: '#fff',
    fontWeight: '700',
  },
  kcalLabel: {
    fontSize: 13,
    fontWeight: '400',
    color: '#ddd',
  },
  macros: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    width: '100%',
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginTop: 4,
  },
  macroLabel: {
    fontSize: 12,
    color: '#fff',
    marginTop: 6,
  },
  macroGrams: {
    fontSize: 11,
    color: '#eee',
    marginTop: 2,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#121212',
  },
  mealAll: {
    fontSize: 13,
    color: '#aaa',
  },
  mealCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  mealImage: {
    width: 40,
    height: 40,
    marginRight: 14,
    borderRadius: 8,
  },
  mealText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#121212',
  },
  mealKcal: {
    fontSize: 13,
    color: '#F39C12',
    marginRight: 8,
  },
});