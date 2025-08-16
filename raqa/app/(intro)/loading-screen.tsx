import { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';

export default function LoadingIntro() {
  const router = useRouter();

  //redirects page after a second
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(intro)/onboarding");
    }, 3000);

    return () => clearTimeout(timer);
  })


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
              width: 200,
              height: 200,
            }}
          />
          <View>
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
    rowGap: 50,
  },
  logoText: {
    fontSize: 18,
    fontFamily: 'Menlo',
  },
  motto: {
    fontSize: 12,
    fontFamily: 'Menlo',
  }
});