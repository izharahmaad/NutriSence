import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const { width, height: screenHeight } = Dimensions.get('window');

export default function CreativeProfile2Screen() {
  const navigation = useNavigation();
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(59);
  const [activity, setActivity] = useState(5);
  const [unitHeight, setUnitHeight] = useState<'cm' | 'ft'>('cm');
  const [unitWeight, setUnitWeight] = useState<'kg' | 'lb'>('kg');
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

  const saveProfileToFirestore = async () => {
    if (!documentId) {
      Alert.alert(
        'Error',
        'Document ID is missing. Please restart the app or ensure the first screen was completed successfully.'
      );
      return;
    }

    try {
      const userDocRef = doc(db, 'users', documentId);

      // Prepare the new profile data to merge
      const newProfileData = {
        height: unitHeight === 'cm' ? `${Math.round(height)} cm` : `${height.toFixed(1)} ft`,
        weight: unitWeight === 'kg' ? `${Math.round(weight)} kg` : `${Math.round(weight)} lb`,
        activity: `Training ${activity}x/week`,
        unitHeight,
        unitWeight,
        updatedAt: new Date(), // Track when the document was last updated
      };

      // Merge the new fields with the existing document
      await setDoc(userDocRef, newProfileData, { merge: true });
      console.log('Profile data successfully updated in Firestore!');
      Alert.alert('Profile Updated', 'Your profile has been updated successfully.');

      // Navigate to the next screen after successful update
      navigation.navigate('CreativeProfile3');
    } catch (error) {
      console.error('Error saving profile to Firestore:', error);
      Alert.alert('Error', 'Failed to save profile. Please check your Firestore rules.');
    }
  };

  const handleNext = async () => {
    await saveProfileToFirestore();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Almost there!</Text>

      {/* Height */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="resize-outline" size={22} color="#4CAF50" />
          <Text style={styles.label}>Height</Text>
          <View style={styles.unitSwitch}>
            {['cm', 'ft'].map((u) => (
              <TouchableOpacity key={u} onPress={() => setUnitHeight(u as 'cm' | 'ft')}>
                <Text style={[styles.unitText, unitHeight === u && styles.unitTextActive]}>{u}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <Slider
          minimumValue={unitHeight === 'cm' ? 140 : 4.5}
          maximumValue={unitHeight === 'cm' ? 210 : 7.0}
          step={unitHeight === 'cm' ? 1 : 0.1}
          value={height}
          onValueChange={(val) => setHeight(val)}
          minimumTrackTintColor="#4CAF50"
          maximumTrackTintColor="#ccc"
          thumbTintColor="#4CAF50"
        />
        <Text style={styles.valueText}>
          {unitHeight === 'cm' ? `${Math.round(height)} cm` : `${height.toFixed(1)} ft`}
        </Text>
      </View>

      {/* Weight */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="fitness-outline" size={22} color="#4CAF50" />
          <Text style={styles.label}>Weight</Text>
          <View style={styles.unitSwitch}>
            {['kg', 'lb'].map((u) => (
              <TouchableOpacity key={u} onPress={() => setUnitWeight(u as 'kg' | 'lb')}>
                <Text style={[styles.unitText, unitWeight === u && styles.unitTextActive]}>{u}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <Slider
          minimumValue={unitWeight === 'kg' ? 40 : 88}
          maximumValue={unitWeight === 'kg' ? 150 : 330}
          step={1}
          value={weight}
          onValueChange={(val) => setWeight(val)}
          minimumTrackTintColor="#4CAF50"
          maximumTrackTintColor="#ccc"
          thumbTintColor="#4CAF50"
        />
        <Text style={styles.valueText}>
          {unitWeight === 'kg' ? `${Math.round(weight)} kg` : `${Math.round(weight)} lb`}
        </Text>
      </View>

      {/* Activity */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="walk-outline" size={22} color="#4CAF50" />
          <Text style={styles.label}>Activity</Text>
        </View>
        <Slider
          minimumValue={1}
          maximumValue={7}
          step={1}
          value={activity}
          onValueChange={(val) => setActivity(val)}
          minimumTrackTintColor="#4CAF50"
          maximumTrackTintColor="#ccc"
          thumbTintColor="#4CAF50"
        />
        <Text style={styles.valueText}>Training {activity}x/week</Text>
      </View>

      <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={()=> navigation.navigate('CreativeProfile3')}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    paddingBottom: 700,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 60,
    marginBottom: 24,
    color: '#121212',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#F8F9F8',
    borderRadius: 14,
    padding: 20,
    width: '100%',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontWeight: '600',
    fontSize: 15,
    flex: 1,
    marginLeft: 10,
  },
  unitSwitch: {
    flexDirection: 'row',
    gap: 15,
  },
  unitText: {
    fontSize: 13,
    color: '#888',
  },
  unitTextActive: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  valueText: {
    textAlign: 'center',
    fontSize: 15,
    marginTop: 10,
    fontWeight: '500',
  },
  nextBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    width: '100%',
    borderRadius: 30,
    marginTop: 10,
  },
  nextText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  skipText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 14,
  },
});