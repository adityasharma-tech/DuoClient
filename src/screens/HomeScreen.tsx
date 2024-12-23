import {View} from 'react-native';
import React, {useRef, useState} from 'react';
import {RNCamera} from 'react-native-camera';
import {PrimaryButton} from '../components/Button';
import TcpSocket from 'react-native-tcp-socket';

export default function HomeScreen() {
  const cameraRef = useRef<RNCamera>(null);
  const [server, setServer] = useState<any>(null);

  React.useEffect(() => {
    const tcpServer = TcpSocket.createServer(function (socket) {
      console.log('Client connected: ', socket.address());

      socket.write('Camera stream started\n');

      socket.on('data', data => {
        console.log('Data received:', data.toString());
      });

      socket.on('error', error => {
        console.error('Socket error:', error);
      });

      socket.on('close', () => {
        console.log('Connection closed');
      });
    });
    tcpServer.listen({port: 8002, host: '0.0.0.0'}, () => {
      console.log('server is running on port 8002');
    });

    setServer(tcpServer);

    return () => {
      tcpServer.close();
    };
  }, []);

  const sendFrame = async () => {
    if(cameraRef.current){
      const data = await cameraRef.current.takePictureAsync({ base64: true })
      if(!data.base64) return;
      const frame = Buffer.from(data.base64, 'base64');
      if(server) {
        server.write(frame)
      }
    }
  }

  return (
    <View>
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
          type="back"
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </View>
      <View
        style={{
          marginTop: 10,
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}>
        <PrimaryButton onPress={() => {}}>Start Server</PrimaryButton>
      </View>
    </View>
  );
}
