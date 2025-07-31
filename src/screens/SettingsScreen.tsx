import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  useColorScheme,
  Modal,
  TextInput,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { doc, deleteDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { db } from '../config/firebaseConfig'; // Update this path to your Firebase configuration file

export default function SettingsScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const theme = {
    bg: isDark ? '#121212' : '#f3f5f4',
    card: isDark ? '#1e1e1e' : '#fff',
    text: isDark ? '#fff' : '#121212',
    sub: isDark ? '#aaa' : '#666',
    border: isDark ? '#333' : '#ddd',
    input: isDark ? '#2a2a2a' : '#f0f0f0',
  };

  const navigation = useNavigation();

  const [settings, setSettings] = useState({
    notifications: true,
    sound: true,
    vibrate: false,
    metricUnits: true,
    reminders: false,
    calendarSync: false,
    backup: true,
    biometric: false,
    haptic: true,
  });

  const [language, setLanguage] = useState('en');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExport = () => {
    Alert.alert('Export Settings', 'Your settings have been exported.');
  };

  const handleChangePassword = () => {
    if (!oldPass || !newPass || newPass !== confirmPass) {
      Alert.alert('Error', 'Please check your inputs.');
      return;
    }
    Alert.alert('Success', 'Password changed.');
    setShowPasswordModal(false);
    setOldPass('');
    setNewPass('');
    setConfirmPass('');
  };

  const handleDeleteAccount = async () => {
    const userId = 'profile_React_1747295173360'; // Replace this with dynamic user ID retrieval logic
    Alert.alert('Delete Account', 'Are you sure? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes, Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            // Reference the user's document in Firestore
            const userDocRef = doc(db, 'users', userId);

            // Delete the document
            await deleteDoc(userDocRef);

            // Notify the user
            Alert.alert('Account Deleted', 'Your account has been removed.');
            navigation.navigate('Login'); // Navigate to login screen
          } catch (error) {
            console.error('Error deleting account:', error);
            Alert.alert('Error', 'Unable to delete the account. Please try again.');
          }
        },
      },
    ]);
  };

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.bg }]}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        <View style={styles.header}>
          <Feather name="settings" size={30} color="#356D35" />
          <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
        </View>

        <Section title="App Preferences" theme={theme}>
          <SettingToggle
            icon="bell-outline"
            label="Notifications"
            value={settings.notifications}
            onToggle={() => toggleSetting('notifications')}
            theme={theme}
          />
          <SettingToggle
            icon="volume-high"
            label="Sound"
            value={settings.sound}
            onToggle={() => toggleSetting('sound')}
            theme={theme}
          />
          <SettingToggle
            icon="vibrate"
            label="Vibration"
            value={settings.vibrate}
            onToggle={() => toggleSetting('vibrate')}
            theme={theme}
          />
          <SettingToggle
            icon="ruler-square"
            label="Metric Units"
            value={settings.metricUnits}
            onToggle={() => toggleSetting('metricUnits')}
            theme={theme}
          />
          <SettingToggle
            icon="calendar-check"
            label="Daily Reminders"
            value={settings.reminders}
            onToggle={() => toggleSetting('reminders')}
            theme={theme}
          />
          <SettingToggle
            icon="calendar-sync"
            label="Sync with Calendar"
            value={settings.calendarSync}
            onToggle={() => toggleSetting('calendarSync')}
            theme={theme}
          />
          <SettingToggle
            icon="cloud-upload-outline"
            label="Auto Backup"
            value={settings.backup}
            onToggle={() => toggleSetting('backup')}
            theme={theme}
          />
          <SettingToggle
            icon="vibrate"
            label="Haptic Feedback"
            value={settings.haptic}
            onToggle={() => toggleSetting('haptic')}
            theme={theme}
          />
          <SettingToggle
            icon="fingerprint"
            label="Face ID / Touch ID"
            value={settings.biometric}
            onToggle={() => toggleSetting('biometric')}
            theme={theme}
          />

          <TouchableOpacity style={styles.row} onPress={handleExport}>
            <Feather name="share" size={22} color={theme.text} />
            <Text style={[styles.label, { color: theme.text }]}>Export Settings</Text>
            <Feather name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>

          <View style={[styles.dropdownRow, { borderBottomColor: theme.border }]}>
            <MaterialCommunityIcons name="translate" size={22} color={theme.text} />
            <Text style={[styles.label, { color: theme.text }]}>Language</Text>
            <Picker
              selectedValue={language}
              onValueChange={(value) => setLanguage(value)}
              style={[styles.picker, { color: theme.text }]}
              dropdownIconColor={theme.text}
            >
              <Picker.Item label="English" value="en" />
              <Picker.Item label="Urdu" value="ur" />
              <Picker.Item label="Arabic" value="ar" />
            </Picker>
          </View>
        </Section>

        <Section title="Account" theme={theme}>
          <TouchableOpacity style={styles.row} onPress={() => setShowPasswordModal(true)}>
            <MaterialCommunityIcons name="lock-reset" size={22} color={theme.text} />
            <Text style={[styles.label, { color: theme.text }]}>Change Password</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <View style={{ marginTop: 12 }}>
            <TouchableOpacity style={styles.row} onPress={handleDeleteAccount}>
              <MaterialCommunityIcons name="delete-forever" size={22} color="#f44336" />
              <Text style={[styles.label, { color: '#f44336' }]}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        </Section>
      </ScrollView>

      {/* Modal: Change Password */}
      <Modal visible={showPasswordModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={[styles.modalCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Change Password</Text>

            <TextInput
              placeholder="Old Password"
              secureTextEntry
              value={oldPass}
              onChangeText={setOldPass}
              style={[styles.input, { backgroundColor: theme.input, color: theme.text }]}
              placeholderTextColor="#888"
            />
            <TextInput
              placeholder="New Password"
              secureTextEntry
              value={newPass}
              onChangeText={setNewPass}
              style={[styles.input, { backgroundColor: theme.input, color: theme.text }]}
              placeholderTextColor="#888"
            />
            <TextInput
              placeholder="Confirm Password"
              secureTextEntry
              value={confirmPass}
              onChangeText={setConfirmPass}
              style={[styles.input, { backgroundColor: theme.input, color: theme.text }]}
              placeholderTextColor="#888"
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={styles.roundBtn} onPress={handleChangePassword}>
                <Feather name="check" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.roundBtn} onPress={() => setShowPasswordModal(false)}>
                <Feather name="x" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const Section = ({ title, children, theme }: any) => (
  <View style={[styles.section, { backgroundColor: theme.card }]}>
    <Text style={[styles.sectionTitle, { color: theme.sub }]}>{title}</Text>
    {children}
  </View>
);

const SettingToggle = ({ label, icon, value, onToggle, theme }: any) => (
  <View style={[styles.row, { borderBottomColor: theme.border }]}>
    <MaterialCommunityIcons name={icon} size={22} color={theme.text} />
    <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onToggle}
      thumbColor={value ? '#fff' : '#ccc'}
      trackColor={{ false: '#ccc', true: '#4caf50' }}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  header: { alignItems: 'center', marginBottom: 24, gap: 6 },
  title: { fontSize: 24, fontWeight: '800' },
  section: { padding: 16, borderRadius: 14, marginBottom: 24, elevation: 2 },
  sectionTitle: { fontSize: 14, fontWeight: '600', marginBottom: 14 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  dropdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  label: { flex: 1, fontSize: 16, marginLeft: 12 },
  picker: { width: 120 },
  modalContainer: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '85%',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  roundBtn: {
    backgroundColor: '#356D35',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});