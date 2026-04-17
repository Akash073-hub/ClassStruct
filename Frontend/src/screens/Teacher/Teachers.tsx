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
    name: "Prof. Sarah Jenkins",
    subject: "Data Structures & Algorithms",
    tags: ["GX DEPT", "2X TAX DEP"],
    avatar: "SJ",
    avatarBg: "#FFD6B0",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    subject: "Quantum Physics",
    tags: ["PHYSICS", "RESEARCHER"],
    avatar: "MC",
    avatarBg: "#B0D6FF",
  },
  {
    id: "3",
    name: "Prof. Elena Rodriguez",
    subject: "Modern Art History",
    tags: ["FINE ARTS", "CURATOR"],
    avatar: "ER",
    avatarBg: "#FFB0C8",
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    subject: "Systems Architecture",
    tags: ["QUANTUM PHYSICS", "LEAD EXPERT"],
    avatar: "JW",
    avatarBg: "#C8B0FF",
  },
  {
    id: "5",
    name: "Prof. Linda Park",
    subject: "Corporate Finance",
    tags: ["BUSINESS", "CFA"],
    avatar: "LP",
    avatarBg: "#B0FFD6",
  },
  {
    id: "6",
    name: "Dr. Robert Smith",
    subject: "Full-stack Development",
    tags: ["CT DEPT", "INDUSTRY PRO"],
    avatar: "RS",
    avatarBg: "#FFE0B0",
  },
];

const BLUE = "#2F52E0";
const DARK = "#1A1A2E";

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
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Teacher Directory</Text>
        <Text style={styles.subtitle}>
          Find and connect with your academic mentors.
        </Text>

        <View style={styles.searchBox}>
          <Text style={styles.searchEmoji}>🔍</Text>
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
          <Text style={styles.spotlightLabel}>STAFF SPOTLIGHT</Text>
          <Text style={styles.spotlightTitle}>Need help choosing a course?</Text>
          <Text style={styles.spotlightBody}>
            Schedule a 1-on-1 consultation with our department heads to align
            your academic path with your career goals.
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
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIconActive}>👨‍🏫</Text>
          <Text style={styles.navLabelActive}>Teachers</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Classes")}
        >
          <Text style={styles.navIcon}>📅</Text>
          <Text style={styles.navLabel}>Schedule</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

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
  subtitle: { fontSize: 14, color: "#888", marginBottom: 20 },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
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
  searchEmoji: { fontSize: 15, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 14, color: DARK },

  teacherCard: {
    backgroundColor: "#fff",
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
  avatarText: { fontSize: 22, fontWeight: "800", color: "#333" },
  teacherName: {
    fontSize: 17,
    fontWeight: "800",
    color: DARK,
    marginBottom: 4,
  },
  teacherSubject: { fontSize: 13, color: BLUE, marginBottom: 12 },
  tagsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  tag: {
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  tagText: { fontSize: 11, fontWeight: "700", color: "#888" },
  profileBtn: {
    backgroundColor: BLUE,
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 40,
    width: "100%",
    alignItems: "center",
  },
  profileBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },

  spotlightCard: {
    backgroundColor: DARK,
    borderRadius: 24,
    padding: 24,
    marginTop: 8,
  },
  spotlightLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.5)",
    fontWeight: "700",
    letterSpacing: 1.5,
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
    color: "rgba(255,255,255,0.7)",
    lineHeight: 20,
    marginBottom: 20,
  },
  consultBtn: {
    backgroundColor: "#fff",
    borderRadius: 50,
    paddingVertical: 12,
    alignItems: "center",
  },
  consultBtnText: { color: DARK, fontSize: 15, fontWeight: "700" },

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