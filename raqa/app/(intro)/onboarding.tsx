import {useRouter} from 'expo-router';
import { View, StyleSheet, Text } from 'react-native';

export default function Onboarding() {
  const router = useRouter();


  return (
    <>
      <View style = {styles.container}>

        <Text>Testing...</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  }
});