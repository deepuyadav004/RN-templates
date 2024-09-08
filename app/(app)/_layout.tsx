import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import { Colors } from '@/constants/Colors';

const appLayout = () => {
  return (
    <Tabs screenOptions={{  tabBarActiveTintColor: Colors.DARK_GREEN, tabBarStyle:styles.bottomTabStyle, tabBarInactiveTintColor: 'black' }}  >
        <Tabs.Screen name="(Home)" options={{
            headerShown: false, 
            tabBarLabel: "Home", 
            title: "Home",
            tabBarIcon: ({ color }) => <Ionicons size={24} name="home" color={color} />
            }}/>
        <Tabs.Screen name="(Profile)" options={{
            headerShown: false, 
            tabBarLabel: "Profile", 
            title: "Profile",
            tabBarIcon: ({ color }) => <FontAwesome size={24} name="user" color={color} />
            }} />
        <Tabs.Screen name="(Settings)" options={{headerShown: false, 
            tabBarLabel: "Settings", 
            title: "Settings",
            tabBarIcon: ({ color }) => <Feather size={24} name="settings" color={color} />
            }} />
    </Tabs>
  )
}

export default appLayout

const styles = StyleSheet.create({
  bottomTabStyle: {
    borderRadius: 30,
    shadowOpacity: 0,
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 3.5,
    borderWidth: 1,
    borderColor: '#ffffff',
    opacity: 0.8,
  }
})