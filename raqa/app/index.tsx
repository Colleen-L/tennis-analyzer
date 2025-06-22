import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
//used to securely store and retrieve sensitive values like tokens
import * as SecureStore from 'expo-secure-store';
//allows showing a loading icon while checking auth
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        //retrienves access_token from secure storage
        const token = await SecureStore.getItemAsync('access_token');
        //console.log("Access token:", token);

        //updates states
        if (token) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  //updates screen based on auth state
  useEffect(() => {
    //done loading/not loading
    if (!isLoading) {
      //updates screen depending on if the user is logged in or not
      if (isLoggedIn) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(intro)/loading-screen');
      }
    }
  }, [isLoading, isLoggedIn]);

  //loading screen
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null;
}
