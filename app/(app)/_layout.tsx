import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '@/constants/Colors';

const appLayout = () => {
  return (
    <Tabs screenOptions={{  
      tabBarActiveTintColor: '#5D3FD3', // Rich purple for selected items
      tabBarStyle: styles.bottomTabStyle, 
      tabBarInactiveTintColor: '#767676', // Subtle gray for inactive items
      tabBarLabelStyle: styles.tabBarLabel,
      tabBarItemStyle: styles.tabBarItem,
      headerShown: false, // Hide header for all tabs by default
    }}  >
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
        <Tabs.Screen name="(Contests)" options={{
            headerShown: false, 
            tabBarLabel: "Contests", 
            title: "Contests",
            tabBarIcon: ({ color }) => <MaterialIcons size={24} name="emoji-events" color={color} />
            }} />
    </Tabs>
  )
}

export default appLayout

const styles = StyleSheet.create({
  bottomTabStyle: {
    borderRadius: 30,
    position: 'absolute',
    bottom: 20,
    left: 15,
    right: 15,
    backgroundColor: 'rgba(248, 248, 255, 0.92)', // Ghost white with transparency
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
    height: 65,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 3,
  },
  tabBarItem: {
    paddingTop: 5,
  }
})