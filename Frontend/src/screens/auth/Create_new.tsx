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
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  useWindowDimensions,
} from "react-native";

// ── Validation ──────────────────────────────────────────────
const isAlphaOnly = (v: string) => /^[A-Za-z]+$/.test(v);
const isRvuEmail  = (v: string) => /^[^\s@]+@rvu\.edu\.in$/i.test(v);
const isPhone     = (v: string) => /^[6-9]\d{9}$/.test(v);   // Indian mobile number

type FieldProps = {
  label: string;
  icon: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  focusKey: "fullName" | "username" | "email" | "phone" | "password" | "confirm";
  keyboardType?: "default" | "email-address" | "phone-pad";
  secureTextEntry?: boolean;
  returnKeyType?: "next" | "done";
  error?: string;
  rightElement?: React.ReactNode;
  onSubmitEditing?: () => void;
  maxLength?: number;
};

export default function CreateNewScreen({ navigation }: { navigation: any }) {
  const { width } = useWindowDimensions();
  const isCompact = width < 360;

  const [fullName,   setFullName]   = useState("");
  const [username,   setUsername]   = useState("");
  const [email,      setEmail]      = useState("");
  const [phone,      setPhone]      = useState("");
  const [password,   setPassword]   = useState("");
  const [confirm,    setConfirm]    = useState("");
  const [showPass,   setShowPass]   = useState(false);
  const [showConf,   setShowConf]   = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [focused,    setFocused]    = useState("");

  // touched flags — errors only appear after the field is blurred
  const [t, setT] = useState({
    fullName: false, username: false, email: false,
    phone: false, password: false, confirm: false,
  });
  const touch = (field: string) => setT(prev => ({ ...prev, [field]: true }));

  // ── Per-field errors ──
  const errors = {
    fullName: t.fullName && fullName.trim().length < 2
      ? "Full name is required."
      : "",
    username: t.username && !isAlphaOnly(username)
      ? username.length === 0 ? "Username is required." : "Only letters A–Z allowed."
      : "",
    email: t.email && !isRvuEmail(email)
      ? email.length === 0 ? "College email is required." : "Must be a valid @rvu.edu.in address."
      : "",
    phone: t.phone && !isPhone(phone)
      ? phone.length === 0 ? "Phone number is required." : "Enter a valid 10-digit Indian mobile number."
      : "",
    password: t.password && password.length < 6
      ? password.length === 0 ? "Password is required." : "Minimum 6 characters."
      : "",
    confirm: t.confirm && confirm !== password
      ? "Passwords do not match."
      : "",
  };

  const hasErrors = Object.values(errors).some(Boolean);

  // ── Handlers ──
  const handleUsernameChange = (text: string) =>
    setUsername(text.replace(/[^A-Za-z]/g, ""));

  const handlePhoneChange = (text: string) =>
    setPhone(text.replace(/[^0-9]/g, "").slice(0, 10));

  const handleRegister = () => {
    // Mark all fields touched to show any errors
    setT({ fullName: true, username: true, email: true, phone: true, password: true, confirm: true });

    if (
      fullName.trim().length < 2 ||
      !isAlphaOnly(username)     ||
      !isRvuEmail(email)         ||
      !isPhone(phone)            ||
      password.length < 6        ||
      confirm !== password
    ) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        "Account Created! 🎉",
        `Welcome, ${fullName}! Your account has been created successfully.`,
        [{ text: "Login Now", onPress: () => navigation.navigate("Login") }]
      );
    }, 1000);
  };

  // ── Reusable field renderer ──
  const Field = ({
    label, icon, placeholder, value, onChangeText, focusKey,
    keyboardType = "default", secureTextEntry = false,
    returnKeyType = "next", error = "",
    rightElement = null,
    onSubmitEditing,
    maxLength,
  }: FieldProps) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={[
        styles.inputBox,
        focused === focusKey  && styles.inputFocused,
        !!error               && styles.inputError,
      ]}>
        <Text style={styles.icon}>{icon}</Text>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#BABABA"
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          returnKeyType={returnKeyType}
          maxLength={maxLength}
          onFocus={() => setFocused(focusKey)}
          onBlur={() => { setFocused(""); touch(focusKey); }}
          onSubmitEditing={onSubmitEditing}
        />
        {rightElement}
      </View>
      {!!error && <Text style={styles.errorMsg}>⚠ {error}</Text>}
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView style={styles.kbView} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.card, isCompact && styles.cardCompact]}>

            {/* ── Back button ── */}
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.backArrow}>‹</Text>
              <Text style={styles.backText}>Back to Login</Text>
            </TouchableOpacity>

            {/* ── Title ── */}
            <Text style={styles.title}>Create{"\n"}Account.</Text>
            <Text style={styles.subtitle}>Join your college community 🎓</Text>

            {/* ── FIELD 1: Full Name ── */}
            <Field
              label="Full Name"
              icon="🙍"
              placeholder="e.g. John Doe"
              value={fullName}
              onChangeText={setFullName}
              focusKey="fullName"
              error={errors.fullName}
            />

            {/* ── FIELD 2: Username (letters only) ── */}
            <Field
              label="Username"
              icon="👤"
              placeholder="e.g. JohnDoe  (letters only)"
              value={username}
              onChangeText={handleUsernameChange}
              focusKey="username"
              error={errors.username}
              rightElement={
                username.length > 0
                  ? <Text style={styles.indicator}>{isAlphaOnly(username) ? "✅" : "❌"}</Text>
                  : null
              }
            />

            {/* ── FIELD 3: College Email ── */}
            <Field
              label="College Email"
              icon="✉️"
              placeholder="yourname@rvu.edu.in"
              value={email}
              onChangeText={setEmail}
              focusKey="email"
              keyboardType="email-address"
              error={errors.email}
              rightElement={
                email.length > 0
                  ? <Text style={styles.indicator}>{isRvuEmail(email) ? "✅" : "❌"}</Text>
                  : null
              }
            />

            {/* ── FIELD 4: Phone ── */}
            <Field
              label="Mobile Number"
              icon="📱"
              placeholder="10-digit mobile number"
              value={phone}
              onChangeText={handlePhoneChange}
              focusKey="phone"
              keyboardType="phone-pad"
              maxLength={10}
              error={errors.phone}
              rightElement={
                phone.length > 0
                  ? <Text style={styles.indicator}>{isPhone(phone) ? "✅" : "❌"}</Text>
                  : null
              }
            />

            {/* ── FIELD 5: Password ── */}
            <Field
              label="Password"
              icon="🔒"
              placeholder="Min. 6 characters"
              value={password}
              onChangeText={setPassword}
              focusKey="password"
              secureTextEntry={!showPass}
              error={errors.password}
              rightElement={
                <TouchableOpacity onPress={() => setShowPass(!showPass)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Text style={styles.eyeIcon}>{showPass ? "👁️" : "👁️‍🗨️"}</Text>
                </TouchableOpacity>
              }
            />

            {/* ── FIELD 6: Confirm Password ── */}
            <Field
              label="Confirm Password"
              icon="🔑"
              placeholder="Re-enter your password"
              value={confirm}
              onChangeText={setConfirm}
              focusKey="confirm"
              secureTextEntry={!showConf}
              returnKeyType="done"
              onSubmitEditing={handleRegister}
              error={errors.confirm}
              rightElement={
                <TouchableOpacity onPress={() => setShowConf(!showConf)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Text style={styles.eyeIcon}>{showConf ? "👁️" : "👁️‍🗨️"}</Text>
                </TouchableOpacity>
              }
            />

            {/* ── Register Button ── */}
            <TouchableOpacity
              style={[styles.registerBtn, loading && styles.btnDisabled]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.registerText}>Create Account</Text>
              }
            </TouchableOpacity>

            {/* ── Already have account ── */}
            <TouchableOpacity style={styles.loginRow} onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginPrompt}>
                Already have an account?{" "}
                <Text style={styles.loginLink}>Login</Text>
              </Text>
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
  scroll:    { flexGrow: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 16, paddingVertical: 28 },

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

  backBtn:  { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  backArrow: { fontSize: 26, color: TEAL, fontWeight: "300", marginRight: 4, lineHeight: 30 },
  backText:  { fontSize: 14, color: TEAL, fontWeight: "600" },

  title:    { fontSize: 28, fontWeight: "800", color: "#222", marginBottom: 6 },
  subtitle: { fontSize: 14, color: "#777", marginBottom: 24 },

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

  errorMsg: { fontSize: 12, color: "#FF4D4D", marginBottom: 12, marginLeft: 4 },

  registerBtn: {
    backgroundColor: DARK,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
    shadowColor: DARK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  btnDisabled:    { opacity: 0.6 },
  registerText:   { color: "#fff", fontWeight: "700", fontSize: 16 },

  loginRow:    { marginTop: 20, alignItems: "center" },
  loginPrompt: { fontSize: 14, color: "#888" },
  loginLink:   { color: TEAL, fontWeight: "700" },
});