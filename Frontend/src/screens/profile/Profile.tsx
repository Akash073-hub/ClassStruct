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
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../../App";
import { getCurrentUser } from "../../services/authSession";

type Props = NativeStackScreenProps<AuthStackParamList, "Profile">;

const BLUE = "#2F52E0";
const DARK = "#1A1A2E";

export default function ProfileScreen({ navigation, route }: Props) {
  const loginDetails = route.params ?? getCurrentUser();
  const [fullName, setFullName] = useState(loginDetails?.name ?? "Student");
  const [bio, setBio] = useState(
    "CSE student passionate about AI, app dev, and building useful campus tools."
  );
  const [email, setEmail] = useState(loginDetails?.email ?? "");
  const [username, setUsername] = useState(loginDetails?.username ?? "");
  const [role, setRole] = useState(loginDetails?.role ?? "student");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [section, setSection] = useState("CSE - B");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const latestUser = route.params ?? getCurrentUser();
    if (!latestUser) return;
    const loginDetails = latestUser;
    setFullName(loginDetails.name ?? "Student");
    setEmail(loginDetails.email ?? "");
    setUsername(loginDetails.username ?? "");
    setRole(loginDetails.role ?? "student");
  }, [route.params]);

  const initials = useMemo(() => {
    const source = fullName.trim() || username.trim() || "Student";
    return source
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  }, [fullName, username]);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 600);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F6FB" />

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
            onChangeText={(value) =>
              setRole(value.toLowerCase().includes("teacher") ? "teacher" : "student")
            }
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

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
          <Text style={styles.saveText}>{saving ? "Saving..." : "Update Profile"}</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4F6FB" },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#F4F6FB",
  },
  backBtn: { width: 38, height: 38, justifyContent: "center", alignItems: "center" },
  backArrow: { fontSize: 32, color: DARK, lineHeight: 36, fontWeight: "300" },
  headerTitle: { fontSize: 20, fontWeight: "800", color: DARK },
  headerSpacer: { width: 38 },
  profileTopCard: {
    backgroundColor: "#fff",
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
    backgroundColor: "#DDE6FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: { fontSize: 28, fontWeight: "800", color: BLUE },
  roleBadge: {
    backgroundColor: "#EEF2FF",
    borderRadius: 30,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  roleBadgeText: { color: BLUE, fontWeight: "700", fontSize: 13 },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  label: { fontSize: 13, fontWeight: "700", color: "#666", marginBottom: 8, marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#E6E8EE",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: DARK,
    backgroundColor: "#FBFCFF",
  },
  textArea: { minHeight: 88 },
  saveBtn: {
    backgroundColor: BLUE,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    marginTop: 16,
  },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  bottomSpacer: { height: 12 },
});
