import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import PreLoginScreen from './src/screens/auth/PreLogin';
import LoginScreen from './src/screens/auth/login';
import CreateNewScreen from './src/screens/auth/Create_new';
import HomeScreen from './src/screens/home/Home';
import ActivitiesScreen from './src/screens/Activites/activity';
import SemesterScreen from './src/screens/sem/semester';
import ClassesScreen from './src/screens/Classes/Classes';
import TeachersScreen from './src/screens/Teacher/Teachers';
import ProfileScreen from './src/screens/profile/Profile';
import UpdatesScreen from './src/screens/updates/Updates';

export type AuthStackParamList = {
  PreLogin: undefined;
  Login: undefined;
  CreateNew: undefined;
  Home:
    | { role?: 'teacher' | 'student'; name?: string; username?: string; email?: string }
    | undefined;
  Activities: undefined;
  Semester: undefined;
  Classes: undefined;
  Teachers: undefined;
  Profile:
    | { role?: 'teacher' | 'student'; name?: string; username?: string; email?: string }
    | undefined;
  Updates: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="PreLogin"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="PreLogin" component={PreLoginScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="CreateNew" component={CreateNewScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Activities" component={ActivitiesScreen} />
          <Stack.Screen name="Semester" component={SemesterScreen} />
          <Stack.Screen name="Classes" component={ClassesScreen} />
          <Stack.Screen name="Teachers" component={TeachersScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Updates" component={UpdatesScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
