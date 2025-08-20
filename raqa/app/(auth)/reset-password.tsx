import React, { useState } from 'react';
import { View, Image, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ResetPassword() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  // ensures that email is a string
  const normalizedEmail = Array.isArray(email) ? email[0] : email || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    //ensure that the passwords aren't empty and that they match
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in both fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    //connects to FastAPI backend to reset the password in the PostgreSQL database
    try {
      const res = await fetch('http://10.0.0.48:8000/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: normalizedEmail,
          new_password: newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert('Error', data.detail || 'Failed to reset password.');
      } else {
        Alert.alert('Success', 'Password reset successful!');
        router.replace('/(auth)/login');
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style = {styles.back} onPress={() => router.back()}>
        <Image 
          source={require('@/assets/images/icons/reset-password/back.png')}
          style={{width: 50, height: 50}}
        />
        <Text style={{fontSize: 16, color: '#6A9860', fontFamily: 'Menlo'}}>Back</Text>
      </TouchableOpacity>
      <Image
        source={require('@/assets/images/icons/reset-password/newpass.png')}
        style={{height: 200, width: 200, alignSelf: 'center', marginBottom: 50}}
      />
      <Text style={styles.title}>Set New Password</Text>
      <Text style={styles.instructions}>Please enter your new password below.</Text>
      
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleReset} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Reset Password</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 30,
    backgroundColor: '#fff',
    flex: 1,
  },
  back: {
    alignSelf: 'flex-start',
    width: 100,
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Menlo',
    marginBottom: 30,
    textAlign: 'center',
  },
  instructions: {
    fontSize: 14,
    fontFamily: 'Menlo',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    fontFamily: 'Menlo',
  },
  button: {
    backgroundColor: '#6A9860',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Menlo',
    color: '#fff',
    fontSize: 16,
  },
  link: {
    marginTop: 30,
    color: '#6A9860',
    textAlign: 'center',
    fontFamily: 'Menlo',
  },
});
