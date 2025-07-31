// WaistWorkoutScreen.tsx – Finish screen with restart + back to home
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const PRIMARY_COLOR = '#356D35';

const workouts = [
  {
    title: 'Get Ready',
    description: 'Stretch, focus and warm up.\nPrepare your core.',
    isIntro: true,
    background: require('../../assets/bg/start.jpg'),
  },
  {
    title: 'Side Crunches',
    duration: '30s',
    animation: require('../../assets/lottie/side_crunch.json'),
    tip: 'Exhale as you crunch. Keep movements controlled.',
  },
  {
    title: 'Russian Twist',
    duration: '30s',
    animation: require('../../assets/lottie/russian_twist.json'),
    tip: 'Twist from your core, not your arms.',
  },
  {
    title: 'Bicycle Kicks',
    duration: '30s',
    animation: require('../../assets/lottie/bicycle_kicks.json'),
    tip: 'Keep your back pressed to the mat.',
  },
  {
    title: 'Mountain Climbers',
    duration: '30s',
    animation: require('../../assets/lottie/mountain_climber.json'),
    tip: 'Drive knees towards chest rapidly.',
  },
  {
    title: 'Plank Twists',
    duration: '30s',
    animation: require('../../assets/lottie/plank_twist.json'),
    tip: 'Rotate from the waist while staying stable.',
  },
  {
    title: 'Flutter Kicks',
    duration: '30s',
    animation: require('../../assets/lottie/flutter_kick.json'),
    tip: 'Tighten abs and kick just above the ground.',
  },
  {
    title: 'Twist Jumps',
    duration: '30s',
    animation: require('../../assets/lottie/twist_jump.json'),
    tip: 'Twist at the waist and land softly.',
  },
  {
    title: 'Workout Complete',
    description: 'Well done!\nStretch and cool down now.',
    isSummary: true,
    background: require('../../assets/bg/finish.jpg'),
  },
];

export default function WaistWorkoutScreen() {
  const flatListRef = useRef(null);
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timerKey, setTimerKey] = useState(0);

  useEffect(() => {
    if (workouts[currentIndex]?.isIntro || workouts[currentIndex]?.isSummary) return;
    const timer = setInterval(() => {
      skipToNext();
    }, 30000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const skipToNext = () => {
    const next = currentIndex + 1;
    if (next < workouts.length) {
      flatListRef.current?.scrollToIndex({ index: next });
      setCurrentIndex(next);
      setTimerKey((prev) => prev + 1);
    }
  };

  const handleStart = () => {
    skipToNext();
  };

  const restartWorkout = () => {
    flatListRef.current?.scrollToIndex({ index: 1 });
    setCurrentIndex(1);
    setTimerKey((prev) => prev + 1);
  };

  return (
    <FlatList
      ref={flatListRef}
      data={workouts}
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
                <View>
                  <TouchableOpacity style={styles.button} onPress={restartWorkout}>
                    <Ionicons name="refresh" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Restart Workout</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button, { marginTop: 10 }]} onPress={() => navigation.navigate('Home')}>
                    <Ionicons name="home" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Back to Home</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.card}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.tip}</Text>
              <Text style={styles.progress}>Exercise {index} of {workouts.length - 2}</Text>
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
}

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
    justifyContent: 'center',
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