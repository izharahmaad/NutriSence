// TodayWorkoutScreen.tsx – Full sequence with intro, skip button, timer
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const { height, width } = Dimensions.get('window');
const PRIMARY_COLOR = '#356D35';

const exercises = [
  {
    title: 'Get Ready',
    description: 'Time to warm up.\nFocus your breath and posture.',
    isIntro: true,
    background: require('../../assets/bg/start.jpg'),
  },
  {
    title: 'Jumping Jacks',
    duration: '30s',
    tip: 'Jump softly and stay light on your feet.',
    animation: require('../../assets/animations/jumping.json'),
  },
  {
    title: 'Push Ups',
    duration: '30s',
    tip: 'Keep your core tight and elbows tucked.',
    animation: require('../../assets/animations/pushups.json'),
  },
  {
    title: 'Plank Hold',
    duration: '30s',
    tip: 'Hold steady and keep your spine neutral.',
    animation: require('../../assets/animations/plank.json'),
  },
  {
    title: 'Bodyweight Squats',
    duration: '30s',
    tip: 'Push through heels and keep your chest lifted.',
    animation: require('../../assets/animations/squats.json'),
  },
  {
    title: 'Arm Circles',
    duration: '30s',
    tip: 'Make small, fast circles to warm shoulders.',
    animation: require('../../assets/animations/armcircles.json'),
  },
  {
    title: 'Workout Complete',
    description: 'Amazing effort.\nTake a deep breath and stretch it out.',
    isSummary: true,
    background: require('../../assets/bg/finish.jpg'),
  },
];

const TodayWorkoutScreen = () => {
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timerKey, setTimerKey] = useState(0);

  useEffect(() => {
    if (exercises[currentIndex]?.isIntro || exercises[currentIndex]?.isSummary) return;
    const timer = setInterval(() => {
      skipToNext();
    }, 30000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const skipToNext = () => {
    const next = currentIndex + 1;
    if (next < exercises.length) {
      flatListRef.current?.scrollToIndex({ index: next });
      setCurrentIndex(next);
      setTimerKey((prev) => prev + 1);
    }
  };

  const handleStart = () => {
    skipToNext();
  };

  return (
    <FlatList
      ref={flatListRef}
      data={exercises}
      keyExtractor={(_, index) => index.toString()}
      pagingEnabled
      scrollEnabled={false}
      renderItem={({ item, index }) => (
        <ImageBackground
          source={item.background || null}
          style={styles.container}
          resizeMode="cover"
        >
          {item.animation && (
            <LottieView
              source={item.animation}
              autoPlay
              loop
              style={styles.animation}
            />
          )}

          {item.isIntro || item.isSummary ? (
            <View style={styles.introCard}>
              <Ionicons
                name={item.isIntro ? 'walk-outline' : 'checkmark-done-outline'}
                size={36}
                color={PRIMARY_COLOR}
              />
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
              {item.isIntro && (
                <TouchableOpacity style={styles.button} onPress={handleStart}>
                  <Ionicons name="play" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Start Workout</Text>
                </TouchableOpacity>
              )}
              {item.isSummary && (
                <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                  <Ionicons name="arrow-back" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Back to Home</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.card}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.tip}</Text>
              <Text style={styles.progress}>Exercise {index} of {exercises.length - 2}</Text>
              <AnimatedCircularProgress
                key={timerKey}
                size={100}
                width={6}
                fill={100}
                tintColor={PRIMARY_COLOR}
                backgroundColor="#ddd"
                duration={30000}
                style={{ marginTop: 20 }}
              >
                {() => <Text style={styles.timer}>30s</Text>}
              </AnimatedCircularProgress>
              <TouchableOpacity onPress={skipToNext} style={styles.skipBtn}>
                <Ionicons name="play-skip-forward" size={20} color={PRIMARY_COLOR} />
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
            </View>
          )}
        </ImageBackground>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    height,
    width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width,
    height: height * 0.6,
  },
  introCard: {
    width: width * 0.85,
    backgroundColor: '#fff',
    padding: 28,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: height * 0.1,
  },
  card: {
    width: width * 0.85,
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 22,
  },
  progress: {
    fontSize: 14,
    color: '#555',
    marginTop: 10,
  },
  timer: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
  },
  button: {
    marginTop: 20,
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  skipBtn: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  skipText: {
    color: PRIMARY_COLOR,
    marginLeft: 6,
    fontSize: 15,
    fontWeight: '600',
  },
});

export default TodayWorkoutScreen;
