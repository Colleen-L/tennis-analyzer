import React, {useRef, useState} from 'react';
import { View, StyleSheet, Dimensions, Text, Image, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import {useRouter} from 'expo-router';
import LottieView from 'lottie-react-native';
import { GestureHandlerRootView, FlatList } from 'react-native-gesture-handler';
import precisionAnimation from '@/assets/animations/target-goal.json';
import communityAnimation from '@/assets/animations/welcome.json';
import growthAnimation from '@/assets/animations/growth.json';

const {width, height} = Dimensions.get('window');

type Slide = {
  key: string;
  title: string;
  image?: number;
  animation?: any;
  description: string;
  backgroundColor: string
}

const slides: Slide[] = [
  {
    key: '1',
    title: 'Welcome to RAQA!',
    description: 'RAQA aims to bring you poise and precision through patience and resilience',
    backgroundColor: '#171719',
    animation: precisionAnimation,
  },
  {
    key: '2',
    title: 'YOUR COMMUNITY',
    description: 'Connect with other tennis players in a supporting and uplifting environment',
    backgroundColor: '#171719',
    animation: communityAnimation,
  },
  {
    key: '3',
    title: 'MOTIVATION AND GROWTH',
    description: 'Track your growth and mastery in a creative, yet competitive, method',
    backgroundColor: '#171719',
    animation: growthAnimation,
  },
];

export default function Onboarding() {
  const slideStyle = StyleSheet.create({
    container: {
      flex: 1,
      width: width,
      alignItems: 'center',
      rowGap: 15,
    }
  });

  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const goNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace('/(auth)/login');
    }
  };

  const renderItem = ({ item }: { item: Slide }) => (
    <View style={[slideStyle.container, { backgroundColor: item.backgroundColor }]}>
      {item.image && (
        <Image source={item.image} style={{ borderColor: 'red', borderWidth: 1, width: width, height: height/3}} resizeMode="contain" />
      )}
      {item.animation && (
        <LottieView
          source={item.animation}
          loop
          autoPlay
          style={{width: width, height: height/2.5}}
        />
      )}
      <Text style={{fontFamily: 'Menlo', width: width, backgroundColor: '#6A9860', color: '#F5F0DF', textAlign: 'center', fontSize: 32, marginBottom: 15, padding: 10}}>{item.title}</Text>
      <Text style={{fontFamily: 'slabion', letterSpacing: 5, color: '#F5F0DF', fontSize: 24, marginLeft: 15, marginRight: 15, padding: 30, textAlign: 'center', borderColor: '#F5F0DF', borderWidth: 1}}>{item.description}</Text>
    </View>
  );

  return (
    <>
      <GestureHandlerRootView>
        <View style = {styles.container}>
          {/* Slides */}
          <FlatList
            data={slides}
            renderItem={renderItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            ref={flatListRef}
            keyExtractor={(item) => item.key}
          />

          {/* Status Dots */}
          <View style={styles.dots}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  currentIndex === index ? styles.activeDot : styles.inactiveDot
                ]}
              />
            ))}
          </View>

          {/* Next Button */}
          <TouchableOpacity onPress={goNext}>
            <Text style = {styles.button}>
              {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: '#6A9860',
  },
  inactiveDot: {
    backgroundColor: '#ccc',
  },
  button: {
    fontFamily: 'agneos',
    textAlign: 'center',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 20,
    fontSize: 18,
    padding: 10,
    marginTop: 20,
    width: width/2,
  }
});