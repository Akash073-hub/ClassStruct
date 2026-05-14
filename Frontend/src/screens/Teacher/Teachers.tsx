import React, { useMemo, useState } from "react";
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
import RVLogo from "../../components/RVLogo";
import GlassBackdrop from "../../components/GlassBackdrop";

type Props = NativeStackScreenProps<AuthStackParamList, "Teachers">;

type Teacher = {
  id: string;
  name: string;
  subject: string;
  tags: string[];
  avatar: string;
  avatarBg: string;
};

const TEACHERS: Teacher[] = [
  {
    id: "1",
    name: "Prof. Sasikala J",
    subject: "Probability Theory, Mathematics",
    tags: ["SK", "2 HOURS"],
    avatar: "SK",
    avatarBg: "#FFD6B0",
  },
  {
    id: "2",
    name: "Prof. K Sarath",
    subject: "Fundamentals of AI",
    tags: ["KS", "4 HOURS"],
    avatar: "KS",
    avatarBg: "#B0D6FF",
  },
  {
    id: "3",
    name: "Prof. Mohammed Danish",
    subject: "Mobile Application Development",
    tags: ["MD", "4 HOURS"],
    avatar: "MD",
    avatarBg: "#FFB0C8",
  },
  {
    id: "4",
    name: "Dr. Manish Kumar",
    subject: "Agile Software Engineering",
    tags: ["MK", "4 HOURS"],
    avatar: "MK",
    avatarBg: "#C8B0FF",
  },
  {
    id: "5",
    name: "Prof. Sharath BR",
    subject: "Universal Human Values, Labs",
    tags: ["SH", "2 HOURS"],
    avatar: "SH",
    avatarBg: "#FFE0B0",
  },
];

const BLUE = "#86D2FF";
const DARK = "#F7FAFF";

export default function TeachersScreen({ navigation }: Props) {
  const [searchText, setSearchText] = useState("");

  const filtered = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return TEACHERS;
    return TEACHERS.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.subject.toLowerCase().includes(query)
    );
  }, [searchText]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <GlassBackdrop />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <RVLogo compact />
        <TouchableOpacity>
          <Text style={styles.searchIcon}>SR</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Teacher Directory</Text>
        <Text style={styles.subtitle}>
          Find and connect with your academic mentors.
        </Text>

        <View style={styles.searchBox}>
          <Text style={styles.searchEmoji}>SR</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, subject, or department"
            placeholderTextColor="#ADADAD"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {filtered.map((teacher) => (
          <View key={teacher.id} style={styles.teacherCard}>
            <View style={[styles.avatar, { backgroundColor: teacher.avatarBg }]}>
              <Text style={styles.avatarText}>{teacher.avatar}</Text>
            </View>
            <Text style={styles.teacherName}>{teacher.name}</Text>
            <Text style={styles.teacherSubject}>{teacher.subject}</Text>
            <View style={styles.tagsRow}>
              {teacher.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.profileBtn}>
              <Text style={styles.profileBtnText}>View Profile</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.spotlightCard}>
          <Text style={styles.spotlightLabel}>BCA 4TH SEM FACULTY</Text>
          <Text style={styles.spotlightTitle}>Timetable teachers updated</Text>
          <Text style={styles.spotlightBody}>
            These faculty names match the timetable: SK, KS, MK, MD, and SH.
          </Text>
          <TouchableOpacity style={styles.consultBtn}>
            <Text style={styles.consultBtnText}>Book Consultation</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.navIcon}>HM</Text>
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIconActive}>TR</Text>
          <Text style={styles.navLabelActive}>Teachers</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Classes")}
        >
          <Text style={styles.navIcon}>SC</Text>
          <Text style={styles.navLabel}>Schedule</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0F1A2E" },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 120 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "transparent",
  },
  backBtn: { width: 38, height: 38, justifyContent: "center", alignItems: "center" },
  backArrow: { fontSize: 32, color: DARK, lineHeight: 36, fontWeight: "300" },
  searchIcon: { fontSize: 11, color: "#fff", fontWeight: "800" },

  title: { fontSize: 26, fontWeight: "800", color: DARK, marginBottom: 4 },
  subtitle: { fontSize: 14, color: "rgba(247,250,255,0.82)", marginBottom: 20 },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    borderRadius: 50,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  searchEmoji: { fontSize: 11, marginRight: 10, color: "#fff", fontWeight: "800" },
  searchInput: { flex: 1, fontSize: 14, color: "#fff" },

  teacherCard: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: { fontSize: 22, fontWeight: "800", color: "#16314D" },
  teacherName: {
    fontSize: 17,
    fontWeight: "800",
    color: DARK,
    marginBottom: 4,
  },
  teacherSubject: { fontSize: 13, color: "rgba(247,250,255,0.9)", marginBottom: 12 },
  tagsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  tag: {
    backgroundColor: "rgba(255,255,255,0.22)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  tagText: { fontSize: 11, fontWeight: "700", color: "rgba(247,250,255,0.86)" },
  profileBtn: {
    backgroundColor: "rgba(134,210,255,0.38)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 40,
    width: "100%",
    alignItems: "center",
  },
  profileBtnText: { color: "#F7FAFF", fontSize: 15, fontWeight: "700" },

  spotlightCard: {
    backgroundColor: "rgba(16,28,44,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    borderRadius: 24,
    padding: 24,
    marginTop: 8,
  },
  spotlightLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.72)",
    fontWeight: "700",
    letterSpacing: 0,
    marginBottom: 10,
  },
  spotlightTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 10,
  },
  spotlightBody: {
    fontSize: 13,
    color: "rgba(255,255,255,0.86)",
    lineHeight: 20,
    marginBottom: 20,
  },
  consultBtn: {
    backgroundColor: "rgba(255,255,255,0.24)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
    borderRadius: 50,
    paddingVertical: 12,
    alignItems: "center",
  },
  consultBtnText: { color: "#F7FAFF", fontSize: 15, fontWeight: "700" },

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
