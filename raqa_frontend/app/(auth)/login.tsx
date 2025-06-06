import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import * as secureStorage from 'expo-secure-store';
import { useRouter } from 'expo-router';
import axios from 'axios';


export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const checkLogin = async() => {
        try {
            // finds local network IP address
            // allows frontend to communicate with backend
            const response = await axios.post('http://172.16.225.5:8000/login', {
                email,
                password
            });

            const token = response.data["access-token"];
            await secureStorage.setItemAsync('token', token);

            if (response.data.success) {
                router.replace('/(tabs)');
            }
            else {
                Alert.alert("Incorrect email or password");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Login Failed");
        }
    };

    return (
        <View style = {styles.container}>

            {/* prompts for email */}

            <TextInput
                style = {styles.input}
                placeholder='Email'
                value={email}
                autoCapitalize='none'
                onChangeText={setEmail}
                keyboardType='email-address'
            ></TextInput>

            {/* prompts for password */}

            <TextInput
                style={styles.input}
                placeholder='Password'
                value={password}
                secureTextEntry
                onChangeText={setPassword}
            ></TextInput>

            <Button title="Login" onPress={checkLogin}></Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 12,
        marginBottom: 12,
    }
})