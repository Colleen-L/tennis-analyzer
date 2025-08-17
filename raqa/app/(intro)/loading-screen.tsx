import { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
//stays on screen until fonts are loaded
import {useFonts} from 'expo-font';

export default function LoadingIntro() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    slabion: require('@/assets/fonts/Slabion-ZpJZB.ttf'),
    agneos: require('@/assets/fonts/agneos-regular.ttf')
  });

  //redirects page after a second
  useEffect(() => {
    if (fontsLoaded) {
      const timer = setTimeout(() => {
        router.replace("/(intro)/onboarding");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return(
    <>
      {/* Header */}
      <View style={styles.container}>
          {/* <Image
            source={require('@/assets/images/tenniscourt.webp')}
            style={{ width: 200, height: 200}}
          /> */}
          <LottieView
            source={require('../../assets/animations/tennis-loading.json')}
            loop
            autoPlay
            style={{
              width: 250,
              height: 250,
              marginBottom: 50,
              borderRadius: 180,
              backgroundColor: '#F7F7ED'
            }}
          />
          <View style={styles.textBox}>
            <Text style={styles.logoText}>
              RAQA.
            </Text>
            <Text style={styles.motto}>
              Start hitting rockets.
            </Text>
          </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6A9860',
  },
  textBox: {
    rowGap: 10,
  },
  logoText: {
    fontSize: 32,
    fontFamily: 'Menlo',
    textAlign: 'center',
    color: 'white',
  },
  motto: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Menlo',
    color: 'white',
  }
});