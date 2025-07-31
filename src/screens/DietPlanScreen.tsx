import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
  Alert,
  Platform,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

const images = {
  breakfast: require('../../assets/breakfast.jpg'),
  lunch: require('../../assets/lunch.jpg'),
  snack: require('../../assets/snack.jpg'),
  dinner: require('../../assets/dinner.jpg'),
  sleep: require('../../assets/sleep1.jpg'),
};

const mealPlans: any = {
  Muslim: {
    Pakistan: {
      breakfast: {
        title: 'Breakfast',
        calories: '350 kcal',
        benefits: 'Traditional start with protein and carbs.',
        items: ['Aloo Paratha', 'Chai'],
      },
      lunch: {
        title: 'Lunch',
        calories: '650 kcal',
        benefits: 'Rich in flavor and nutrients.',
        items: ['Chicken Karahi', 'Naan', 'Salad'],
      },
      snack: {
        title: 'Snack',
        calories: '200 kcal',
        benefits: 'Hydrating and refreshing.',
        items: ['Rooh Afza', 'Fruit Chaat'],
      },
      dinner: {
        title: 'Dinner',
        calories: '500 kcal',
        benefits: 'Light but filling.',
        items: ['Daal Chawal', 'Cucumber Raita'],
      },
      sleep: {
        title: 'Sleep',
        benefits: 'Helps digestion and recovery.',
        items: ['Sleep 7–8 hrs; avoid spicy foods late.'],
      },
    },
    India: {
      breakfast: {
        title: 'Breakfast',
        calories: '360 kcal',
        benefits: 'Nutritious and filling.',
        items: ['Idli Sambhar', 'Herbal Tea'],
      },
      lunch: {
        title: 'Lunch',
        calories: '600 kcal',
        benefits: 'Balanced and hearty.',
        items: ['Mutton Curry', 'Rice', 'Salad'],
      },
      snack: {
        title: 'Snack',
        calories: '180 kcal',
        benefits: 'Good for hydration.',
        items: ['Buttermilk', 'Banana'],
      },
      dinner: {
        title: 'Dinner',
        calories: '450 kcal',
        benefits: 'Helps wind down the day.',
        items: ['Chicken Pulao', 'Mint Raita'],
      },
      sleep: {
        title: 'Sleep',
        benefits: 'Aids muscle recovery and stress relief.',
        items: ['Avoid caffeine; stretch before bed.'],
      },
    },
    Bangladesh: {
      breakfast: {
        title: 'Breakfast',
        calories: '370 kcal',
        benefits: 'Traditional and sustaining.',
        items: ['Paratha', 'Boiled Egg', 'Tea'],
      },
      lunch: {
        title: 'Lunch',
        calories: '620 kcal',
        benefits: 'High protein and fiber.',
        items: ['Fish Curry', 'Rice', 'Vegetables'],
      },
      snack: {
        title: 'Snack',
        calories: '160 kcal',
        benefits: 'Fresh and hydrating.',
        items: ['Coconut Water', 'Seasonal Fruits'],
      },
      dinner: {
        title: 'Dinner',
        calories: '470 kcal',
        benefits: 'Light with good nutrition.',
        items: ['Lentil Soup', 'Chapati', 'Cucumber'],
      },
      sleep: {
        title: 'Sleep',
        benefits: 'Important for healthy metabolism.',
        items: ['Dark room; 7–8 hrs sleep.'],
      },
    },
    Turkey: {
      breakfast: {
        title: 'Breakfast',
        calories: '400 kcal',
        benefits: 'Fresh start with variety.',
        items: ['Simit', 'Cheese', 'Olives', 'Tea'],
      },
      lunch: {
        title: 'Lunch',
        calories: '600 kcal',
        benefits: 'Balanced and rich in nutrients.',
        items: ['Kebab', 'Rice Pilaf', 'Ayran'],
      },
      snack: {
        title: 'Snack',
        calories: '180 kcal',
        benefits: 'Boosts energy.',
        items: ['Dried Fruits', 'Nuts'],
      },
      dinner: {
        title: 'Dinner',
        calories: '480 kcal',
        benefits: 'Balanced evening meal.',
        items: ['Lentil Soup', 'Bread', 'Salad'],
      },
      sleep: {
        title: 'Sleep',
        benefits: 'Improves heart health and memory.',
        items: ['No heavy food 2 hours before sleep.'],
      },
    },
    Indonesia: {
      breakfast: {
        title: 'Breakfast',
        calories: '390 kcal',
        benefits: 'Spicy and energizing.',
        items: ['Nasi Goreng', 'Fried Egg'],
      },
      lunch: {
        title: 'Lunch',
        calories: '640 kcal',
        benefits: 'Balanced with carbs and protein.',
        items: ['Satay', 'Rice', 'Veggies'],
      },
      snack: {
        title: 'Snack',
        calories: '170 kcal',
        benefits: 'Keeps blood sugar stable.',
        items: ['Banana Fritters', 'Tea'],
      },
      dinner: {
        title: 'Dinner',
        calories: '460 kcal',
        benefits: 'Nutritious and light.',
        items: ['Vegetable Soup', 'Rice'],
      },
      sleep: {
        title: 'Sleep',
        benefits: 'Regulates hormones and reduces stress.',
        items: ['Sleep by 10 PM for max benefit.'],
      },
    },
  },
  Hindu: {
    India: {
      breakfast: {
        title: 'Breakfast',
        calories: '300-400 kcal',
        benefits: 'Light start with energy boost.',
        items: ['Poha', 'Masala Chai'],
      },
      lunch: {
        title: 'Lunch',
        calories: '500-600 kcal',
        benefits: 'Balanced vegetarian thali.',
        items: ['Chapati', 'Dal', 'Sabzi', 'Rice'],
      },
      snack: {
        title: 'Snack',
        calories: '150-250 kcal',
        benefits: 'Refreshing and light.',
        items: ['Fruit Bowl', 'Buttermilk'],
      },
      dinner: {
        title: 'Dinner',
        calories: '400-500 kcal',
        benefits: 'Easy-to-digest meal.',
        items: ['Khichdi', 'Curd'],
      },
      sleep: {
        title: 'Sleep',
        benefits: '8 hours restful sleep recommended.',
        items: ['Avoid screen time before bed.'],
      },
    },
  },
};

const sectionIcons = {
  breakfast: 'sunny-outline',
  lunch: 'fast-food-outline',
  snack: 'cafe-outline',
  dinner: 'moon-outline',
  sleep: 'bed-outline',
};

export default function DietPlanScreen() {
  const [religion, setReligion] = useState('');
  const [region, setRegion] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState<any>(null);

  const selectedMeals = mealPlans?.[religion]?.[region] || null;

  const handleSearch = () => {
    if (!religion || !region) {
      Alert.alert('Input Missing', 'Please enter both religion and region.');
      return;
    }
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ marginTop: Platform.OS === 'ios' ? 70 : 50 }}>
        <View style={styles.titleRow}>
          <Ionicons name="leaf-outline" size={22} color="#356D35" />
          <Text style={styles.title}>Your Personalized Diet Plan</Text>
        </View>
      </View>

      <View style={styles.inputRow}>
        <FontAwesome5 name="place-of-worship" size={16} color="#444" />
        <TextInput
          style={styles.input}
          placeholder="Religion (e.g., Muslim, Hindu)"
          value={religion}
          onChangeText={setReligion}
        />
      </View>

      <View style={styles.inputRow}>
        <Ionicons name="earth-outline" size={18} color="#444" />
        <TextInput
          style={styles.input}
          placeholder="Region (e.g., Pakistan, India)"
          value={region}
          onChangeText={setRegion}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Ionicons name="restaurant-outline" size={18} color="#fff" />
        <Text style={styles.buttonText}>Get Diet Plan</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#356D35" style={{ marginTop: 20 }} />}

      {!loading && selectedMeals && (
        <View>
          {Object.entries(selectedMeals).map(([section, data], idx, arr) => (
            <Pressable key={section} onPress={() => setSelectedSection({ section, data })}>
              <View style={[styles.card, idx === arr.length - 1 && { marginBottom: 40 }]}>
                <Image source={images[section as keyof typeof images]} style={styles.image} />
                <View style={styles.overlay} />
                <View style={styles.cardContent}>
                  <View style={styles.header}>
                    <Ionicons
                      name={sectionIcons[section as keyof typeof sectionIcons] as keyof typeof Ionicons.glyphMap}
                      size={20}
                      color="#fff"
                    />
                    <Text style={styles.sectionTitle}>{(data as any).title?.toUpperCase()}</Text>
                  </View>
                  {(data as any).items?.map((item: string, idx: number) => (
                    <Text key={idx} style={styles.itemText}>• {item}</Text>
                  ))}
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      )}

      <Modal visible={!!selectedSection} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedSection && (
              <>
                <Text style={styles.modalTitle}>{selectedSection.data.title}</Text>
                <Text style={styles.modalLabel}>Items:</Text>
                {selectedSection.data.items.map((item: string, idx: number) => (
                  <Text key={idx} style={styles.modalText}>• {item}</Text>
                ))}
                {selectedSection.data.calories && (
                  <Text style={styles.modalText}>Calories: {selectedSection.data.calories}</Text>
                )}
                <Text style={styles.modalText}>Benefits: {selectedSection.data.benefits}</Text>

                <TouchableOpacity style={styles.modalClose} onPress={() => setSelectedSection(null)}>
                  <Text style={styles.modalCloseText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
    backgroundColor: '#eef3ee',
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#121212',
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 12,
    gap: 8,
  },
  input: { flex: 1, fontSize: 14 },
  button: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#356D35',
    padding: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  card: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    elevation: 3,
  },
  image: { width: '100%', height: 180, resizeMode: 'cover' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  cardContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    justifyContent: 'center',
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  itemText: { fontSize: 14, color: '#fefefe', marginBottom: 4, paddingLeft: 6 },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 360,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalLabel: { fontWeight: '600', marginBottom: 4 },
  modalText: { fontSize: 14, marginBottom: 6 },
  modalClose: {
    backgroundColor: '#356D35',
    padding: 10,
    borderRadius: 10,
    marginTop: 16,
    alignItems: 'center',
  },
  modalCloseText: { color: '#fff', fontWeight: '600' },
});
