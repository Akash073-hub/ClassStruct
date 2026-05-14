import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  ActivityIndicator,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../../App";
import RVLogo from "../../components/RVLogo";
import GlassBackdrop from "../../components/GlassBackdrop";
import { authApi, type DatabaseUser } from "../../services/authApi";

type Props = NativeStackScreenProps<AuthStackParamList, "Teachers">;

const DARK = "#F7FAFF";

export default function TeachersScreen({ navigation }: Props) {
  const [searchText, setSearchText] = useState("");
  const [teachers, setTeachers] = useState<DatabaseUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<DatabaseUser | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    authApi
      .listDatabaseUsers()
      .then((users) => {
        if (!active) {
          return;
        }

        setTeachers(
          users
            .filter((user) => user.role.toLowerCase() === "teacher")
            .sort((a, b) => a.displayName.localeCompare(b.displayName))
        );
      })
      .catch((fetchError) => {
        if (!active) {
          return;
        }

        setTeachers([]);
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Could not load teachers from H2 database."
        );
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) {
      return teachers;
    }

    return teachers.filter((teacher) =>
      [teacher.displayName, teacher.username, teacher.email, teacher.phone ?? ""].some((field) =>
        field.toLowerCase().includes(query)
      )
    );
  }, [searchText, teachers]);

  const initialsFor = (name: string) =>
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");

  const avatarPalette = [
    styles.avatarBgOne,
    styles.avatarBgTwo,
    styles.avatarBgThree,
    styles.avatarBgFour,
    styles.avatarBgFive,
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <GlassBackdrop />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <RVLogo compact />
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        <Text style={styles.title}>Teacher Directory</Text>
        <Text style={styles.subtitle}>
          Live faculty list from H2 database.
        </Text>

        <View style={styles.searchBox}>
          <Text style={styles.searchEmoji}>SR</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, username, email, or phone"
            placeholderTextColor="#ADADAD"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {loading ? (
          <View style={styles.stateCard}>
            <ActivityIndicator color="#EAF6FF" />
            <Text style={styles.stateText}>Loading teachers from H2...</Text>
          </View>
        ) : error ? (
          <View style={styles.stateCard}>
            <Text style={styles.stateText}>{error}</Text>
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.stateCard}>
            <Text style={styles.stateText}>No teachers found for this search.</Text>
          </View>
        ) : (
          filtered.map((teacher, index) => (
            <TouchableOpacity
              key={`${teacher.id}-${teacher.username}`}
              style={styles.teacherCard}
              activeOpacity={0.88}
              onPress={() => setSelectedTeacher(teacher)}
            >
              <View style={[styles.avatar, avatarPalette[index % avatarPalette.length]]}>
                <Text style={styles.avatarText}>{initialsFor(teacher.displayName)}</Text>
              </View>
              <Text style={styles.teacherName}>{teacher.displayName}</Text>
              <Text style={styles.teacherSubject}>{teacher.email}</Text>
              <View style={styles.tagsRow}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>@{teacher.username}</Text>
                </View>
                {teacher.phone ? (
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{teacher.phone}</Text>
                  </View>
                ) : (
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>No phone in H2</Text>
                  </View>
                )}
              </View>
              <View style={styles.profileBtn}>
                <Text style={styles.profileBtnText}>Tap for H2 Overview</Text>
              </View>
            </TouchableOpacity>
          ))
        )}

        <View style={styles.spotlightCard}>
          <Text style={styles.spotlightLabel}>TEACHER PART</Text>
          <Text style={styles.spotlightTitle}>
            {teachers.length} teacher record{teachers.length === 1 ? "" : "s"} in H2
          </Text>
          <Text style={styles.spotlightBody}>
            Keep teacher email and phone updated so students can find and contact faculty quickly.
          </Text>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <Modal
        visible={!!selectedTeacher}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedTeacher(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Teacher H2 Overview</Text>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setSelectedTeacher(null)}
              >
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalName}>{selectedTeacher?.displayName ?? ""}</Text>
            <Text style={styles.modalRole}>TEACHER</Text>

            <View style={styles.modalInfoBlock}>
              <Text style={styles.modalInfoLine}>ID: {selectedTeacher?.id ?? "-"}</Text>
              <Text style={styles.modalInfoLine}>
                Username: {selectedTeacher?.username ?? "-"}
              </Text>
              <Text style={styles.modalInfoLine}>
                Email: {selectedTeacher?.email ?? "-"}
              </Text>
              <Text style={styles.modalInfoLine}>
                Phone: {selectedTeacher?.phone ?? "-"}
              </Text>
            </View>

            <Text style={styles.modalRecommendationTitle}>What to do</Text>
            <Text style={styles.modalRecommendationText}>
              For teachers, prioritize verified contact details and role accuracy in H2 so students
              can reliably discover faculty and reach out for guidance.
            </Text>
          </View>
        </View>
      </Modal>

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
  headerRight: { width: 38 },

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
    marginBottom: 20,
  },
  searchEmoji: { fontSize: 11, marginRight: 10, color: "#fff", fontWeight: "800" },
  searchInput: { flex: 1, fontSize: 14, color: "#fff" },

  stateCard: {
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  stateText: {
    color: "rgba(247,250,255,0.9)",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },

  teacherCard: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarBgOne: { backgroundColor: "#FFD6B0" },
  avatarBgTwo: { backgroundColor: "#B0D6FF" },
  avatarBgThree: { backgroundColor: "#FFB0C8" },
  avatarBgFour: { backgroundColor: "#C8B0FF" },
  avatarBgFive: { backgroundColor: "#FFE0B0" },
  avatarText: { fontSize: 22, fontWeight: "800", color: "#16314D" },
  teacherName: {
    fontSize: 17,
    fontWeight: "800",
    color: DARK,
    marginBottom: 4,
    textAlign: "center",
  },
  teacherSubject: {
    fontSize: 13,
    color: "rgba(247,250,255,0.9)",
    marginBottom: 12,
    textAlign: "center",
  },
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
    letterSpacing: 0.4,
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
  },

  bottomSpacer: { height: 100 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(3,10,24,0.68)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: "rgba(19,38,68,0.95)",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    padding: 18,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  modalTitle: { fontSize: 15, fontWeight: "800", color: "#DDEEFF" },
  modalCloseBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  modalCloseText: { color: "#F6FAFF", fontSize: 12, fontWeight: "700" },
  modalName: { color: "#fff", fontSize: 22, fontWeight: "800", marginBottom: 3 },
  modalRole: { color: "rgba(214,234,255,0.8)", fontSize: 12, fontWeight: "700", marginBottom: 14 },
  modalInfoBlock: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 12,
    marginBottom: 12,
    gap: 4,
  },
  modalInfoLine: { color: "#E9F4FF", fontSize: 13, fontWeight: "600" },
  modalRecommendationTitle: {
    color: "#DDEEFF",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 4,
  },
  modalRecommendationText: {
    color: "rgba(235,246,255,0.88)",
    fontSize: 13,
    lineHeight: 18,
  },

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
  navIcon: {
    fontSize: 11,
    marginBottom: 3,
    opacity: 0.8,
    fontWeight: "900",
    color: "rgba(255,255,255,0.86)",
  },
  navIconActive: { fontSize: 11, marginBottom: 3, fontWeight: "900", color: "#EAF6FF" },
  navLabel: { fontSize: 11, color: "rgba(255,255,255,0.82)", fontWeight: "500" },
  navLabelActive: { fontSize: 11, color: "#EAF6FF", fontWeight: "700" },
});
