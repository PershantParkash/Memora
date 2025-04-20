import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import CameraScreen from './CameraScreen';
import FriendsScreen from './FriendsScreen';
import ProfileScreen from './ProfileScreen';
import HomeCapsule from './HomeCapsule'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
const Tab = createBottomTabNavigator();

export default function TabLayout() {
  return (
    <Tab.Navigator>
<Tab.Screen 
        name="friends" 
        component={FriendsScreen} 
        options={{
          title: 'Friends',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'people-sharp' : 'people-outline'} color={color} size={24} />
          ),
          headerShown: false,  
        }}
      />

 <Tab.Screen 
        name="CameraScreen" 
        component={CameraScreen} 
        options={{
          title: 'Camera',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'camera-sharp' : 'camera-outline'} color={color} size={26} />
          ),
          headerShown: false,  
        }}
      /> 


<Tab.Screen 
        name="HomeCapsule" 
        component={HomeCapsule} 
        options={{
          title: 'Capsules',
          tabBarIcon: ({ color, focused }) => (
            // <Ionicons name={focused ? 'capsule-sharp' : 'capsule-outline'} color={color} size={24} />   <MaterialCommunityIcons name="timer-sand" size={24} color="black" />
            <MaterialCommunityIcons name={focused ? 'timer-sand' : 'timer-sand'} color={color} size={22} />
          ),
          headerShown: false,  
        }}
      /> 
      
  <Tab.Screen 
        name="profile" 
        component={ProfileScreen} 
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person-sharp' : 'person-outline'} color={color} size={22} />
          ),
          headerShown: false,
        }}
      /> 
 


    
    </Tab.Navigator>
  );
}
