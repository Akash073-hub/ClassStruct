import React, { useState } from "react";
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

export default function LoginScreen({ navigation }: { navigation?: any }) {
  const [focusedInput, setFocusedInput] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      console.log("Login Successful");
      if (navigation?.navigate) {
        navigation.navigate("Home");
      }
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.card}>
        {/* Title */}
        <Text style={styles.title}>
          Hey,{"\n"}Login Now.
        </Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          If you are new /{"\n"}
          <Text style={styles.linkText}>Create New</Text>
        </Text>

        {/* Username Input */}
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
            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
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
            <Text style={styles.eyeIcon}>{showPassword ? "👁️" : "👁️‍🗨️"}</Text>
          </TouchableOpacity>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity style={styles.forgotRow}>
          <Text style={styles.forgotText}>Forgot Passcode?</Text>
          <Text style={styles.resetText}> Reset</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          activeOpacity={0.8}
        >
          <Text style={styles.loginText}>
            {isLoading ? "Signing in..." : "Login"}
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.line} />
          <Text style={styles.or}>or</Text>
          <View style={styles.line} />
        </View>

        {/* Social Links */}
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialIcon}>G</Text>
          </TouchableOpacity>
      
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialIcon}>f</Text>
          </TouchableOpacity>
        </View>

        {/* Skip */}
        <TouchableOpacity>
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
    backgroundColor: "#FFFFFF",
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
    color: "#222",
    marginBottom: 8,
  },

  subtitle: {
    color: "#777",
    fontSize: 14,
    marginBottom: 25,
    lineHeight: 20,
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
    borderWidth: 1,
    borderColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  activeInput: {
    backgroundColor: "#fff",
    borderColor: "#8BBDB3",
    borderWidth: 2,
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
    fontSize: 14,
    fontWeight: "600",
  },

  resetText: {
    color: "#79B6AD",
    fontSize: 14,
    fontWeight: "600",
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
    marginBottom: 25,
    gap: 20,
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
    color: "#888",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },

  // Additional style definitions for missing styles
  categoryContainer: {
    alignItems: "center",
    marginBottom: 15,
  },

  category: {
    color: "#ff7a7a",
    fontWeight: "800",
    fontSize: 12,
    letterSpacing: 3,
    textTransform: "uppercase",
  },

  categoryLine: {
    width: 40,
    height: 3,
    backgroundColor: "#ff7a7a",
    borderRadius: 2,
    marginTop: 8,
  },

  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 35,
  },

  dotWrapper: {
    padding: 5,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 8,
  },

  activeDot: {
    width: 28,
    backgroundColor: "#ff7a7a",
    borderRadius: 5,
  },

  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },

  skipButton: {
    padding: 10,
  },

  nextBtn: {
    backgroundColor: "#1e2235",
    paddingVertical: 16,
    paddingHorizontal: 35,
    borderRadius: 30,
    shadowColor: "#1e2235",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },

  nextText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
    letterSpacing: 0.5,
  },
});
