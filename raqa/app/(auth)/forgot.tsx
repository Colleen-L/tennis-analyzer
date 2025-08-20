import React, { useState } from 'react';
import { View, Image, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async () => {
    //ensures email is not empty
    if (!email.trim()) {
      Alert.alert('Missing Email', 'Please enter your email address.');
      return;
    }

    setLoading(true);
    //connects to FastAPI backend to send the verification code
    try {
      const res = await fetch('http://10.0.0.48:8000/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const text = await res.text();

      if (!res.ok) {
        Alert.alert('Error', text);
      } else {
        Alert.alert(
          'Email Sent',
          'Check your inbox for a password reset link or code.'
        );
        
        router.replace({
          pathname: '/(auth)/verification',
          params: { email },
        });
      }
    } catch (error) {
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
        source={require('@/assets/images/icons/reset-password/reset.png')}
        style={{height: 200, width: 200, alignSelf: 'center', marginBottom: 50}}
      />
      <Text style={styles.title}>Forgot your password?</Text>
      <Text style={{fontFamily: 'Menlo', fontSize: 14, marginBottom: 20, textAlign: 'center'}}>Please enter your email address below to reset your password.</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#666"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handlePasswordReset}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Send Reset Email</Text>
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
    fontSize: 22,
    fontFamily: 'Menlo',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Menlo',
    color: '#333',
    marginBottom: 20,
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
    fontFamily: 'Menlo',
    marginTop: 20,
    textAlign: 'center',
    color: '#6A9860',
  },
});
