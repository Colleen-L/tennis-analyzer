import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
 return (
   <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>

     {/* Home Tab */}
     <Tabs.Screen
       name="index"
       options={{
         title: 'Home',
         tabBarIcon: ({ color }) => (
           <Ionicons name="home" size={24} color={color} />
         ),
       }}/>


     {/* Explore Tab */}
     <Tabs.Screen
       name="explore"
       options={{
         title: 'explore',
         tabBarIcon: ({ color }) => (
           <Ionicons name="compass" size={24} color={color} />
         ),
      }}/>


     {/* Camera Tab (hidden in tab bar) */}
     <Tabs.Screen
       name="camera"
       options={{
         href: null, // Hides from tab bar
         headerShown: false,
       }}/>


   </Tabs>
 );
}
