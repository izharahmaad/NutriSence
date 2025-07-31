import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  FlatList,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

interface Slide {
  key: string;
  title: string;
  text: string;
  icon: keyof typeof Ionicons.glyphMap;
  image: any;
}

const slides: Slide[] = [
  {
    key: '0',
    title: 'Welcome to NutriSense',
    text: 'Your personal guide to smarter nutrition and healthy habits.',
    icon: 'leaf-outline',
    image: require('../../assets/tips/welcome.jpg'),
  },
  {
    key: '1',
    title: 'Plan Smart Meals',
    text: 'Discover tasty, nutritious recipes that fit your lifestyle.',
    icon: 'restaurant-outline',
    image: require('../../assets/tips/tips1.jpg'),
  },
  {
    key: '2',
    title: 'Stay Hydrated',
    text: 'Track water intake and boost your daily energy.',
    icon: 'water-outline',
    image: require('../../assets/tips/tips2.jpg'),
  },
  {
    key: '3',
    title: 'Track & Improve',
    text: 'Set goals, log meals, and improve daily routines.',
    icon: 'trending-up-outline',
    image: require('../../assets/tips/tips-3.jpg'),
  },
];

export default function TipsScreen() {
  const flatListRef = useRef<FlatList<Slide>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation();
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.navigate('Login');
    }
  };

  const renderItem = ({ item }: { item: Slide }) => (
    <View style={styles.slide}>
      <ImageBackground source={item.image} style={styles.image}>
        <View style={styles.overlay} />
        <BlurView intensity={90} tint="light" style={styles.contentBox}>
          <View style={styles.innerCard}>
            <Ionicons name={item.icon} size={42} color="#4CAF50" style={styles.icon} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.text}>{item.text}</Text>

            <View style={styles.dotContainer}>
              {slides.map((_, i) => (
                <Animated.View
                  key={i}
                  style={[
                    styles.dot,
                    {
                      opacity: scrollX.interpolate({
                        inputRange: [(i - 1) * width, i * width, (i + 1) * width],
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: 'clamp',
                      }),
                    },
                  ]}
                />
              ))}
            </View>

            <View style={styles.controls}>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.skip}>Skip</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.nextButton} onPress={nextSlide}>
                <Text style={styles.nextText}>
                  {currentIndex === slides.length - 1 ? 'Start' : 'Next'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </ImageBackground>
    </View>
  );

  return (
    <FlatList
      data={slides}
      ref={flatListRef}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      renderItem={renderItem}
      keyExtractor={(item) => item.key}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: false, listener: handleScroll }
      )}
    />
  );
}

const styles = StyleSheet.create({
  slide: {
    width,
    height,
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  contentBox: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: 'hidden',
    marginTop: 20,
  },
  innerCard: {
    padding: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 30,
    margin: 10,
    borderColor: 'rgba(255,255,255,0.4)',
    borderWidth: 1.2,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E2E2E',
    textAlign: 'center',
    marginBottom: 12,
  },
  text: {
    fontSize: 15,
    textAlign: 'center',
    color: '#4A4A4A',
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 16,
  },
  skip: {
    fontSize: 15,
    color: '#888',
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 26,
    paddingVertical: 10,
    borderRadius: 25,
  },
  nextText: {
    color: 'white',
    fontWeight: '600',
  },
  dotContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 4,
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
  },
});
