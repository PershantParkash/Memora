import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

export const handleCreateCapsule = async (capsuleInfo) => {
  try {
    const token = await AsyncStorage.getItem('authToken');

    const formData = new FormData();
    formData.append('title', capsuleInfo.title);
    formData.append('description', capsuleInfo.description);
    formData.append('unlockDate', moment(capsuleInfo.unlockDate).format('YYYY-M-D'));
    formData.append('capsuleType', capsuleInfo.capsuleType);

    if (capsuleInfo.capsuleType === "Shared" && capsuleInfo.friends.length > 0) {
      capsuleInfo.friends.forEach((friendId) => {
        formData.append('friends[]', friendId);  // Send as an array
      });
    }

    if (capsuleInfo.fileUri) {
      const fileName = capsuleInfo.fileUri.split('/').pop();
      const fileType = fileName.split('.').pop();
      formData.append('file', {
        uri: capsuleInfo.fileUri,
        name: fileName,
        type: `image/${fileType}`,
      });
    } else {
      Alert.alert('Photo Error', 'No valid photo provided.');
      return;
    }

    const response = await fetch('http://192.168.2.106:5000/api/timecapsules/create', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorMessage = (await response.json().catch(() => null))?.message ||
        'Failed to create capsule';
      Alert.alert('Error Creating Capsule', errorMessage);
      return;
    }

    Alert.alert('Capsule Created', 'Your time capsule has been created successfully.');
  } catch (error) {
    console.error('Error:', error);
    Alert.alert('Error', 'An error occurred while creating the capsule.');
  }
};


export default handleCreateCapsule;