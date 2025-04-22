import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
const CapsulePage = () => {
  const [capsules, setCapsules] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);

  useEffect(() => {
    const fetchCapsules = async () => {
      const token = await AsyncStorage.getItem('authToken');
      try {
        const response = await fetch('http://192.168.2.107:5000/api/timecapsules/getLoginUserCapsules', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCapsules(data.capsules);
        } else {
          console.error('Failed to fetch capsules:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching capsules:', error.message);
      }
    };

    fetchCapsules();
  }, []);

  const renderCapsule = ({ item }) => (
    <View style={styles.capsuleContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{item.Title}</Text>
        <FontAwesome
          name={item.Status === 'Locked' ? 'lock' : 'unlock'}
          size={24}
          color={item.Status === 'Locked' ? '#f36b4d' : '#6BAED6'}
        />
      </View>

      <Text style={styles.description}>{item.Description}</Text>

      {item.Status === 'Open' ? (
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => setSelectedMedia(item.Media)}
        >
          <Text style={styles.buttonText}>View Capsule Media</Text>
        </TouchableOpacity>
      ) : (  <TouchableOpacity
        style={styles.viewButton2}
        // onPress={() => setSelectedMedia(item.Media)}
      >

 <Text style={styles.buttonText}>Unlock Date: {moment(item.UnlockDate).format('YYYY-MM-DD')}</Text>
        {/* <Text style={styles.buttonText}>{item.UnlockDate}</Text> */}
      </TouchableOpacity>)
      }
    </View>
  );

  return (
    <View style={styles.container}>
      {selectedMedia ? (
        <View style={styles.mediaContainer}>
          <Image
            source={{ uri: `http://192.168.2.107:5000/uploads/${selectedMedia}` }}
            style={styles.mediaImage}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedMedia(null)}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Page Heading */}
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>My Time Capsules</Text>
            <Text style={styles.subHeaderText}>
              Explore and revisit your memories or unlock shared moments.
            </Text>
          </View>

          {/* Capsule List */}
          <FlatList
            data={capsules}
            keyExtractor={(item) => item._id}
            renderItem={renderCapsule}
            contentContainerStyle={styles.listContainer}
          />
        </>
      )}
    </View>
  );
};

export default CapsulePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 10,
  },
  headerContainer: {
    padding: 20,
    backgroundColor: '#6BAED6',
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 14,
    color: '#e0e0e0',
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  capsuleContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  viewButton: {
    backgroundColor: '#6BAED6',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  viewButton2: {
    backgroundColor:'#f36b4d',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  mediaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaImage: {
    width: '90%',
    height: '70%',
  },
  closeButton: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});
