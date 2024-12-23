import { GestureResponderEvent, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native'
import React, { PropsWithChildren } from 'react'

export function PrimaryButton({children, onPress, containerStyle={}, textStyle={}}: PropsWithChildren<{children: string; onPress: (event: GestureResponderEvent) => void, containerStyle?: ViewStyle, textStyle?: TextStyle }>) {
  return (
    <TouchableOpacity onPress={onPress} style={[containerStyle,{
        paddingHorizontal: 48,
        display: 'flex',
        paddingVertical: 10,
        backgroundColor: 'black',
        borderRadius: 10,
    }]}>
      <Text style={[textStyle, {
        color: 'white',
        textAlign: 'center'
      }]}>{children}</Text>
    </TouchableOpacity>
  )
}