import {View, Text} from 'react-native';
import React, {useRef, useState} from 'react';
import {RNCamera} from 'react-native-camera';
import {PrimaryButton} from '../components/Button';
import TcpSocket from 'react-native-tcp-socket';
import {NetworkInfo} from 'react-native-network-info';
import {Buffer} from 'buffer'

export default function HomeScreen() {
  const cameraRef = useRef<RNCamera>(null);
  const [socket, setSocket] = useState<TcpSocket.Socket|null>(null);
  const [ipv4Address, setIPv4Address] = useState<string | null>(null);
  const [useFrontCameraType, setUseFrontCameraType] = useState<boolean>(false);

  React.useEffect(() => {
    const tcpServer = TcpSocket.createServer(function (st) {
      console.log('Client connected: ', st.address());

      setSocket(socket)

      st.on('data', data => {
        console.log('Data received:', data.toString());
      });

      st.on('error', error => {
        console.error('Socket error:', error);
      });

      st.on('close', () => {
        console.log('Connection closed');
      });
    });
    NetworkInfo.getIPV4Address().then(ipv4Add => {
      setIPv4Address(ipv4Add);
      tcpServer.listen({port: 8002, host: ipv4Add || '0.0.0.0'}, () => {
        console.log('server is running on port 8002');
      });
    });

    return () => {
      tcpServer.close();
    };
  }, []);

  React.useEffect(()=>{
    const sI = setInterval(sendFrame, 720);
    return ()=> clearInterval(sI);
  }, [])

  const sendFrame = async () => {
    if (cameraRef.current) {
      const data = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.4,
        width: 420,
        doNotSave: true
      });
      if (!data.base64) return;
      sendData(data.base64)
    }
  };

  const sendData = async (base64: string | undefined) => {
    if (!base64) return;
    try {
      const frame = Buffer.from(base64, 'base64');
      console.log(frame.byteLength);
      const frameLength = Buffer.alloc(4);
      frameLength.writeUInt32BE(frame.length, 0);
      if (socket != null) {
        socket.write(frameLength);
        socket.write(frame);
      }
    } catch (error) {
      console.error('Error during frames: ', error);
    }
  };

  return (
    <View>
      <View
        style={{
          marginVertical: 10,
        }}>
        <Text
          style={{
            color: 'black',
            textAlign: 'center',
            fontWeight: '900',
            fontSize: 16,
          }}>
          Server is running on {ipv4Address}:8002
        </Text>
      </View>
      <View
        style={{
          width: 1080 * 0.3,
          height: 1920 * 0.3,
          alignSelf: 'center',
          overflow: 'hidden',
          position: 'relative',
          borderRadius: 5,
        }}>
        <RNCamera
          captureAudio={false}
          ref={cameraRef}
          type={useFrontCameraType ? 'back' : 'front'}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </View>
      <View
        style={{
          marginTop: 40,
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 5,
        }}>
        <PrimaryButton onPress={sendFrame}> Send Frame </PrimaryButton>
        <PrimaryButton
          onPress={() => setUseFrontCameraType(!useFrontCameraType)}>
          Toogle Camera
        </PrimaryButton>
      </View>
    </View>
  );
}
