import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Alert,
} from "react-native";

import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";

export default function LoginScreen({ navigation }: { navigation: any }) {
  const [focusedInput, setFocusedInput] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "YOUR_GOOGLE_WEB_CLIENT_ID",
    });
  }, []);

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    Alert.alert("Success", `Login Successful\nUsername: ${username}`);
    // ❌ Removed: navigation.navigate("Home");
  };

  // GOOGLE LOGIN - FIXED
  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
    } catch (error) {
      console.log("Google Login Error:", error);
      
      // Check if user cancelled the sign-in
      if (error && typeof error === 'object' && 'code' in error &&
          (error as any).code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert("Login Failed", "You cancelled Google Sign-In. Please try again.");
        return; // Don't navigate to Home
      }
      
      // Other errors
      Alert.alert("Login Failed", "Google Sign-In failed. Please try again.");
      return; // Don't navigate to Home
    }
  };

  // LINKEDIN LOGIN
  const handleLinkedInLogin = async () => {
    try {
      Alert.alert(
        "LinkedIn Login",
        `LinkedIn Sign-In would open here!\n\nUsername: ${
          username || "Not entered"
        }\nPassword: ${password ? "********" : "Not entered"}`
      );
      // ❌ Removed: navigation.navigate("Home");
    } catch (error) {
      console.log("LinkedIn Login Error:", error);
      Alert.alert("Login Failed", "LinkedIn Sign-In failed. Please try again.");
    }
  };

  const handleSkip = () => {
    if (navigation?.goBack) {
      navigation.goBack();
    } else {
      Alert.alert("Info", "No previous screen to go back to");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.topGlow} />
      <View style={styles.bottomGlow} />

      <View style={styles.card}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <View
          style={[
            styles.inputBox,
            focusedInput === "user" && styles.activeInput,
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
            onFocus={() => setFocusedInput("user")}
            onBlur={() => setFocusedInput("")}
          />
        </View>

        <View
          style={[
            styles.inputBox,
            focusedInput === "pass" && styles.activeInput,
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            onFocus={() => setFocusedInput("pass")}
            onBlur={() => setFocusedInput("")}
          />

          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.toggleText}>{showPassword ? "Hide" : "Show"}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.forgotRow}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Sign In</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.line} />
          <Text style={styles.or}>OR</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
            <Text style={styles.socialIcon}>G</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={handleLinkedInLogin}
          >
            <Text style={styles.socialIcon}>in</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skip}>Skip for now</Text>
        </TouchableOpacity>

        <Text style={styles.registerText}>
          New here? <Text style={styles.linkText}>Create account</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8BBDB3",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  topGlow: {
    position: "absolute",
    top: -42,
    right: -32,
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: "rgba(255,122,122,0.25)",
  },

  bottomGlow: {
    position: "absolute",
    bottom: -62,
    left: -42,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingVertical: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 6,
    color: "#1e2235",
  },

  subtitle: {
    color: "#647082",
    marginBottom: 22,
    fontSize: 14,
  },

  linkText: {
    fontWeight: "700",
    color: "#1e2235",
  },

  inputBox: {
    backgroundColor: "#f6f7f8",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ebeff2",
  },

  activeInput: {
    borderWidth: 1.5,
    borderColor: "#8BBDB3",
    backgroundColor: "#fff",
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },

  toggleText: {
    fontSize: 12,
    color: "#6b7380",
    fontWeight: "700",
    letterSpacing: 0.4,
  },

  forgotRow: {
    alignItems: "flex-end",
    marginBottom: 22,
  },

  forgotText: {
    color: "#79b6ad",
    fontWeight: "600",
    fontSize: 13,
  },

  loginButton: {
    backgroundColor: "#1e2235",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#1e2235",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },

  loginText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.4,
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#d9dee3",
  },

  or: {
    marginHorizontal: 10,
    color: "#8b949e",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },

  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 25,
  },

  socialButton: {
    width: 52,
    height: 52,
    borderRadius: 999,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e4e9ee",
  },

  socialIcon: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },

  skip: {
    textAlign: "center",
    color: "#888",
    fontWeight: "600",
    fontSize: 14,
  },

  registerText: {
    marginTop: 14,
    textAlign: "center",
    color: "#6b7380",
    fontSize: 13,
  },
});
