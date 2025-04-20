import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { RadioButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCreateCapsule } from '../Hooks/useCreateCapsule'
import { MyContext } from "./context/MyContext";

import { useRouter } from 'expo-router';
const SendCapsulePage = () => {
  const context = useContext(MyContext);
  const { handleCreateCapsule } = useCreateCapsule();
  const { capsuleInfo, setCapsuleInfo } = context;
  const [title, setTitle] = useState(capsuleInfo.title);
  const [description, setDescription] = useState(capsuleInfo.description);
  const [capsuleType, setCapsuleType] = useState(capsuleInfo.capsuleType);
  const [unlockDate, setUnlockDate] = useState(capsuleInfo.unlockDate);
  const [fileUri, setFileUri] = useState(capsuleInfo.fileUri);

  const router = useRouter();
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const fetchFriends = async () => {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      Alert.alert('Error', 'No authentication token found.');
      return;
    }

    try {
      const response = await fetch('http://192.168.2.107:5000/api/friends/user-friends', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error('Error fetching friends:', response.status);
        Alert.alert('Error', 'Failed to fetch friends data.');
        return;
      }

      const data = await response.json();
      if (data && data.friends) {
        const friendsData = await Promise.all(data.friends.map(async (friend) => {
          const profile = await fetchProfileByID(friend._id);
          return {
            ...friend,
            profilePicture: profile ? profile.profilePicture : null,
            username: profile ? profile.username : null,
          };
        }));
        setFriends(friendsData);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
      Alert.alert('Error', 'Failed to fetch friends data.');
    }
  };

  const fetchProfileByID = async (friendId) => {
    const token = await AsyncStorage.getItem('authToken');
    try {
      const response = await fetch(`http://192.168.2.107:5000/api/profile/getProfileByID/${friendId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if (!response.ok) throw new Error('Failed to fetch profile');
      return await response.json();
    } catch (error) {
      console.error('Error fetching profile by ID:', error);
      return null;
    }
  };

  const handleSelectFriend = (friendId) => {
    if (selectedFriends.includes(friendId)) {
      // Deselect friend if already selected
      setSelectedFriends(selectedFriends.filter((id) => id !== friendId));
    } else {
      // Select friend
      setSelectedFriends([...selectedFriends, friendId]);
    }
  };

  const handleSendCapsule = async () => {
    if (selectedFriends.length > 0) {
      await handleCreateCapsule({ title, description, unlockDate, capsuleType, fileUri, friends: selectedFriends });
      // console.log(selectedFriends)
      router.push('/tab/CameraScreen');
    } else {
      Alert.alert('Error', 'Please select at least one friend to send the capsule.');
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Friends to Send Capsule</Text>
      <ScrollView>
        {friends.map((friend) => (
          <TouchableOpacity
            key={friend._id}
            style={[
              styles.friendContainer,
              selectedFriends.includes(friend._id) && styles.selectedFriendContainer,
            ]}
            onPress={() => handleSelectFriend(friend._id)}
          >
            <Image
              source={{ uri: `http://192.168.2.107:5000/uploads/${friend.profilePicture}` }}
              style={styles.profilePic}
            />
            <Text style={styles.friendName}>{friend.username}</Text>
            <RadioButton
              value={friend._id}
              status={selectedFriends.includes(friend._id) ? 'checked' : 'unchecked'}
              onPress={() => handleSelectFriend(friend._id)}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.sendButton} onPress={handleSendCapsule}>
        <Text style={styles.sendButtonText}>Send Capsule</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  friendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedFriendContainer: {
    backgroundColor: '#e0f7fa', // Light blue for selected
    borderColor: '#26c6da',
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  friendName: {
    fontSize: 16,
    flex: 1,
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SendCapsulePage;
