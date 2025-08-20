import { View, Text, TouchableOpacity, Button } from 'react-native';
import { useRouter, Link } from 'expo-router';



export default function StrokeAnalysis() {
  const router = useRouter();

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
        </TouchableOpacity>
      </Link>
    </View>
  );
  }

