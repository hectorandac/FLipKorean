import React, { useState, useEffect, useRef } from 'react';
import { ViroARSceneNavigator, ViroMaterials } from '@reactvision/react-viro';
import { Camera, useCameraDevice, useCodeScanner, useCameraPermission, Code, CodeScannerFrame } from 'react-native-vision-camera';
import { StyleSheet, View, Text, Platform, PermissionsAndroid } from 'react-native';
import { PERMISSIONS, request, check, RESULTS } from 'react-native-permissions';
import ARScene from './src/ARScene';
import RNFS from 'react-native-fs';
import ImageEditor from '@react-native-community/image-editor';
import { ImageCropData } from '@react-native-community/image-editor/lib/typescript/src/types';
import { ViroARTrackingTargets } from '@reactvision/react-viro';

function App(): React.JSX.Element {
  const camera = useRef<Camera | null>(null);
  const [showAR, setShowAR] = useState(false);
  const [deactivateCamera, setDeactivateCamera] = useState(false);
  const [arVisible, setArVisible] = useState(false);
  const device = useCameraDevice('back');
  const { hasPermission } = useCameraPermission();
  const [unloadQRScan, setUnloadQRScan] = useState(false);

  const setupViroTracking = async (qrCodePath: string) => {
    ViroARTrackingTargets.createTargets({
      qrCode: {
        source: { uri: qrCodePath },
        orientation: 'up',
        physicalWidth: 0.04,
      },
    });
  };

  const cropQR = async (code: Code, frame: CodeScannerFrame) => {
    if (!camera || !camera.current) {
      return undefined;
    }

    let snapshot = await camera.current.takeSnapshot({
      quality: 100
    })

    const isAndroid = Platform.OS === 'android';
    const isPortrait = snapshot.width < snapshot.height;

    let scale;

    if (isAndroid) {
      if (isPortrait) {
        scale = { x: snapshot.width / frame.height, y: snapshot.height / frame.width };
      } else {
        scale = { x: snapshot.width / frame.width, y: snapshot.height / frame.height };
      }
    } else if (Platform.OS === 'ios') {
      scale = { x: snapshot.width / frame.width, y: snapshot.height / frame.height };
    } else {
      scale = { x: snapshot.width / frame.width, y: snapshot.height / frame.height };
    }

    if (!code.corners) return
    if (!code.frame) return

    const cropData : ImageCropData  = {
      offset: { x: code.frame.x * scale.x, y: code.frame.y * scale.y },
      size: {height: code.frame.height * scale.x,  width: code.frame.width * scale.y},
      quality: 1.0
    };

    return (await ImageEditor.cropImage(`file://${snapshot.path}`, cropData)).uri;
  }

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes: Code[], frame: CodeScannerFrame) => {
      if(deactivateCamera) return
      setDeactivateCamera(true);
      cropQR(codes[0], frame).then((qrImgPath) => {
        console.log(qrImgPath);

        if (!qrImgPath) return
        setupViroTracking(qrImgPath);

        RNFS.copyFile(qrImgPath, `${RNFS.DownloadDirectoryPath}/TestSnapshot.jpg`);

        setShowAR(true);
        setTimeout(() => {
          setArVisible(true);
          setUnloadQRScan(true);
        }, 3000);
      }).catch(e => console.log(e));
    }
  });

  useEffect(() => {
    if (!hasPermission) {
      Camera.requestCameraPermission();
    }
  }, [hasPermission]);

  if (!device || !hasPermission) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>No Camera</Text></View>;
  }

  return (
    <View style={styles.container}>
      {showAR && (
        <View style={[styles.arContainer, { right: arVisible ? 0 : -1000 }]}>
          <ViroARSceneNavigator
            initialScene={{ scene: ARScene }}
            autofocus={true}
            style={styles.fullScreen}
          />
        </View>
      )}

      {!unloadQRScan && 
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={!deactivateCamera}
          codeScanner={codeScanner}
        />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullScreen: {
    flex: 1,
  },
  arContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    right: -1000, // Start off-screen to the right
  },
});

export default App;
