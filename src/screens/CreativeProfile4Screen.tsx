import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function CreativeProfile4Screen() {
  const navigation = useNavigation();
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [randomProgress, setRandomProgress] = useState(0);

  // Generate random progress on component mount
  useEffect(() => {
    const generateRandomProgress = () => {
      const randomValue = Math.floor(Math.random() * 101); // Generate a random number between 0 and 100
      setRandomProgress(randomValue);
    };

    generateRandomProgress();
  }, []);

  // Find the document ID starting with "profile_"
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

  const saveProgressToFirestore = async () => {
    if (!documentId) {
      Alert.alert(
        'Error',
        'Document ID is missing. Please restart the app or ensure the first screen was completed successfully.'
      );
      return;
    }

    try {
      const userDocRef = doc(db, 'users', documentId);

      // Prepare progress data to merge
      const progressData: Record<string, any> = {
        trainingProgress: `${randomProgress}%`, // Use random progress
        trainingPlanCreated: true,
        updatedAt: new Date(), // Track when the document was last updated
      };

      // Merge the progress data with the existing document
      await setDoc(userDocRef, progressData, { merge: true });
      console.log('Progress updated successfully in users collection!');
    } catch (error) {
      console.error('Error saving progress to Firestore:', error);
      Alert.alert('Error', 'Failed to save progress. Please check your Firestore rules.');
    }
  };

  const handleStart = async () => {
    await saveProgressToFirestore();
    navigation.navigate('CreativeProfile5');
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>We create your</Text>
        <Text style={styles.titleAccent}>Training Plan</Text>
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <AnimatedCircularProgress
          size={220}
          width={16}
          fill={randomProgress} // Show random progress
          tintColor="#4CAF50"
          backgroundColor="#E8F5E9"
          rotation={0}
          lineCap="round"
        >
          {(fill) => (
            <Text style={styles.progressText}>{`${Math.round(fill)}%`}</Text>
          )}
        </AnimatedCircularProgress>
      </View>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        We create a workout according to your profile, activity level, and interests.
      </Text>

      {/* Start Button */}
      <TouchableOpacity style={styles.startButton} onPress={handleStart}>
        <Text style={styles.startButtonText}>Start</Text>
      </TouchableOpacity>

      {/* Skip */}
      <TouchableOpacity onPress={()=> navigation.navigate('CreativeProfile5')}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: height,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    paddingTop: 70,
    paddingBottom: 100,
    
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#121212',
  },
  titleContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    color: '#222',
  },
  titleAccent: {
    fontSize: 28,
    fontWeight: '800',
    color: '#121212',
  },
  progressContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  progressText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#121212',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    lineHeight: 20,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 30,
    marginHorizontal: 20,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  startButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  skipText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    marginTop:10,
  },
});