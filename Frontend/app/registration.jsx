import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  Alert,
  Dimensions, ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { MyContext } from "./context/MyContext";
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

const RegistrationScreen = () => {
  const context = useContext(MyContext);
  const { state, setState } = context;
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const validateFields = () => {
    if (!fullName.trim()) {
      Alert.alert('Validation Error', 'Full Name is required.');
      return false;
    }

    if (!email.trim()) {
      Alert.alert('Validation Error', 'Email is required.');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Validation Error', 'Invalid email format.');
      return false;
    }

    if (!password) {
      Alert.alert('Validation Error', 'Password is required.');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters.');
      return false;
    }

    if (!confirmPassword) {
      Alert.alert('Validation Error', 'Confirm Password is required.');
      return false;
    }

    if (confirmPassword !== password) {
      Alert.alert('Validation Error', 'Passwords do not match.');
      return false;
    }

    return true;
  };

  const handleRegister = () => {
    if (!validateFields()) return;

    router.push({
      pathname: '/AdditionalInfoScreen',
      params: { fullName, email, password },
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/images/logo4.png')} style={styles.logo} />
        <Text style={styles.tagline}>Begin Your Memory Journey</Text>
      </View>
         {/* <View style={styles.progressContainer}>
        <View style={styles.progressDot1} />
        <View style={styles.progressLine} />
        <View style={[styles.progressDot2, styles.inactiveDot]} />
      </View> */}
      {/* <View style={styles.formContainer}> */}
         <ScrollView 
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false} 
          style={styles.formContainer} >
        <Text style={styles.welcomeText}>Create Account</Text>
        <Text style={styles.subtitle}>Step 1 of 2: Basic Information</Text>

     
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#A9A9A9"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email Address</Text>
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
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Create a password"
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
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm your password"
              placeholderTextColor="#A9A9A9"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity 
              style={styles.eyeButton} 
              onPress={toggleConfirmPasswordVisibility}
            >
              <Ionicons 
                name={showConfirmPassword ? 'eye-off' : 'eye'} 
                size={24} 
                color="#555" 
              />
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleRegister}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
        
        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.line} />
        </View>
        
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push('/')}
        >
          <Text style={styles.loginButtonText}>Already have an account? Log In</Text>
        </TouchableOpacity>
        </ScrollView>
      {/* </View> */}
      
     
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
    flex: 1,
    display: "flex",
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
  loginButton: {
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
  loginButtonText: {
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
    backgroundColor: '#fff',
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
  inactiveDot: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
  },
});

export default RegistrationScreen;