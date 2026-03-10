import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import OnboardingScreen from '../screens/auth/PreLogin.tsx';
import LoginScreen from '../screens/auth/login.tsx';

// ─── Route Params ─────────────────────────────────────────────
export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  // Add screens here as you build them:
  // StudentDashboard: undefined;
  // TeacherDashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// ─── Onboarding Wrapper ───────────────────────────────────────
function OnboardingWrapper({
  navigation,
}: {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;
}) {
  return (
    <OnboardingScreen
      onGetStarted={() => navigation.replace('Login')}
      onSkip={() => navigation.replace('Login')}
    />
  );
}

// ─── Login Wrapper ────────────────────────────────────────────
function LoginWrapper({
  navigation,
}: {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
}) {
  return (
    <LoginScreen
      onLogin={(role, username, password) => {
        // Spring Boot will handle auth — hook your API call here later
        // navigation.replace(role === 'teacher' ? 'TeacherDashboard' : 'StudentDashboard');
      }}
      onCreateNew={() => {
        // navigation.navigate('Register');
      }}
      onForgotPassword={() => {
        // navigation.navigate('ForgotPassword');
      }}
    />
  );
}

// ─── Root Navigator ───────────────────────────────────────────
export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          animationDuration: 380,
          gestureEnabled: false,
        }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingWrapper} />
        <Stack.Screen name="Login" component={LoginWrapper} />

        {/* Uncomment as you build screens:
        <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
        <Stack.Screen name="TeacherDashboard" component={TeacherDashboard} />
        */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
