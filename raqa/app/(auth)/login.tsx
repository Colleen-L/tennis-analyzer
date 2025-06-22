import React, { useState } from 'react';
import { View, TextInput, Image, Text, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
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
    <>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
            <Image
              source={require('@/assets/images/tenniscourt.webp')}
              style={{ width: 200, height: 200}}
            />
        </View>

        {/* login form */}
        <View style={styles.loginContainer}>
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

          {/* buttons */}
          {/* login button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={login}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* signup option and redirection */}
          <TouchableOpacity
            onPress={() => router.replace('/(auth)/signup')}
            style={styles.linkBtn}
          >
            <Text style={styles.linkBtnText}>No Account? Sign Up</Text>
          </TouchableOpacity>

        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#EBEBEB',
  },
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderEndEndRadius: 35,
    borderEndStartRadius: 35,
    backgroundColor: '#6A9860',
  },
  loginContainer: {
    flex: 1,
    paddingTop: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: '#353535',
    color: '#6A9860',
    marginVertical: 8,
    marginHorizontal: 50,
    paddingVertical: 8,
    borderRadius: 4,
    fontFamily: 'Menlo',
    padding: 20,
  },
  button: {
    backgroundColor: '#353535',
    marginHorizontal: 50,
    borderRadius: 12,
    marginTop: 10,
    paddingVertical: 8,
  },
  buttonDisabled: {
    backgroundColor: '#A0B9A0',
  },
  buttonText: {
    color: '#EBEBEB',
    fontFamily: 'Menlo',
    fontSize: 24,
    textAlign: 'center',
  },
  linkBtn: {
    marginHorizontal: 50,
    marginTop: 20,
  },
  linkBtnText: {
    color: '#353535',
    fontFamily: 'Menlo',
    fontSize: 14,
    textAlign: 'right',
  }
});
