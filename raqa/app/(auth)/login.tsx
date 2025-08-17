import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, Image, Alert, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { ImageBackground } from 'expo-image';

const {width, height} = Dimensions.get('window');

//expected structure of the login API response
type LoginResponse = {
  access_token: string;
  token_type: string;
};

//checks web browser session's completion of authentication process
//detects and completes pending authentication (after web-based auth redirection)
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();

  //state variables that store input values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //keeps track of loading state for button UI
  const [loading, setLoading] = useState(false);

  const login = async () => {
    //not permitting any empty fields
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      //sends a POST request to backend (where endpoint is /login)
      const response = await fetch('http://10.0.0.48:8000/login', {
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

  //Google Sign-In
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '550585625092-439v5ksj1pfbimha2blb6gb1i56264ht.apps.googleusercontent.com',
    iosClientId: '550585625092-e26ej2s4cnc1s1kvs6jqnavljj7sb0hu.apps.googleusercontent.com',
    clientId: '550585625092-0hkur1li8dirla1ijen79mhodd62m3bq.apps.googleusercontent.com',
  });


  // CONTINUE GOOGLE AUTH HERE...

  return (
    <>
      <ImageBackground
        source={require('@/assets/images/tenniscourt.jpg')}
        style={styles.background}
      >
        <View style={styles.container}>
          {/* login form */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#171719"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#171719"
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

          <TouchableOpacity
            onPress={() => promptAsync()}
            style={[styles.button, styles.googleBtn]}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    height: height,
    borderWidth: 1,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: "white",
    opacity: 0.95,
    borderTopEndRadius: 32,
    borderTopStartRadius: 32,
    width: width,
    height: height * (3.3/5),
    paddingTop: 20,
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
    fontSize: 18,
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
  },
  googleBtn: {
    backgroundColor: '#DB4437',
    marginTop: 20,
  }
});
