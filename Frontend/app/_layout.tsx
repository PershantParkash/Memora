import React from "react";
import { Stack } from "expo-router";
import MyProvider from "./context/MyContext"; // Import the context provider

export default function RootLayout() {
  return (
    <MyProvider> 
      <Stack initialRouteName="index">
        <Stack.Screen name="index" options={{ headerShown: false }} /> 
        <Stack.Screen name="AdditionalInfoScreen" options={{ headerShown: false }} />
        <Stack.Screen name="registration" options={{ headerShown: false }} />
         <Stack.Screen name="tab" options={{ headerShown: false }} />
        <Stack.Screen name="EditProfileScreen" options={{ headerShown: false }} />
        <Stack.Screen name="CapsuleCreationScreen" options={{ headerShown: false }} />
        <Stack.Screen name="AcceptDeclineProfileScreen" options={{ headerShown: false }} />
        <Stack.Screen name="SendRequestProfileScreen" options={{ headerShown: false }} />
        <Stack.Screen name="SendCapsulePage" options={{ headerShown: false }} />
        <Stack.Screen name="HomeCapsule" options={{ headerShown: false }} />
        <Stack.Screen name="SettingsScreen" options={{ headerShown: false }} />
        <Stack.Screen name="Test" options={{ headerShown: false }} />
      </Stack>
    </MyProvider>
  );
}
