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
import Ionicons from '@expo/vector-icons/Ionicons';
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
  
      const response = await fetch('http://192.168.2.106:5000/api/profile/getAllProfiles', {
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

      const response = await fetch('http://192.168.2.106:5000/api/friends/getPendingFriendRequests', {
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
      // const profiles = await Promise.all(
      //   data.pendingRequests.map((request) => fetchProfileByID(request.user_id))
      // );

      setPendingRequestsProfile(data.pendingRequests);
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

      const response = await fetch(`http://192.168.2.106:5000/api/profile/getProfileByID/${userId}`, {
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
  
     
  
      const response = await fetch('http://192.168.2.106:5000/api/friends/accept', {
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
        prev.filter((request) => request.userId !== friendshipId)
      );
      setPendingRequestsProfile((prev) =>
        prev.filter((profile) => profile.userId !== friendshipId)
      );
     
    } catch (error) {
      console.error('Error accepting friend request:', error);
      Alert.alert('Error', 'Failed to accept friend request. Please try again later.');
  
      await fetchPendingRequests();
    }
  };
  
  const handleDeclineRequest = async (friendshipId) => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      if (!storedToken) {
        Alert.alert('Error', 'Authentication token not found.');
        return;
      }
  
      
      // Make the API call to decline the friend request
      const response = await fetch('http://192.168.2.106:5000/api/friends/decline', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${storedToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ friendshipId }), // Send friendshipId to the backend
      });
  
      if (!response.ok) {
        throw new Error('Failed to decline friend request');
      }
  
      const data = await response.json();
     
      Alert.alert('Success', data.message || 'Friend request declined!');
      setPendingRequests((prev) =>
        prev.filter((request) => request.userId !== friendshipId)
      );
      setPendingRequestsProfile((prev) =>
        prev.filter((profile) => profile.userId !== friendshipId)
      );
    } catch (error) {
      console.error('Error declining friend request:', error);
      Alert.alert('Error', 'Failed to decline friend request. Please try again later.');
  
      // If something goes wrong, re-fetch pending requests to ensure UI consistency
      await fetchPendingRequests();
    }
  };
  
  const sendFriendRequest = async (friend_user_id) => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      if (!storedToken) {
        Alert.alert('Error', 'Authentication token not found.');
        return;
      }
  
      const response = await fetch('http://192.168.2.106:5000/api/friends/send', {
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
    <TouchableOpacity style={styles.requestItem} key={item._id} onPress={()=>{
       router.push({
      pathname: '/AcceptDeclineProfileScreen',
      params: { user_id: item.userId },
    })
    ;}}
    >
      <View style={styles.pendingItem}>
        <Image
          source={
            { uri: `http://192.168.2.106:5000/uploads/${item.profilePicture}` }
          }
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{item.username}</Text>
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
      {isLoading ? (
        <ActivityIndicator size="large" color="#6BAED6" />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.sectionTitle}>Friend Requests</Text>
          {pendingRequestsProfile.length > 0 ? (
            pendingRequestsProfile.map(renderPendingRequestItem)
          ) : (
            <View style={styles.container2}>
            <Image 
              source={require('../../assets/images/png.jpg')} 
              style={styles.image} 
            />
            <Text style={styles.noRequestsText}>You have no pending friend requests right now.</Text> 
            </View>
          )}
  
          <Text style={styles.sectionTitle}>Find Friends</Text>
          {allProfiles.length > 0 ? (
            allProfiles.map((profile) => (
              <TouchableOpacity style={styles.profileItem} key={profile._id} onPress={()=>{
                router.push({
               pathname: '/SendRequestProfileScreen',
               params: { user_id: profile.userId },
             })
             ;}}
              >
                <Image
                  source={{  uri: `http://192.168.2.106:5000/uploads/${profile.profilePicture}`}}
                  style={styles.profileImage}
                />
                <Text style={styles.profileName}>{profile.username}</Text>
                <TouchableOpacity
                  style={styles.sendRequestButton}
                  onPress={() => sendFriendRequest(profile.userId)}
                >
                  <Text style={styles.sendRequestButtonText}>Add</Text>  
                  <Ionicons name="person-add" size={16} color="white"  style={styles.personIcon} />
                </TouchableOpacity>
               
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.container2}>
            <Image 
              source={require('../../assets/images/Wavy_Ppl-09_Single-02.jpg')} 
              style={styles.image} 
            />
            <Text style={styles.noRequestsText}>
              It seems there are no users available to send a friend request at the moment. </Text>
          </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#f9f9f9',
    backgroundColor: 'white',
  },
  container2: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
  },
  image: {
    width: 180,
    height: 180,
  },
  scrollContainer: {
    padding: 16,
  },
  personIcon: {
    marginLeft:5,
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
    flexDirection:'row',
  },
  sendRequestButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noRequestsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    paddingHorizontal:7,
    marginVertical: 10,
  },
});

export default FriendsScreen;
