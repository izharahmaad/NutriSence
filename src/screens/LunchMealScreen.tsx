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
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

const lunchMeals = [
  {
    title: 'Grilled Chicken Salad',
    time: '30 min',
    kcal: 350,
    image: require('../../assets/mealsCS/lunch1.jpg'),
    tips: 'High protein, low fat. Keeps you full and energized through the day. Great post-workout meal. Rich in vitamins. Easily digestible.'
  },
  {
    title: 'Quinoa Bowl',
    time: '25 min',
    kcal: 320,
    image: require('../../assets/mealsCS/lunch2.jpg'),
    tips: 'Packed with plant protein. Contains essential amino acids. Good source of fiber. Aids digestion. Gluten-free.'
  },
  {
    title: 'Veggie Pasta',
    time: '35 min',
    kcal: 400,
    image: require('../../assets/mealsCS/lunch3.jpg'),
    tips: 'Rich in complex carbs. Adds variety to meal plan. High fiber content. Balanced energy source. Good for active days.'
  },
  {
    title: 'Stuffed Bell Peppers',
    time: '40 min',
    kcal: 380,
    image: require('../../assets/mealsCS/lunch4.jpg'),
    tips: 'Low in calories. Boosts immunity. Filled with nutrients. Rich in antioxidants. Colorful and filling.'
  },
];

const trendingMeals = [
  {
    title: 'Avocado Toast',
    servings: '2 servings',
    time: '20 min',
    image: require('../../assets/mealsCS/trending1.jpg'),
    tips: 'Heart-healthy fats. Quick and easy. Great breakfast. High fiber. Versatile with toppings.'
  },
  {
    title: 'Kale Smoothie',
    servings: '1 glass',
    time: '10 min',
    image: require('../../assets/mealsCS/trending2.jpg'),
    tips: 'Detox booster. Rich in iron and calcium. Great for skin. Antioxidant-rich. Keeps you refreshed.'
  },
  {
    title: 'Tofu Stir Fry',
    servings: '1 bowl',
    time: '25 min',
    image: require('../../assets/mealsCS/trending3.jpg'),
    tips: 'High protein plant-based meal. Fast to prepare. Customizable veggies. Low calorie. Boosts energy.'
  },
  {
    title: 'Chickpea Wrap',
    servings: '1 wrap',
    time: '15 min',
    image: require('../../assets/mealsCS/trending4.jpg'),
    tips: 'Rich in protein and fiber. Keeps you full. Easy to carry. Great lunch box item. Flavorful and filling.'
  },
  {
    title: 'Green Detox Bowl',
    servings: '1 bowl',
    time: '15 min',
    image: require('../../assets/mealsCS/trending5.jpg'),
    tips: 'Cleanses your system. Nutrient-rich. Balances gut health. Adds greens to your day. Energizing and light.'
  }
];

export default function LunchMealScreen() {
  const [search, setSearch] = useState('');
  const [selectedTips, setSelectedTips] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const filteredMeals = lunchMeals.filter(meal =>
    meal.title.toLowerCase().includes(search.toLowerCase())
  );

  const openTips = (tips) => {
    setSelectedTips(tips);
    setModalVisible(true);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Your Lunch</Text>
          <Text style={styles.date}>Today, {new Date().toLocaleDateString()}</Text>
        </View>
      </View>

      {/* Search + Filter */}
      <View style={styles.searchFilter}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search meals..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />
        <Feather name="sliders" size={22} color="#333" style={{ marginLeft: 12 }} />
      </View>

      {/* Meals Grid */}
      <View style={styles.grid}>
        {filteredMeals.map((meal, index) => (
          <TouchableOpacity key={index} style={styles.card} onPress={() => openTips(meal.tips)}>
            <Image source={meal.image} style={styles.image} />
            <Text style={styles.mealTitle}>{meal.title}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>{meal.time}</Text>
              <Text style={styles.infoText}>{meal.kcal} Kcal</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Trending Section */}
      <Text style={styles.sectionHeading}>Trending and Easy Recipes</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.trendingScroll}>
        {trendingMeals.map((meal, idx) => (
          <TouchableOpacity key={idx} style={styles.trendCard} onPress={() => openTips(meal.tips)}>
            <Image source={meal.image} style={styles.trendImage} />
            <Text style={styles.trendTitle}>{meal.title}</Text>
            <Text style={styles.trendSubtitle}>{meal.servings}</Text>
            <Text style={styles.trendTime}>{meal.time}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tips Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Meal Info</Text>
            <Text style={styles.modalTips}>{selectedTips}</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 20, fontWeight: '800', color: '#121212',  marginTop: 20, },
  date: { fontSize: 13, color: '#999' }, 
  searchFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 42,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 14,
    color: '#333',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 10,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  mealTitle: { fontSize: 14, fontWeight: '600', color: '#121212', marginBottom: 6 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoText: { fontSize: 12, color: '#888' },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#121212',
    marginVertical: 16,
  },
  trendingScroll: { marginBottom: 30 },
  trendCard: {
    width: 140,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 10,
    marginRight: 12,
    elevation: 2,
  },
  trendImage: { width: '100%', height: 90, borderRadius: 10 },
  trendTitle: { fontSize: 13, fontWeight: '600', marginTop: 6 },
  trendSubtitle: { fontSize: 11, color: '#888' },
  trendTime: { fontSize: 11, color: '#aaa' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 14,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#356D35',
    marginBottom: 10,
  },
  modalTips: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    marginBottom: 20,
  },
  closeBtn: {
    backgroundColor: '#356D35',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  closeText: {
    color: '#fff',
    fontWeight: '600',
  },
});
