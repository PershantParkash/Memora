import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';

const EditProfileScreen = () => {
  
  const [profileData, setProfileData] = useState({
    username: '',
    bio: '',
    profilePicture: '',
    cnic: '',
    contactNo: '',
    dob: '',
    gender: '',
    address: '',
  });

  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();
  const [profileChanged, setProfileChanged] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          Alert.alert('Error', 'You are not logged in.');
          router.push('/login');
          return;
        }

        const response = await fetch(
          'http://192.168.2.106:5000/api/profile/getProfile',
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
          return;
        }

        const data = await response.json();
        setProfileData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        Alert.alert('Error', 'An unknown error occurred.');
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'You are not logged in.');
        router.push('/login');
        return;
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
      
      const response = await fetch('http://192.168.2.106:5000/api/profile/updateProfile', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Failed to update profile.');
        return;
      }
  
      Alert.alert('Success', 'Profile updated successfully.');
      router.push('/tab/ProfileScreen');
    }catch(error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'An unknown error occurred.');
    }
  };
  

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileData({ ...profileData, profilePicture: result.assets[0].uri });
      setProfileChanged(true)
    } else {
      Alert.alert('No image selected', 'Please select an image.');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setProfileData({ ...profileData, dob: formattedDate });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6BAED6" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.profilePicContainer}
        onPress={handlePickImage}
      >
        <Image
  source={
    profileData.profilePicture.startsWith('file')
      ? { uri: profileData.profilePicture } 
      : { uri: `http://192.168.2.106:5000/uploads/${profileData.profilePicture}` } 
  }
  style={styles.profilePic}
/>
        <Text style={styles.changePicText}>Change Profile Picture</Text>
      </TouchableOpacity>

      <InputField
        label="Username"
        value={profileData.username}
        onChangeText={(text) =>
          setProfileData({ ...profileData, username: text })
        }
      />

      <InputField
        label="Bio"
        value={profileData.bio}
        onChangeText={(text) => setProfileData({ ...profileData, bio: text })}
        multiline
      />

      <InputField
        label="CNIC"
        value={profileData.cnic}
        keyboardType="numeric"
        onChangeText={(text) => setProfileData({ ...profileData, cnic: text })}
      />

      <InputField
        label="Contact Number"
        value={profileData.contactNo}
        keyboardType="phone-pad"
        onChangeText={(text) =>
          setProfileData({ ...profileData, contactNo: text })
        }
      />

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Date of Birth</Text>
        <TouchableOpacity
          style={[styles.input, styles.dateInput]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={{ color: profileData.dob ? '#000' : '#aaa' }}>
            {profileData.dob || 'Select Date of Birth'}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={profileData.dob ? new Date(profileData.dob) : new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.inputLabel}>Gender</Text>
        <Picker
          selectedValue={profileData.gender}
          onValueChange={(value) =>
            setProfileData({ ...profileData, gender: value })
          }
          style={styles.picker}
        >
          <Picker.Item label="Select Gender" value="" />
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
          <Picker.Item label="Other" value="other" />
        </Picker>
      </View>

      <InputField
        label="Address"
        value={profileData.address}
        onChangeText={(text) =>
          setProfileData({ ...profileData, address: text })
        }
        multiline
      />

      {/* Save and Cancel Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.push('/tab/ProfileScreen')}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity> */}
      </View>
    </ScrollView>
  );
};

const InputField = ({ label, value, onChangeText, multiline, ...props }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={[styles.input, multiline && styles.textArea]}
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      {...props}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  changePicText: {
    marginTop: 10,
    color: '#6BAED6',
    fontSize: 16,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 50,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    marginBottom: 20,
  },
  picker: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#6BAED6',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    // marginRight: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ccc',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
  },
  dateInput: {
    justifyContent: 'center',
  },
});

export default EditProfileScreen;
