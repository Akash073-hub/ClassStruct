import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../../App";
import { getCurrentUser, setCurrentUser } from "../../services/authSession";
import GlassBackdrop from "../../components/GlassBackdrop";
import { authApi, type Role } from "../../services/authApi";

type Props = NativeStackScreenProps<AuthStackParamList, "Profile">;

const BLUE = "#86D2FF";
const DARK = "#F7FAFF";

export default function ProfileScreen({ navigation, route }: Props) {
  const loginDetails = getCurrentUser() ?? route.params;
  const [fullName, setFullName] = useState(loginDetails?.name ?? "Student");
  const [bio, setBio] = useState(
    "CSE student passionate about AI, app dev, and building useful campus tools."
  );
  const [email, setEmail] = useState(loginDetails?.email ?? "");
  const [username, setUsername] = useState(loginDetails?.username ?? "");
  const [role, setRole] = useState<Role>(loginDetails?.role ?? "student");
  const [phone, setPhone] = useState(loginDetails?.role === "teacher" ? "" : "+919876543210");
  const [profileEmailKey, setProfileEmailKey] = useState(loginDetails?.email ?? "");
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [section, setSection] = useState("CSE - B");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const latestUser = getCurrentUser() ?? route.params;
    if (!latestUser) {
      return;
    }

    setFullName(latestUser.name ?? "Student");
    setEmail(latestUser.email ?? "");
    setUsername(latestUser.username ?? "");
    setRole(latestUser.role ?? "student");
    setProfileEmailKey(latestUser.email ?? "");

    if (!latestUser.email?.trim()) {
      setLoadingProfile(false);
      return;
    }

    let active = true;
    setLoadingProfile(true);

    authApi
      .profile(latestUser.email ?? "", latestUser.role ?? "student")
      .then((profile) => {
        if (!active) {
          return;
        }
        setFullName(profile.name);
        setEmail(profile.email);
        setUsername(profile.username);
        setRole(profile.role);
        setPhone(profile.phone ?? "");
        setProfileEmailKey(profile.email);
      })
      .catch(() => {
        if (!active) {
          return;
        }
      })
      .finally(() => {
        if (active) {
          setLoadingProfile(false);
        }
      });

    return () => {
      active = false;
    };
  }, [route.params]);

  const initials = useMemo(() => {
    const source = fullName.trim() || username.trim() || "Student";
    return source
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  }, [fullName, username]);

  const handleSave = async () => {
    if (!profileEmailKey.trim()) {
      Alert.alert("Profile update failed", "Your account email is missing.");
      return;
    }

    setSaving(true);
    try {
      const updated = await authApi.updateProfile({
        currentEmail: profileEmailKey.trim(),
        role,
        name: fullName.trim(),
        username: username.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });

      const normalizedRole: Role = updated.role === "teacher" ? "teacher" : "student";
      setFullName(updated.name);
      setUsername(updated.username);
      setEmail(updated.email);
      setPhone(updated.phone ?? "");
      setRole(normalizedRole);
      setProfileEmailKey(updated.email);

      const refreshedUser = {
        role: normalizedRole,
        name: updated.name,
        username: updated.username,
        email: updated.email,
      };
      setCurrentUser(refreshedUser);
      navigation.setParams(refreshedUser);
      Alert.alert("Profile updated", "Your profile details were saved successfully.");
    } catch (error) {
      Alert.alert(
        "Profile update failed",
        error instanceof Error ? error.message : "Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <GlassBackdrop />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Information</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileTopCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>
              {role === "teacher" ? "Teacher Account" : "Student Account"}
            </Text>
          </View>
        </View>

        <View style={styles.formCard}>
          {loadingProfile && (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#EAF6FF" />
              <Text style={styles.loadingText}>Loading latest profile...</Text>
            </View>
          )}

          <Text style={styles.label}>Full Name</Text>
          <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />

          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={bio}
            onChangeText={setBio}
            multiline
            textAlignVertical="top"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Role</Text>
          <TextInput
            style={styles.input}
            value={role === "teacher" ? "Teacher" : "Student"}
            editable={false}
          />

          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Department</Text>
          <TextInput
            style={styles.input}
            value={department}
            onChangeText={setDepartment}
          />

          <Text style={styles.label}>Section</Text>
          <TextInput style={styles.input} value={section} onChangeText={setSection} />
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, (saving || loadingProfile) && styles.saveBtnDisabled]}
          onPress={handleSave}
          activeOpacity={0.85}
          disabled={saving || loadingProfile}
        >
          <Text style={styles.saveText}>{saving ? "Saving..." : "Update Profile"}</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0F1A2E" },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "transparent",
  },
  backBtn: { width: 38, height: 38, justifyContent: "center", alignItems: "center" },
  backArrow: { fontSize: 32, color: DARK, lineHeight: 36, fontWeight: "300" },
  headerTitle: { fontSize: 20, fontWeight: "800", color: DARK },
  headerSpacer: { width: 38 },
  profileTopCard: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    borderRadius: 20,
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "rgba(255,255,255,0.24)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: { fontSize: 28, fontWeight: "800", color: BLUE },
  roleBadge: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 30,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  roleBadgeText: { color: BLUE, fontWeight: "700", fontSize: 13 },
  formCard: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  loadingRow: { flexDirection: "row", alignItems: "center", marginBottom: 4, gap: 8 },
  loadingText: { color: "rgba(234,246,255,0.9)", fontSize: 12, fontWeight: "700" },
  label: { fontSize: 13, fontWeight: "700", color: "#EAF6FF", marginBottom: 8, marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.32)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: "#fff",
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  textArea: { minHeight: 88 },
  saveBtn: {
    backgroundColor: "rgba(134,210,255,0.38)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    marginTop: 16,
  },
  saveBtnDisabled: { opacity: 0.68 },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  bottomSpacer: { height: 12 },
});
