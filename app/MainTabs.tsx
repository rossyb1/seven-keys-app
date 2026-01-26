import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Calendar, MessageCircle, User } from 'lucide-react-native';
import HomeScreen from './screens/HomeScreen';
import BookingsScreen from './screens/BookingsScreen';
import ConciergeScreen from './screens/ConciergeScreen';
import ProfileScreen from './screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0A1628',
          borderTopColor: 'rgba(255,255,255,0.08)',
          borderTopWidth: 1,
          height: 85,
          paddingTop: 10,
          paddingBottom: 25,
        },
        tabBarActiveTintColor: '#5684C4',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Home 
              size={24} 
              color={color} 
              strokeWidth={focused ? 2 : 1.5}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingsScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Calendar 
              size={24} 
              color={color} 
              strokeWidth={focused ? 2 : 1.5}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Concierge"
        component={ConciergeScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <MessageCircle 
              size={24} 
              color={color} 
              strokeWidth={focused ? 2 : 1.5}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <User 
              size={24} 
              color={color} 
              strokeWidth={focused ? 2 : 1.5}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
