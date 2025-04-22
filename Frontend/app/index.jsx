import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  Alert,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MyContext } from "./context/MyContext";
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

const LoginScreen = () => {
  const context = useContext(MyContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
 
  const router = useRouter();

  if (!context) {
    throw new Error("IndexScreen must be used within a MyProvider");
  }

  const { state, setState } = context;
  
  const handleLogin = async () => {
    if (email && password) {
      setIsLoading(true);
      try {
        const response = await fetch(`http://192.168.2.107:5000/api/auth/login`, {
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
        Alert.alert('Login Successful', 'Welcome back to MemoryCapsule!');
      } catch (error) {
        console.error('Login error:', error);
        Alert.alert('Connection Error', 'Unable to connect to the server. Please check your internet connection.');
      } finally {
        setIsLoading(false);
      }
    } else if (!email && password) {
      Alert.alert('Login Error', 'Please enter your email address.');
    } else if (email && !password) {
      Alert.alert('Login Error', 'Please enter your password.');
    } else {
      Alert.alert('Login Error', 'Please enter your email and password.');
    }
  };

  // const forgetPass = () => {
  //   Alert.alert('Feature Coming Soon', 'Password recovery will be available in the next update.');
  // };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
          <View style={styles.container}>
            <View style={styles.logoContainer}>
              <Image source={require('../assets/images/logo4.png')} style={styles.logo} />
              <Text style={styles.tagline}>Capture Moments. Revisit Memories.</Text>
            </View>
            
            <View style={styles.formContainer}>
              <Text style={styles.welcomeText}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to continue your journey</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label }>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#A9A9A9"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label
                }>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Enter your password"
                    placeholderTextColor="#A9A9A9"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity 
                    style={styles.eyeButton} 
                    onPress={togglePasswordVisibility}
                  >
                    <Ionicons 
                      name={showPassword ? 'eye-off' : 'eye'} 
                      size={24} 
                      color="#555" 
                    />
                  </TouchableOpacity>
                </View>
              </View>
              
              
              <TouchableOpacity 
                style={styles.button} 
                onPress={handleLogin}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? 'Logging in...' : 'Log In'}
                </Text>
              </TouchableOpacity>
              
              <View style={styles.divider}>
                <View style={styles.line} />
                <Text style={styles.orText}>OR</Text>
                <View style={styles.line} />
              </View>
              
              <TouchableOpacity
                style={styles.signupButton}
                onPress={() => router.push('/registration')}
              >
                <Text style={styles.signupButtonText}>Create New Account</Text>
              </TouchableOpacity>
            </View>
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
    marginBottom: 30,
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
    flex:1,
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
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
    marginBottom: 25,
    textAlign: 'center',
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: '#F9F9F9',
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#333',
  },
  eyeButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#1F618D',
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#2E86C1',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
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
  signupButton: {
    width: '100%',
    height: 50,
    borderColor: '#2E86C1',
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  signupButtonText: {
    color: '#2E86C1',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;