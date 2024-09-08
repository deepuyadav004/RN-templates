import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';

const appLayout = () => {
  return (
    <Tabs screenOptions={{  tabBarActiveTintColor: 'blue' }}>
        <Tabs.Screen name="(Home)" options={{
            headerShown: false, 
            tabBarLabel: "Home", 
            title: "Home",
            tabBarIcon: ({ color }) => <Ionicons size={28} name="home" color={color} />
            }}/>
        <Tabs.Screen name="(Profile)" options={{
            headerShown: false, 
            tabBarLabel: "Profile", 
            title: "Profile",
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />
            }} />
        <Tabs.Screen name="(Settings)" options={{headerShown: false, 
            tabBarLabel: "Settings", 
            title: "Settings",
            tabBarIcon: ({ color }) => <Feather size={28} name="settings" color={color} />
            }} />
    </Tabs>
  )
}

export default appLayout