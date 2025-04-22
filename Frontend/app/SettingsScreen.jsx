import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Switch, 
  ScrollView, 
  Animated,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const SettingsScreen = () => {
  const router = useRouter();
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [capsuleCount, setCapsuleCount] = useState(0);  // Default count of time capsules

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
  
  const goToEditProfile = () => { router.push('/EditProfileScreen'); };
  const goToChangePassword = () => { router.push('/ChangePasswordScreen'); };
  const goToManageAccount = () => { router.push('/ManageAccountScreen'); };
  const goToMyCapsules = () => { router.push('/MyCapsules'); };
  const goToPrivacySettings = () => { router.push('/PrivacySettings'); };
  const goToExportData = () => { router.push('/ExportData'); };
  const goToAbout = () => { router.push('/AboutScreen'); };
  const goToHelpCenter = () => { router.push('/HelpCenter'); };
  const goToContactUs = () => { router.push('/ContactUs'); };

  return (
    <ScrollView style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Profile Header */}
      <View style={[styles.profileHeader, isDarkMode ? styles.darkProfileHeader : styles.lightProfileHeader]}>
        <View style={styles.profileAvatarContainer}>
          <Text style={styles.profileAvatarText}>TC</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Time Capsule User</Text>
          <Text style={styles.profileTagline}>Capture your memories</Text>
        </View>
        <TouchableOpacity style={styles.editProfileButton} onPress={goToEditProfile}>
          <Icon name="pencil" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={[styles.card, isDarkMode && styles.darkCard]}>
        <View style={styles.cardHeader}>
          <Icon name="person-circle-outline" size={24} color={isDarkMode ? "#61DAFB" : "#4FACFE"} />
          <Text style={[styles.cardTitle, isDarkMode && styles.darkText]}>Profile</Text>
        </View>
        <TouchableOpacity style={styles.optionRow} onPress={goToEditProfile}>
          <View style={styles.optionIconTextContainer}>
            <Icon name="create-outline" size={20} color={isDarkMode ? "#61DAFB" : "#4FACFE"} style={styles.optionIcon} />
            <Text style={[styles.optionText, isDarkMode && styles.darkText]}>Edit Profile</Text>
          </View>
          <Icon name="chevron-forward-outline" size={20} color={isDarkMode ? "#aaa" : "#888"} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.optionRow} onPress={goToMyCapsules}>
          <View style={styles.optionIconTextContainer}>
            <Icon name="images-outline" size={20} color={isDarkMode ? "#61DAFB" : "#4FACFE"} style={styles.optionIcon} />
            <Text style={[styles.optionText, isDarkMode && styles.darkText]}>My Time Capsules</Text>
          </View>
          <View style={styles.capsuleCount}>
            <Text style={styles.capsuleCountText}>{capsuleCount}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Notifications Section */}
      <View style={[styles.card, isDarkMode && styles.darkCard]}>
        <View style={styles.cardHeader}>
          <Icon name="notifications-outline" size={24} color={isDarkMode ? "#61DAFB" : "#4FACFE"} />
          <Text style={[styles.cardTitle, isDarkMode && styles.darkText]}>Notifications</Text>
        </View>
        <View style={styles.optionRow}>
          <View style={styles.optionIconTextContainer}>
            <Icon name="notifications-circle-outline" size={20} color={isDarkMode ? "#61DAFB" : "#4FACFE"} style={styles.optionIcon} />
            <Text style={[styles.optionText, isDarkMode && styles.darkText]}>Enable Notifications</Text>
          </View>
          <Switch
            value={isNotificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: "#767577", true: isDarkMode ? "#61DAFB" : "#4FACFE" }}
            thumbColor={isNotificationsEnabled ? "#fff" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
          />
        </View>
        
        <View style={styles.optionRow}>
          <View style={styles.optionIconTextContainer}>
            <Icon name="time-outline" size={20} color={isDarkMode ? "#61DAFB" : "#4FACFE"} style={styles.optionIcon} />
            <Text style={[styles.optionText, isDarkMode && styles.darkText]}>Capsule Reminders</Text>
          </View>
          <Switch
            value={isNotificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: "#767577", true: isDarkMode ? "#61DAFB" : "#4FACFE" }}
            thumbColor={isNotificationsEnabled ? "#fff" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
          />
        </View>
      </View>

      {/* Appearance Section */}
      <View style={[styles.card, isDarkMode && styles.darkCard]}>
        <View style={styles.cardHeader}>
          <Icon name="color-palette-outline" size={24} color={isDarkMode ? "#61DAFB" : "#4FACFE"} />
          <Text style={[styles.cardTitle, isDarkMode && styles.darkText]}>Appearance</Text>
        </View>
        <View style={styles.optionRow}>
          <View style={styles.optionIconTextContainer}>
            <Icon name="moon-outline" size={20} color={isDarkMode ? "#61DAFB" : "#4FACFE"} style={styles.optionIcon} />
            <Text style={[styles.optionText, isDarkMode && styles.darkText]}>Dark Mode</Text>
          </View>
          <Switch 
            value={isDarkMode} 
            onValueChange={toggleDarkMode} 
            trackColor={{ false: "#767577", true: isDarkMode ? "#61DAFB" : "#4FACFE" }}
            thumbColor={isDarkMode ? "#fff" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
          />
        </View>
      </View>

      {/* Privacy & Security Section */}
      <View style={[styles.card, isDarkMode && styles.darkCard]}>
        <View style={styles.cardHeader}>
          <Icon name="shield-checkmark-outline" size={24} color={isDarkMode ? "#61DAFB" : "#4FACFE"} />
          <Text style={[styles.cardTitle, isDarkMode && styles.darkText]}>Privacy & Security</Text>
        </View>
        <TouchableOpacity style={styles.optionRow} onPress={goToChangePassword}>
          <View style={styles.optionIconTextContainer}>
            <Icon name="key-outline" size={20} color={isDarkMode ? "#61DAFB" : "#4FACFE"} style={styles.optionIcon} />
            <Text style={[styles.optionText, isDarkMode && styles.darkText]}>Change Password</Text>
          </View>
          <Icon name="chevron-forward-outline" size={20} color={isDarkMode ? "#aaa" : "#888"} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.optionRow} onPress={goToPrivacySettings}>
          <View style={styles.optionIconTextContainer}>
            <Icon name="lock-closed-outline" size={20} color={isDarkMode ? "#61DAFB" : "#4FACFE"} style={styles.optionIcon} />
            <Text style={[styles.optionText, isDarkMode && styles.darkText]}>Privacy Settings</Text>
          </View>
          <Icon name="chevron-forward-outline" size={20} color={isDarkMode ? "#aaa" : "#888"} />
        </TouchableOpacity>
      </View>

      {/* Account Section */}
      <View style={[styles.card, isDarkMode && styles.darkCard]}>
        <View style={styles.cardHeader}>
          <Icon name="settings-outline" size={24} color={isDarkMode ? "#61DAFB" : "#4FACFE"} />
          <Text style={[styles.cardTitle, isDarkMode && styles.darkText]}>Account</Text>
        </View>
        <TouchableOpacity style={styles.optionRow} onPress={goToManageAccount}>
          <View style={styles.optionIconTextContainer}>
            <Icon name="person-outline" size={20} color={isDarkMode ? "#61DAFB" : "#4FACFE"} style={styles.optionIcon} />
            <Text style={[styles.optionText, isDarkMode && styles.darkText]}>Manage Account</Text>
          </View>
          <Icon name="chevron-forward-outline" size={20} color={isDarkMode ? "#aaa" : "#888"} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.optionRow} onPress={goToExportData}>
          <View style={styles.optionIconTextContainer}>
            <Icon name="cloud-download-outline" size={20} color={isDarkMode ? "#61DAFB" : "#4FACFE"} style={styles.optionIcon} />
            <Text style={[styles.optionText, isDarkMode && styles.darkText]}>Export Data</Text>
          </View>
          <Icon name="chevron-forward-outline" size={20} color={isDarkMode ? "#aaa" : "#888"} />
        </TouchableOpacity>
      </View>

      {/* Support & Help Section */}
      <View style={[styles.card, isDarkMode && styles.darkCard]}>
        <View style={styles.cardHeader}>
          <Icon name="help-buoy-outline" size={24} color={isDarkMode ? "#61DAFB" : "#4FACFE"} />
          <Text style={[styles.cardTitle, isDarkMode && styles.darkText]}>Support & Help</Text>
        </View>
        <TouchableOpacity style={styles.optionRow} onPress={goToAbout}>
          <View style={styles.optionIconTextContainer}>
            <Icon name="information-circle-outline" size={20} color={isDarkMode ? "#61DAFB" : "#4FACFE"} style={styles.optionIcon} />
            <Text style={[styles.optionText, isDarkMode && styles.darkText]}>About Time Capsule</Text>
          </View>
          <Icon name="chevron-forward-outline" size={20} color={isDarkMode ? "#aaa" : "#888"} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.optionRow} onPress={goToHelpCenter}>
          <View style={styles.optionIconTextContainer}>
            <Icon name="help-outline" size={20} color={isDarkMode ? "#61DAFB" : "#4FACFE"} style={styles.optionIcon} />
            <Text style={[styles.optionText, isDarkMode && styles.darkText]}>Help Center</Text>
          </View>
          <Icon name="chevron-forward-outline" size={20} color={isDarkMode ? "#aaa" : "#888"} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.optionRow} onPress={goToContactUs}>
          <View style={styles.optionIconTextContainer}>
            <Icon name="mail-outline" size={20} color={isDarkMode ? "#61DAFB" : "#4FACFE"} style={styles.optionIcon} />
            <Text style={[styles.optionText, isDarkMode && styles.darkText]}>Contact Us</Text>
          </View>
          <Icon name="chevron-forward-outline" size={20} color={isDarkMode ? "#aaa" : "#888"} />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity 
        style={[styles.logoutButton, isDarkMode && styles.darkLogoutButton]} 
        onPress={handleLogout}
      >
        <Icon name="log-out-outline" size={20} color="#fff" style={styles.logoutIcon} />
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
      
      <Text style={[styles.versionText, isDarkMode && styles.darkVersionText]}>Time Capsule v1.0.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f9fc',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginBottom: 15,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  lightProfileHeader: {
    backgroundColor: '#4FACFE',
  },
  darkProfileHeader: {
    backgroundColor: '#1a1a2e',
  },
  profileAvatarContainer: {
    height: 70,
    width: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  profileAvatarText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileInfo: {
    marginLeft: 15,
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileTagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 3,
  },
  editProfileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  darkCard: {
    backgroundColor: '#1e1e1e',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    borderColor: '#333',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  darkText: {
    color: '#e0e0e0',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionIconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    color: '#444',
  },
  capsuleCount: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: '#4FACFE',
    borderRadius: 12,
    minWidth: 30,
    alignItems: 'center',
  },
  capsuleCountText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    marginHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  darkLogoutButton: {
    backgroundColor: '#d44242',
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#aaa',
    marginTop: 5,
    marginBottom: 20,
  },
  darkVersionText: {
    color: '#666',
  }
});

export default SettingsScreen;