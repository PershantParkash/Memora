import { Alert } from 'react-native';
import axiosInstance from '../axiosInstance'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const useProfileService = () => {
    const router = useRouter();

    const fetchProfileData = async () => {
        try {
          const token = await AsyncStorage.getItem('authToken');
          if (!token) {
            Alert.alert('Session Expired', 'Please log in again to continue.');
            router.push('/login');
            return;
          }
      
          const response = await axiosInstance.get('/api/profile/getProfile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
      
          return response.data;
        } catch (error) {
          const message = error.response?.data?.message || 'Failed to fetch profile data.';
          Alert.alert('Profile Error', message);
          router.push('/login');
        }
      };

      const updateUserProfile = async (profileData, profileChanged) => {
        try {
          const token = await AsyncStorage.getItem('authToken');
          if (!token) {
            Alert.alert('Error', 'You are not logged in.');
            throw new Error('No auth token found.');
          }
      
          const formData = new FormData();
          formData.append('username', profileData.username);
          formData.append('bio', profileData.bio);
          formData.append('cnic', profileData.cnic);
          formData.append('contactNo', profileData.contactNo);
          formData.append('dob', profileData.dob);
          formData.append('gender', profileData.gender);
          formData.append('address', profileData.address);
      
          if (profileChanged) {
            const fileName = profileData.profilePicture.split('/').pop();
            const fileType = fileName.split('.').pop();
            formData.append('file', {
              uri: profileData.profilePicture,
              name: fileName,
              type: `image/${fileType}`,
            });
          }
      
          const response = await axiosInstance.put('/api/profile/updateProfile', formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          });
      
          return response.data;
        } catch (error) {
          console.error('Update profile error:', error);
          throw error;
        }
      };
      

  return { fetchProfileData, updateUserProfile };
};

export default useProfileService;
