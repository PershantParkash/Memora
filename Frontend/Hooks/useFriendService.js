import { Alert } from 'react-native';
import axiosInstance from '../axiosInstance'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const useProfileService = () => {
    const router = useRouter();

 const fetchAllProfiles = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      if (!storedToken) {
        Alert.alert('Error', 'Authentication token not found.');
        setIsLoading(false);
        return;
      }
  
      const response = await axiosInstance.get('/api/profile/getAllProfiles', {
        headers: {
          Authorization: `Bearer ${storedToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      const data = response.data;
  
      const filteredProfiles = data.filter(
        (profile) =>
          !pendingRequests.some((request) => request.user_id === profile.userId)
      );
  
      return (filteredProfiles || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load profiles. Please try again later.');
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      if (!storedToken) {
        Alert.alert('Error', 'Authentication token not found.');
        return;
      }
  
      const response = await axiosInstance.get('/api/friends/getPendingFriendRequests', {
        headers: {
          Authorization: `Bearer ${storedToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      const data = response.data;
      return (data.pendingRequests || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load pending requests. Please try again later.');
    }
  };
  
 const sendFriendRequest = async (friend_user_id, setAllProfiles) => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      if (!storedToken) {
        Alert.alert('Error', 'Authentication token not found.');
        return;
      }
  
      const response = await axiosInstance.post(
        '/api/friends/send',
        { friend_user_id },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.status !== 200) {
        throw new Error('Failed to send friend request');
      }
  
      Alert.alert('Success', 'Friend request sent successfully!');
      setAllProfiles((prev) => prev.filter((profile) => profile.userId !== friend_user_id));
    } catch (error) {
      Alert.alert('Error', 'Failed to send friend request. Please try again later.');
    }
  };

 const acceptFriendRequest = async (requestId, onSuccess) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'Authentication token not found.');
        return;
      }
  
      const response = await axiosInstance.post(
        '/api/friends/accept',
        { request_id: requestId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.status !== 200) {
        throw new Error('Failed to accept friend request');
      }
  
      Alert.alert('Success', 'Friend request accepted!');
      if (onSuccess) onSuccess(requestId);
    } catch (error) {
      console.error('Accept Friend Error:', error);
      Alert.alert('Error', 'Failed to accept request. Try again later.');
    }
  };
      
const declineFriendRequest = async (requestId, onSuccess) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'Authentication token not found.');
        return;
      }
  
      const response = await axiosInstance.post(
        '/api/friends/decline',
        { request_id: requestId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.status !== 200) {
        throw new Error('Failed to decline friend request');
      }
  
      Alert.alert('Request Declined', 'Friend request declined.');
      if (onSuccess) onSuccess(requestId);
    } catch (error) {
      console.error('Decline Friend Error:', error);
      Alert.alert('Error', 'Failed to decline request. Try again later.');
    }
  };
  

  return { fetchAllProfiles, fetchPendingRequests, sendFriendRequest, acceptFriendRequest, declineFriendRequest };
};

export default useProfileService;
