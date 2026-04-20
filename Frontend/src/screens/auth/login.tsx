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

const GOOGLE_WEB_CLIENT_ID = "YOUR_GOOGLE_WEB_CLIENT_ID.apps.googleusercontent.com";

// ── Validation ─────────────────────────────────────────────
const isAlphaOnly = (v: string) => /^[A-Za-z]+$/.test(v);
const isRvuEmail  = (v: string) => /^[^\s@]+@rvu\.edu\.in$/i.test(v);

type GoogleSigninError = { code?: string };
type Role = "student" | "teacher";

export default function LoginScreen({ navigation }: { navigation: any }) {
  const { width } = useWindowDimensions();
  const isCompact = width < 360;

  // ── Role toggle ──
  const [role, setRole] = useState<Role>("student");

  const [username,      setUsername]      = useState("");
  const [email,         setEmail]         = useState("");
  const [password,      setPassword]      = useState("");
  const [showPassword,  setShowPassword]  = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [focused,       setFocused]       = useState("");

  const [usernameTouched, setUsernameTouched] = useState(false);
  const [emailTouched,    setEmailTouched]    = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const usernameErr = usernameTouched && !isAlphaOnly(username)
    ? username.length === 0 ? "Username is required." : "Only letters A-Z allowed. No numbers or symbols."
    : "";

  const emailErr = emailTouched && !isRvuEmail(email)
    ? email.length === 0 ? "College email is required." : "Must be a valid @rvu.edu.in address."
    : "";

  const passwordErr = passwordTouched && password.length < 6
    ? password.length === 0 ? "Password is required." : "Minimum 6 characters."
    : "";

  useEffect(() => {
    GoogleSignin.configure({ webClientId: GOOGLE_WEB_CLIENT_ID });
  }, []);

  // Reset fields when role switches
  const handleRoleSwitch = (newRole: Role) => {
    setRole(newRole);
    setUsername("");
    setEmail("");
    setPassword("");
    setUsernameTouched(false);
    setEmailTouched(false);
    setPasswordTouched(false);
  };

  const goToHome = () =>
    navigation.reset({ index: 0, routes: [{ name: "Home", params: { role, name: username } }] });

  const handleUsernameChange = (text: string) => {
    setUsername(text.replace(/[^A-Za-z]/g, ""));
  };

  const handleLogin = () => {
    setUsernameTouched(true);
    setEmailTouched(true);
    setPasswordTouched(true);
    if (!isAlphaOnly(username) || !isRvuEmail(email) || password.length < 6) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); goToHome(); }, 800);
  };

  const handleGoogleLogin = async () => {
      Alert.alert("Google Sign-In Failed", "Please try again..", [
      { text: "Cancel", style: "cancel" },
      { text: "Under construction", onPress: () => navigation.replace("Login") },
    ]);
  };

  const handleLinkedInLogin = () => {
    Alert.alert("LinkedIn Login", "LinkedIn Sign-In is not yet configured. Tap OK to continue as demo.", [
      { text: "Cancel", style: "cancel" },
      { text: "Under construction", onPress: () => navigation.replace("Login") },
    ]);
  };

  const handleForgotPassword = () => {
    if (!isRvuEmail(email)) {
      Alert.alert("Enter Email First", "Please enter your valid @rvu.edu.in email above.");
      return;
    }
    Alert.alert("Password Reset", `A reset link has been sent to ${email}.`);
  };

  const handleSkip = () => {
    if (navigation?.canGoBack()) navigation.goBack();
    else navigation.reset({ index: 0, routes: [{ name: "PreLogin" }] });
  };

  const handleCreateNew = () => {
    navigation.navigate("CreateNew");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ══════════════════════════════════════
          STUDENT / TEACHER TOGGLE  (top pill)
      ══════════════════════════════════════ */}
      <View style={styles.toggleWrapper}>
        <View style={styles.togglePill}>
          <TouchableOpacity
            style={[styles.toggleBtn, role === "student" && styles.toggleBtnActive]}
            onPress={() => handleRoleSwitch("student")}
            activeOpacity={0.8}
          >
            <Text style={[styles.toggleText, role === "student" && styles.toggleTextActive]}>
              Student
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleBtn, role === "teacher" && styles.toggleBtnActive]}
            onPress={() => handleRoleSwitch("teacher")}
            activeOpacity={0.8}
          >
            <Text style={[styles.toggleText, role === "teacher" && styles.toggleTextActive]}>
              Teacher
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView style={styles.kbView} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={[styles.card, isCompact && styles.cardCompact]}>

            {/* ── Title ── */}
            <Text style={styles.title}>Hey,{"\n"}Login Now.</Text>
            <Text style={styles.subtitle}>
              {role === "student" ? "If you are new / " : "Sign in as a Teacher / "}
              {role === "student" && (
                <Text style={styles.link} onPress={handleCreateNew}>Create New</Text>
              )}
            </Text>

            {/* ── Role badge ── */}
            <View style={[styles.roleBadge, role === "teacher" && styles.roleBadgeTeacher]}>
              <Text style={styles.roleBadgeText}>
                {role === "student" ? "🎓 Student Login" : "👨‍🏫 Teacher Login"}
              </Text>
            </View>

            {/* ── USERNAME ── */}
            <Text style={styles.label}>Username</Text>
            <View style={[
              styles.inputBox,
              focused === "user" && styles.inputFocused,
              !!usernameErr && styles.inputError,
            ]}>
              <Text style={styles.icon}>👤</Text>
              <TextInput
                style={styles.input}
                placeholder={role === "student" ? "e.g. JohnDoe" : "e.g. ProfSmith"}
                placeholderTextColor="#BABABA"
                value={username}
                onChangeText={handleUsernameChange}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="default"
                returnKeyType="next"
                onFocus={() => setFocused("user")}
                onBlur={() => { setFocused(""); setUsernameTouched(true); }}
              />
              {username.length > 0 && (
                <Text style={styles.indicator}>{isAlphaOnly(username) ? "✅" : "❌"}</Text>
              )}
            </View>
            {!!usernameErr && <Text style={styles.errorMsg}>⚠ {usernameErr}</Text>}

            {/* ── COLLEGE EMAIL ── */}
            <Text style={styles.label}>College Email</Text>
            <View style={[
              styles.inputBox,
              focused === "email" && styles.inputFocused,
              !!emailErr && styles.inputError,
            ]}>
              <Text style={styles.icon}>✉️</Text>
              <TextInput
                style={styles.input}
                placeholder="yourname@rvu.edu.in"
                placeholderTextColor="#BABABA"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType="next"
                onFocus={() => setFocused("email")}
                onBlur={() => { setFocused(""); setEmailTouched(true); }}
              />
              {email.length > 0 && (
                <Text style={styles.indicator}>{isRvuEmail(email) ? "✅" : "❌"}</Text>
              )}
            </View>
            {!!emailErr && <Text style={styles.errorMsg}>⚠ {emailErr}</Text>}

            {/* ── PASSWORD ── */}
            <Text style={styles.label}>Password</Text>
            <View style={[
              styles.inputBox,
              focused === "pass" && styles.inputFocused,
              !!passwordErr && styles.inputError,
            ]}>
              <Text style={styles.icon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="Min. 6 characters"
                placeholderTextColor="#BABABA"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onFocus={() => setFocused("pass")}
                onBlur={() => { setFocused(""); setPasswordTouched(true); }}
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.eyeIcon}>{showPassword ? "👁️" : "👁️‍🗨️"}</Text>
              </TouchableOpacity>
            </View>
            {!!passwordErr && <Text style={styles.errorMsg}>⚠ {passwordErr}</Text>}

            {/* ── Forgot Passcode ── */}
            <TouchableOpacity style={styles.forgotRow} onPress={handleForgotPassword}>
              <Text style={styles.forgotText}>Forgot Passcode?</Text>
            </TouchableOpacity>

            {/* ── Login Button ── */}
            <TouchableOpacity
              style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.loginText}>Login as {role === "student" ? "Student" : "Teacher"}</Text>
              }
            </TouchableOpacity>

            {/* ── Divider ── */}
            <View style={styles.divider}>
              <View style={styles.divLine} />
              <Text style={styles.divOr}>or</Text>
              <View style={styles.divLine} />
            </View>

            {/* ── Social ── */}
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialBtnG} onPress={handleGoogleLogin} disabled={loading}>
                <Text style={styles.socialIcon}>G</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtnIn} onPress={handleLinkedInLogin} disabled={loading}>
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

// ─────────────────────────────────────────────
//  STYLES
// ─────────────────────────────────────────────
const TEAL = "#8BBDB3";
const DARK = "#1e2235";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: TEAL },
  kbView:    { flex: 1 },

  // ── Toggle pill at the very top ──
  toggleWrapper: {
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 8,
  },
  togglePill: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 30,
    padding: 4,
    width: 240,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 26,
    alignItems: "center",
  },
  toggleBtnActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleText:       { fontSize: 14, fontWeight: "600", color: "rgba(255,255,255,0.75)" },
  toggleTextActive: { color: TEAL, fontWeight: "800" },

  scroll: { flexGrow: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 16, paddingVertical: 16 },

  card: {
    width: "100%",
    maxWidth: 460,
    backgroundColor: "#fff",
    borderRadius: 35,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 10,
  },
  cardCompact: { borderRadius: 28, padding: 22 },

  title:    { fontSize: 28, fontWeight: "800", color: "#222", marginBottom: 6 },
  subtitle: { fontSize: 14, color: "#777", marginBottom: 14 },
  link:     { fontWeight: "700", color: DARK },

  // ── Role badge ──
  roleBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#E8F4F2",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 22,
  },
  roleBadgeTeacher: { backgroundColor: "#EEE8FF" },
  roleBadgeText: { fontSize: 13, fontWeight: "700", color: DARK },

  label: { fontSize: 13, fontWeight: "700", color: "#444", marginBottom: 6, marginLeft: 2 },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 6,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  inputFocused: { borderColor: TEAL, backgroundColor: "#fff" },
  inputError:   { borderColor: "#FF4D4D", backgroundColor: "#fff9f9" },

  icon:      { fontSize: 16, marginRight: 10 },
  input:     { flex: 1, fontSize: 15, color: "#333" },
  indicator: { fontSize: 14, marginLeft: 6 },
  eyeIcon:   { fontSize: 18, marginLeft: 6 },

  errorMsg: { fontSize: 12, color: "#FF4D4D", marginBottom: 14, marginLeft: 4 },

  forgotRow: { alignItems: "flex-end", marginTop: 4, marginBottom: 22 },
  forgotText: { color: TEAL, fontWeight: "600", fontSize: 13 },

  loginBtn: {
    backgroundColor: DARK,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: DARK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  loginBtnDisabled: { opacity: 0.6 },
  loginText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  divider: { flexDirection: "row", alignItems: "center", marginVertical: 24 },
  divLine: { flex: 1, height: 1, backgroundColor: "#E0E0E0" },
  divOr:   { marginHorizontal: 12, color: "#AAA", fontSize: 13 },

  socialRow: { flexDirection: "row", justifyContent: "center", marginBottom: 24, gap: 20 },
  socialBtnG: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: "#F3F3F3",
    justifyContent: "center", alignItems: "center",
  },
  socialBtnIn: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: "#F3F3F3",
    justifyContent: "center", alignItems: "center",
  },
  socialIcon: { fontSize: 18, fontWeight: "800", color: "#333" },

  skip: { textAlign: "center", color: "#AAA", fontWeight: "600", fontSize: 14 },
});