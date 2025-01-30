import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';

const SettingsScreen = () => {
    const router = useRouter();
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleNotifications = () => setIsNotificationsEnabled((prev) => !prev);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      router.push('/'); 
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
  const goToEditProfile = () => { router.push('/EditProfileScreen');}
  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="person-circle-outline" size={24} color="#6BAED6" />
          <Text style={styles.cardTitle}>Profile</Text>
        </View>
        <TouchableOpacity style={styles.optionRow} onPress={goToEditProfile}>
          <Text style={styles.optionText}>Edit Profile</Text>
          <Icon name="chevron-forward-outline" size={20} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Notifications Section */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="notifications-outline" size={24} color="#6BAED6" />
          <Text style={styles.cardTitle}>Notifications</Text>
        </View>
        <View style={styles.optionRow}>
          <Text style={styles.optionText}>Enable Notifications</Text>
          <Switch
            value={isNotificationsEnabled}
            onValueChange={toggleNotifications}
          />
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="moon-outline" size={24} color="#6BAED6" />
          <Text style={styles.cardTitle}>Appearance</Text>
        </View>
        <View style={styles.optionRow}>
          <Text style={styles.optionText}>Dark Mode</Text>
          <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
        </View>
      </View>

      {/* Account Section */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="settings-outline" size={24} color="#6BAED6" />
          <Text style={styles.cardTitle}>Account</Text>
        </View>
        <TouchableOpacity style={styles.optionRow}>
          <Text style={styles.optionText}>Change Password</Text>
          <Icon name="chevron-forward-outline" size={20} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionRow}>
          <Text style={styles.optionText}>Manage Account</Text>
          <Icon name="chevron-forward-outline" size={20} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, 
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#FF4D4D',
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    // marginTop: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
