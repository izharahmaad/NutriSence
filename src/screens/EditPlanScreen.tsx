import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Modal,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export default function EditPlanScreen() {
  const [goal, setGoal] = useState('');
  const [duration, setDuration] = useState('');
  const [split, setSplit] = useState('');
  const [meal, setMeal] = useState('');
  const [notes, setNotes] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const theme = {
    bg: isDark ? '#121212' : '#f1f5f3',
    card: isDark ? '#1e1e1e' : '#fff',
    text: isDark ? '#fff' : '#121212',
    input: isDark ? '#2a2a2a' : '#fff',
    border: isDark ? '#333' : '#ddd',
    placeholder: isDark ? '#aaa' : '#888',
  };

  const handleSave = async () => {
    const durationMs = convertDurationToMs(duration);
    if (!durationMs) {
      return; // Stop if the duration is invalid
    }

    const plan = { goal, duration, split, meal, notes };
    try {
      // Search for the user document in Firestore
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('__name__', '>=', 'profile_'), where('__name__', '<', 'profile_~'));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userRef = doc(db, 'users', userDoc.id);

        await setDoc(userRef, { fitnessPlan: plan }, { merge: true });
        setModalVisible(true);
        setTimeout(() => setModalVisible(false), 2000); // Auto-dismiss modal after 2 seconds

        // Set a timer for the duration
        setTimeout(() => {
          Alert.alert(
            'Reminder',
            `Your fitness plan duration (${duration}) has been completed! It's time to update your plan.`,
          );
        }, durationMs);
      } else {
        Alert.alert('Error', 'No user profile found to save the plan.');
      }
    } catch (error) {
      console.error('Error saving fitness plan:', error);
      Alert.alert('Error', 'Failed to save your fitness plan. Please try again.');
    }
  };

  const convertDurationToMs = (duration: string): number | null => {
    // Enhanced regex to match valid duration formats
    const regex = /^(\d+)([mhd])$/i; // Matches number followed by 'm', 'h', or 'd' (case-insensitive)
    const match = duration.trim().toLowerCase().match(regex); // Convert input to lowercase and trim spaces

    if (!match) {
      Alert.alert('Invalid Duration', 'Please specify duration in minutes (m), hours (h), or days (d). Use formats like "30m", "2h", or "1d".');
      return null;
    }

    const value = parseInt(match[1], 10); // First group is the numeric value
    const unit = match[2];

    switch (unit) {
      case 'm': // Minutes
        return value * 60 * 1000;
      case 'h': // Hours
        return value * 60 * 60 * 1000;
      case 'd': // Days
        return value * 24 * 60 * 60 * 1000;
      default:
        return null;
    }
  };

  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}>
        <View style={[styles.card, { backgroundColor: theme.card, shadowColor: theme.text }]}>
          <View style={styles.header}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={24} color={theme.text} />
            <Text style={[styles.title, { color: theme.text }]}>Edit Your Fitness Plan</Text>
          </View>

          <LabelInput label="Goal" icon="target" value={goal} onChangeText={setGoal} theme={theme} />
          <LabelInput label="Duration (e.g., 30m, 2h, 1d)" icon="calendar-clock" value={duration} onChangeText={setDuration} theme={theme} />
          <LabelInput label="Workout Split" icon="arm-flex-outline" value={split} onChangeText={setSplit} theme={theme} />
          <LabelInput label="Meal Focus" icon="food-apple" value={meal} onChangeText={setMeal} theme={theme} />
          <LabelInput label="Notes" icon="note-text-outline" value={notes} onChangeText={setNotes} theme={theme} multiline />

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <MaterialCommunityIcons name="content-save-check-outline" size={22} color="#fff" />
            <Text style={styles.saveText}>Save Plan</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ✅ Custom Modal */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={[styles.modalCard, { backgroundColor: theme.card }]}>
            <MaterialCommunityIcons name="check-circle" size={48} color="#356D35" />
            <Text style={[styles.modalTitle, { color: theme.text }]}>Plan Saved</Text>
            <Text style={[styles.modalText, { color: theme.text }]}>
              Your fitness plan has been saved successfully!
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
}

const LabelInput = ({
  label,
  icon,
  value,
  onChangeText,
  multiline = false,
  theme,
}: any) => (
  <View style={styles.inputGroup}>
    <Text style={[styles.label, { color: theme.text }]}>
      <MaterialCommunityIcons name={icon} size={18} color={theme.text} /> {label}
    </Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      style={[
        styles.input,
        {
          backgroundColor: theme.input,
          color: theme.text,
          borderColor: theme.border,
          height: multiline ? 100 : 50,
          textAlignVertical: multiline ? 'top' : 'center',
        },
      ]}
      placeholder={`Enter ${label.toLowerCase()}...`}
      placeholderTextColor={theme.placeholder}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    elevation: 5,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 30,
    paddingHorizontal: 18,
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: '#356D35',
    paddingVertical: 16,
    borderRadius: 30,
    // marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },

  // ✅ Modal styles
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalCard: {
    width: '80%',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 6,
  },
  modalText: {
    fontSize: 14,
    textAlign: 'center',
  },
});