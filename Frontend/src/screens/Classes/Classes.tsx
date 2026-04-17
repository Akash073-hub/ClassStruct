import React, { useState } from "react";
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

type Props = NativeStackScreenProps<AuthStackParamList, "Classes">;

type Day = { day: string; date: number };
const DAYS: Day[] = [
  { day: "MON", date: 12 },
  { day: "TUE", date: 13 },
  { day: "WED", date: 14 },
  { day: "THU", date: 15 },
];

type ClassItem = {
  id: string;
  status: string;
  statusColor: string;
  statusText: string;
  time: string;
  title: string;
  room: string;
  teacher: string;
};

const CLASSES: ClassItem[] = [
  {
    id: "1",
    status: "ONGOING",
    statusColor: "#E8F0FF",
    statusText: "#2F52E0",
    time: "09:00 - 10:30",
    title: "Probability",
    room: "F block, 002",
    teacher: "Dr. Sasikala",
  },
  {
    id: "2",
    status: "NEXT UP",
    statusColor: "#E8F0FF",
    statusText: "#2F52E0",
    time: "11:00 - 12:30",
    title: "Agile",
    room: "F block, 002",
    teacher: "Dr. Manish Kumar",
  },
  {
    id: "3",
    status: "AFTERNOON",
    statusColor: "#F0F0F0",
    statusText: "#888",
    time: "13:30 - 15:00",
    title: "AI",
    room: "C block, 501",
    teacher: "Dr. Baishali ",
  },
  {
    id: "4",
    status: "FINAL SESSION",
    statusColor: "#F0F0F0",
    statusText: "#888",
    time: "15:30 - 17:00",
    title: "UHV",
    room: "Seminar Room 3",
    teacher: "Prof. Sharath",
  },
];

export default function ClassesScreen({ navigation }: Props) {
  const [selectedDay, setSelectedDay] = useState(0);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F6FB" />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🎓</Text>
          </View>
          <Text style={styles.logoText}>StudentLink</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>My Class Schedule</Text>
        <Text style={styles.subtitle}>You have {CLASSES.length} classes today, Alex.</Text>

        <View style={styles.dayRow}>
          {DAYS.map((d, i) => (
            <TouchableOpacity
              key={`${d.day}-${d.date}`}
              style={[styles.dayBox, selectedDay === i && styles.dayBoxActive]}
              onPress={() => setSelectedDay(i)}
            >
              <Text style={[styles.dayLabel, selectedDay === i && styles.dayLabelActive]}>
                {d.day}
              </Text>
              <Text style={[styles.dayDate, selectedDay === i && styles.dayDateActive]}>
                {d.date}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.timeline}>
          {CLASSES.map((cls, index) => (
            <View key={cls.id} style={styles.timelineRow}>
              <View style={styles.timelineDotCol}>
                <View style={[styles.dot, index === 0 && styles.dotActive]} />
                {index < CLASSES.length - 1 && <View style={styles.line} />}
              </View>

              <View style={styles.classCard}>
                <View style={styles.cardTop}>
                  <View style={[styles.badge, { backgroundColor: cls.statusColor }]}>
                    <Text style={[styles.badgeText, { color: cls.statusText }]}>{cls.status}</Text>
                  </View>
                  <Text style={styles.timeText}>{cls.time}</Text>
                </View>

                <Text style={styles.classTitle}>{cls.title}</Text>

                <View style={styles.cardMeta}>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaIcon}>📍</Text>
                    <Text style={styles.metaText}>{cls.room}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaIcon}>👤</Text>
                    <Text style={styles.metaText}>{cls.teacher}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.lunchRow}>
          <Text style={styles.lunchIcon}>🍴</Text>
          <Text style={styles.lunchText}>Lunch Break & Campus Lounge (1 Hour)</Text>
        </View>

        <View style={styles.weeklyCard}>
          <Text style={styles.weeklyTitle}>Weekly Load</Text>
          <Text style={styles.weeklySubtitle}>
            You've completed 12 hours of lectures this week. 8 hours remaining.
          </Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: "60%" }]} />
          </View>
        </View>

        <View style={styles.studyCard}>
          <View>
            <Text style={styles.studyTitle}>Study Group</Text>
            <Text style={styles.studySubtitle}>Design Review at 17:30</Text>
          </View>
          <View style={styles.avatarStack}>
            <View style={[styles.avatarCircle, { backgroundColor: "#FFB3A7", zIndex: 3, left: 0 }]}>
              <Text style={styles.avatarText}>A</Text>
            </View>
            <View style={[styles.avatarCircle, { backgroundColor: "#A7C4FF", zIndex: 2, left: 20 }]}>
              <Text style={styles.avatarText}>B</Text>
            </View>
            <View style={[styles.avatarCircle, { backgroundColor: "#B2F0B2", zIndex: 1, left: 40 }]}>
              <Text style={styles.avatarText}>+3</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Teachers")}>
          <Text style={styles.navIcon}>👨‍🏫</Text>
          <Text style={styles.navLabel}>Teachers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIconActive}>📅</Text>
          <Text style={styles.navLabelActive}>Schedule</Text>
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
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 120 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#F4F6FB",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  logoCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFD6B0",
    justifyContent: "center",
    alignItems: "center",
  },
  logoEmoji: { fontSize: 16 },
  logoText: { fontSize: 18, fontWeight: "800", color: BLUE },
  searchIcon: { fontSize: 18 },

  title: { fontSize: 26, fontWeight: "800", color: DARK, marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#888", marginBottom: 24 },

  dayRow: { flexDirection: "row", gap: 10, marginBottom: 28 },
  dayBox: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dayBoxActive: { backgroundColor: BLUE },
  dayLabel: { fontSize: 11, fontWeight: "700", color: "#ADADAD", marginBottom: 4 },
  dayLabelActive: { color: "rgba(255,255,255,0.8)" },
  dayDate: { fontSize: 18, fontWeight: "800", color: DARK },
  dayDateActive: { color: "#fff" },

  timeline: { marginBottom: 8 },
  timelineRow: { flexDirection: "row", marginBottom: 16 },
  timelineDotCol: { alignItems: "center", marginRight: 14, paddingTop: 14, width: 12 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#D0D0D0", marginBottom: 4 },
  dotActive: { backgroundColor: BLUE },
  line: { flex: 1, width: 2, backgroundColor: "#E8E8E8", marginTop: 2 },

  classCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: "800" },
  timeText: { fontSize: 12, color: "#888", fontWeight: "700" },
  classTitle: { fontSize: 16, fontWeight: "800", color: DARK, marginBottom: 10 },
  cardMeta: { gap: 8 },
  metaItem: { flexDirection: "row", alignItems: "center" },
  metaIcon: { marginRight: 8 },
  metaText: { fontSize: 13, color: "#666", fontWeight: "600" },

  lunchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 16,
    padding: 14,
    marginTop: 8,
    marginBottom: 14,
  },
  lunchIcon: { fontSize: 18, marginRight: 10 },
  lunchText: { fontSize: 13, color: "#777", fontWeight: "700" },

  weeklyCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  weeklyTitle: { fontSize: 16, fontWeight: "800", color: DARK, marginBottom: 6 },
  weeklySubtitle: { fontSize: 13, color: "#888", marginBottom: 12, lineHeight: 18 },
  progressBarBg: { height: 10, borderRadius: 10, backgroundColor: "#E8E8E8", overflow: "hidden" },
  progressBarFill: { height: 10, borderRadius: 10, backgroundColor: BLUE },

  studyCard: {
    backgroundColor: DARK,
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  studyTitle: { fontSize: 16, fontWeight: "800", color: "#fff", marginBottom: 4 },
  studySubtitle: { fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: "600" },

  avatarStack: { width: 80, height: 34, position: "relative" },
  avatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: DARK,
  },
  avatarText: { fontSize: 12, fontWeight: "800", color: "#111" },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingTop: 10,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    elevation: 20,
  },
  navItem: { alignItems: "center", flex: 1 },
  navIcon: { fontSize: 20, marginBottom: 2, opacity: 0.4 },
  navIconActive: { fontSize: 20, marginBottom: 2 },
  navLabel: { fontSize: 11, color: "#ADADAD", fontWeight: "500" },
  navLabelActive: { fontSize: 11, color: BLUE, fontWeight: "700" },
});
