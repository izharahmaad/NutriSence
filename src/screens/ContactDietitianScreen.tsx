import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Linking,
  Image,
  ScrollView,
  useColorScheme,
  Alert,
  Dimensions,
} from 'react-native';
import {
  MaterialCommunityIcons,
  Ionicons,
  Feather,
} from '@expo/vector-icons';

const { height } = Dimensions.get('window');

export default function ContactDietitianScreen() {
  const [message, setMessage] = useState('');
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const phone = '+923030723372';
  const email = 'dr.kiran@example.com';

  const theme = {
    bg: isDark ? '#121212' : '#f3f5f4',
    card: isDark ? '#1e1e1e' : '#fff',
    text: isDark ? '#fff' : '#222',
    input: isDark ? '#2b2b2b' : '#fff',
  };

  const handleWhatsApp = () => {
    if (!message.trim()) {
      Alert.alert('⚠️ Message Required', 'Please type a message first.');
      return;
    }
    Linking.openURL(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
    Alert.alert('✅ Sent', 'Message sent to Dr. Kiran Rabi via WhatsApp.');
    setMessage('');
  };

  const handleCall = () => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${email}?subject=Nutrition Help&body=${encodeURIComponent(message)}`);
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        {
          backgroundColor: theme.bg,
          minHeight: height,
          justifyContent: 'center',
        },
      ]}
    >
      <View style={[styles.card, { backgroundColor: theme.card, shadowColor: theme.text }]}>
        {/* Doctor Info */}
        <View style={styles.avatarSection}>
          <Image
            source={require('../../assets/dr-kiran.jpg')} // ✅ Replace with your image
            style={styles.avatar}
          />
          <Text style={[styles.name, { color: theme.text }]}>Dr. Kiran Rabi</Text>
          <Text style={[styles.title, { color: theme.text }]}>Clinical Dietitian | Certified Nutritionist</Text>
          <Text style={[styles.sub, { color: theme.text }]}>Mon - Sat · 9:00 AM – 5:00 PM</Text>
        </View>

        {/* Contact Buttons */}
        <View style={styles.buttonGroup}>
          <ContactButton
            icon={<Ionicons name="logo-whatsapp" size={24} color="#fff" />}
            label="WhatsApp"
            onPress={handleWhatsApp}
          />
          <ContactButton
            icon={<Feather name="phone-call" size={22} color="#fff" />}
            label="Call"
            onPress={handleCall}
          />
          <ContactButton
            icon={<MaterialCommunityIcons name="email-outline" size={24} color="#fff" />}
            label="Email"
            onPress={handleEmail}
          />
        </View>

        {/* Message Section */}
        <Text style={[styles.label, { color: theme.text }]}>Write a Message</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.input,
              color: theme.text,
              borderColor: isDark ? '#444' : '#ccc',
            },
          ]}
          multiline
          placeholder="Describe your issue or message here..."
          placeholderTextColor={isDark ? '#888' : '#888'}
          value={message}
          onChangeText={setMessage}
        />

        {/* Send Button */}
        <TouchableOpacity style={styles.sendBtn} onPress={handleWhatsApp}>
          <MaterialCommunityIcons name="send-circle" size={22} color="#fff" />
          <Text style={styles.sendText}>Send Message</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Button component
const ContactButton = ({ icon, label, onPress }: any) => (
  <TouchableOpacity style={styles.circleButtonWrap} onPress={onPress}>
    <View style={styles.circleButton}>{icon}</View>
    <Text style={styles.buttonLabel}>{label}</Text>
  </TouchableOpacity>
);

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    elevation: 4,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#356D35',
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
  },
  title: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  sub: {
    fontSize: 13,
    marginTop: 2,
    color: '#888',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 28,
    marginTop: 16,
  },
  circleButtonWrap: {
    alignItems: 'center',
  },
  circleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#356D35',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    elevation: 4,
  },
  buttonLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 2,
  },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    fontSize: 15,
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  sendBtn: {
    backgroundColor: '#356D35',
    paddingVertical: 14,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 10,
  },
});
