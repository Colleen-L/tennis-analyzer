import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
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
      setLoading(true);
      
      try {
      


      } catch (error) {
      Alert.alert('Network error', (error as Error).message);
      } finally {
      setLoading(false);
      }
  }
}