import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  useColorScheme,
  Alert,
  Image,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const RULES: { icon: 'account-lock-outline' | 'food-outline' | 'chat-alert-outline' | 'lock-outline' | 'medical-bag'; title: string; detail: string }[] = [
  {
    icon: 'account-lock-outline',
    title: 'Personal Use Only',
    detail: 'NutriSense accounts are strictly for individual use. Sharing login credentials, using a single account across multiple users, or misrepresenting identity undermines data accuracy and system integrity. This compromises your health tracking and may lead to inaccurate assessments or unintended exposure of personal data. We take these violations seriously to protect user experience and system reliability. Please register and maintain separate accounts for each individual to ensure tailored recommendations, secure data, and compliant use of our wellness platform.',
  },
  {
    icon: 'food-outline',
    title: 'Nutrition Accuracy',
    detail: 'While NutriSense uses cutting-edge AI and verified nutritional databases, exact values of scanned foods may vary. Factors such as portion size, preparation method, and ingredients can impact final values. We recommend reviewing and adjusting the nutritional breakdown after each scan for accuracy. NutriSense is a tool to support, not replace, mindful tracking. Being engaged and diligent with your logs ensures better guidance, insights, and progress toward your goals. Treat each scan as an assistive input that works best with your awareness.',
  },
  {
    icon: 'chat-alert-outline',
    title: 'Respectful Behavior',
    detail: 'Our platform promotes respectful, encouraging, and inclusive communication. Whether engaging with support agents, health advisors, or fellow users, we expect kindness and professionalism. Harassment, abusive language, or spamming will not be tolerated and may result in account suspension. Creating a safe space ensures everyone can benefit from NutriSense resources. Be mindful of tone and content in all messages. Remember, the experience of others is shaped by community respect. Help us keep NutriSense a positive and empowering space for all.',
  },
  {
    icon: 'lock-outline',
    title: 'Privacy Protection',
    detail: 'NutriSense upholds the highest standards of privacy and data protection. All user data is encrypted and stored securely. We do not sell your data to third parties. You have the right to view, download, or delete your information at any time through account settings. Our system complies with global data protection laws. Trust is at the center of our mission, and transparency is how we earn it. Your data belongs to you, and we exist to help you use it responsibly and confidently to improve your health journey.',
  },
  {
    icon: 'medical-bag',
    title: 'Medical Disclaimer',
    detail: 'NutriSense provides tools for health support and nutritional awareness but does not offer clinical diagnosis or replace professional medical care. All recommendations are informational and based on general health data. Always consult with your physician before making major dietary or lifestyle changes. Our features are designed to assist in wellness tracking and habit-building. While helpful for most users, they are not a substitute for personalized medical supervision. Use NutriSense alongside, not instead of, professional care.',
  },
];

export default function AboutAppScreen() {
  const [agreed, setAgreed] = useState(false);
  const [selectedRule, setSelectedRule] = useState<{ icon: string; title: string; detail: string } | null>(null);
  const isDark = useColorScheme() === 'dark';
  const navigation = useNavigation();

  const theme = {
    bg: isDark ? '#121212' : '#fefefe',
    text: isDark ? '#fff' : '#121212',
    sub: isDark ? '#aaa' : '#555',
    icon: '#356D35',
    primary: '#356D35',
  };

  const handleAgree = () => {
    setAgreed(true);
    Alert.alert("You're Ready!", "Thanks for agreeing to NutriSense's guidelines.");
    navigation.goBack();
  };

  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Header with image */}
        <View style={styles.headerWrapper}>
          <Image source={require('../../assets/header-bg1.jpg')} style={styles.headerImage} />
          <View style={styles.headerContent}>
            <MaterialCommunityIcons name="heart-pulse" size={34} color="#fff" />
            <Text style={styles.headerTitle}>NutriSense</Text>
            <Text style={styles.headerSubtitle}>Your Wellness Companion</Text>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Ionicons name="information-circle-outline" size={26} color={theme.icon} />
          <Text style={[styles.title, { color: theme.text }]}>About NutriSense</Text>
          <Text style={[styles.text, { color: theme.sub }]}>NutriSense is a personalized health and wellness app that combines nutrition science with technology to help users reach their dietary goals. Using AI-powered food scanning, NutriSense provides real-time nutritional insights from photos, while tracking your macros, hydration, activity, and progress over time. Whether you're managing weight, building strength, or just eating better, NutriSense makes healthy living intuitive. All features are designed with user privacy, simplicity, and results in mind, with a team of experts behind the scenes.</Text>
        </View>

        {/* Rules */}
        <View style={styles.section}>
          <MaterialCommunityIcons name="shield-check-outline" size={26} color={theme.icon} />
          <Text style={[styles.title, { color: theme.text }]}>Rules & Guidelines</Text>

          {RULES.map((rule, index) => (
            <TouchableOpacity key={index} style={styles.ruleRow} onPress={() => setSelectedRule(rule)}>
              <MaterialCommunityIcons name={rule.icon} size={24} color={theme.icon} />
              <Text style={[styles.ruleTitle, { color: theme.text }]}>{rule.title}</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.sub} style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Confirm */}
        <View style={styles.section}>
          <MaterialCommunityIcons name="checkbox-marked-circle-outline" size={26} color={theme.icon} />
          <Text style={[styles.title, { color: theme.text }]}>Agree & Continue</Text>
          <Text style={[styles.text, { color: theme.sub }]}>By tapping the button below, you confirm that you understand and accept all NutriSense policies.</Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary, opacity: agreed ? 0.5 : 1 }]}
            disabled={agreed}
            onPress={handleAgree}
          >
            <Text style={styles.buttonText}>{agreed ? "Agreed" : "Agree & Continue"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal visible={!!selectedRule} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{selectedRule?.title}</Text>
            <Text style={styles.modalContent}>{selectedRule?.detail}</Text>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setSelectedRule(null)}>
              <Text style={{ color: '#fff', fontWeight: '600' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerWrapper: {
    height: 240,
    position: 'relative',
    overflow: 'hidden',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  headerImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    marginTop: 10,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFA500',
    marginTop: 4,
    borderRadius: 50,
  },
  section: {
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 14,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  ruleTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  button: {
    marginTop: 24,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignSelf: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 22,
    borderRadius: 16,
    maxWidth: 320,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalContent: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  modalCloseBtn: {
    backgroundColor: '#356D35',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 30,
  },
});
