import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../../App";

type Props = NativeStackScreenProps<AuthStackParamList, "Updates">;

const BLUE = "#2F52E0";
const DARK = "#1A1A2E";

const UPDATES = [
  {
    id: "1",
    title: "Internal Exams Timetable Released",
    message: "Check your semester section for complete exam schedule and room details.",
    time: "2h ago",
    tone: "#E8EDFF",
    emoji: "📝",
  },
  {
    id: "2",
    title: "Assignment Deadline Extended",
    message: "Data Analytics with Python assignment submission moved to Friday.",
    time: "5h ago",
    tone: "#EAFBF2",
    emoji: "⏳",
  },
  {
    id: "3",
    title: "Workshop: App Dev Sprint",
    message: "Registration is now open. Limited seats available for this weekend.",
    time: "1d ago",
    tone: "#FFF4E8",
    emoji: "📱",
  },
];

export default function UpdatesScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F6FB" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Updates</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {UPDATES.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={[styles.iconBox, { backgroundColor: item.tone }]}>
              <Text style={styles.iconText}>{item.emoji}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardMessage}>{item.message}</Text>
              <Text style={styles.cardTime}>{item.time}</Text>
            </View>
          </View>
        ))}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Activities")}>
          <Text style={styles.navIcon}>📅</Text>
          <Text style={styles.navLabel}>Activities</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIconActive}>🔔</Text>
          <Text style={styles.navLabelActive}>Updates</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Profile")}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 14,
    marginBottom: 14,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  iconText: { fontSize: 22 },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: "800", color: DARK, marginBottom: 4 },
  cardMessage: { fontSize: 13, color: "#666", lineHeight: 18, marginBottom: 8 },
  cardTime: { fontSize: 12, color: "#9A9A9A", fontWeight: "600" },
  bottomSpacer: { height: 20 },
  bottomNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingTop: 10,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    elevation: 10,
  },
  navItem: { alignItems: "center", flex: 1 },
  navIcon: { fontSize: 20, marginBottom: 2, opacity: 0.45 },
  navIconActive: { fontSize: 20, marginBottom: 2 },
  navLabel: { fontSize: 11, color: "#ADADAD", fontWeight: "500" },
  navLabelActive: { fontSize: 11, color: BLUE, fontWeight: "700" },
});
