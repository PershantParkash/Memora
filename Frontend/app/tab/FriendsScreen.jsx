import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { API_BASE_URL } from '@env';

const FriendsScreen = () => {
  const [allProfiles, setAllProfiles] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [pendingRequestsProfile, setPendingRequestsProfile] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchAllProfiles = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      if (!storedToken) {
        Alert.alert('Error', 'Authentication token not found.');
        setIsLoading(false);
        return;
      }
  
      const response = await fetch(`${API_BASE_URL}/api/profile/getAllProfiles`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${storedToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch profiles');
      }
  
      const data = await response.json();
  
      const filteredProfiles = data.filter(
        (profile) =>
          !pendingRequests.some((request) => request.user_id === profile.userId)
      );
  
      setAllProfiles(filteredProfiles || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
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

      const response = await fetch(`${API_BASE_URL}/api/friends/getPendingFriendRequests`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${storedToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pending friend requests');
      }

      const data = await response.json();
      setPendingRequests(data.pendingRequests || []);
      const profiles = await Promise.all(
        data.pendingRequests.map((request) => fetchProfileByID(request.user_id))
      );

      setPendingRequestsProfile(profiles.filter(Boolean));
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      Alert.alert('Error', 'Failed to load pending requests. Please try again later.');
    }
  };

  const fetchProfileByID = async (userId) => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      if (!storedToken) {
        Alert.alert('Error', 'Authentication token not found.');
        return null;
      }

      const response = await fetch(`${API_BASE_URL}/api/profile/getProfileByID/${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${storedToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile by ID');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching profile by ID:', error);
      return null;
    }
  };

  const handleAcceptRequest = async (friendshipId) => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      if (!storedToken) {
        Alert.alert('Error', 'Authentication token not found.');
        return;
      }
  
      const response = await fetch(`${API_BASE_URL}/api/friends/accept`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${storedToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ friendshipId }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to accept friend request');
      }
  
      const data = await response.json();
      Alert.alert('Success', data.message || 'Friend request accepted!');
  
      setPendingRequests((prev) =>
        prev.filter((request) => request.friendshipId !== friendshipId)
      );
      setPendingRequestsProfile((prev) =>
        prev.filter((profile) => profile.friendshipId !== friendshipId)
      );
    } catch (error) {
      console.error('Error accepting friend request:', error);
      Alert.alert('Error', 'Failed to accept friend request. Please try again later.');
    }
  };
  

  const handleDeclineRequest = async (friendshipId) => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      if (!storedToken) {
        Alert.alert('Error', 'Authentication token not found.');
        return;
      }
  
      const response = await fetch(`${API_BASE_URL}/api/friends/decline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${storedToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ friendshipId }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to decline friend request');
      }
  
      const data = await response.json();
      Alert.alert('Success', data.message || 'Friend request declined!');
  
      setPendingRequests((prev) =>
        prev.filter((request) => request.friendshipId !== friendshipId)
      );
      setPendingRequestsProfile((prev) =>
        prev.filter((profile) => profile.friendshipId !== friendshipId)
      );
    } catch (error) {
      console.error('Error declining friend request:', error);
      Alert.alert('Error', 'Failed to decline friend request. Please try again later.');
    }
  };
  

  const sendFriendRequest = async (friend_user_id) => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      if (!storedToken) {
        Alert.alert('Error', 'Authentication token not found.');
        return;
      }
  
      const response = await fetch(`${API_BASE_URL}/api/friends/send`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${storedToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ friend_user_id }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to send friend request');
      }
  
      Alert.alert('Success', 'Friend request sent successfully!');
  
      // Update state to remove the profile from `allProfiles`
      setAllProfiles((prev) => prev.filter((profile) => profile.userId !== friend_user_id));
    } catch (error) {
      console.error('Error sending friend request:', error);
      Alert.alert('Error', 'Failed to send friend request. Please try again later.');
    }
  };
  

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchPendingRequests();
      await fetchAllProfiles();
      setIsLoading(false);
    };
    loadData();
  }, []);
  

  const renderPendingRequestItem = (item) => (
    <TouchableOpacity style={styles.requestItem} key={item._id}
    >
      <View style={styles.pendingItem}>
        <Image
          source={
            { uri: `${API_BASE_URL}/uploads/${item.profilePicture}` }
          }
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{item.username || 'Unknown User'}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.button, styles.acceptButton]}
          onPress={() => handleAcceptRequest(item.userId)}
        >
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.declineButton]}
          onPress={() => handleDeclineRequest(item.userId)}
        >
          <Text style={styles.buttonText}>Decline</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
        {/* <Text style={styles.sectionTitle}>{API_BASE_URL}</Text> */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#6BAED6" />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.sectionTitle}>Pending Friend Requests</Text>
          {pendingRequestsProfile.length > 0 ? (
            pendingRequestsProfile.map(renderPendingRequestItem)
          ) : (
            <Text style={styles.noRequestsText}>No pending friend requests.</Text>
          )}

          <Text style={styles.sectionTitle}>All Profiles</Text>
          {allProfiles.length > 0 ? (
            allProfiles.map((profile) => (
              <TouchableOpacity style={styles.profileItem} key={profile._id}
              >
                <Image
                  source={{  uri: `${API_BASE_URL}/uploads/${profile.profilePicture}`}}
                  style={styles.profileImage}
                />
                <Text style={styles.profileName}>{profile.username || 'Unknown User'}</Text>
                <TouchableOpacity
                  style={styles.sendRequestButton}
                  onPress={() => sendFriendRequest(profile.userId)}
                >
                  <Text style={styles.sendRequestButtonText}>Send Request</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noRequestsText}>No profiles found.</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  requestItem: {
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 1,
  },
  requestText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 0.48,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  declineButton: {
    backgroundColor: '#FF5252',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 1,
  },
  pendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  profileName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  sendRequestButton: {
    backgroundColor: '#6BAED6',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  sendRequestButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noRequestsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default FriendsScreen;
