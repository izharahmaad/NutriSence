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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const { height } = Dimensions.get('window');

const moods: { label: string; color: string; icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'] }[] = [
  { label: 'Angry', color: '#EF5350', icon: 'emoticon-angry-outline' },
  { label: 'Sad', color: '#42A5F5', icon: 'emoticon-sad-outline' },
  { label: 'Neutral', color: '#BDBDBD', icon: 'emoticon-neutral-outline' },
  { label: 'Happy', color: '#66BB6A', icon: 'emoticon-happy-outline' },
  { label: 'Excited', color: '#FFB300', icon: 'emoticon-excited-outline' },
];

export default function CreativeProfile5Screen() {
  const navigation = useNavigation();
  const [selectedMood, setSelectedMood] = useState(moods[3]); // Default to "Happy"
  const [documentId, setDocumentId] = useState<string | null>(null);

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
          console.log('Error', 'No profile document found. Please ensure the earlier steps are completed.');
        }
      } catch (error) {
        console.error('Error finding document:', error);
        Alert.alert('Error', 'Failed to find the document. Please try again.');
      }
    };

    findDocument();
  }, []);

  const saveMoodToFirestore = async () => {
    if (!documentId) {
      Alert.alert(
        'Error',
        'Document ID is missing. Please restart the app or ensure the earlier steps were completed successfully.'
      );
      return;
    }

    try {
      const userDocRef = doc(db, 'users', documentId);

      // Prepare mood data to merge
      const moodData: Record<string, any> = {
        mood: selectedMood.label,
        moodColor: selectedMood.color,
        updatedAt: new Date(), // Track when the document was last updated
      };

      // Merge the mood data with the existing document
      await setDoc(userDocRef, moodData, { merge: true });
      console.log('Mood updated successfully in users collection!');
    } catch (error) {
      console.error('Error saving mood to Firestore:', error);
      Alert.alert('Error', 'Failed to save mood. Please check your Firestore rules.');
    }
  };

  const handleNext = async () => {
    await saveMoodToFirestore();
    navigation.navigate('Home'); // Replace with the actual next screen
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>How would you describe your mood?</Text>
      <Text style={styles.moodLabel}>I feel {selectedMood.label}</Text>

      {/* Main Icon */}
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: selectedMood.color + '33' },
        ]}
      >
        <MaterialCommunityIcons
          name={selectedMood.icon}
          size={80}
          color={selectedMood.color}
        />
      </View>

      {/* Mood Selector */}
      <View style={styles.moodSelector}>
        {moods.map((mood, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedMood(mood)}
            style={styles.moodOption}
          >
            <MaterialCommunityIcons
              name={mood.icon}
              size={36}
              color={mood.color}
            />
            <Text style={styles.moodText}>{mood.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Next Button */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>

      {/* Skip */}
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: height,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 40,
    color: '#222',
  },
  moodLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 8,
    marginBottom: 20,
  },
  iconContainer: {
    alignSelf: 'center',
    borderRadius: 100,
    padding: 30,
    backgroundColor: '#EEE',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  moodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 30,
  },
  moodOption: {
    alignItems: 'center',
    flex: 1,
  },
  moodText: {
    marginTop: 8,
    fontSize: 12,
    color: '#555',
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 30,
    marginHorizontal: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  skipText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    marginTop: 12,
  },
});