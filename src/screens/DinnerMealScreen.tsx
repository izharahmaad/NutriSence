import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

const meals = [
  {
    title: 'Grilled Chicken',
    time: '30 min',
    kcal: 350,
    image: require('../../assets/mealsCS/dinner-1.jpg'),
    tips: 'Lean protein that supports muscle growth and keeps you full.'
  },
  {
    title: 'Steamed Veggies',
    time: '20 min',
    kcal: 150,
    image: require('../../assets/mealsCS/dinner-2.jpg'),
    tips: 'Rich in fiber and essential vitamins, great for digestion.'
  },
  {
    title: 'Salmon Bowl',
    time: '25 min',
    kcal: 400,
    image: require('../../assets/mealsCS/dinner-3.jpg'),
    tips: 'High in Omega-3 fatty acids, good for heart health.'
  },
  {
    title: 'Quinoa Salad',
    time: '22 min',
    kcal: 300,
    image: require('../../assets/mealsCS/dinner-4.jpg'),
    tips: 'Packed with protein and antioxidants for overall wellness.'
  }
];

const trending = [
  {
    title: 'Zucchini Pasta',
    servings: '1 bowl',
    time: '20 min',
    image: require('../../assets/mealsCS/trending1.jpg'),
    tips: 'Low carb and perfect alternative to pasta.'
  },
  {
    title: 'Kale Stir Fry',
    servings: '1 plate',
    time: '15 min',
    image: require('../../assets/mealsCS/trending2.jpg'),
    tips: 'Rich in calcium and iron, helps detox the body.'
  },
  {
    title: 'Tofu Wraps',
    servings: '2 wraps',
    time: '25 min',
    image: require('../../assets/mealsCS/trending3.jpg'),
    tips: 'Plant-based protein that satisfies hunger.'
  },
  {
    title: 'Broccoli Soup',
    servings: '1 bowl',
    time: '18 min',
    image: require('../../assets/mealsCS/trending4.jpg'),
    tips: 'High in fiber and vitamin C to boost immunity.'
  },
  {
    title: 'Chickpea Curry',
    servings: '1 plate',
    time: '30 min',
    image: require('../../assets/mealsCS/trending5.jpg'),
    tips: 'Rich in protein and iron for sustained energy.'
  },
];

export default function DinnerMealScreen() {
  const [search, setSearch] = useState('');
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectMeal = (meal) => {
    setSelectedMeal(meal);
    setModalVisible(true);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Dinner</Text>
        <Text style={styles.date}>Today, {new Date().toLocaleDateString()}</Text>
      </View>

      <View style={styles.searchBar}>
        <TextInput
          placeholder="Search food..."
          value={search}
          onChangeText={setSearch}
          style={styles.input}
        />
        <Feather name="search" size={20} color="#555" />
      </View>

      <Text style={styles.sectionTitle}>Healthy Dinner Recipes</Text>
      <View style={styles.grid}>
        {meals.map((meal, index) => (
          <TouchableOpacity key={index} style={styles.card} onPress={() => handleSelectMeal(meal)}>
            <Image source={meal.image} style={styles.image} />
            <Text style={styles.mealTitle}>{meal.title}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>{meal.time}</Text>
              <Text style={styles.infoText}>{meal.kcal} Kcal</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Trending and Easy Recipes</Text>
      <View style={styles.grid}>
        {trending.map((meal, index) => (
          <TouchableOpacity key={index} style={styles.card} onPress={() => handleSelectMeal(meal)}>
            <Image source={meal.image} style={styles.image} />
            <Text style={styles.mealTitle}>{meal.title}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>{meal.servings}</Text>
              <Text style={styles.infoText}>{meal.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedMeal?.title}</Text>
            <Text style={styles.modalTip}>{selectedMeal?.tips}</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: { marginBottom: 20 },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#121212',
  },
  date: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#121212',
    marginBottom: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  card: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 10,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  mealTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#121212',
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoText: {
    fontSize: 12,
    color: '#888',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  modalTip: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    marginBottom: 20,
  },
  closeBtn: {
    backgroundColor: '#356D35',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  closeText: {
    color: '#fff',
    fontWeight: '600',
  },
});
