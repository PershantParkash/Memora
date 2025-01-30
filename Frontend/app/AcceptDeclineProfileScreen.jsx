import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';

const ProfileScreen = () => {
  const { user_id } = useLocalSearchParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

 

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          Alert.alert('Error', 'You are not logged in.', [
            { text: 'OK', onPress: () => router.push('/login') },
          ]);
          return;
        }
        const response = await fetch(
          `http://192.168.2.106:5000/api/profile/getProfileByID/${user_id}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          Alert.alert('Error', errorData.message || 'Failed to fetch profile.');
          router.push('/login');
          return;
        }

        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        Alert.alert('Error', 'An unknown error occurred.');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [router, user_id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6BAED6" />
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load profile.</Text>
      </View>
    );
  }

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
      router.push({
        pathname: '/tab/CameraScreen'
      })
    } catch (error) {
      console.error('Error accepting friend request:', error);
      Alert.alert('Error', 'Failed to accept friend request. Please try again later.');
  
      // If something goes wrong, re-fetch pending requests to ensure UI consistency
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
  
      // // Optimistically update UI by removing the request from pending lists
      // setPendingRequests((prev) =>
      //   prev.filter((request) => request.friendshipId !== friendshipId)
      // );
      // setPendingRequestsProfile((prev) =>
      //   prev.filter((profile) => profile.friendshipId !== friendshipId)
      // );
  
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
      router.push({
        pathname: '/tab/CameraScreen'
      })
    } catch (error) {
      console.error('Error declining friend request:', error);
      Alert.alert('Error', 'Failed to decline friend request. Please try again later.');
  
      // If something goes wrong, re-fetch pending requests to ensure UI consistency
      await fetchPendingRequests();
    }
  };
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image
          source={{
            uri: `http://192.168.2.106:5000/uploads/${profileData?.profilePicture}`,
          }}
          style={styles.profileImage}
        />
        <Text style={styles.username}>{profileData?.username }</Text>
        <Text style={styles.bio}>{profileData?.bio }</Text>
      </View>

      <View style={styles.detailsContainer}>
        <DetailItem label="Contact" value={profileData?.contactNo || 'N/A'} />
        {/* <DetailItem label="CNIC" value={profileData?.cnic || 'N/A'} /> */}
        <DetailItem
          label="Date of Birth"
          value={profileData?.dob ? new Date(profileData.dob).toDateString() : 'N/A'}
        />
        <DetailItem
          label="Gender"
          value={
            profileData?.gender
              ? profileData.gender.charAt(0).toUpperCase() + profileData.gender.slice(1)
              : 'N/A'
          }
        />
        <DetailItem label="Address" value={profileData?.address || 'N/A'} />
      </View>

     <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.button, styles.acceptButton]}
          onPress={() => handleAcceptRequest(profileData.userId)}
        >
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.declineButton]}
          onPress={() => handleDeclineRequest(profileData.userId)}
        >
          <Text style={styles.buttonText}>Decline</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
};

const DetailItem = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  errorText: {
    fontSize: 16,
    color: '#ff4d4d',
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#6BAED6',
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  bio: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#6BAED6',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
});

export default ProfileScreen;
