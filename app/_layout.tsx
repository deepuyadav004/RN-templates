import React from 'react'
import { Stack } from 'expo-router'

const rootLayout = () => {
  return (
   <Stack>
        <Stack.Screen name='(Welcome)' options={{ headerShown: false }} />
   </Stack>
  )
}

export default rootLayout