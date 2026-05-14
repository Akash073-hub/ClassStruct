import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, StatusBar } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../../App";
import RVLogo from "../../components/RVLogo";
import { clearCurrentUser } from "../../services/authSession";

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "Home">;
  route?: { params?: { role?: "teacher" | "student"; name?: string; username?: string; email?: string } };
};

export default function HomeScreen({ navigation, route }: Props) {
  const { role = "student", name = "Student", username = "", email = "" } = route?.params ?? {};
  const userInfo = { role, name, username, email };
  const [searchText, setSearchText] = useState("");
  const progress = 0.75;
  const currentWeek = 12;
  const totalWeeks = 16;
  const examsLeft = 5;

  const handleLogout = () => {
    clearCurrentUser();
    navigation.reset({ index: 0, routes: [{ name: "PreLogin" }] });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning,";
    if (hour < 17) return "Good afternoon,";
    return "Good evening,";
  };

  const initials = (name || username || "Student")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  const menuItems = [
    {
      label: "Schedule",
      subtitle: "Timetable and exam days",
      code: "SC",
      accent: "#2F52E0",
      onPress: () => navigation.navigate("Classes"),
    },
    {
      label: "Teachers",
      subtitle: "BCA 4th sem faculty",
      code: "TR",
      accent: "#0F766E",
      onPress: () => navigation.navigate("Teachers"),
    },
    {
      label: "Updates",
      subtitle: "Exam reminders",
      code: "UP",
      accent: "#B45309",
      onPress: () => navigation.navigate("Updates"),
    },
    {
      label: "Profile",
      subtitle: "About information",
      code: "ME",
      accent: "#7C3AED",
      onPress: () => navigation.navigate("Profile", userInfo),
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F6FB" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <RVLogo compact />
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <View style={styles.welcomeRow}>
              <Text style={styles.welcomeBold}>Welcome back, {name}</Text>
            </View>
            {!!email && <Text style={styles.emailText}>{email}</Text>}
          </View>
          <TouchableOpacity style={styles.avatar} onPress={handleLogout}>
            <View style={styles.avatarInner}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={styles.onlineDot} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBox}>
          <TextInput style={styles.searchInput} placeholder="Search students or semesters" placeholderTextColor="#ADADAD" value={searchText} onChangeText={setSearchText} />
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressTop}>
            <View>
              <Text style={styles.progressLabel}>CURRENT PROGRESS</Text>
              <Text style={styles.progressTitle}>BCA 4th Sem Exam Week</Text>
            </View>
            <View style={styles.weekBadge}>
              <Text style={styles.weekText}>WEEK {currentWeek}/{totalWeeks}</Text>
            </View>
          </View>
          <Text style={styles.progressPercent}>{Math.round(progress * 100)}%</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.examsLeft}>
            {examsLeft} exams: MAD 15, IKS 23, Minor/Elective 25-27
          </Text>
        </View>

        <View style={styles.quickHeader}>
          <Text style={styles.quickTitle}>Quick Access</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Semester")}>
            <Text style={styles.quickLink}>Semester</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.menuCard}
              activeOpacity={0.78}
              onPress={item.onPress}
            >
              <View style={[styles.codeBox, { backgroundColor: item.accent }]}>
                <Text style={styles.codeText}>{item.code}</Text>
              </View>
              <Text style={styles.cardTitle}>{item.label}</Text>
              <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.databaseCard}
          activeOpacity={0.82}
          onPress={() => navigation.navigate("Activities")}
        >
          <View>
            <Text style={styles.databaseLabel}>Backend Ready</Text>
            <Text style={styles.databaseTitle}>H2 database has seeded users</Text>
            <Text style={styles.databaseText}>Show /api/database/overview to the jury.</Text>
          </View>
          <Text style={styles.databaseCode}>DB</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIconActive}>HM</Text>
          <Text style={styles.navLabelActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Activities")}>
          <Text style={styles.navIcon}>NW</Text>
          <Text style={styles.navLabel}>Network</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.fab}>
          <Text style={styles.fabPlus}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Updates")}>
          <Text style={styles.navIcon}>UP</Text>
          <Text style={styles.navLabel}>Updates</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Profile", userInfo)}>
          <Text style={styles.navIcon}>ME</Text>
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const BLUE = "#2F52E0";
const DARK = "#1A1A2E";

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4F6FB" },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  greeting: { fontSize: 15, color: "#666", fontWeight: "400", marginTop: 12 },
  welcomeRow: { flexDirection: "row", alignItems: "center" },
  welcomeBold: { fontSize: 22, fontWeight: "800", color: DARK },
  emailText: { fontSize: 13, color: "#667085", fontWeight: "600", marginTop: 3 },
  avatar: { position: "relative" },
  avatarInner: { width: 48, height: 48, borderRadius: 16, backgroundColor: "#19313A", justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 14, color: "#fff", fontWeight: "900" },
  onlineDot: { position: "absolute", bottom: 2, right: 2, width: 11, height: 11, borderRadius: 6, backgroundColor: "#22C55E", borderWidth: 2, borderColor: "#F4F6FB" },
  searchBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 18, paddingHorizontal: 18, paddingVertical: 12, marginBottom: 22, borderWidth: 1, borderColor: "#E6E8EE" },
  searchInput: { flex: 1, fontSize: 15, color: DARK },
  progressCard: { backgroundColor: "#19313A", borderRadius: 22, padding: 22, marginBottom: 22 },
  progressTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 },
  progressLabel: { fontSize: 11, color: "rgba(255,255,255,0.7)", letterSpacing: 1.5, fontWeight: "600", marginBottom: 4 },
  progressTitle: { fontSize: 20, fontWeight: "800", color: "#fff" },
  weekBadge: { backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  weekText: { color: "#fff", fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  progressPercent: { fontSize: 42, fontWeight: "800", color: "#fff", marginBottom: 12 },
  progressBarBg: { height: 8, backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 4, marginBottom: 10 },
  progressBarFill: { height: 8, backgroundColor: "#fff", borderRadius: 4 },
  examsLeft: { color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: "500", textAlign: "right" },
  quickHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  quickTitle: { fontSize: 18, fontWeight: "900", color: DARK },
  quickLink: { fontSize: 13, fontWeight: "800", color: BLUE },
  menuGrid: { flexDirection: "row", flexWrap: "wrap", gap: 14, marginBottom: 18 },
  menuCard: { width: "47.8%", backgroundColor: "#fff", borderRadius: 18, padding: 16, borderWidth: 1, borderColor: "#E6E8EE" },
  codeBox: { width: 42, height: 42, borderRadius: 12, justifyContent: "center", alignItems: "center", marginBottom: 14 },
  codeText: { color: "#fff", fontSize: 13, fontWeight: "900" },
  cardTitle: { fontSize: 17, fontWeight: "800", color: DARK, marginBottom: 5 },
  cardSubtitle: { fontSize: 12, color: "#667085", fontWeight: "600", lineHeight: 17 },
  databaseCard: { backgroundColor: "#fff", borderRadius: 18, padding: 18, borderWidth: 1, borderColor: "#D7B56D", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  databaseLabel: { color: "#B89143", fontSize: 11, fontWeight: "900", letterSpacing: 0.8, marginBottom: 6 },
  databaseTitle: { color: DARK, fontSize: 16, fontWeight: "900", marginBottom: 4 },
  databaseText: { color: "#667085", fontSize: 12, fontWeight: "600" },
  databaseCode: { color: "#B89143", fontSize: 20, fontWeight: "900" },
  bottomSpacer: { height: 20 },
  bottomNav: { flexDirection: "row", alignItems: "center", justifyContent: "space-around", backgroundColor: "#fff", paddingTop: 10, paddingBottom: 14, borderTopWidth: 1, borderTopColor: "#EEE", elevation: 10 },
  navItem: { alignItems: "center", flex: 1 },
  navIcon: { fontSize: 11, marginBottom: 3, opacity: 0.45, fontWeight: "900" },
  navIconActive: { fontSize: 11, marginBottom: 3, fontWeight: "900", color: BLUE },
  navLabel: { fontSize: 11, color: "#ADADAD", fontWeight: "500" },
  navLabelActive: { fontSize: 11, color: BLUE, fontWeight: "700" },
  fab: { width: 56, height: 56, borderRadius: 28, backgroundColor: BLUE, justifyContent: "center", alignItems: "center", marginBottom: 10, shadowColor: BLUE, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 8 },
  fabPlus: { color: "#fff", fontSize: 30, fontWeight: "300", lineHeight: 34 },
});
