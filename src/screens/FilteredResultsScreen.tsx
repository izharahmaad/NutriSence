import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const mealsFilter = [
  {
    title: 'Avocado Toast',
    time: 15,
    kcal: 230,
    category: 'Breakfast',
    image: require('../../assets/filtermeals/avocado_toast.jpg'),
    description: 'Avocado Toast is a nutritious breakfast option made with whole-grain bread topped with mashed avocado and seasoning. It is rich in healthy fats, fiber, and keeps you full for hours.',
  },
  {
    title: 'Grilled Chicken Bowl',
    time: 25,
    kcal: 450,
    category: 'Lunch',
    image: require('../../assets/filtermeals/lunch1.jpg'),
    description: 'A protein-packed meal featuring grilled chicken, brown rice, and assorted vegetables. Ideal for post-workout recovery and balanced nutrition.',
  },
  {
    title: 'Mixed Berry Salad',
    time: 10,
    kcal: 150,
    category: 'Snacks',
    image: require('../../assets/filtermeals/snack1.jpg'),
    description: 'A refreshing mix of strawberries, blueberries, and raspberries. This antioxidant-rich snack helps in reducing inflammation and boosting immunity.',
  },
  {
    title: 'Vegetable Soup',
    time: 20,
    kcal: 180,
    category: 'Dinner',
    image: require('../../assets/filtermeals/dinner1.jpg'),
    description: 'A comforting soup made with seasonal vegetables, perfect for a light and healthy dinner. Low in calories but rich in vitamins and fiber.',
  },
  {
    title: 'Chocolate Mousse',
    time: 30,
    kcal: 300,
    category: 'Desert',
    image: require('../../assets/filtermeals/desert1.jpg'),
    description: 'A rich and creamy dessert made with dark chocolate and whipped cream. A perfect indulgence to satisfy sweet cravings in moderation.',
  },
  {
    title: 'Caesar Salad',
    time: 15,
    kcal: 270,
    category: 'Salad',
    image: require('../../assets/filtermeals/salad1.jpg'),
    description: 'Classic Caesar Salad with romaine lettuce, parmesan, and light dressing. Adds a crisp and savory touch to your meal with balanced nutrients.',
  },
  {
    title: 'Fresh Orange Juice',
    time: 5,
    kcal: 110,
    category: 'Juice',
    image: require('../../assets/filtermeals/juice1.jpg'),
    description: 'Freshly squeezed orange juice loaded with Vitamin C. Great for hydration and boosting immune function.',
  },
  {
    title: 'Tomato Soup',
    time: 20,
    kcal: 160,
    category: 'Soup',
    image: require('../../assets/filtermeals/soup1.jpg'),
    description: 'Warm and delicious tomato soup, perfect for a cozy dinner. Provides antioxidants like lycopene which support heart health.',
  },
];

const categories = [
  'Breakfast',
  'Lunch',
  'Snacks',
  'Dinner',
  'Desert',
  'Salad',
  'Juice',
  'Soup',
];

export default function FilteredResultsScreen() {
  const [activeType, setActiveType] = useState('Breakfast');
  const [cookTime, setCookTime] = useState(20);
  const [selectedCalories, setSelectedCalories] = useState('0-500');
  const [modalVisible, setModalVisible] = useState(false);

  const calorieRange = {
    '0-500': [0, 500],
    '500-1000': [500, 1000],
    '800-2000': [800, 2000],
    '2000+': [2000, Infinity],
  };

  const filteredMeals = mealsFilter.filter(
    (meal) =>
      meal.category === activeType &&
      meal.time <= cookTime &&
      meal.kcal >= calorieRange[selectedCalories][0] &&
      meal.kcal <= calorieRange[selectedCalories][1]
  );

  const bestMeal = filteredMeals[0];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerCircle}>
        <FontAwesome5 name="utensils" size={32} color="#fff" />
        <Text style={styles.headerTitle}>Refined Meal Results</Text>
      </View>

      <Text style={styles.label}>Meal Type</Text>
      <View style={styles.tagsContainer}>
        {categories.map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.tag, activeType === type && styles.activeTag]}
            onPress={() => setActiveType(type)}
          >
            <Text style={[styles.tagText, activeType === type && styles.activeTagText]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Cooking Time: {cookTime} min</Text>
      <Slider
        minimumValue={5}
        maximumValue={60}
        step={1}
        value={cookTime}
        onValueChange={setCookTime}
        minimumTrackTintColor="#356D35"
        maximumTrackTintColor="#ccc"
      />

      <Text style={styles.label}>Calories</Text>
      <View style={styles.caloriesContainer}>
        {Object.keys(calorieRange).map((range) => (
          <TouchableOpacity
            key={range}
            style={[styles.calorieBtn, selectedCalories === range && styles.activeCalorieBtn]}
            onPress={() => setSelectedCalories(range)}
          >
            <Text style={[styles.calorieText, selectedCalories === range && styles.activeCalorieText]}>
              {range} kcal
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.resultBtn} onPress={() => setModalVisible(true)}>
        <Text style={styles.resultText}>Show Results</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {bestMeal ? (
              <>
                <Image source={bestMeal.image} style={styles.modalImage} />
                <Text style={styles.modalTitle}>{bestMeal.title}</Text>
                <Text style={styles.modalText}>
                  Time: {bestMeal.time} min | {bestMeal.kcal} kcal
                </Text>
                <Text style={styles.modalTip}>{bestMeal.description}</Text>
              </>
            ) : (
              <Text style={styles.modalTitle}>No matching meals found.</Text>
            )}
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fefefe', padding: 20 },
  headerCircle: {
    backgroundColor: '#356D35',
    borderRadius: 60,
    width: 120,
    height: 120,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#121212',
    marginTop: 24,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    marginBottom: 10,
  },
  activeTag: {
    backgroundColor: '#356D35',
    borderColor: '#356D35',
  },
  tagText: { color: '#333', fontWeight: '500' },
  activeTagText: { color: '#fff', fontWeight: '600' },
  caloriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  calorieBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    marginBottom: 10,
  },
  activeCalorieBtn: {
    backgroundColor: '#356D35',
    borderColor: '#356D35',
  },
  calorieText: { color: '#333' },
  activeCalorieText: { color: '#fff' },
  resultBtn: {
    backgroundColor: '#356D35',
    marginTop: 30,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  resultText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    width: Dimensions.get('window').width * 0.85,
    borderRadius: 20,
    alignItems: 'center',
  },
  modalImage: {
    width: 150,
    height: 150,
    borderRadius: 12,
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#121212',
    marginBottom: 6,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  modalTip: {
    fontSize: 13,
    color: '#444',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 10,
  },
  closeBtn: {
    marginTop: 10,
    backgroundColor: '#356D35',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  closeText: {
    color: '#fff',
    fontWeight: '600',
  },
});
