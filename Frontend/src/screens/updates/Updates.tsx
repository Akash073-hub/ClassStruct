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
    title: "Tomorrow: MAD Paper",
    message: "May 15 is Mobile Application Development. Regular classes are cancelled for the exam.",
    time: "May 15",
    tone: "#FFF4E5",
    code: "MD",
  },
  {
    id: "2",
    title: "IKS Paper",
    message: "Indian Knowledge Systems exam is scheduled on May 23.",
    time: "May 23",
    tone: "#E8EDFF",
    code: "IK",
  },
  {
    id: "3",
    title: "No Classes: Minor 1",
    message: "May 25 is Minor 1 exam day. Classes will not be conducted.",
    time: "May 25",
    tone: "#EAFBF2",
    code: "M1",
  },
  {
    id: "4",
    title: "No Classes: University Elective 2",
    message: "May 26 is the University Elective 2 exam day.",
    time: "May 26",
    tone: "#F0E9FF",
    code: "UE",
  },
  {
    id: "5",
    title: "No Classes: Minor 2",
    message: "May 27 is Minor 2 exam day. Regular classes are removed from the schedule.",
    time: "May 27",
    tone: "#FFE8E8",
    code: "M2",
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
              <Text style={styles.iconText}>{item.code}</Text>
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
          <Text style={styles.navIcon}>HM</Text>
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Activities")}>
          <Text style={styles.navIcon}>AC</Text>
          <Text style={styles.navLabel}>Activities</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIconActive}>UP</Text>
          <Text style={styles.navLabelActive}>Updates</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Profile")}>
          <Text style={styles.navIcon}>ME</Text>
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
  iconText: { fontSize: 12, fontWeight: "900", color: DARK },
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
  navIcon: { fontSize: 11, marginBottom: 3, opacity: 0.45, fontWeight: "900" },
  navIconActive: { fontSize: 11, marginBottom: 3, fontWeight: "900", color: BLUE },
  navLabel: { fontSize: 11, color: "#ADADAD", fontWeight: "500" },
  navLabelActive: { fontSize: 11, color: BLUE, fontWeight: "700" },
});
