import React, { useState, useContext  } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MyContext } from "./context/MyContext";

const LoginScreen = () => {
  const context = useContext(MyContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
 
  const router = useRouter(); 

  if (!context) {
    throw new Error("IndexScreen must be used within a MyProvider");
  }

  const { state, setState } = context;
  const handleLogin = async () => {
    if( email && password) {
      try {
        const response = await fetch(`http://192.168.2.106:5000/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          Alert.alert('Login Failed', errorData.message || 'Invalid credentials');
          return;
        }
  
        const data = await response.json();
        const { token } = data;
  
        await AsyncStorage.setItem('authToken', token);
        router.push('./tab/CameraScreen');
        // router.push('./HomeCapsule');
        Alert.alert('Login Successful', 'You have logged in successfully.');
      } catch (error) {
        console.error('Login error:', error);
        Alert.alert('Error logging in', 'An error occurred during login');
      }
    }
   if( !email && password){
    Alert.alert('Login Error', 'Please enter your email address.');
   }
   if( email && !password){
    Alert.alert('Login Error', 'Please enter your password.');
   }
   if( !email && !password){
    Alert.alert('Login Error', 'Please enter your email and password.');
   }
  };

  const forgetPass = () => {
    Alert.alert('Feature Coming Soon');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/Logo.png')} style={styles.logo} />
      <TextInput
        style={styles.input}
        placeholder="Email or Phone Number"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      /> 
      <TouchableOpacity style={styles.button} onPress={handleLogin} >
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={styles.forgotPassword} onPress={forgetPass}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity> */}
      <Text style={styles.orText}>or</Text>
      <TouchableOpacity
        style={styles.signupButton}
        onPress={() =>  {
          router.push('/registration')}
        }
      >
        <Text style={styles.signupButtonText}>Sign Up</Text>
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
  logo: {
    width: 150,
    height: 80,
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
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
  forgotPassword: {
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: '#6BAED6',
    fontSize: 14,
  },
  orText: {
    marginVertical: 16,
    color: '#888',
  },
  signupButton: {
    borderColor: '#6BAED6',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  signupButtonText: {
    color: '#6BAED6',
    fontSize: 16,
  },
});

export default LoginScreen;
