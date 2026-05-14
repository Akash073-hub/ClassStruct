import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, StatusBar } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../../App";

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
  const examsLeft = 3;

  const handleLogout = () => navigation.reset({ index: 0, routes: [{ name: "PreLogin" }] });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning,";
    if (hour < 17) return "Good afternoon,";
    return "Good evening,";
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F6FB" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <View style={styles.welcomeRow}>
              <Text style={styles.welcomeBold}>Welcome back, {name}! </Text>
              <Text style={styles.wave}>👋</Text>
            </View>
            {!!email && <Text style={styles.emailText}>{email}</Text>}
          </View>
          <TouchableOpacity style={styles.avatar} onPress={handleLogout}>
            <View style={styles.avatarInner}>
              <Text style={styles.avatarEmoji}>📒</Text>
            </View>
            <View style={styles.onlineDot} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput style={styles.searchInput} placeholder="Search students or semesters" placeholderTextColor="#ADADAD" value={searchText} onChangeText={setSearchText} />
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressTop}>
            <View>
              <Text style={styles.progressLabel}>CURRENT PROGRESS</Text>
              <Text style={styles.progressTitle}>Fall Semester 2024</Text>
            </View>
            <View style={styles.weekBadge}>
              <Text style={styles.weekText}>WEEK {currentWeek}/{totalWeeks}</Text>
            </View>
          </View>
          <Text style={styles.progressPercent}>{Math.round(progress * 100)}%</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.examsLeft}>{examsLeft} exams left</Text>
        </View>

        <View style={styles.cardsRow}>
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.75}
            onPress={() => navigation.navigate("Activities")}
          >
            <View style={styles.cardIconBox}>
              <Text style={styles.cardIcon}>📅</Text>
            </View>
            <Text style={styles.cardTitle}>Activities</Text>
            <Text style={styles.cardSubtitle}>Events & campus pulse</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.75}
            onPress={() => navigation.navigate("Semester")}
          >
            <View style={styles.cardIconBox}>
              <Text style={styles.cardIcon}>🎓</Text>
            </View>
            <Text style={styles.cardTitle}>Semesters</Text>
            <Text style={styles.cardSubtitle}>Records & courses</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardsRow}>
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.75}
            onPress={() => navigation.navigate("Teachers")}
          >
            <View style={[styles.cardIconBox, styles.cardIconBoxPurple]}>
              <Text style={styles.cardIcon}>👥</Text>
            </View>
            <Text style={styles.cardTitle}>Teachers</Text>
            <Text style={styles.cardSubtitle}>Mentors & support</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.75}
            onPress={() => navigation.navigate("Classes")}
          >
            <View style={[styles.cardIconBox, styles.cardIconBoxOrange]}>
              <Text style={styles.cardIcon}>📙</Text>
            </View>
            <Text style={styles.cardTitle}>Classes</Text>
            <Text style={styles.cardSubtitle}>Schedules & labs</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIconActive}>🏠</Text>
          <Text style={styles.navLabelActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Activities")}>
          <Text style={styles.navIcon}>👥</Text>
          <Text style={styles.navLabel}>Network</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.fab}>
          <Text style={styles.fabPlus}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Updates")}>
          <Text style={styles.navIcon}>🔔</Text>
          <Text style={styles.navLabel}>Updates</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Profile", userInfo)}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const BLUE = "#2F52E0";
const BLUE_LIGHT = "#E8EDFF";
const DARK = "#1A1A2E";

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4F6FB" },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  greeting: { fontSize: 15, color: "#666", fontWeight: "400" },
  welcomeRow: { flexDirection: "row", alignItems: "center" },
  welcomeBold: { fontSize: 22, fontWeight: "800", color: DARK },
  emailText: { fontSize: 13, color: "#667085", fontWeight: "600", marginTop: 3 },
  wave: { fontSize: 22 },
  avatar: { position: "relative" },
  avatarInner: { width: 46, height: 46, borderRadius: 23, backgroundColor: "#D6E4FF", justifyContent: "center", alignItems: "center" },
  avatarEmoji: { fontSize: 22 },
  onlineDot: { position: "absolute", bottom: 2, right: 2, width: 11, height: 11, borderRadius: 6, backgroundColor: "#22C55E", borderWidth: 2, borderColor: "#F4F6FB" },
  searchBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 50, paddingHorizontal: 18, paddingVertical: 12, marginBottom: 22, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  searchIcon: { fontSize: 16, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: DARK },
  progressCard: { backgroundColor: BLUE, borderRadius: 24, padding: 24, marginBottom: 28 },
  progressTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 },
  progressLabel: { fontSize: 11, color: "rgba(255,255,255,0.7)", letterSpacing: 1.5, fontWeight: "600", marginBottom: 4 },
  progressTitle: { fontSize: 20, fontWeight: "800", color: "#fff" },
  weekBadge: { backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  weekText: { color: "#fff", fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  progressPercent: { fontSize: 42, fontWeight: "800", color: "#fff", marginBottom: 12 },
  progressBarBg: { height: 8, backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 4, marginBottom: 10 },
  progressBarFill: { height: 8, backgroundColor: "#fff", borderRadius: 4 },
  examsLeft: { color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: "500", textAlign: "right" },
  cardsRow: { flexDirection: "row", gap: 16, marginBottom: 28 },
  card: { flex: 1, backgroundColor: "#fff", borderRadius: 24, paddingVertical: 32, paddingHorizontal: 16, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  cardIconBox: { width: 64, height: 64, borderRadius: 18, backgroundColor: BLUE_LIGHT, justifyContent: "center", alignItems: "center", marginBottom: 14 },
  cardIconBoxPurple: { backgroundColor: "#F0E9FF" },
  cardIconBoxOrange: { backgroundColor: "#FCEFE2" },
  cardIcon: { fontSize: 28 },
  cardTitle: { fontSize: 17, fontWeight: "800", color: DARK, marginBottom: 5 },
  cardSubtitle: { fontSize: 12, color: "#ADADAD", fontWeight: "500", textAlign: "center" },
  bottomSpacer: { height: 20 },
  bottomNav: { flexDirection: "row", alignItems: "center", justifyContent: "space-around", backgroundColor: "#fff", paddingTop: 10, paddingBottom: 14, borderTopWidth: 1, borderTopColor: "#EEE", elevation: 10 },
  navItem: { alignItems: "center", flex: 1 },
  navIcon: { fontSize: 20, marginBottom: 2, opacity: 0.45 },
  navIconActive: { fontSize: 20, marginBottom: 2 },
  navLabel: { fontSize: 11, color: "#ADADAD", fontWeight: "500" },
  navLabelActive: { fontSize: 11, color: BLUE, fontWeight: "700" },
  fab: { width: 56, height: 56, borderRadius: 28, backgroundColor: BLUE, justifyContent: "center", alignItems: "center", marginBottom: 10, shadowColor: BLUE, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 8 },
  fabPlus: { color: "#fff", fontSize: 30, fontWeight: "300", lineHeight: 34 },
});
