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
import GlassBackdrop from "../../components/GlassBackdrop";

type Props = NativeStackScreenProps<AuthStackParamList, "Semester">;

const SEMESTERS = [
  { id: "1", label: "1st Sem", icon: "S1", iconBg: "#E8EDFF" },
  { id: "2", label: "2nd Sem", icon: "S2", iconBg: "#F0EAFF" },
  { id: "3", label: "3rd Sem", icon: "S3", iconBg: "#2F52E0" },
  { id: "4", label: "4th Sem", icon: "S4", iconBg: "#E6F9F0" },
  { id: "5", label: "5th Sem", icon: "S5", iconBg: "#FFF3E8" },
  { id: "6", label: "6th Sem", icon: "S6", iconBg: "#FFE8E8" },
  { id: "7", label: "7th Sem", icon: "S7", iconBg: "#FFFBE6" },
  { id: "8", label: "8th Sem", icon: "S8", iconBg: "#E6FFF8" },
];

const SEMESTER_STATS: Record<string, { attendance: number; cgpa: number }> = {
  "1": { attendance: 86, cgpa: 7.8 },
  "2": { attendance: 89, cgpa: 8.1 },
  "3": { attendance: 91, cgpa: 8.4 },
  "4": { attendance: 88, cgpa: 8.2 },
  "5": { attendance: 90, cgpa: 8.5 },
  "6": { attendance: 87, cgpa: 8.3 },
  "7": { attendance: 92, cgpa: 8.7 },
  "8": { attendance: 93, cgpa: 8.9 },
};

const BLUE = "#86D2FF";
const DARK = "#F7FAFF";

export default function SemesterScreen({ navigation }: Props) {
  const [selected, setSelected] = useState("3");
  const selectedSemester = SEMESTERS.find((s) => s.id === selected);
  const stats = SEMESTER_STATS[selected];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <GlassBackdrop />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Semester</Text>
        <View style={styles.headerSpacer} />
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
                  <Text style={[styles.iconEmoji, isSelected && styles.iconEmojiSelected]}>
                    {sem.icon}
                  </Text>
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

        <View style={styles.overviewCard}>
          <Text style={styles.overviewTitle}>{selectedSemester?.label} Overview</Text>
          <View style={styles.metricsRow}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Attendance</Text>
              <Text style={styles.metricValue}>{stats.attendance}%</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>CGPA</Text>
              <Text style={styles.metricValue}>{stats.cgpa.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Footer help */}
        <View style={styles.helpRow}>
          <Text style={styles.helpText}>Need help finding your curriculum?</Text>
          <TouchableOpacity>
            <Text style={styles.helpLink}>Contact Administration</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.goBack()}>
          <Text style={styles.navIconActive}>HM</Text>
          <Text style={styles.navLabelActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
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
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Profile")}>
          <Text style={styles.navIcon}>ME</Text>
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
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

  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(247,250,255,0.82)",
    letterSpacing: 1.5,
    marginBottom: 6,
    marginTop: 4,
  },
  sectionSubtitle: { fontSize: 14, color: "rgba(247,250,255,0.84)", lineHeight: 21, marginBottom: 24 },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    justifyContent: "space-between",
    marginBottom: 28,
  },
  card: {
    width: "47%",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
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
  iconEmoji: { fontSize: 12, fontWeight: "900", color: DARK },
  iconEmojiSelected: { color: "#fff" },
  semLabel: { fontSize: 12, color: "rgba(247,250,255,0.8)", fontWeight: "500", marginBottom: 2 },
  semLabelSelected: { color: "rgba(255,255,255,0.75)" },
  semName: { fontSize: 18, fontWeight: "800", color: DARK },
  semNameSelected: { color: "#fff" },

  overviewCard: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  overviewTitle: { fontSize: 16, fontWeight: "800", color: DARK, marginBottom: 14 },
  metricsRow: { flexDirection: "row", gap: 12 },
  metricBox: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  metricLabel: { fontSize: 12, color: "rgba(247,250,255,0.82)", fontWeight: "600", marginBottom: 6 },
  metricValue: { fontSize: 24, color: BLUE, fontWeight: "800" },

  helpRow: { alignItems: "center", paddingVertical: 10 },
  helpText: { fontSize: 13, color: "rgba(247,250,255,0.78)", marginBottom: 4 },
  helpLink: { fontSize: 14, color: "#EAF6FF", fontWeight: "700" },
  bottomSpacer: { height: 20 },

  bottomNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "rgba(16,28,44,0.6)",
    paddingTop: 10,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.16)",
    elevation: 10,
  },
  navItem: { alignItems: "center", flex: 1 },
  navIcon: { fontSize: 11, marginBottom: 3, opacity: 0.8, fontWeight: "900", color: "rgba(255,255,255,0.86)" },
  navIconActive: { fontSize: 11, marginBottom: 3, fontWeight: "900", color: "#EAF6FF" },
  navLabel: { fontSize: 11, color: "rgba(255,255,255,0.82)", fontWeight: "500" },
  navLabelActive: { fontSize: 11, color: "#EAF6FF", fontWeight: "700" },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(134,210,255,0.38)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
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
