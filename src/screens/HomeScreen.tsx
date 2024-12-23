import {View} from 'react-native';
import React, { useRef } from 'react';
import {RNCamera} from 'react-native-camera';
import { PrimaryButton } from '../components/Button';

export default function HomeScreen() {
  const cameraRef = useRef<RNCamera>(null);
  
  return (
    <View>
      <View style={{
        width: 1080*0.3,
        height: 1920*0.3,
        alignSelf: 'center',
        overflow: 'hidden',
        position:'relative',
        borderRadius: 5
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
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-around'
      }}>
        
      <PrimaryButton onPress={()=>{}}>Start Server</PrimaryButton>
      </View>
    </View>
  );
}
