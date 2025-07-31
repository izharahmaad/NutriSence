import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

interface Feature {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  screen: string;
  badge?: string;
}

const features: Feature[] = [
  { icon: 'flame-outline', label: 'Calories', screen: 'Calories', badge: 'New' },
  { icon: 'heart-outline', label: 'Heart', screen: 'Heart' },
  { icon: 'water-outline', label: 'Water', screen: 'Water' },
  { icon: 'walk-outline', label: 'Steps', screen: 'Steps' },
  { icon: 'moon-outline', label: 'Sleep', screen: 'Sleep', badge: '⚡' },
  { icon: 'barbell-outline', label: 'Workout', screen: 'WaistWorkout' },
];

export default function MyPlanTodayScreen() {
  const navigation = useNavigation();
  const [showPicker, setShowPicker] = useState(false);
  const [reminderTime, setReminderTime] = useState<Date>(new Date());
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
          Alert.alert('Error', 'No profile document found. Please ensure the earlier steps are completed.');
        }
      } catch (error) {
        console.error('Error finding document:', error);
        Alert.alert('Error', 'Failed to find the document. Please try again.');
      }
    };

    findDocument();
  }, []);

  const saveReminderToFirestore = async (time: Date) => {
    if (!documentId) {
      Alert.alert(
        'Error',
        'Document ID is missing. Please restart the app or ensure the earlier steps were completed successfully.'
      );
      return;
    }

    try {
      const userDocRef = doc(db, 'users', documentId);

      // Prepare reminder data to merge
      const reminderData: Record<string, any> = {
        reminderTime: time.toISOString(), // Save as ISO string for easier handling
        updatedAt: new Date(), // Track when the document was last updated
      };

      // Merge the reminder data with the existing document
      await setDoc(userDocRef, reminderData, { merge: true });
      console.log('Reminder time updated successfully in users collection!');
      Alert.alert('Reminder Set', `You'll be reminded at ${time.toLocaleTimeString()}`);
    } catch (error) {
      console.error('Error saving reminder to Firestore:', error);
      Alert.alert('Error', 'Failed to save reminder. Please check your Firestore rules.');
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowPicker(false);
    if (selectedTime) {
      setReminderTime(selectedTime);
      saveReminderToFirestore(selectedTime);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animatable.Text animation="fadeInDown" style={styles.title}>
        My Plan Today
      </Animatable.Text>

      {features.map((item, index) => (
        <Animatable.View
          key={index}
          animation="fadeInUp"
          delay={index * 100}
          style={styles.card}
        >
          <TouchableOpacity
            style={styles.cardContent}
            onPress={() => navigation.navigate(item.screen as never)}
          >
            <Ionicons
              name={item.icon}
              size={28}
              color="#356D35"
              style={{ marginRight: 14 }}
            />
            <Text style={styles.label}>{item.label}</Text>
            {item.badge && <Text style={styles.badge}>{item.badge}</Text>}
          </TouchableOpacity>
        </Animatable.View>
      ))}

      <TouchableOpacity style={styles.reminderBtn} onPress={() => setShowPicker(true)}>
        <Ionicons name="alarm-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.reminderText}>Set Daily Reminder</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={reminderTime}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#fdfdfd',
    minHeight: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 20,
    color: '#121212',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    elevation: 3,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#121212',
    flex: 1,
  },
  badge: {
    backgroundColor: '#356D35',
    color: '#fff',
    fontSize: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 10,
  },
  reminderBtn: {
    flexDirection: 'row',
    backgroundColor: '#356D35',
    padding: 14,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  reminderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});