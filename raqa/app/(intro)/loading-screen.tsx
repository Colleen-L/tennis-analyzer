import { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoadingIntro() {
  const router = useRouter();

  //redirects page after a second
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(auth)/login");
    }, 3000);

    return () => clearTimeout(timer);
  })


  return(
    <>
      {/* Header */}
      <View style={styles.container}>
          <Image
            source={require('@/assets/images/tenniscourt.webp')}
            style={{ width: 200, height: 200}}
          />
          <Text style={styles.logoText}>
            RAQA.
          </Text>
          <Text style={styles.motto}>
            Start hitting rockets.
          </Text>
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
  logoText: {
    fontSize: 18,
    fontFamily: 'Menlo',
  },
  motto: {
    fontSize: 12,
    fontFamily: 'Menlo',
  }
});