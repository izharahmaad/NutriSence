import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { doc, setDoc, getDocs, query, collection, where } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker
import { db } from '../config/firebaseConfig';

const { width } = Dimensions.get('window');

export default function CreativeProfile1Screen() {
  const navigation = useNavigation();
  const [gender, setGender] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [country, setCountry] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null); // Image is optional now

  useEffect(() => {
    const loadProfile = async () => {
      const saved = await AsyncStorage.getItem('profile1');
      if (saved) {
        const data = JSON.parse(saved);
        setGender(data.gender);
        setName(data.name);
        setAge(data.age);
        setCountry(data.country);
        setImageUri(data.imageUri);
      }
    };
    loadProfile();
  }, []);

  const saveProfile = async () => {
    const profileData = { gender, name, age, country, imageUri };
    await AsyncStorage.setItem('profile1', JSON.stringify(profileData));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleNext = async () => {
  if (!gender || !name || !age || !country || !imageUri) {
    Alert.alert('Missing Info', 'All fields including the image must be filled out.');
    return;
  }

  try {
    // Prepare profile data
    const profileData: Record<string, any> = {
      gender,
      name,
      age: parseInt(age, 10),
      country,
      imageUrl: imageUri, // Ensure imageUrl is always included
      createdAt: new Date(),
    };

    // Query Firestore to check if data exists with similar fields
    const usersCollection = collection(db, 'users');
    const q = query(
      usersCollection,
      where('name', '==', name),
      where('age', '==', parseInt(age, 10)),
      where('gender', '==', gender),
      where('country', '==', country)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // If matching data is found, show an alert
      Alert.alert(
        'Profile Exists',
        'A profile with similar details already exists. Do you want to update it?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Update',
            onPress: async () => {
              // Replace the existing document
              const docId = querySnapshot.docs[0].id; // Get the first matching document ID
              const userDocRef = doc(db, 'users', docId);
              await setDoc(userDocRef, profileData, { merge: true });
              await AsyncStorage.setItem('profile1', JSON.stringify(profileData));
              Alert.alert('Success', 'Profile updated successfully!');
              navigation.navigate('CreativeProfile2');
            },
          },
        ]
      );
    } else {
      // If no matching data is found, create a new document
      const uniqueId = `profile_${name}_${Date.now()}`;
      const newUserDocRef = doc(db, 'users', uniqueId);
      await setDoc(newUserDocRef, profileData, { merge: true });
      await AsyncStorage.setItem('profile1', JSON.stringify(profileData));
      Alert.alert('Success', 'Profile saved successfully!');
      navigation.navigate('CreativeProfile2');
    }
  } catch (error) {
    console.error('Error saving profile:', error);
    Alert.alert('Error', 'Failed to save profile. Please try again.');
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Create account</Text>

      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        <Image
          source={
            imageUri
              ? { uri: imageUri }
              : { uri: 'https://via.placeholder.com/100' }
          }
          style={styles.avatar}
        />
        <Text style={styles.chooseText}>
          {imageUri ? 'Image Selected' : 'Choose your Image'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>Gender</Text>
      <View style={styles.genderContainer}>
        {['Male', 'Female', 'Non'].map((g) => (
          <TouchableOpacity
            key={g}
            style={[styles.genderBtn, gender === g && styles.genderSelected]}
            onPress={() => setGender(g)}
          >
            <Text style={gender === g ? styles.genderTextActive : styles.genderText}>
              {g}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Your Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        placeholderTextColor="#888"
        value={name}
        onChangeText={(text) => {
          setName(text);
          saveProfile();
        }}
      />

      <Text style={styles.label}>Your Age</Text>
      <TextInput
        style={styles.input}
        placeholder="18"
        placeholderTextColor="#888"
        keyboardType="numeric"
        value={age}
        onChangeText={(text) => {
          setAge(text);
          saveProfile();
        }}
      />

      <Text style={styles.label}>Your Country</Text>
      <TextInput
        style={styles.input}
        placeholder="🇵🇰 Pakistan"
        placeholderTextColor="#888"
        value={country}
        onChangeText={(text) => {
          setCountry(text);
          saveProfile();
        }}
      />

      <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('CreativeProfile2')}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    backgroundColor: '#fff',
    minHeight: '100%',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
    marginTop: 20,
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
    backgroundColor: '#ddd',
  },
  chooseText: {
    color: '#4CAF50',
    marginTop: 8,
    fontSize: 14,
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#E5ECE5',
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    marginBottom: 16,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  genderBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 14,
    borderRadius: 30,
    marginHorizontal: 5,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  genderSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#E5F5E5',
  },
  genderText: {
    color: '#888',
    fontSize: 14,
  },
  genderTextActive: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  nextBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 20,
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