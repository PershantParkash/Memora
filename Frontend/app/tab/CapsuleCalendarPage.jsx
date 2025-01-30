import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
const screenWidth = Dimensions.get('window').width;

const CapsuleCalendarPage = () => {
  const [capsules, setCapsules] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCapsules = async () => {
      const token = await AsyncStorage.getItem('authToken');
      try {
        const response = await fetch('http://192.168.2.106:5000/api/timecapsules/getLoginUserCapsules', {
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

  const markedDates = capsules.reduce((acc, capsule) => {
    acc[moment(capsule.UnlockDate).format('YYYY-MM-DD')] = {
      customStyles: {
        container: {
          backgroundColor: '#6BAED6',
          borderRadius: 5,
        },
        text: {
          color: 'white',
          fontWeight: 'bold',
        },
      },
    };
    return acc;
  }, {});

  const handleDateSelect = (day) => {
    setSelectedDate(day.dateString);
    const capsule = capsules.find((item) => moment(item.UnlockDate).format('YYYY-MM-DD') === day.dateString);
    if (capsule) {
      setTooltip({ date: moment(capsule.UnlockDate).format('YYYY-MM-DD'), title: capsule.Title, status: capsule.Status });
    } else {
      setTooltip(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>TimeCapsule Calendar</Text>
      </View>
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={handleDateSelect}
          markingType={'custom'}
          markedDates={{
            ...markedDates,
            ...(selectedDate && {
              [selectedDate]: {
                selected: true,
                selectedColor: '#00bcd4',
                selectedTextColor: '#ffffff',
              },
            }),
          }}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#00bcd4',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#6a11cb',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            arrowColor: '#6a11cb',
            monthTextColor: '#6a11cb',
            indicatorColor: '#6a11cb',
          }}
        />
      </View>
      {tooltip ? (
        <View style={styles.infoContainer}>
          <View>
          {selectedDate ? (
            <Text style={styles.infoText}>
            {tooltip.status === 'Locked' ? (
              <>
                 This Time Capsule will unlock on this selected date: <Text style={styles.dateText}>{selectedDate}</Text>
              </>
            ) : (
              <>
              This Time Capsule has been unlock on this selected date: <Text style={styles.dateText}>{selectedDate}</Text>
            </>
            )}
          </Text>
          ) : (
            <Text style={styles.infoText}>Tap on a highlighted date to see capsule details.</Text>
          )}
        </View>
          <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>{tooltip.title}</Text>
          <FontAwesome
            name={tooltip.status === 'Locked' ? 'lock' : 'unlock'}
            size={18}
            color="#6BAED6"
            style={styles.tooltipIcon}
          />
          <View style={styles.arrowDown} />
          </View>
        </View>
      ) : (
        <View style={styles.infoContainer}>  
        <View>
          {selectedDate ? (
            <Text style={styles.infoText}>
              No Time Capsules are scheduled to unlock for you on this date: <Text style={styles.dateText}>{selectedDate}</Text>
            </Text>
          ) : (
            <Text style={styles.infoText}>Tap on a highlighted date to see capsule details.</Text>
          )}
        </View>
        <TouchableOpacity style={styles.button} onPress={() => { router.push('/tab/CameraScreen'); }}>
        <Text style={styles.buttonText}>Create Capsules</Text>
      </TouchableOpacity>
</View>
      )}



      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6BAED6',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  headerText: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  calendarContainer: {
    margin: 20,
    padding: 5,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    elevation: 5,
  },
  tooltip: {
    flexDirection: 'row',
    margin: 20,
    paddingHorizontal: 45,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    gap: 7,
  },
  tooltipText: {
    color: '#6BAED6',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    // padding: 20,
    flex: 1,
    // backgroundColor: 'blue',
  },
  infoText: {
    paddingHorizontal: 35,
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
  },
  dateText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    margin: 20,
    paddingHorizontal: 45,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  buttonText: {
    color: '#6BAED6',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CapsuleCalendarPage;
