import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

//expected structure of the signup API response
type SignupResponse = {
  message: string;
}

export default function SignupScreen() {
  const router = useRouter();

  //state variables that store input values
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //tracks loading state for button
  const [loading, setLoading] = useState(false);

  const signup = async () => {

    //not permitting empty fields
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }

    //password must be more than 6 characters
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    
    try {
      //sends POST request to backend (where enpoint is /signup)
      const response = await fetch('http://localhost:8000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        //sends name, email, password from signup as JSON to backend
        body: JSON.stringify({name, email, password}),
      });

      const text = await response.text();

      //shows alert and stops loading if signup failts
      if (!response.ok) {
        Alert.alert('Signup Failed', text);
        setLoading(false);
        return;
      }

      //parses JSON string received from backend
      const data: SignupResponse = JSON.parse(text);
      //shows message returned from backend
      Alert.alert(data.message);
      //redirects to a different page
      router.replace('/(tabs)');
    } catch (error) {
      //gives error if network/unexpected errors occur
      Alert.alert('Network error', (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder='Name'
        autoCapitalize='none'
        value={name}
        onChangeText={setName}
      />
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
      <TouchableOpacity
        style={styles.button}
        onPress={signup}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#EBEBEB',
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
  buttonText: {
    color: '#EBEBEB',
    fontFamily: 'Menlo',
    fontSize: 18,
    textAlign: 'center',
  }
})