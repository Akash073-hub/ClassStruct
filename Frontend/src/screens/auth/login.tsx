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
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  useWindowDimensions,
} from "react-native";

import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";

// ─────────────────────────────────────────────
// 🔑  PASTE YOUR GOOGLE WEB CLIENT ID BELOW
//     Get it from: https://console.cloud.google.com
//     → APIs & Services → Credentials → OAuth 2.0 Client IDs
// ─────────────────────────────────────────────
const GOOGLE_WEB_CLIENT_ID = "YOUR_GOOGLE_WEB_CLIENT_ID.apps.googleusercontent.com";

type GoogleSigninError = {
  code?: string;
};

export default function LoginScreen({ navigation }: { navigation: any }) {
  const { width } = useWindowDimensions();
  const isCompactDevice = width < 360;

  const [focusedInput, setFocusedInput] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
    });
  }, []);

  // ─── Navigate to Home (resets stack so user can't go back to Login) ───
  const goToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Home", params: { role: "student", name: username } }],
    });
  };

  // ─── Username / Password Login ───
  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Missing Fields", "Please enter both username and password.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters.");
      return;
    }

    // TODO: Replace this block with your real API call, e.g.:
    // const response = await fetch("https://your-api.com/login", { ... });
    // if (response.ok) goToHome();
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      goToHome(); // ✅ Navigate to Home after successful login
    }, 800); // Simulated network delay – remove when using real API
  };

  // ─── Google Login ───
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      if (Platform.OS === "android") {
        await GoogleSignin.hasPlayServices();
      }
      await GoogleSignin.signIn();
      goToHome();

    } catch (error) {
      console.log("Google Login Error:", error);

      const googleError = error as GoogleSigninError;

      if (googleError.code === statusCodes.SIGN_IN_CANCELLED) {
        // User dismissed the sign-in dialog – no alert needed
        return;
      } else if (googleError.code === statusCodes.IN_PROGRESS) {
        Alert.alert("Please wait", "Sign-In is already in progress.");
      } else if (googleError.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("Unavailable", "Google Play Services are not available on this device.");
      } else {
        Alert.alert("Google Sign-In Failed", "Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── LinkedIn Login ───
  const handleLinkedInLogin = async () => {
    // TODO: Integrate a real LinkedIn OAuth library, e.g. react-native-linkedin
    // For now this is a placeholder that navigates to Home on confirmation.
    Alert.alert(
      "LinkedIn Login",
      "LinkedIn Sign-In is not yet configured. Tap OK to continue as demo.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK (Demo)",
          onPress: () => goToHome(), // ✅ Navigate on confirmation
        },
      ]
    );
  };

  // ─── Forgot Password ───
  const handleForgotPassword = () => {
    if (!username.trim()) {
      Alert.alert(
        "Reset Password",
        "Please enter your username above first, then tap Forgot Passcode again."
      );
      return;
    }
    // TODO: Call your password reset API here
    Alert.alert(
      "Password Reset",
      `A reset link has been sent to the account associated with "${username}".`
    );
  };

  // ─── Skip / Go Back ───
  const handleSkip = () => {
    if (navigation?.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: "PreLogin" }],
      });
    }
  };

  // ─── Navigate to Register ───
  const handleCreateNew = () => {
    // TODO: Create a Register screen and uncomment the line below
    // navigation.navigate("Register");
    Alert.alert("Coming Soon", "Registration screen is under construction.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
      <View style={[styles.card, isCompactDevice && styles.cardCompact]}>
        <Text style={styles.title}>Hey,{"\n"}Login Now.</Text>

        <Text style={styles.subtitle}>
          If you are new /{" "}
          <Text style={styles.linkText} onPress={handleCreateNew}>
            Create New
          </Text>
        </Text>

        {/* ── Username ── */}
        <View style={[styles.inputBox, focusedInput === "user" && styles.activeInput]}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={() => setFocusedInput("user")}
            onBlur={() => setFocusedInput("")}
          />
        </View>

        {/* ── Password ── */}
        <View style={[styles.inputBox, focusedInput === "pass" && styles.activeInput]}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={() => setFocusedInput("pass")}
            onBlur={() => setFocusedInput("")}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.eyeIcon}>{showPassword ? "👁️" : "👁️‍🗨️"}</Text>
          </TouchableOpacity>
        </View>

        {/* ── Forgot Password ── */}
        <TouchableOpacity style={styles.forgotRow} onPress={handleForgotPassword}>
          <Text style={styles.forgotText}>Forgot Passcode?</Text>
        </TouchableOpacity>

        {/* ── Login Button ── */}
        <TouchableOpacity
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginText}>Login</Text>
          )}
        </TouchableOpacity>

        {/* ── Divider ── */}
        <View style={styles.dividerRow}>
          <View style={styles.line} />
          <Text style={styles.or}>or</Text>
          <View style={styles.line} />
        </View>

        {/* ── Social Buttons ── */}
        <View style={styles.socialRow}>
          <TouchableOpacity
            style={[styles.socialButton, styles.socialButtonGap]}
            onPress={handleGoogleLogin}
            disabled={loading}
          >
            <Text style={styles.socialIcon}>G</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={handleLinkedInLogin}
            disabled={loading}
          >
            <Text style={styles.socialIcon}>in</Text>
          </TouchableOpacity>
        </View>

        {/* ── Skip ── */}
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skip}>Skip Now</Text>
        </TouchableOpacity>
      </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8BBDB3",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  card: {
    width: "100%",
    maxWidth: 460,
    backgroundColor: "#fff",
    borderRadius: 35,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  cardCompact: {
    borderRadius: 28,
    padding: 20,
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
  loginButtonDisabled: {
    opacity: 0.6,
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
  },
  socialButtonGap: {
    marginRight: 20,
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
