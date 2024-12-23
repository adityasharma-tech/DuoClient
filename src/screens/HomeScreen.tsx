import {View, Button} from 'react-native';
import React from 'react';
import {RNCamera} from 'react-native-camera';

export default function HomeScreen() {
  return (
    <View>
      <View style={{
        width: '75%',
        height: 400,
        alignSelf: 'center',
      }}>
        <RNCamera
          type="back"
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </View>
      <View style={{
        marginTop: 10
      }}>

      <Button title="Start server" />
      </View>
    </View>
  );
}
