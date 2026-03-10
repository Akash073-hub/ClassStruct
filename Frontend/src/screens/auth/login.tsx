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
      const userInfo = await GoogleSignin.signIn();

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
        `LinkedIn Sign-In would open here!\n\nUsername: ${username || 'Not entered'}\nPassword: ${password ? '••••••••' : 'Not entered'}`
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

      <View style={styles.card}>
        <Text style={styles.title}>
          Hey,{"\n"}Login Now.
        </Text>

        <Text style={styles.subtitle}>
          If you are new /{" "}
          <Text style={styles.linkText}>Create New</Text>
        </Text>

        {/* Username */}
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

        {/* Password */}
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

          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.eyeIcon}>
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity style={styles.forgotRow}>
          <Text style={styles.forgotText}>Forgot Passcode?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.line} />
          <Text style={styles.or}>or</Text>
          <View style={styles.line} />
        </View>

        {/* Social Login */}
        <View style={styles.socialRow}>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={handleGoogleLogin}
          >
            <Text style={styles.socialIcon}>G</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={handleLinkedInLogin}
          >
            <Text style={styles.socialIcon}>in</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleSkip}
        >
          <Text style={styles.skip}>Skip Now</Text>
        </TouchableOpacity>
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
  },

  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 35,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 10,
    color: "#222",
  },

  subtitle: {
    color: "#777",
    marginBottom: 25,
    fontSize: 14,
  },

  linkText: {
    fontWeight: "600",
    color: "#1e2235",
  },

  inputBox: {
    backgroundColor: "#F5F5F5",
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },

  activeInput: {
    borderWidth: 2,
    borderColor: "#8BBDB3",
    backgroundColor: "#fff",
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },

  eyeIcon: {
    fontSize: 18,
  },

  forgotRow: {
    alignItems: "flex-end",
    marginBottom: 25,
  },

  forgotText: {
    color: "#79B6AD",
    fontWeight: "600",
    fontSize: 14,
  },

  loginButton: {
    backgroundColor: "#1e2235",
    paddingVertical: 16,
    borderRadius: 15,
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
    fontSize: 17,
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },

  or: {
    marginHorizontal: 10,
    color: "#999",
    fontSize: 14,
  },

  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 25,
  },

  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f3f3f3",
    justifyContent: "center",
    alignItems: "center",
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
    fontSize: 15,
  },
});