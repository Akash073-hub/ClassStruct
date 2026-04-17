import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../../App";

type Props = NativeStackScreenProps<AuthStackParamList, "Semester">;

const SEMESTERS = [
  { id: "1", label: "1st Sem", icon: "🎓", iconBg: "#E8EDFF" },
  { id: "2", label: "2nd Sem", icon: "📐", iconBg: "#F0EAFF" },
  { id: "3", label: "3rd Sem", icon: "🖥️", iconBg: "#2F52E0" },
  { id: "4", label: "4th Sem", icon: "🗄️", iconBg: "#E6F9F0" },
  { id: "5", label: "5th Sem", icon: "🌐", iconBg: "#FFF3E8" },
  { id: "6", label: "6th Sem", icon: "☁️", iconBg: "#FFE8E8" },
  { id: "7", label: "7th Sem", icon: "🔬", iconBg: "#FFFBE6" },
  { id: "8", label: "8th Sem", icon: "🏅", iconBg: "#E6FFF8" },
];

const BLUE = "#2F52E0";
const DARK = "#1A1A2E";

export default function SemesterScreen({ navigation }: Props) {
  const [selected, setSelected] = useState("3");

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F6FB" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Semester</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Section label */}
        <Text style={styles.sectionLabel}>AVAILABLE SEMESTERS</Text>
        <Text style={styles.sectionSubtitle}>
          Choose your current semester to view{"\n"}specific resources and classmates.
        </Text>

        {/* Grid */}
        <View style={styles.grid}>
          {SEMESTERS.map((sem) => {
            const isSelected = selected === sem.id;
            return (
              <TouchableOpacity
                key={sem.id}
                style={[styles.card, isSelected && styles.cardSelected]}
                activeOpacity={0.8}
                onPress={() => setSelected(sem.id)}
              >
                {isSelected && (
                  <View style={styles.checkBadge}>
                    <Text style={styles.checkMark}>✓</Text>
                  </View>
                )}
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: isSelected ? "rgba(255,255,255,0.25)" : sem.iconBg },
                  ]}
                >
                  <Text style={styles.iconEmoji}>{sem.icon}</Text>
                </View>
                <Text style={[styles.semLabel, isSelected && styles.semLabelSelected]}>
                  Semester
                </Text>
                <Text style={[styles.semName, isSelected && styles.semNameSelected]}>
                  {sem.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Footer help */}
        <View style={styles.helpRow}>
          <Text style={styles.helpText}>Need help finding your curriculum?</Text>
          <TouchableOpacity>
            <Text style={styles.helpLink}>Contact Administration</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.goBack()}>
          <Text style={styles.navIconActive}>🏠</Text>
          <Text style={styles.navLabelActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>👥</Text>
          <Text style={styles.navLabel}>Network</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.fab}>
          <Text style={styles.fabPlus}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🔔</Text>
          <Text style={styles.navLabel}>Updates</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
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

  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#ADADAD",
    letterSpacing: 1.5,
    marginBottom: 6,
    marginTop: 4,
  },
  sectionSubtitle: { fontSize: 14, color: "#555", lineHeight: 21, marginBottom: 24 },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    justifyContent: "space-between",
    marginBottom: 28,
  },
  card: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    position: "relative",
  },
  cardSelected: { backgroundColor: BLUE },
  checkBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  checkMark: { color: "#fff", fontSize: 12, fontWeight: "800" },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  iconEmoji: { fontSize: 24 },
  semLabel: { fontSize: 12, color: "#ADADAD", fontWeight: "500", marginBottom: 2 },
  semLabelSelected: { color: "rgba(255,255,255,0.75)" },
  semName: { fontSize: 18, fontWeight: "800", color: DARK },
  semNameSelected: { color: "#fff" },

  helpRow: { alignItems: "center", paddingVertical: 10 },
  helpText: { fontSize: 13, color: "#ADADAD", marginBottom: 4 },
  helpLink: { fontSize: 14, color: BLUE, fontWeight: "700" },

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
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: BLUE,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  fabPlus: { color: "#fff", fontSize: 30, fontWeight: "300", lineHeight: 34 },
});