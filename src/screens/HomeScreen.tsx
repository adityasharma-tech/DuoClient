import { View, Button } from 'react-native'
import React from 'react'
import { RNCamera } from 'react-native-camera'

export default function HomeScreen() {
  return (
    <View>
      <RNCamera type='back'/>
      <Button title='Start server'/>
    </View>
  )
}