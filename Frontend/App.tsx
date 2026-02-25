import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import PreLoginScreen from './src/screens/auth/PreLogin';
import { AuthStackParamList } from './src/navigation/types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="PreLogin" component={PreLoginScreen} />
          {/* Login and Register will be added here later */}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
