import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

type ProfileSettingProps = {
  title: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
};

const ProfileSetting = ({ title, icon, children }: ProfileSettingProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.icon}>{icon}</View>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    marginHorizontal: 10,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 18,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
    backgroundColor: '#A0B9A0',
    width: 30,
    height: 30,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'Menlo',
  },
});

export default ProfileSetting;