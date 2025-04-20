import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

const AdditionalInfoScreen = () => {
  const [cnic, setCnic] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  const router = useRouter();
  const { fullName, email, password } = useLocalSearchParams();

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setDob(formattedDate);
    }
  };

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfilePic(result.assets[0].uri);
      console.log(profilePic)
    } else {
      Alert.alert('No image selected', 'Please select an image.');
    }
  };

  const handleRemoveImage = () => {
    setProfilePic('');
  };

  const registerUser = async () => {
    console.log(profilePic)
    const response = await fetch(`http://192.168.2.107:5000/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error during registration.');
    }

    return response.json();
  };

  const createProfile = async (token) => {
    const formData = new FormData();
    formData.append('username', fullName);
    formData.append('cnic', cnic);
    formData.append('dob', dob);
    formData.append('gender', gender);
    formData.append('address', address);
    formData.append('contactNo', contactNo);

    if (profilePic) {
        const fileName = profilePic.split('/').pop();
        const fileType = fileName.split('.').pop();
        console.log(profilePic+"  "+fileName+"  "+fileType)
        formData.append('file', {
            uri: profilePic,
            name: fileName,
            type: `image/${fileType}`, 
        });
    }
    formData.forEach((value, key) => {
      console.log(`${key}:`+ value);
    });
    const response = await fetch(`http://192.168.2.107:5000/api/profile/createProfile`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`, 
        },
        body: formData, 
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error creating profile.');
    }

    return response.json();
};


  const validateFields = () => {
    if (!cnic.trim()) {
      Alert.alert('Validation Error', 'Please enter your CNIC.');
      return false;
    }
    if (!/^\d{13}$/.test(cnic)) {
      Alert.alert('Validation Error', 'CNIC must be 13 digits.');
      return false;
    }
    if (!contactNo.trim()) {
      Alert.alert('Validation Error', 'Please enter your contact number.');
      return false;
    }
    if (!/^\d{10,15}$/.test(contactNo)) {
      Alert.alert('Validation Error', 'Contact number must be between 10-15 digits.');
      return false;
    }
    if (!dob.trim()) {
      Alert.alert('Validation Error', 'Please select your date of birth.');
      return false;
    }
    if (!gender) {
      Alert.alert('Validation Error', 'Please select your gender.');
      return false;
    }
    if (!address.trim()) {
      Alert.alert('Validation Error', 'Please enter your address.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    try {
        const registerData = await registerUser();
        const { token } = registerData;

        await AsyncStorage.setItem('authToken', token);

        if (token) {
            await createProfile(token);
            Alert.alert('Success', 'Profile created successfully.');
            router.push('/tab/CameraScreen');
        }
    } catch (error) {
        Alert.alert('Error', error.message || 'An unknown error occurred. Please try again.');
        router.push('/registration');
    }
};

  return (
    <View style={styles.container}>
      {profilePic ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: profilePic }} style={styles.profileImage} />
          <TouchableOpacity style={styles.removeButton} onPress={handleRemoveImage}>
            <Text style={styles.removeButtonText}>Remove Picture</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.profileButton} onPress={handlePickImage}>
          <View style={styles.profileButtonContent}>
            <Ionicons name="images-outline" size={24} color="black" />
            <Text style={styles.profileButtonText}>Choose Profile Picture</Text>
          </View>
        </TouchableOpacity>
      )}

      <TextInput
        style={styles.input}
        placeholder="CNIC"
        keyboardType="numeric"
        value={cnic}
        onChangeText={setCnic}
      />

      <TextInput
        style={styles.input}
        placeholder="Contact No"
        keyboardType="phone-pad"
        value={contactNo}
        onChangeText={setContactNo}
      />

      <TouchableOpacity style={styles.input} onPress={() => setShowPicker(true)}>
        <Text style={{ color: dob ? '#000' : '#aaa' }}>{dob || 'Select Date of Birth'}</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={dob ? new Date(dob) : new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={gender}
          onValueChange={(itemValue) => setGender(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Gender" value="" />
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
          <Picker.Item label="Other" value="other" />
        </Picker>
      </View>

      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Complete Registration</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    marginBottom: 12,
  },
  pickerContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 50,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#6BAED6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    flexDirection: 'row',
  },
  profileButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileButtonText: {
    color: 'black',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 80,
    marginBottom: 8,
  },
  removeButton: {
    backgroundColor: '#FF4C4C',
    padding: 8,
    borderRadius: 8,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default AdditionalInfoScreen;
