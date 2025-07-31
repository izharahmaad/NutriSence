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
import { useNavigation } from '@react-navigation/native';

const breakfastMeals = [
  {
    title: 'Avocado Salad',
    time: '25 min',
    kcal: 230,
    image: require('../../assets/mealsCS/breakfast2.jpg'),
    info: 'Avocado Salad is rich in healthy fats and fiber, perfect for heart health.',
  },
  {
    title: 'Breakfast Bowl',
    time: '20 min',
    kcal: 210,
    image: require('../../assets/mealsCS/breakfast3.jpg'),
    info: 'Packed with greens, grains, and eggs for a balanced start to your day.',
  },
  {
    title: 'Healthy Snacks',
    time: '15 min',
    kcal: 150,
    image: require('../../assets/mealsCS/snack1.jpg'),
    info: 'Quick, nutritious bites full of fiber and protein.',
  },
  {
    title: 'Meal Salad',
    time: '18 min',
    kcal: 200,
    image: require('../../assets/mealsCS/breakfast4.jpg'),
    info: 'A colorful mix of veggies and lean protein to energize your morning.',
  },
];

const trendingMeals = [
  {
    title: 'Avocado Toast',
    servings: 2,
    time: '25 min',
    image: require('../../assets/mealsCS/trending1.jpg'),
    info: 'A classic breakfast choice loaded with healthy fats and fiber.',
  },
  {
    title: 'Green Salad',
    servings: 2,
    time: '20 min',
    image: require('../../assets/mealsCS/trending2.jpg'),
    info: 'Low-calorie greens and veggies rich in antioxidants.',
  },
  {
    title: 'Chia Pudding',
    servings: 1,
    time: '10 min',
    image: require('../../assets/mealsCS/trending3.jpg'),
    info: 'Great source of omega-3 and fiber. Best consumed chilled.',
  },
  {
    title: 'Oat Smoothie',
    servings: 1,
    time: '7 min',
    image: require('../../assets/mealsCS/trending4.jpg'),
    info: 'Quick energy booster packed with oats and fruit.',
  },
  {
    title: 'Fruit Yogurt Bowl',
    servings: 1,
    time: '8 min',
    image: require('../../assets/mealsCS/trending5.jpg'),
    info: 'High in protein and probiotics, topped with seasonal fruit.',
  },
];

export default function BreakfastMealScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [selectedMeal, setSelectedMeal] = useState(null);

  const filteredMeals = breakfastMeals.filter(meal =>
    meal.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Your Breakfast</Text>
          <Text style={styles.date}> Today, {new Date().toLocaleDateString()}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#356D35" />
        </TouchableOpacity>
      </View>

      {/* Search and Filters */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search meals..."
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity onPress={() => navigation.navigate('FilteredResults')}>
          <Feather name="sliders" size={22} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Tags */}
      <View style={styles.tags}>
        <TouchableOpacity style={[styles.tag, styles.activeTag]}>
          <Text style={styles.activeText}>Breakfast</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tag} onPress={() => navigation.navigate('LunchMeal')}>
          <Text style={styles.tagText}>Lunch</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tag} onPress={() => navigation.navigate('DinnerMeal')}>
          <Text style={styles.tagText}>Dinner</Text>
        </TouchableOpacity>
      </View>

      {/* Meals Grid */}
      <View style={styles.grid}>
        {filteredMeals.map((meal, index) => (
          <TouchableOpacity key={index} style={styles.card} onPress={() => setSelectedMeal(meal)}>
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
      <Text style={styles.trendingTitle}>Trending and Easy Recipes</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.trendingScroll}>
        {trendingMeals.map((meal, idx) => (
          <TouchableOpacity key={idx} style={styles.trendCard} onPress={() => setSelectedMeal(meal)}>
            <Image source={meal.image} style={styles.trendImage} />
            <Text style={styles.trendText}>{meal.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Info Modal */}
      <Modal visible={!!selectedMeal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedMeal?.title}</Text>
            <Text style={styles.modalText}>{selectedMeal?.info}</Text>
            <TouchableOpacity onPress={() => setSelectedMeal(null)} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fefefe', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: '800', color: '#121212' , marginTop: 20, },
  date: { fontSize: 13, color: '#888' },
  backBtn: { marginLeft: 10 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    
  },
  tags: { flexDirection: 'row', marginBottom: 20 },
  tag: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
  },
  activeTag: { backgroundColor: '#356D35', borderColor: '#356D35' },
  activeText: { color: '#fff', fontWeight: '600' },
  tagText: { color: '#333', fontWeight: '500' },
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
  trendingTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 12,
    color: '#121212',
  },
  trendingScroll: { paddingBottom: 20 },
  trendCard: {
    width: 120,
    marginRight: 14,
    alignItems: 'center',
  },
  trendImage: {
    width: 120,
    height: 80,
    borderRadius: 10,
    marginBottom: 6,
  },
  trendText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#121212',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#356D35',
  },
  modalText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  modalClose: {
    marginTop: 20,
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: '#356D35',
    borderRadius: 12,
  },
  modalCloseText: {
    color: '#fff',
    fontWeight: '600',
  },
});
