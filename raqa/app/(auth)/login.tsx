import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

//expected structure of the login API response
type LoginResponse = {
  access_token: string;
  token_type: string;
};

export default function LoginScreen() {
  const router = useRouter();

  //state variables that store input values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //keeps track of loading state for button UI
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    try {
      //sends a POST request to backend (where endpoint is /login)
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), //sends email and password as JSON
      });

      const text = await response.text();
      // console.log('Raw response:', text); // for debugging

      //shows alert and stops loading if login fails
      if (!response.ok) {
        Alert.alert('Login failed', text);
        setLoading(false);
        return;
      }

      //parses the JSON string
      const data: LoginResponse = JSON.parse(text);
      //Alert.alert('Login success', `Token: ${data.access_token}`); // for debugging
      //securely stores the token for future auth
      await SecureStore.setItemAsync('access_token', data.access_token);

      //shows success message and redirects to a different page
      Alert.alert('Success', 'You are logged in!');
      router.replace('/(tabs)');
    } catch (error) {
      //gives error is network/unexpected errors occur
      Alert.alert('Network error', (error as Error).message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title={loading ? 'Logging in...' : 'Login'} onPress={login} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ffffff',
    marginVertical: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
});
