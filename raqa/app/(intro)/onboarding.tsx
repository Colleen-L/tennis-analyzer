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
    title: 'WELCOME TO RAQA!',
    description: 'RAQA aims to bring you poise and precision through patience and resilience',
    backgroundColor: 'white',
    animation: precisionAnimation,
  },
  {
    key: '2',
    title: 'YOUR COMMUNITY',
    description: 'Connect with other tennis players in a supporting and uplifting environment',
    backgroundColor: 'white',
    animation: communityAnimation,
  },
  {
    key: '3',
    title: 'MOTIVATION AND GROWTH',
    description: 'Track your growth and mastery in a creative, yet competitive, method',
    backgroundColor: 'white',
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
          style={{width: width, height: height/2.2}}
        />
      )}
      <Text style={{fontFamily: 'graphik', letterSpacing: 4, fontSize: 40, width: width, color: '#171719', textAlign: 'center', padding: 10}}>{item.title}</Text>
      <Text style={{fontFamily: 'Menlo', letterSpacing: 1, color: '#171719', fontSize: 18, marginLeft: 15, marginRight: 15, padding: 30, textAlign: 'center'}}>{item.description}</Text>
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
    width: 20,
    height: 5,
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
    fontFamily: 'Menlo',
    textAlign: 'center',
    backgroundColor: '#6A9860',
    color: 'white',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 20,
    fontSize: 18,
    padding: 10,
    margin: 20,
    width: width/2,
  }
});