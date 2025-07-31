import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  useColorScheme,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  MaterialCommunityIcons,
  Ionicons,
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

interface UserProfile {
  name: string;
  imageUrl: string;
  weight: string;
  height: string;
  age: string;
}

export default function ProfileScreen() {
  const [user, setUser] = useState<UserProfile>({
    name: 'User',
    imageUrl: '',
    weight: '64 kg',
    height: '175 cm',
    age: '27',
  });
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const theme = {
    bg: isDark ? '#121212' : '#f1f5f3',
    card: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.95)',
    text: isDark ? '#fff' : '#121212',
    sub: isDark ? '#aaa' : '#666',
    red: '#e74c3c',
  };

  const fetchUserFromFirestore = async () => {
    try {
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('__name__', '>=', 'profile_'), where('__name__', '<', 'profile_~'));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        const updatedUser = {
          name: userData.name || 'User',
          imageUrl: userData.imageUrl || '',
          weight: userData.weight || '64 kg',
          height: userData.height || '175 cm',
          age: userData.age || '27',
        };

        setUser(updatedUser);
        await AsyncStorage.setItem('profileData', JSON.stringify(updatedUser));
      } else {
        console.log('Error', 'No user profile found. Please ensure your profile is set up.');
      }
    } catch (error) {
      console.error('Error fetching user data from Firestore:', error);
      Alert.alert('Error', 'Failed to fetch user data. Please try again.');
    }
  };

  useEffect(() => {
    fetchUserFromFirestore();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserFromFirestore();
    setRefreshing(false);
  }, []);

  const handleImagePick = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Denied', 'We need media access to update your profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images' as any,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const newImage = result.assets[0].uri;
        const updatedUser = { ...user, imageUrl: newImage };
        setUser(updatedUser);
        await AsyncStorage.setItem('profileData', JSON.stringify(updatedUser));
        Alert.alert('Success', 'Profile picture updated successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while picking the image.');
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleImagePick} style={styles.avatarWrapper}>
          <Image
            source={{ uri: user.imageUrl || 'https://via.placeholder.com/100' }}
            style={styles.avatar}
          />
          <View style={styles.cameraIcon}>
            <Ionicons name="camera" size={16} color="#fff" />
          </View>
        </TouchableOpacity>

        <View style={styles.nameBlock}>
          <Text style={[styles.fullName, { color: theme.text }]}>
            {user.name}
          </Text>
          <Text style={[styles.subLabel, { color: theme.sub }]}>Active Member</Text>
        </View>

        <View style={[styles.metricsCard, { borderColor: theme.red }]}>
          <Metric label="Weight" value={user.weight} icon="weight-kilogram" color={theme.text} />
          <Metric label="Height" value={user.height} icon="human-male-height" color={theme.text} />
          <Metric label="Age" value={user.age} icon="calendar" color={theme.text} />
        </View>
      </View>

      <Section title="Devices" theme={theme}>
        <ProfileItem label="Connect Device" icon="bluetooth" onPress={() => navigation.navigate('ConnectDevice')} theme={theme} />
      </Section>

      <Section title="Account" theme={theme}>
        <ProfileItem label="Edit Profile" icon="account-edit" onPress={() => navigation.navigate('EditProfile')} theme={theme} />
        <ProfileItem label="Notification" icon="bell-outline" onPress={() => navigation.navigate('Notification')} theme={theme} />
      </Section>

      <Section title="Statistics" theme={theme}>
        <ProfileItem label="Edit Plan" icon="calendar-edit" onPress={() => navigation.navigate('EditPlan')} theme={theme} />
        <ProfileItem label="My Progress" icon="chart-line" onPress={() => navigation.navigate('MyProgress')} theme={theme} />
      </Section>

      <Section title="My Scan" theme={theme}>
        <ProfileItem label="My Scan" icon="qrcode-scan" onPress={() => navigation.navigate('MyScan')} theme={theme} />
      </Section>

      <Section title="Help & Tools" theme={theme}>
        <ProfileItem label="Settings" icon="cog-outline" onPress={() => navigation.navigate('Settings')} theme={theme} />
        <ProfileItem label="Help & Report" icon="message-question-outline" onPress={() => navigation.navigate('Help')} theme={theme} />
        <ProfileItem label="Theme Mode" icon="theme-light-dark" onPress={() => navigation.navigate('Theme')} theme={theme} />
        <ProfileItem label="Contact Your Dietitian" icon="account-heart-outline" onPress={() => navigation.navigate('ContactDietitian')} theme={theme} />
      </Section>

      <Section title="About" theme={theme}>
        <ProfileItem label="About & Rules" icon="information-outline" onPress={() => navigation.navigate('AboutApp')} theme={theme} />
      </Section>

      <Section title="" theme={theme}>
        <View style={{ alignItems: 'center', marginBottom: 30 }}>
          <TouchableOpacity
            style={styles.circularLogout}
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: 'Tips' as never }],
              })
            }
          >
            <MaterialCommunityIcons name="logout" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={{ color: theme.sub, marginTop: 8, fontSize: 14 }}>Logout</Text>
        </View>
      </Section>
    </ScrollView>
  );
}

const Metric = ({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: any;
  color: string;
}) => (
  <View style={styles.metricItem}>
    <MaterialCommunityIcons name={icon} size={20} color={color} />
    <Text style={[styles.metricLabel, { color }]}>{label}</Text>
    <Text style={[styles.metricValue, { color }]}>{value}</Text>
  </View>
);

const Section = ({ title, children, theme }: { title: string; children: React.ReactNode; theme: any }) => (
  <View style={[styles.section, { backgroundColor: theme.card }]}>
    {title ? <Text style={[styles.sectionTitle, { color: theme.sub }]}>{title}</Text> : null}
    {children}
  </View>
);

const ProfileItem = ({
  icon,
  label,
  onPress,
  theme,
}: {
  icon: any;
  label: string;
  onPress?: () => void;
  theme: any;
}) => (
  <TouchableOpacity style={styles.option} onPress={onPress}>
    <MaterialCommunityIcons name={icon} size={22} color="#356D35" />
    <Text style={[styles.optionText, { color: theme.text }]}>{label}</Text>
    <Ionicons name="chevron-forward" size={20} color="#999" style={{ marginLeft: 'auto' }} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
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
    borderRadius: 16,
    borderColor: '#fff',
    borderWidth: 2,
  },
  nameBlock: {
    alignItems: 'center',
    marginBottom: 12,
  },
  fullName: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subLabel: {
    fontSize: 13,
    marginTop: 2,
    opacity: 0.7,
  },
  metricsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    borderWidth: 2,
    borderColor: '#e74c3c',
    borderRadius: 14,
    padding: 16,
    backgroundColor: '#fff',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 13,
    marginTop: 4,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 2,
  },
  section: {
    borderRadius: 16,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    marginHorizontal: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 16,
    marginLeft: 12,
  },
  circularLogout: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});