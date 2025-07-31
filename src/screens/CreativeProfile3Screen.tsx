import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

// Goal options
const goals = [
  { label: 'Gain Weight', icon: <Ionicons name="barbell" size={22} color="#4CAF50" /> },
  { label: 'Lose weight', icon: <MaterialCommunityIcons name="scale-bathroom" size={22} color="#4CAF50" /> },
  { label: 'Get fitter', icon: <MaterialCommunityIcons name="run" size={22} color="#4CAF50" /> },
  { label: 'Gain more flexible', icon: <MaterialCommunityIcons name="yoga" size={22} color="#4CAF50" /> },
  { label: 'Learn the basic', icon: <Ionicons name="school-outline" size={22} color="#4CAF50" /> },
];

const CreativeProfile3Screen = () => {
  const navigation = useNavigation();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null); // To identify the existing document

  useEffect(() => {
    const findDocument = async () => {
      try {
        // Search Firestore for a document ID starting with "profile_"
        const usersCollection = collection(db, 'users');
        const q = query(usersCollection, where('__name__', '>=', 'profile_'), where('__name__', '<', 'profile_~'));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Use the first matching document ID
          const docId = querySnapshot.docs[0].id;
          setDocumentId(docId);
        } else {
          // If no document is found, fall back to AsyncStorage for the document ID
          const savedProfile = await AsyncStorage.getItem('profile1');
          if (savedProfile) {
            const profileData = JSON.parse(savedProfile);
            const generatedDocumentId = `profile_${profileData.name}_${profileData.createdAt}`;
            setDocumentId(generatedDocumentId);
          }
        }
      } catch (error) {
        console.error('Error finding document:', error);
        Alert.alert('Error', 'Failed to find the document. Please try again.');
      }
    };

    findDocument();
  }, []);

  const saveGoalToFirestore = async () => {
    if (!documentId) {
      Alert.alert(
        'Error',
        'Document ID is missing. Please restart the app or ensure the first screen was completed successfully.'
      );
      return;
    }

    try {
      const userDocRef = doc(db, 'users', documentId);

      // Prepare goal data to merge
      const goalData: Record<string, any> = {
        goal: selectedGoal,
        updatedAt: new Date(), // Track when the document was last updated
      };

      // Merge the goal data with the existing document
      await setDoc(userDocRef, goalData, { merge: true });
      console.log('Goal updated successfully in users collection!');
      Alert.alert('Goal Saved', 'Your goal has been saved successfully.');

      // Navigate to the next screen after successful update
      navigation.navigate('CreativeProfile4');
    } catch (error) {
      console.error('Error saving goal to Firestore:', error);
      Alert.alert('Error', 'Failed to save goal. Please check your Firestore rules.');
    }
  };

  const saveGoal = async () => {
    // Save locally to AsyncStorage
    if (selectedGoal) {
      await AsyncStorage.setItem('profileGoal', selectedGoal);
    }

    // Save to Firestore
    await saveGoalToFirestore();
  };

  const handleNext = async () => {
    if (!selectedGoal) {
      Alert.alert('Error', 'Please select a goal before proceeding.');
      return;
    }
    await saveGoal();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>What’s your goal?</Text>
      <Text style={styles.subtitle}>Let us help you personalize your nutrition journey</Text>

      <View style={styles.goalList}>
        {goals.map((goal, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.goalCard,
              selectedGoal === goal.label && styles.goalCardSelected,
            ]}
            onPress={() => setSelectedGoal(goal.label)}
          >
            <View style={styles.goalRow}>
              {goal.icon}
              <Text
                style={[
                  styles.goalText,
                  selectedGoal === goal.label && styles.goalTextSelected,
                ]}
              >
                {goal.label}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=> navigation.navigate('CreativeProfile4')}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CreativeProfile3Screen;

const styles = StyleSheet.create({
  container: {
    padding: 25,
    backgroundColor: '#fff',
    paddingBottom: 700,
    minHeight: Dimensions.get('window').height * 0.95,
    paddingTop: 120,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    gap: 12,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 8,
    color: '#222',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginBottom: 30,
  },
  goalList: {
    gap: 14,
    marginBottom: 30,
  },
  goalCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 18,
    paddingHorizontal: 22,
    borderRadius: 50,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 2,
  },
  goalCardSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#f0fff4',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  goalText: {
    fontSize: 16,
    color: '#888',
  },
  goalTextSelected: {
    color: '#222',
    fontWeight: 'bold',
  },
  nextBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 30,
    width: '100%',
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  skipText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 14,
    fontSize: 13,
  },
});