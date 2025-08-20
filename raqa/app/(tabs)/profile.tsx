import React from 'react';
import {Button, Text, View, StyleSheet, Dimensions} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import {useRouter} from 'expo-router';
import ProfileSetting from '@/components/profile/profile-settings';

const {width, height} = Dimensions.get('window');

export default function Profile() {
  const router = useRouter();

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('access_token');
    router.replace("/(auth)/login");
  }

  return(
    <>
      <View style={styles.container}>
        <Text style={styles.title}>My Profile</Text>
        <View style={styles.profile}></View>
        <Button title = "Log out" onPress={handleLogout} />
        <ProfileSetting 
          title="Personal Growth"
          icon={<Ionicons name="rocket-outline" size={20} color={'#fff'} />}
        ></ProfileSetting>
        <ProfileSetting
          title="Stroke Gallery"
          icon={<Ionicons name="images-outline" size={20} color={'#fff'} />}
        ></ProfileSetting>
        <ProfileSetting
          title="Account Settings"
          icon={<Ionicons name="settings-outline" size={20} color={'#fff'} />}
        ></ProfileSetting>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Menlo',
    marginLeft: 20,
    marginTop: 20, 
  },
  profile: {
    width: width - 40,
    height: height/4,
    backgroundColor: "#ccc",
    borderRadius: 30,
    margin: 20,
  }
});
