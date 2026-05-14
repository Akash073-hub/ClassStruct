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
import RVLogo from "../../components/RVLogo";
import GlassBackdrop from "../../components/GlassBackdrop";

type Props = NativeStackScreenProps<AuthStackParamList, "Classes">;

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

type ScheduleDay = {
  id: string;
  day: string;
  date: string;
  title: string;
  subtitle: string;
  noClasses?: boolean;
  classes: ClassItem[];
};

const regularBadge = {
  statusColor: "#E8F0FF",
  statusText: "#2F52E0",
};

const examBadge = {
  statusColor: "#FFF4E5",
  statusText: "#B45309",
};

const SCHEDULE_DAYS: ScheduleDay[] = [
  {
    id: "may-15",
    day: "FRI",
    date: "15",
    title: "MAD Paper",
    subtitle: "Mobile Application Development exam tomorrow. Regular classes are cancelled.",
    noClasses: true,
    classes: [
      {
        id: "mad-paper",
        status: "EXAM",
        ...examBadge,
        time: "Tomorrow, May 15",
        title: "Mobile Application Development",
        room: "As per exam seating",
        teacher: "Prof. Mohammed Danish / Prof. Sharath BR",
      },
    ],
  },
  {
    id: "may-23",
    day: "SAT",
    date: "23",
    title: "IKS Paper",
    subtitle: "Indian Knowledge Systems exam day. No regular classes.",
    noClasses: true,
    classes: [
      {
        id: "iks-paper",
        status: "EXAM",
        ...examBadge,
        time: "May 23",
        title: "IKS",
        room: "As per exam seating",
        teacher: "Exam cell",
      },
    ],
  },
  {
    id: "may-25",
    day: "MON",
    date: "25",
    title: "Minor 1",
    subtitle: "Minor 1 exam day. Classes will not be conducted.",
    noClasses: true,
    classes: [],
  },
  {
    id: "may-26",
    day: "TUE",
    date: "26",
    title: "University Elective 2",
    subtitle: "Elective exam day. Classes will not be conducted.",
    noClasses: true,
    classes: [],
  },
  {
    id: "may-27",
    day: "WED",
    date: "27",
    title: "Minor 2",
    subtitle: "Minor 2 exam day. Classes will not be conducted.",
    noClasses: true,
    classes: [],
  },
  {
    id: "mon",
    day: "MON",
    date: "TT",
    title: "Monday Timetable",
    subtitle: "Classrooms C404/C405, Lab C504",
    classes: [
      {
        id: "mon-mad-lab",
        status: "LAB",
        ...regularBadge,
        time: "09:10 - 11:10",
        title: "MAD Lab",
        room: "C504",
        teacher: "Prof. Mohammed Danish / Prof. Sharath BR",
      },
      {
        id: "mon-math",
        status: "CORE",
        ...regularBadge,
        time: "11:10 - 12:10",
        title: "Mathematics",
        room: "C404",
        teacher: "Prof. Sasikala J",
      },
      {
        id: "mon-minor",
        status: "MINOR",
        statusColor: "#F3F4F6",
        statusText: "#4B5563",
        time: "02:50 - 03:50",
        title: "Minor",
        room: "Minor stream room",
        teacher: "Minor faculty",
      },
    ],
  },
  {
    id: "tue",
    day: "TUE",
    date: "TT",
    title: "Tuesday Timetable",
    subtitle: "Classrooms C404/C405, Lab C504",
    classes: [
      {
        id: "tue-agile-lab",
        status: "LAB",
        ...regularBadge,
        time: "09:10 - 11:10",
        title: "Agile Lab",
        room: "C404",
        teacher: "Dr. Manish Kumar / Prof. Sharath BR",
      },
      {
        id: "tue-ai",
        status: "CORE",
        ...regularBadge,
        time: "11:10 - 12:10",
        title: "Fundamentals of AI",
        room: "C404",
        teacher: "Prof. K Sarath",
      },
      {
        id: "tue-uhv",
        status: "SEC",
        statusColor: "#FFF4E5",
        statusText: "#B45309",
        time: "12:10 - 01:10",
        title: "Universal Human Values",
        room: "C404",
        teacher: "Prof. Sharath BR",
      },
      {
        id: "tue-minor",
        status: "MINOR",
        statusColor: "#F3F4F6",
        statusText: "#4B5563",
        time: "02:50 - 03:50",
        title: "Minor",
        room: "Minor stream room",
        teacher: "Minor faculty",
      },
    ],
  },
  {
    id: "wed",
    day: "WED",
    date: "TT",
    title: "Wednesday Timetable",
    subtitle: "Classrooms C404/C405, Lab C504",
    classes: [
      {
        id: "wed-agile",
        status: "CORE",
        ...regularBadge,
        time: "09:10 - 10:10",
        title: "Agile Software Engineering",
        room: "C405",
        teacher: "Dr. Manish Kumar",
      },
      {
        id: "wed-math",
        status: "CORE",
        ...regularBadge,
        time: "10:10 - 11:10",
        title: "Mathematics",
        room: "C405",
        teacher: "Prof. Sasikala J",
      },
      {
        id: "wed-ai-lab",
        status: "LAB",
        ...regularBadge,
        time: "11:10 - 01:10",
        title: "AI Lab",
        room: "C504",
        teacher: "Prof. K Sarath / Prof. Sharath BR",
      },
      {
        id: "wed-elective",
        status: "ELECTIVE",
        statusColor: "#F0E9FF",
        statusText: "#6D28D9",
        time: "01:50 - 03:50",
        title: "University Elective 2",
        room: "As allotted",
        teacher: "Elective faculty",
      },
    ],
  },
  {
    id: "thu",
    day: "THU",
    date: "TT",
    title: "Thursday Timetable",
    subtitle: "Classrooms C404/C405, Lab C504",
    classes: [
      {
        id: "thu-mad-1",
        status: "CORE",
        ...regularBadge,
        time: "09:10 - 10:10",
        title: "Mobile Application Development",
        room: "C404",
        teacher: "Prof. Mohammed Danish",
      },
      {
        id: "thu-mad-2",
        status: "CORE",
        ...regularBadge,
        time: "10:10 - 11:10",
        title: "Mobile Application Development",
        room: "C404",
        teacher: "Prof. Mohammed Danish",
      },
      {
        id: "thu-uhv",
        status: "SEC",
        statusColor: "#FFF4E5",
        statusText: "#B45309",
        time: "11:10 - 12:10",
        title: "Universal Human Values",
        room: "C404",
        teacher: "Prof. Sharath BR",
      },
      {
        id: "thu-minor",
        status: "MINOR",
        statusColor: "#F3F4F6",
        statusText: "#4B5563",
        time: "02:50 - 03:50",
        title: "Minor",
        room: "Minor stream room",
        teacher: "Minor faculty",
      },
    ],
  },
  {
    id: "fri",
    day: "FRI",
    date: "TT",
    title: "Friday Timetable",
    subtitle: "Classrooms C404/C405, Lab C504",
    classes: [
      {
        id: "fri-ai",
        status: "CORE",
        ...regularBadge,
        time: "09:10 - 10:10",
        title: "Fundamentals of AI",
        room: "C405",
        teacher: "Prof. K Sarath",
      },
      {
        id: "fri-agile",
        status: "CORE",
        ...regularBadge,
        time: "10:10 - 11:10",
        title: "Agile Software Engineering",
        room: "C405",
        teacher: "Dr. Manish Kumar",
      },
      {
        id: "fri-mentor",
        status: "MENTOR",
        statusColor: "#EAFBF2",
        statusText: "#047857",
        time: "11:10 - 12:10",
        title: "Mentor Hour",
        room: "C404",
        teacher: "Class mentor",
      },
    ],
  },
];

export default function ClassesScreen({ navigation }: Props) {
  const [selectedDay, setSelectedDay] = useState(0);
  const selectedSchedule = SCHEDULE_DAYS[selectedDay];
  const hasClasses = selectedSchedule.classes.length > 0;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <GlassBackdrop />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <RVLogo compact />
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>BCA 4th Sem Schedule</Text>
        <Text style={styles.subtitle}>Classrooms C404/C405 • Lab C504</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dayRow}
        >
          {SCHEDULE_DAYS.map((d, i) => (
            <TouchableOpacity
              key={d.id}
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
        </ScrollView>

        <View style={[styles.noticeCard, selectedSchedule.noClasses && styles.examNotice]}>
          <Text style={styles.noticeTitle}>{selectedSchedule.title}</Text>
          <Text style={styles.noticeText}>{selectedSchedule.subtitle}</Text>
          {selectedSchedule.noClasses && (
            <Text style={styles.noClassText}>No regular classes on this date.</Text>
          )}
        </View>

        <View style={styles.timeline}>
          {hasClasses ? (
            selectedSchedule.classes.map((cls, index) => (
              <View key={cls.id} style={styles.timelineRow}>
                <View style={styles.timelineDotCol}>
                  <View style={[styles.dot, index === 0 && styles.dotActive]} />
                  {index < selectedSchedule.classes.length - 1 && <View style={styles.line} />}
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
                      <Text style={styles.metaIcon}>Room</Text>
                      <Text style={styles.metaText}>{cls.room}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Text style={styles.metaIcon}>By</Text>
                      <Text style={styles.metaText}>{cls.teacher}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Classes removed from schedule</Text>
              <Text style={styles.emptyText}>
                Use this slot for exam preparation and seating updates.
              </Text>
            </View>
          )}
        </View>

        {!selectedSchedule.noClasses && (
          <View style={styles.lunchRow}>
            <Text style={styles.lunchText}>Break: 01:10 - 01:50 PM</Text>
          </View>
        )}

        <View style={styles.weeklyCard}>
          <Text style={styles.weeklyTitle}>Exam Week Plan</Text>
          <Text style={styles.weeklySubtitle}>
            May 15 MAD, May 23 IKS, May 25 Minor 1, May 26 Elective, May 27 Minor 2.
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.navIcon}>HM</Text>
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Teachers")}>
          <Text style={styles.navIcon}>TR</Text>
          <Text style={styles.navLabel}>Teachers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIconActive}>SC</Text>
          <Text style={styles.navLabelActive}>Schedule</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const BLUE = "#86D2FF";
const DARK = "#F7FAFF";

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0F1A2E" },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 120 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "transparent",
  },
  backBtn: { width: 38, height: 38, justifyContent: "center", alignItems: "center" },
  backArrow: { fontSize: 32, color: DARK, lineHeight: 36, fontWeight: "300" },
  headerSpacer: { width: 38 },

  title: { fontSize: 26, fontWeight: "800", color: DARK, marginBottom: 4 },
  subtitle: { fontSize: 14, color: "rgba(247,250,255,0.84)", marginBottom: 20 },

  dayRow: { gap: 10, paddingBottom: 20 },
  dayBox: {
    width: 66,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
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

  noticeCard: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
  },
  examNotice: { backgroundColor: "#FFF8ED", borderColor: "#F4C57B" },
  noticeTitle: { fontSize: 18, fontWeight: "800", color: DARK, marginBottom: 6 },
  noticeText: { fontSize: 13, color: "rgba(247,250,255,0.85)", lineHeight: 19 },
  noClassText: { fontSize: 13, color: "#B45309", fontWeight: "800", marginTop: 10 },

  timeline: { marginBottom: 8 },
  timelineRow: { flexDirection: "row", marginBottom: 16 },
  timelineDotCol: { alignItems: "center", marginRight: 14, paddingTop: 14, width: 12 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#D0D0D0", marginBottom: 4 },
  dotActive: { backgroundColor: BLUE },
  line: { flex: 1, width: 2, backgroundColor: "#E8E8E8", marginTop: 2 },

  classCard: {
    flex: 1,
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
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    gap: 10,
  },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: "800" },
  timeText: { fontSize: 12, color: "rgba(247,250,255,0.82)", fontWeight: "700", flexShrink: 1 },
  classTitle: { fontSize: 16, fontWeight: "800", color: DARK, marginBottom: 10 },
  cardMeta: { gap: 8 },
  metaItem: { flexDirection: "row", alignItems: "center" },
  metaIcon: { marginRight: 8, width: 38, fontSize: 11, fontWeight: "900", color: "#98A2B3" },
  metaText: { fontSize: 13, color: "rgba(247,250,255,0.86)", fontWeight: "600", flex: 1 },

  emptyCard: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
  },
  emptyTitle: { fontSize: 16, fontWeight: "800", color: DARK, marginBottom: 6 },
  emptyText: { fontSize: 13, color: "rgba(247,250,255,0.86)", lineHeight: 19 },

  lunchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 16,
    padding: 14,
    marginTop: 8,
    marginBottom: 14,
  },
  lunchText: { fontSize: 13, color: "rgba(247,250,255,0.88)", fontWeight: "700" },

  weeklyCard: {
    backgroundColor: "rgba(16,28,44,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },
  weeklyTitle: { fontSize: 16, fontWeight: "800", color: "#fff", marginBottom: 6 },
  weeklySubtitle: { fontSize: 13, color: "rgba(255,255,255,0.78)", lineHeight: 19 },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "rgba(16,28,44,0.6)",
    paddingTop: 10,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.16)",
    elevation: 20,
  },
  navItem: { alignItems: "center", flex: 1 },
  navIcon: { fontSize: 11, marginBottom: 3, opacity: 0.8, fontWeight: "900", color: "rgba(255,255,255,0.86)" },
  navIconActive: { fontSize: 11, marginBottom: 3, fontWeight: "900", color: "#EAF6FF" },
  navLabel: { fontSize: 11, color: "rgba(255,255,255,0.82)", fontWeight: "500" },
  navLabelActive: { fontSize: 11, color: "#EAF6FF", fontWeight: "700" },
});
