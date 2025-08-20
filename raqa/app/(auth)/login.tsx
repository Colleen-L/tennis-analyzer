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
  const [name, setName] = useState('');
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
  //redirection w Google sign-in
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;

      if (authentication?.accessToken) {
        SecureStore.setItemAsync('access_token', authentication.accessToken);
        router.replace('/(tabs)');
      }
    }
  }, [response]);

  return (
    <>
      <ImageBackground
        source={require('@/assets/images/tennisball.jpg')}
        style={styles.background}
      >
        <View style={styles.container}>

          {/* opening line */}
          <Text style={{textAlign: 'center', fontFamily: 'Menlo', fontSize: 18}}>Welcome Back!</Text>

          {/* choice between login/signup */}
          <View style={styles.choice}>
            <TouchableOpacity
              onPress={() => router.replace('/(auth)/login')}
              style={styles.login}
            >
              <Text style={{fontFamily: 'Menlo', textAlign: 'center'}}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.register}
              onPress={() => router.replace('/(auth)/signup')}
            >
              <Text style={{fontFamily: 'Menlo', textAlign: 'center'}}>Sign up</Text>
            </TouchableOpacity>
          </View>

          {/* login form */}
          {/* email */}
          <View style={{justifyContent:"center", alignItems: "center", width: width, flexDirection: "row" }}>
            <Image
              source={require('@/assets/images/icons/login/email.png')}
              style={{width: 25, height: 25}}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#171719"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* password */}
          <View style={{justifyContent:"center", alignItems: "center", width: width, flexDirection: "row" }}>
            <Image
              source={require('@/assets/images/icons/login/password.png')}
              style={{width: 25, height: 25}}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#171719"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* password reset */}
          <TouchableOpacity
            style={styles.linkBtn}
            onPress={() => router.push('/(auth)/forgot')}
          >
            <Text style={styles.linkBtnText}>Forgot Password?</Text>
          </TouchableOpacity>

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

          <Image
            source = {require('@/assets/images/icons/login/linebreak.png')}
            style = {{width: width - 30, alignSelf: 'center', height: 20, margin: 10}}
          />

          <View style={styles.externalLogins}>
            {/* Google */}
            <TouchableOpacity
              onPress={() => promptAsync()}
              activeOpacity={0.8}
              style={styles.externalIcons}
            >
              <Image
                source = {require('@/assets/images/icons/login/google.png')}
                style = {{width: 32, height: 32}}
                resizeMode="contain"
              />
              <Text style={{fontFamily: 'Menlo', fontSize: 14}}>Google</Text>
            </TouchableOpacity>

            {/* Facebook */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.externalIcons}
            >
              <Image
                source = {require('@/assets/images/icons/login/facebook.png')}
                style = {{width: 32, height: 32}}
                resizeMode="contain"
              />
              <Text style={{fontFamily: 'Menlo', fontSize: 14}}>Facebook</Text>
            </TouchableOpacity>

            {/* Apple */}
            {/*
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.externalIcons}
            >
              <Image
                source = {require('@/assets/images/icons/login/apple.webp')}
                style = {{width: 32, height: 32}}
                resizeMode="contain"
              />
              <Text style={{fontFamily: 'Menlo', fontSize: 14}}>Apple</Text>
            </TouchableOpacity>
            */}
          </View>
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
    justifyContent: 'flex-end',
  },
  container: {
    opacity: 0.95,
    backgroundColor: "white",
    borderTopEndRadius: 32,
    borderTopStartRadius: 32,
    width: width,
    height: height * (3/5),
    paddingTop: 20,
    justifyContent: 'space-evenly'
  },
  choice: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: width * (2/3) + 5,
    backgroundColor: '#99b795ff',
    justifyContent: 'center',
    borderRadius: 20,
    height: 40
  },
  login: {
    width: width * (1/3),
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#AEDE4B',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 20,
    height: 35,
  },
  register: {
    width: width * (1/3),
    alignSelf: 'center',
    justifyContent: 'center',
    height: 35,
    borderRadius: 20,
  },
  input: {
    borderWidth: 1,
    width: width * (2/3) - 25,
    alignSelf: 'center',
    borderColor: '#353535',
    color: '#6A9860',
    marginHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 4,
    fontFamily: 'Menlo',
    padding: 10,
  },
  button: {
    borderColor: '#A0B9A0',
    borderWidth: 2, 
    width: width * (2/3),
    alignSelf: 'center',
    marginHorizontal: 10,
    borderRadius: 20,
    paddingVertical: 8,
  },
  buttonDisabled: {
    backgroundColor: '#A0B9A0',
  },
  buttonText: {
    color: '#171719',
    fontFamily: 'Menlo',
    fontSize: 18,
    textAlign: 'center',
  },
  linkBtn: {
    marginHorizontal: 50,
  },
  linkBtnText: {
    color: '#7e977eff',
    fontFamily: 'Menlo',
    fontSize: 12,
    textAlign: 'right',
  },
  externalLogins: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  externalIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 150,
    borderRadius: 30,
    borderColor: '#6A9860',
    borderWidth: 1,
    paddingLeft: 28,
    paddingRight: 28,
    paddingTop: 6,
    paddingBottom: 6,
    margin: 4,
  }
});
