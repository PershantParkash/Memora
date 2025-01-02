import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack initialRouteName='index'> 
      <Stack.Screen name="index" options={{ headerShown: false }}  />
      <Stack.Screen name="registration" options={{ headerShown: false }}  />
      <Stack.Screen name="AdditionalInfoScreen" options={{ headerShown: false }}  />
      <Stack.Screen name="EditProfileScreen" options={{ headerShown: false }}  />
      <Stack.Screen name="tab" options={{ headerShown: false }} />
      {/* <Stack.Screen name="FileUploadScreen" options={{ headerShown: false }} /> */}
    </Stack>
  );
}