import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, ScrollView,
  TouchableOpacity, useColorScheme, Alert, Modal,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export default function HelpScreen() {
  const [search, setSearch] = useState('');
  const [reportText, setReportText] = useState('');
  const [selectedFAQ, setSelectedFAQ] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const theme = {
    bg: isDark ? '#121212' : '#f4f6f5',
    card: isDark ? '#1e1e1e' : '#fff',
    text: isDark ? '#fff' : '#222',
    input: isDark ? '#2c2c2c' : '#fff',
    placeholder: isDark ? '#888' : '#999',
  };

  const faqs = [
    'How do I change my password?',
    'Why can’t I log in?',
    'How do I track my progress?',
    'How to scan QR in the app?',
    'How to contact a dietitian?',
  ];

  const answers: { [key: string]: string[] } = {
    'How do I change my password?': [
      '1. Go to Settings → Account → Change Password.',
      '2. Enter your old password.',
      '3. Enter and confirm your new password.',
      '4. Tap Save to update securely.',
    ],
    'Why can’t I log in?': [
      '1. Ensure your email and password are correct.',
      '2. Check your internet connection.',
      '3. If forgotten, tap "Forgot Password" to reset.',
    ],
    'How do I track my progress?': [
      '1. Navigate to Profile → My Progress.',
      '2. View your weekly or monthly graph.',
      '3. Tap filters to explore stats.',
    ],
    'How to scan QR in the app?': [
      '1. Go to Scan tab or tap Camera icon.',
      '2. Grant camera permission if prompted.',
      '3. Point at a valid QR code.',
    ],
    'How to contact a dietitian?': [
      '1. Go to Profile → Contact Dietitian.',
      '2. Choose WhatsApp or SMS.',
      '3. You will be redirected to chat.',
    ],
  };

  const handleReport = () => {
    if (!reportText.trim()) {
      Alert.alert('Error', 'Please describe your issue.');
      return;
    }
    Alert.alert('Reported', 'Your report has been submitted.');
    setReportText('');
  };

  const openFAQ = (question: string) => {
    setSelectedFAQ(question);
    setShowModal(true);
  };

  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Search Bar */}
        <View style={[styles.searchBox, { backgroundColor: theme.input }]}>
          <Feather name="search" size={18} color={theme.placeholder} style={{ marginLeft: 12 }} />
          <TextInput
            placeholder="Search help..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor={theme.placeholder}
            style={[styles.searchInput, { color: theme.text }]}
          />
        </View>

        {/* FAQs */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Popular Questions</Text>
        {faqs
          .filter(q => q.toLowerCase().includes(search.toLowerCase()))
          .map((q, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.faqItem, { backgroundColor: theme.card }]}
              onPress={() => openFAQ(q)}
            >
              <Feather name="help-circle" size={20} color="#356D35" />
              <Text style={[styles.faqText, { color: theme.text }]}>{q}</Text>
            </TouchableOpacity>
          ))}

        {/* Report an Issue */}
        <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 24 }]}>Report a Problem</Text>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <TextInput
            multiline
            placeholder="Describe your issue here..."
            placeholderTextColor={theme.placeholder}
            value={reportText}
            onChangeText={setReportText}
            style={[
              styles.reportInput,
              {
                backgroundColor: theme.input,
                color: theme.text,
                borderColor: theme.placeholder,
              },
            ]}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleReport}>
            <MaterialCommunityIcons name="send" size={26} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* FAQ Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>{selectedFAQ}</Text>
            {answers[selectedFAQ ?? '']?.map((line, index) => (
              <Text key={index} style={[styles.modalContent, { color: theme.text }]}>
                {line}
              </Text>
            ))}
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowModal(false)}>
              <Feather name="x" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 30,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 1,
  },
  faqText: { marginLeft: 10, fontSize: 15, fontWeight: '500' },
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 40,
    elevation: 2,
    position: 'relative',
  },
  reportInput: {
    height: 120,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    fontSize: 15,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  sendBtn: {
    backgroundColor: '#356D35',
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    position: 'absolute',
    right: 16,
    bottom: 16,
    elevation: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    elevation: 5,
    position: 'relative',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  modalContent: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 6,
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#356D35',
    padding: 8,
    borderRadius: 18,
  },
});
