import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const rootLayout = () => {
  return (
   <Stack>
        <Stack.Screen name='(app)' options={{ headerShown: false }} />
   </Stack>
  )
}

export default rootLayout