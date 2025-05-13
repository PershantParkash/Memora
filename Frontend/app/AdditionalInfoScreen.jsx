import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  Alert,
  ScrollView,
  Dimensions
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import useAuthService from '../Hooks/useAuthService';

const { height } = Dimensions.get('window');

const AdditionalInfoScreen = () => {
  const { registerUser, createProfile } = useAuthService();
  const [cnic, setCnic] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    } else {
      Alert.alert('No image selected', 'Please select an image.');
    }
  };

  const handleRemoveImage = () => {
    setProfilePic('');
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

    setIsLoading(true);
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
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/images/logo4.png')} style={styles.logo} />
        <Text style={styles.tagline}>Complete Your Profile</Text>
      </View>
       {/* <View style={styles.formContainer}></View> */}
      <ScrollView 
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false} 
      style={styles.formContainer} >
        <Text style={styles.welcomeText}>Personal Details</Text>
        <Text style={styles.subtitle}>Step 2 of 2: Finalize Your Account</Text>
        
        <View style={styles.profileSection}>
          {profilePic ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: profilePic }} style={styles.profileImage} />
              <TouchableOpacity style={styles.editImageButton} onPress={handlePickImage}>
                <Ionicons name="camera" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.removeButton} onPress={handleRemoveImage}>
                <Ionicons name="trash-outline" size={18} color="#fff" />
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.profileButton} onPress={handlePickImage}>
              <View style={styles.profileImagePlaceholder}>
                <Ionicons name="person" size={40} color="#A0A0A0" />
              </View>
              <Text style={styles.profileButtonText}>Add Profile Picture</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>CNIC Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter 13-digit CNIC"
            placeholderTextColor="#A9A9A9"
            keyboardType="numeric"
            maxLength={13}
            value={cnic}
            onChangeText={setCnic}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contact Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter contact number"
            placeholderTextColor="#A9A9A9"
            keyboardType="phone-pad"
            value={contactNo}
            onChangeText={setContactNo}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity 
            style={styles.datePickerButton} 
            onPress={() => setShowPicker(true)}
          >
            <Text style={dob ? styles.dateText : styles.placeholderText}>
              {dob || 'Select date of birth'}
            </Text>
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
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue) => setGender(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select gender" value="" color="#A9A9A9" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, styles.addressInput]}
            placeholder="Enter your full address"
            placeholderTextColor="#A9A9A9"
            value={address}
            onChangeText={setAddress}
            multiline
          />
        </View>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Creating Account...' : 'Complete Registration'}
          </Text>
        </TouchableOpacity>
      
        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.line} />
        </View>
        
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/registration')}
        >
          <Text style={styles.backButtonText}>Go Back to Step 1</Text>
        </TouchableOpacity>
      </ScrollView>
      
      {/* <View style={styles.progressContainer}>
        <View style={styles.progressDot1} />
        <View style={styles.progressLine} />
        <View style={styles.progressDot2} />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: height,
    backgroundColor: '#2E86C1',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 83,
    resizeMode: 'contain',
  },
  tagline: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
    fontStyle: 'italic',
  },
  formContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F618D',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileButton: {
    alignItems: 'center',
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#2E86C1',
    borderStyle: 'dashed',
  },
  imageContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  editImageButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#2E86C1',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButtonText: {
    color: '#2E86C1',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  removeButton: {
    flexDirection: 'row',
    backgroundColor: '#ff4c4c',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginTop: 10,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 12,
  },
  inputContainer: {
    marginBottom: 12,
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: '#F9F9F9',
    fontSize: 16,
    color: '#333',
  },
  addressInput: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  datePickerButton: {
    height: 50,
    width: '100%',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    fontSize: 16,
    color: '#A9A9A9',
  },
  pickerContainer: {
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: '#F9F9F9',
    height: 50,
    justifyContent: 'center',
    fontSize: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#2E86C1',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  orText: {
    marginHorizontal: 10,
    color: '#888',
    fontWeight: '500',
  },
  backButton: {
    width: '100%',
    height: 50,
    borderColor: '#2E86C1',
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginBottom: 50,
  },
  backButtonText: {
    color: '#2E86C1',
    fontSize: 14,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  progressDot1: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  progressLine: {
    height: 3,
    width: 40,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  progressDot2: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
});

export default AdditionalInfoScreen;