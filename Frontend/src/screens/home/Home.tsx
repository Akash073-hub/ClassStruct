import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, StatusBar } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../../App";
import RVLogo from "../../components/RVLogo";
import GlassBackdrop from "../../components/GlassBackdrop";
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
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <GlassBackdrop />
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
            <Text style={styles.databaseText}>Check /api/database/overview for live records.</Text>
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

const BLUE = "#86D2FF";
const DARK = "#F6FAFF";

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0F1A2E" },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  greeting: { fontSize: 15, color: "rgba(239,246,255,0.82)", fontWeight: "500", marginTop: 12 },
  welcomeRow: { flexDirection: "row", alignItems: "center" },
  welcomeBold: { fontSize: 22, fontWeight: "800", color: DARK },
  emailText: { fontSize: 13, color: "rgba(239,246,255,0.75)", fontWeight: "600", marginTop: 3 },
  avatar: { position: "relative" },
  avatarInner: { width: 48, height: 48, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.2)", borderWidth: 1, borderColor: "rgba(255,255,255,0.35)", justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 14, color: "#fff", fontWeight: "900" },
  onlineDot: { position: "absolute", bottom: 2, right: 2, width: 11, height: 11, borderRadius: 6, backgroundColor: "#22C55E", borderWidth: 2, borderColor: "#0F1A2E" },
  searchBox: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.16)", borderRadius: 18, paddingHorizontal: 18, paddingVertical: 12, marginBottom: 22, borderWidth: 1, borderColor: "rgba(255,255,255,0.3)" },
  searchInput: { flex: 1, fontSize: 15, color: "#fff" },
  progressCard: { backgroundColor: "rgba(255,255,255,0.16)", borderRadius: 22, padding: 22, marginBottom: 22, borderWidth: 1, borderColor: "rgba(255,255,255,0.3)" },
  progressTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 },
  progressLabel: { fontSize: 11, color: "rgba(255,255,255,0.85)", letterSpacing: 1, fontWeight: "600", marginBottom: 4 },
  progressTitle: { fontSize: 20, fontWeight: "800", color: "#fff" },
  weekBadge: { backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  weekText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  progressPercent: { fontSize: 42, fontWeight: "800", color: "#fff", marginBottom: 12 },
  progressBarBg: { height: 8, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 4, marginBottom: 10 },
  progressBarFill: { height: 8, backgroundColor: "#EAF6FF", borderRadius: 4 },
  examsLeft: { color: "rgba(255,255,255,0.86)", fontSize: 13, fontWeight: "500", textAlign: "right" },
  quickHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  quickTitle: { fontSize: 18, fontWeight: "900", color: DARK },
  quickLink: { fontSize: 13, fontWeight: "800", color: "#EAF6FF" },
  menuGrid: { flexDirection: "row", flexWrap: "wrap", gap: 14, marginBottom: 18 },
  menuCard: { width: "47.8%", backgroundColor: "rgba(255,255,255,0.16)", borderRadius: 18, padding: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.28)" },
  codeBox: { width: 42, height: 42, borderRadius: 12, justifyContent: "center", alignItems: "center", marginBottom: 14 },
  codeText: { color: "#fff", fontSize: 13, fontWeight: "900" },
  cardTitle: { fontSize: 17, fontWeight: "800", color: DARK, marginBottom: 5 },
  cardSubtitle: { fontSize: 12, color: "rgba(255,255,255,0.86)", fontWeight: "600", lineHeight: 17 },
  databaseCard: { backgroundColor: "rgba(255,255,255,0.18)", borderRadius: 18, padding: 18, borderWidth: 1, borderColor: "rgba(215,181,109,0.6)", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  databaseLabel: { color: "#B89143", fontSize: 11, fontWeight: "900", letterSpacing: 0.8, marginBottom: 6 },
  databaseTitle: { color: DARK, fontSize: 16, fontWeight: "900", marginBottom: 4 },
  databaseText: { color: "rgba(255,255,255,0.84)", fontSize: 12, fontWeight: "600" },
  databaseCode: { color: "#B89143", fontSize: 20, fontWeight: "900" },
  bottomSpacer: { height: 20 },
  bottomNav: { flexDirection: "row", alignItems: "center", justifyContent: "space-around", backgroundColor: "rgba(16,28,44,0.6)", paddingTop: 10, paddingBottom: 14, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.16)", elevation: 10 },
  navItem: { alignItems: "center", flex: 1 },
  navIcon: { fontSize: 11, marginBottom: 3, opacity: 0.75, fontWeight: "900", color: "rgba(255,255,255,0.82)" },
  navIconActive: { fontSize: 11, marginBottom: 3, fontWeight: "900", color: "#EAF6FF" },
  navLabel: { fontSize: 11, color: "rgba(255,255,255,0.78)", fontWeight: "500" },
  navLabelActive: { fontSize: 11, color: "#EAF6FF", fontWeight: "700" },
  fab: { width: 56, height: 56, borderRadius: 28, backgroundColor: "rgba(134,210,255,0.38)", borderWidth: 1, borderColor: "rgba(255,255,255,0.4)", justifyContent: "center", alignItems: "center", marginBottom: 10, shadowColor: BLUE, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 8 },
  fabPlus: { color: "#fff", fontSize: 30, fontWeight: "300", lineHeight: 34 },
});
