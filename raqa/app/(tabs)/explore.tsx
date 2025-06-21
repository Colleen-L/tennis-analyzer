import { View, Text, TouchableOpacity, Button } from 'react-native';
import { useRouter, Link } from 'expo-router';
import * as SecureStore from 'expo-secure-store';



export default function ExploreScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('access_token');
    router.replace("/(auth)/login");
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Explore Content</Text>
      <Link href="/camera" asChild>
        <TouchableOpacity style={{
          padding: 15,
          backgroundColor: 'blue',
          borderRadius: 8,
          marginTop: 20
        }}>
          <Text style={{ color: 'white' }}>Open Camera</Text>
          <Button title = "Log out" onPress={handleLogout} />
        </TouchableOpacity>
      </Link>
    </View>
  );
  }

