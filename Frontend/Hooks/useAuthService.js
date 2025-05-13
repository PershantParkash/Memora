import { Alert } from 'react-native';
import axiosInstance from '../axiosInstance'

const useAuthService = () => {

    const registerUser = async () => {
        try {
          const response = await axiosInstance.post('/api/auth/register', {
            email,
            password,
          });
      
          return response.data; 
        } catch (error) {
          const message = error.response?.data?.message || 'Error during registration.';
          Alert.alert('Registration Failed', message);
        }
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
          formData.append('file', {
            uri: profilePic,
            name: fileName,
            type: `image/${fileType}`,
          });
        }
      
        try {
          const response = await axiosInstance.post(
            '/api/profile/createProfile',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
              },
            }
          );
      
          return response.data;
        } catch (error) {
          const message = error.response?.data?.message || 'Error creating profile.';
          Alert.alert('Registration Failed', message);
        }
      };

  return { registerUser, createProfile };
};

export default useAuthService;
