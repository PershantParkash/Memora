
import React, { useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { MyContext } from "./context/MyContext";
import { useCreateCapsule } from '../Hooks/useCreateCapsule'

const CapsuleCreationScreen = () => {
  const { handleCreateCapsule } = useCreateCapsule();
 const context = useContext(MyContext);
 const { capsuleInfo, setCapsuleInfo } = context;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [capsuleType, setCapsuleType] = useState('Personal');
  const [unlockDate, setUnlockDate] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [fileUri, setFileUri] = useState(capsuleInfo.fileUri);
  const router = useRouter();

  if (!fileUri) {
    console.warn('No photo provided!');
  }
 
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    if (date <= new Date()) {
      Alert.alert('Invalid Date', 'Unlock date must be in the future');
    } else {
      setUnlockDate(date);
      hideDatePicker();
    }
  };

  const CreateCapsule = async () => {

    setCapsuleInfo({
      ...capsuleInfo,
      title,
      description,
      unlockDate,
      capsuleType,
    });

    if(capsuleType === 'Personal'){
      await handleCreateCapsule({ title, description, unlockDate, capsuleType, fileUri });
      router.push('/tab/CameraScreen');
     }
     if(capsuleType === 'Shared'){
      router.push('/SendCapsulePage')
     }
  };
  
  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create a Time Capsule</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />

      <View style={styles.picker}>
        <Text style={styles.label}>Capsule Type</Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              capsuleType === 'Personal' && styles.activeButton,
            ]}
            onPress={() => setCapsuleType('Personal')}
          >
            <Text
              style={[
                styles.toggleButtonText,
                capsuleType === 'Personal' && styles.activeButtonText,
              ]}
            >
              Personal
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.toggleButton,
              capsuleType === 'Shared' && styles.activeButton,
            ]}
            onPress={() => setCapsuleType('Shared')}
          >
            <Text
              style={[
                styles.toggleButtonText,
                capsuleType === 'Shared' && styles.activeButtonText,
              ]}
            >
              Shared
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.datePickerContainer}>
        <Text style={styles.label}>Unlock Date</Text>
        <TouchableOpacity onPress={showDatePicker} style={styles.button}>
          <Text style={styles.buttonText}>
            {unlockDate
              ? moment(unlockDate).format('YYYY-MM-DD')
              : 'Select Date'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button3} onPress={CreateCapsule}>
        <Text style={styles.createButtonText}>Create Capsule</Text>
        <FontAwesome name="arrow-right" size={24} color="white" style={styles.button4}/>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        minimumDate={new Date()}
      />
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  }, button4:{
    marginLeft:10
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    fontSize: 16,
  }, 
  button3:{
    position:'absolute',
    bottom:20,
    right:20,
    backgroundColor: '#6BAED6',
    paddingHorizontal:20,
    paddingVertical: 10,
    borderRadius:8,
    flexDirection: 'row',
  },
  picker: {
    width: '100%',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderRadius: 8,
    gap:10,
    borderColor: '#ddd',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: '#6BAED6',
  },
  toggleButtonText: {
    fontSize: 16,
    color: '#333',
  },
  activeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  datePickerContainer: {
    width: '100%',
    marginBottom: 20,
  },
  button: {
    height: 50,
    backgroundColor: '#6BAED6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  createButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#6BAED6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default CapsuleCreationScreen;