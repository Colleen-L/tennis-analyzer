import React, { useRef, useState } from 'react';
import { View, Image, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function VerifyCode() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  //ensures that email is a string
  const normalizedEmail = Array.isArray(email) ? email[0] : email || '';

  //inistialize 6 digit code as array of empty strings
  const [code, setCode] = useState(['', '', '', '', '', '']);
  //stores references to the 6 fields
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    //only allows single digit
    if (!/^\d?$/.test(text)) return;

    //updates the code array with new digit
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    //auto-focus the next input
    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    //automatically verify code when all inputs are filled
    if (newCode.every((digit) => digit !== '')) {
      verifyCode(newCode.join(''));
    }
  };

  
  const handleKeyPress = (e: any, index: number) => {
    //focus on previous input if deletion/backspace
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const verifyCode = async (fullCode: string) => {
    //connects to FastAPI backend for verification
    try {
      const res = await fetch('http://10.0.0.48:8000/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, code: fullCode }),
      });

      const data = await res.json();

      if (data.message === 'Verification successful') {
        router.replace({
          pathname: '/(auth)/reset-password',
          params: { email: normalizedEmail },
        });
      }
      else {
        Alert.alert('Unexpected response', JSON.stringify(data));
      }

    } catch (error) {
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  const resendCode = async () => {
    //connects to FastAPI backend for resending code
    try {
      const res = await fetch('http://10.0.0.48:8000/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Success', 'A new code has been sent to your email.');
      } else {
        Alert.alert('Failed to Resend', data.detail || 'Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while resending the code.');
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
        source={require('@/assets/images/icons/reset-password/email.png')}
        style={{height: 200, width: 200, alignSelf: 'center', marginBottom: 50}}
      />
      <Text style={styles.title}>Check your Email</Text>
      <Text style={styles.instructions}>Enter the unique 6-digit code we sent to {email} </Text>
      <View style={styles.codeContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              inputs.current[index] = ref;
            }}
            placeholder="-"
            placeholderTextColor="#ccc"
            style={styles.codeInput}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            autoFocus={index === 0}
            returnKeyType="done"
          />
        ))}
      </View>
      <TouchableOpacity onPress={resendCode}>
        <Text style={styles.link}>Didn't Receive it? Send Again</Text>
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
    alignItems: 'center',
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
    fontSize: 24,
    fontFamily: 'Menlo',
    marginBottom: 15,
    textAlign: 'left',
  },
  instructions: {
    fontSize: 14,
    fontFamily: 'Menlo',
    marginBottom: 30,
    textAlign: 'center',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  codeInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#171719',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 24,
    marginHorizontal: 5,
    fontFamily: 'Menlo',
  },
  link: {
    marginTop: 30,
    color: '#6A9860',
    fontFamily: 'Menlo',
  },
});
