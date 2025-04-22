import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useEffect, useContext } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video as ExpoVideo } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { MyContext } from "../context/MyContext";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

export default function App() {
  const context = useContext(MyContext);
  const { capsuleInfo, setCapsuleInfo } = context;

  const [facing, setFacing] = useState('back');
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [videoUri, setVideoUri] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioPermission, setAudioPermission] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  
  // Loading state variables
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const cameraRef = useRef(null);
  let recordingTimeout = null;

  const router = useRouter();
  useEffect(() => {
    (async () => {
      const { status: audioStatus } = await Audio.requestPermissionsAsync();
      setAudioPermission(audioStatus === 'granted');
    })();
  }, []);

  if (!cameraPermission || audioPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Checking permissions...</Text>
      </View>
    );
  }

  if (!cameraPermission.granted || !audioPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera and record audio</Text>
        <Button onPress={requestCameraPermission} title="Grant Camera Permission" />
        <Button onPress={() => Audio.requestPermissionsAsync()} title="Grant Audio Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function takePicture() {
    if (!cameraRef.current || !isCameraReady) return;
    
    try {
      setIsCapturing(true);
      const photo1 = await cameraRef.current.takePictureAsync();
      setCapsuleInfo(prevState => ({ ...prevState, fileUri: photo1.uri }));
      setPhoto(photo1.uri);
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  }

  const SettingsScreen = () => {
    router.push({
      pathname: '/SettingsScreen',
    });
  }

  const createCapsule = async () => {
    if (!photo) {
      Alert.alert('Photo Error', 'No valid photo provided.');
      return;
    }
    
    try {
      setIsProcessing(true);
      // Simulate processing time - you may remove this in production
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to the capsule creation screen
      router.push({
        pathname: '/CapsuleCreationScreen',
      });
    } catch (error) {
      console.error('Error preparing capsule:', error);
      Alert.alert('Error', 'Failed to prepare capsule. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  function removePhoto() {
    setPhoto(null);
  }

  async function startRecording() {
    if (!cameraRef.current || isRecording || !isCameraReady) return;
    
    try {
      setIsRecording(true);
      const video = await cameraRef.current.recordAsync();
      setVideoUri(video.uri);
    } catch (error) {
      console.error("Error starting video recording:", error);
      Alert.alert('Recording Error', 'Failed to start recording. Please try again.');
    }
  }

  function stopRecording() {
    if (!cameraRef.current || !isRecording) return;
    
    try {
      clearTimeout(recordingTimeout);
      cameraRef.current.stopRecording();
      setIsRecording(false);
    } catch (error) {
      console.error("Error stopping video recording:", error);
      Alert.alert('Recording Error', 'Failed to stop recording. Please try again.');
    }
  }

  function removeVideo() {
    setVideoUri(null);
  }

  const handleCameraReady = () => {
    setIsCameraReady(true);
  };

  return (
    <View style={styles.container}>
      {!videoUri && !photo ? (
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          onCameraReady={handleCameraReady}
          onRecordingError={(error) => {
            console.error("Recording error:", error);
            setIsRecording(false);
          }}
        >
          <TouchableOpacity 
            style={styles.button2} 
            onPress={toggleCameraFacing}
            disabled={isCapturing}
          >
            <MaterialIcons name="flip-camera-android" size={26} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingsIcon} 
            onPress={SettingsScreen}
            disabled={isCapturing}
          >
            <SimpleLineIcons name="settings" size={26} color="white" />
          </TouchableOpacity>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.button} 
              onPress={takePicture}
              disabled={isCapturing || !isCameraReady}
            >
              {isCapturing ? (
                <ActivityIndicator size="large" color="white" />
              ) : (
                <MaterialIcons name="camera" size={66} color="white" />
              )}
            </TouchableOpacity>
          </View>
          
          {!isCameraReady && (
            <View style={styles.cameraLoadingOverlay}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text style={styles.loadingText}>Camera is initializing...</Text>
            </View>
          )}
        </CameraView>
      ) : photo ? (
        <View style={styles.photoContainer}>
          <Image source={{ uri: photo }} style={styles.fullScreenPhoto} />
          
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={removePhoto}
            disabled={isProcessing}
          >
            <Ionicons name="close-circle" size={40} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button3, isProcessing ? styles.buttonDisabled : null]} 
            onPress={createCapsule}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <View style={styles.processingContainer}>
                <ActivityIndicator size="small" color="white" />
                <Text style={styles.text}>Processing...</Text>
              </View>
            ) : (
              <>
                <Text style={styles.text}>Create Capsule</Text>
                <FontAwesome name="arrow-right" size={24} color="white" style={styles.button4}/>
              </>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.videoContainer}>
          <ExpoVideo
            source={{ uri: videoUri }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            shouldPlay
            isLooping
            style={styles.video}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={removeVideo}>
              <Text style={styles.text}>Remove Video</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    marginBottom: 50,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  button2: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  button3: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#6BAED6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#A9A9A9',
  },
  button4: {
    marginLeft: 10
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  photoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  fullScreenPhoto: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  settingsIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  cameraLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: 'white',
    fontSize: 16,
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});