import React, { useState } from 'react';
import { View, TextInput, Button, Image, Text, StyleSheet, Dimensions, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ImageBackground } from 'expo-image';

const {width, height} = Dimensions.get('window');

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
      const response = await fetch('http://10.0.0.48:8000/signup', {
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
    <>
      <ImageBackground
        source={require('@/assets/images/tennisball.jpg')}
        style={styles.background}
      >
        <View style={styles.container}>

          {/* inspiration message */}

          <View style ={{rowGap: 5}}>
            <Text style={{fontFamily: 'Menlo', fontSize: 18, textAlign: 'center'}}>Create an Account</Text>
          </View>

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

          {/* signup form */}
          {/* name */}
          <View style={{justifyContent:"center", alignItems: "center", width: width, flexDirection: "row" }}>
            <Image
              source={require('@/assets/images/icons/login/name.png')}
              style={{width: 25, height: 25}}
            />
            <TextInput
              style={styles.input}
              placeholder='Name'
              placeholderTextColor="#171719"
              autoCapitalize='none'
              value={name}
              onChangeText={setName}
            />
          </View>

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
          <TouchableOpacity
            style={styles.button}
            onPress={signup}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <Text style={{width: width, fontSize: 14, textAlign: 'center', color: '#7e977eff', fontFamily: 'Menlo'}}>By signing up, you are agreeing to our Terms and Conditions</Text>
        </View>
      </ImageBackground>
    </>
  )
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
    height: 35,
    borderRadius: 20,
  },
  register: {
    width: width * (1/3),
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#AEDE4B',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 20,
    height: 35,
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
  buttonText: {
    color: '#171719',
    fontFamily: 'Menlo',
    fontSize: 18,
    textAlign: 'center',
  }
})