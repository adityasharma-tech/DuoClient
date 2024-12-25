import {View, Text} from 'react-native';
import React, {useRef, useState} from 'react';
import {PrimaryButton} from '../components/Button';
import TcpSocket from 'react-native-tcp-socket';
import {NetworkInfo} from 'react-native-network-info';
import {Buffer} from 'buffer';
import {
  Camera,
  Frame,
  useCameraDevice,
  useCameraPermission,
  useFrameProcessor,
} from 'react-native-vision-camera';

export default function HomeScreen() {
  const backCamera = useCameraDevice('back');
  const frontCamera = useCameraDevice('front');
  const {hasPermission} = useCameraPermission();

  const cameraRef = useRef<Camera>(null);
  const [isBrodcasting, setIsBrodcasting] = useState(false);
  const [ipv4Address, setIPv4Address] = useState<string | null>(null);
  const [useFrontCameraType, setUseFrontCameraType] = useState<boolean>(false);
  const [socket, setSocket] = React.useState<TcpSocket.Socket | null>(null);

  React.useEffect(() => {
    const tcpServer = TcpSocket.createServer(function (socket) {
      console.log('Client connected: ', socket.address());

      setSocket(socket);

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

  const startRecording = async () => {
    setIsBrodcasting(!isBrodcasting);
    if (cameraRef.current) {
      cameraRef.current.takeSnapshot()
    }
    // setIsBrodcasting(false)
  };

  const frameProcessor = useFrameProcessor((frame: Frame)=>{
    'worklet'
  }, [])

  const sendFrame = async () => {
    if (cameraRef.current) {
      // const data = await cameraRef.current.takePictureAsync({
      //   base64: true,
      //   doNotSave: true,
      //   quality: 0.3,
      //   width: 420
      // });
      // await sendData(data.base64)
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
          borderWidth: 1,
          borderColor: isBrodcasting ? '#e74c3c' : '#ffffff',
          elevation: 1,
        }}>
        {hasPermission && frontCamera != null && backCamera != null ? (
          <Camera
          frameProcessor={frameProcessor}
            device={useFrontCameraType ? frontCamera : backCamera}
            isActive={true}
            ref={cameraRef}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        ) : null}
      </View>
      <View
        style={{
          marginTop: 40,
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 6,
          width: '80%',
          alignSelf: 'center',
        }}>
        <PrimaryButton onPress={sendFrame}> Send Frame </PrimaryButton>
        <PrimaryButton
          onPress={() => setUseFrontCameraType(!useFrontCameraType)}>
          Toogle Camera
        </PrimaryButton>
      </View>
      <PrimaryButton
        containerStyle={{
          width: '80%',
          marginTop: 5,
          alignSelf: 'center',
          backgroundColor: isBrodcasting ? '#e74c3c' : '#000000',
        }}
        onPress={startRecording}>
        {isBrodcasting ? 'Stop recording' : 'Start recording'}
      </PrimaryButton>
    </View>
  );
}
