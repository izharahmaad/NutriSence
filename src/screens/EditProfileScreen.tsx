import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig'; // Update this path to your Firebase configuration

export default function EditProfileScreen() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const theme = {
    bg: isDark ? '#121212' : '#f1f5f3',
    card: isDark ? '#1e1e1e' : '#fff',
    text: isDark ? '#fff' : '#121212',
    placeholder: isDark ? '#aaa' : '#888',
    input: isDark ? '#2a2a2a' : '#fff',
    border: isDark ? '#333' : '#ddd',
  };

  const fetchUserData = async () => {
    try {
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('__name__', '>=', 'profile_'), where('__name__', '<', 'profile_~'));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        setName(userData.name || '');
        setAge(userData.age || '');
        setWeight(userData.weight || '');
        setHeight(userData.height || '');
        setImage(userData.imageUrl || null); // Use imageUrl from Firestore
      } else {
        console.log('Error', 'No user profile found. Please ensure your profile is set up.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to fetch user data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('__name__', '>=', 'profile_'), where('__name__', '<', 'profile_~'));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userRef = doc(db, 'users', userDoc.id);

        await setDoc(
          userRef,
          {
            name,
            age,
            weight,
            height,
            imageUrl: image, // Save the updated image URL
          },
          { merge: true } // Merge the new data with the existing document
        );
        Alert.alert('✅ Profile Saved', 'Your profile has been successfully updated.');
      } else {
        Alert.alert('Error', 'No user profile found to update.');
      }
    } catch (error) {
      console.error('Error saving user data:', error);
      Alert.alert('❌ Error', 'Failed to save your profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#356D35" />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
          <Image
            source={{ uri: image || 'https://via.placeholder.com/100' }}
            style={styles.avatar}
          />
          <View style={styles.cameraIcon}>
            <Feather name="edit-3" size={16} color="#fff" />
          </View>
        </TouchableOpacity>
        <Text style={[styles.name, { color: theme.text }]}>Edit Profile</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card, shadowColor: theme.text }]}>
        <Input label="Full Name" icon="account" value={name} onChangeText={setName} theme={theme} />
        <Input label="Age" icon="calendar" value={age} onChangeText={setAge} theme={theme} keyboardType="number-pad" />
        <Input label="Height (cm)" icon="human-male-height" value={height} onChangeText={setHeight} theme={theme} keyboardType="number-pad" />
        <Input label="Weight (kg)" icon="weight-kilogram" value={weight} onChangeText={setWeight} theme={theme} keyboardType="number-pad" />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <MaterialCommunityIcons name="account-check-outline" size={22} color="#fff" />
        <Text style={styles.saveButtonText}>Save Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const Input = ({
  label,
  icon,
  value,
  onChangeText,
  theme,
  keyboardType = 'default',
}: any) => (
  <View style={styles.inputGroup}>
    <Text style={[styles.label, { color: theme.text }]}>
      <MaterialCommunityIcons name={icon} size={18} color={theme.text} /> {label}
    </Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      style={[
        styles.input,
        {
          backgroundColor: theme.input,
          color: theme.text,
          borderColor: theme.border,
        },
      ]}
      keyboardType={keyboardType}
      placeholder={`Enter ${label.toLowerCase()}`}
      placeholderTextColor={theme.placeholder}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 24,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#356D35',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#356D35',
    padding: 6,
    borderRadius: 14,
    borderColor: '#fff',
    borderWidth: 2,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
  },
  card: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 18,
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderRadius: 30,
    paddingHorizontal: 18,
    fontSize: 16,
  },
  saveButton: {
    margin: 24,
    backgroundColor: '#356D35',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },
});