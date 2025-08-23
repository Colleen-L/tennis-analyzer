import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { HapticTab } from '@/components/HapticTab';
import BlurTabBarBackground from '@/components/ui/TabBarBackground.ios';

export default function TabLayout() {
 return (
   <Tabs
      screenOptions={{ 
        tabBarActiveTintColor: 'white',
        tabBarActiveBackgroundColor: '#6A9860',
        headerShown: false,
        tabBarStyle:{
          //borderRadius: 40,
          borderWidth: 1,
          borderColor: '#6A9860',
          position: 'absolute',
          paddingBottom: 0,
          height: 60,
          margin: 10,
        },
        tabBarButton: HapticTab,
        tabBarBackground: BlurTabBarBackground,
        animation: 'fade',
      }}>

      {/* Stroke Analysis Tab */}
     <Tabs.Screen
        name="stroke-analysis"
        options={{
          title: 'Stroke Analysis',
          tabBarIcon: ({ color }) => (
            <Ionicons name="analytics-outline" size={24} color={color} />
          ),
          tabBarIconStyle: {
            borderRadius: 40,
          }
        }}
      />

     <Tabs.Screen
        name="video-upload"
        options={{
          title: 'Video Analysis',
          tabBarIcon: ({ color }) => (
            <Ionicons name="analytics-outline" size={24} color={color} />
          ),
          tabBarIconStyle: {
            borderRadius: 40,
          }
        }}
      />


     {/* Home Tab */}
     <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'profile',
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-circle-outline" size={24} color={color} />
          ),
        }}
      />


     {/* Camera Tab (hidden in tab bar) */}
     <Tabs.Screen
        name="camera"
        options={{
          href: null, // Hides from tab bar
          headerShown: false,
        }}
      />


   </Tabs>
 );
}
