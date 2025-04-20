import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useEffect ,useContext} from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, Alert, ActivityIndicator}  from 'react-native';
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
    try {
      if (cameraRef.current) {
        const photo1 = await cameraRef.current.takePictureAsync();
        setCapsuleInfo(prevState => ({ ...prevState, fileUri: photo1.uri }));
        // console.log(photo1)
        setPhoto(photo1.uri);
        // setCapsuleInfo("fileUri", photo1.uri)
        // const fileName = photo.uri.split('/').pop();
        // const fileType = fileName.split('.').pop();
  
        // const formData = new FormData();
        // formData.append('file', {
        //   uri: photo.uri,
        //   name: fileName,
        //   type: `image/${fileType}`,
        // });
      }
    } catch (error) {
      console.error('Error taking picture:', error);
    }
  }
  const SettingsScreen = () => {
    router.push({
      pathname: '/SettingsScreen',
    });
  }
  const createCapsule = async () => {
    
    if (photo) {
      console.log("test"+capsuleInfo)
      try {
        router.push({
          pathname: '/CapsuleCreationScreen',
        });

      } catch (error) {
        console.error('Error saving photo URI to AsyncStorage:', error);
      }
    } else {
      Alert.alert('Photo Error', 'No valid photo provided.');
    }
  };
  

  function removePhoto() {
    setPhoto(null);
  }

  async function startRecording() {
    console.log("Attempting to start recording...");
    if (cameraRef.current && !isRecording && isCameraReady) {
      try {
        setIsRecording(true);
        console.log("Recording started...");
        const video = await cameraRef.current.recordAsync();
        console.log("Recording completed...");
        setVideoUri(video.uri);
      } catch (error) {
        console.error("Error starting video recording:", error);
      }
    }
  }
  
  
  function stopRecording() {
    console.log("Attempting to stop recording...");
    if (cameraRef.current && isRecording) {
      try {
        clearTimeout(recordingTimeout);
        cameraRef.current.stopRecording();
        setIsRecording(false);
        console.log("Recording stopped successfully");
      } catch (error) {
        console.error("Error stopping video recording:", error);
      }
    }
  }
  

  function removeVideo() {
    setVideoUri(null);
  }

  const handleCameraReady = () => {
    setIsCameraReady(true); 
  };

  // const handleCreateCapsule = async () => {
  //   const formData = new FormData();
  //   formData.append('title', "title");
  //   formData.append('description', "description");
  //   formData.append('unlockDate', "2025-01-28");
  //   formData.append('capsuleType', "Personal");

  //   if (photo) {
  //     const fileName = photo.split('/').pop();
  //     const fileType = fileName.split('.').pop();
  //     formData.append('file', {
  //       uri: photo,
  //       name: fileName,
  //       type: `image/${fileType}`,
  //     });
  //     console.log( photo );
  //   } else {
  //     Alert.alert('Photo Error', 'No valid photo provided.');
  //     console.log("2")
  //     return;
  //   }
    
  //   formData.forEach((value, key) => {
  //       console.log(`${key}: ${value}`);
  //     });
  //   try {
      
  //     // const token = await AsyncStorage.getItem('authToken');
  //     // console.log(token)
  //     const response = await fetch('http://192.168.2.107:5000/api/timecapsules/create', {
  //       method: 'POST',
  //       // headers: {
  //       //   Authorization: `Bearer ${token}`,
  //       // },
  //       body: formData,
  //     });
  //     console.log("6")
  //     if (!response.ok) {
  //       const errorMessage = (await response.json().catch(() => null))?.message || 
  //         'Failed to create capsule';
  //       Alert.alert('Error Creating Capsule', errorMessage);
  //       return;
  //     }
  //     console.log("7")
  //     Alert.alert('Capsule Created', 'Your time capsule has been created successfully.');
  //     router.push('/tab/HomeScreen');
  //   } catch (error) {
  //     console.error('Error:', error);
  //     Alert.alert('Error', 'An error occurred while creating the capsule.');
  //   }
  // };
  

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
        ><TouchableOpacity style={styles.button2} onPress={toggleCameraFacing}>
             <MaterialIcons name="flip-camera-android" size={26} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingsIcon} onPress={SettingsScreen}>
            <SimpleLineIcons name="settings" size={26} color="white" />
            </TouchableOpacity>
          <View style={styles.buttonContainer}>
            
            {/* {!isRecording ? (
              <TouchableOpacity style={styles.button} onPress={startRecording}>
                <Text style={styles.text}>Start Recording</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button} onPress={stopRecording}>
                <Text style={styles.text}>Stop Recording</Text>
              </TouchableOpacity>
            )} */}
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              {/* <Text style={styles.text}>Take Photo</Text> */}
              <MaterialIcons name="camera" size={66} color="white" />
              
            </TouchableOpacity>
          </View>
        </CameraView>
      ) : photo ? (
        <View style={styles.photoContainer}>
          <Image source={{ uri: photo }} style={styles.fullScreenPhoto} />
          
          <TouchableOpacity style={styles.closeButton} onPress={removePhoto}>
            <Ionicons name="close-circle" size={40} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button3} onPress={createCapsule}>
              <Text style={styles.text}>Create Capsule</Text>
              <FontAwesome name="arrow-right" size={24} color="white" style={styles.button4}/>
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
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  button2:{
  position:'absolute',
  top:20,
  left:20,
  },
  button3:{
    position:'absolute',
    bottom:20,
    right:20,
    backgroundColor: '#6BAED6',
    paddingHorizontal:20,
    paddingVertical: 10,
    borderRadius:8,
    flexDirection: 'row',
  },
  button4:{
    marginLeft:10
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
  settingsIcon:{
    position:'absolute',
    top:20,
    right:20,
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
});
