import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, StatusBar, Modal, ActivityIndicator } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../../App";
import RVLogo from "../../components/RVLogo";
import GlassBackdrop from "../../components/GlassBackdrop";
import { clearCurrentUser, getCurrentUser } from "../../services/authSession";
import { authApi, type DatabaseUser, type TeacherDashboard } from "../../services/authApi";

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "Home">;
  route?: { params?: { role?: "teacher" | "student"; name?: string; username?: string; email?: string } };
};

export default function HomeScreen({ navigation, route }: Props) {
  const activeUser = getCurrentUser() ?? route?.params ?? {};
  const { role = "student", name = "Student", username = "", email = "" } = activeUser;
  const userInfo = { role, name, username, email };
  const isTeacher = role === "teacher";
  const [searchText, setSearchText] = useState("");
  const [directoryUsers, setDirectoryUsers] = useState<DatabaseUser[]>([]);
  const [isDirectoryLoading, setIsDirectoryLoading] = useState(true);
  const [directoryError, setDirectoryError] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<DatabaseUser | null>(null);
  const [teacherDashboard, setTeacherDashboard] = useState<TeacherDashboard | null>(null);
  const [isTeacherDashboardLoading, setIsTeacherDashboardLoading] = useState(false);
  const [teacherDashboardError, setTeacherDashboardError] = useState("");
  const progress = 0.9;
  const currentWeek = 14;
  const totalWeeks = 16;
  const examsLeft = 5;

  useEffect(() => {
    let active = true;

    setIsDirectoryLoading(true);
    setDirectoryError("");

    authApi
      .listDatabaseUsers()
      .then((users) => {
        if (!active) {
          return;
        }

        const currentEmail = email.trim().toLowerCase();
        const currentUsername = username.trim().toLowerCase();

        setDirectoryUsers(
          users.filter((user) => {
            const emailMatch = currentEmail && user.email.toLowerCase() === currentEmail;
            const usernameMatch =
              currentUsername && user.username.toLowerCase() === currentUsername;
            return !(emailMatch || usernameMatch);
          })
        );
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        setDirectoryUsers([]);
        setDirectoryError(
          error instanceof Error
            ? error.message
            : "Could not load people from H2 database."
        );
      })
      .finally(() => {
        if (active) {
          setIsDirectoryLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [email, username]);

  useEffect(() => {
    if (!isTeacher || !email.trim()) {
      setTeacherDashboard(null);
      setTeacherDashboardError("");
      setIsTeacherDashboardLoading(false);
      return;
    }

    let active = true;
    setIsTeacherDashboardLoading(true);
    setTeacherDashboardError("");

    authApi
      .teacherDashboard(email.trim())
      .then((data) => {
        if (!active) {
          return;
        }
        setTeacherDashboard(data);
      })
      .catch((error) => {
        if (!active) {
          return;
        }
        setTeacherDashboard(null);
        setTeacherDashboardError(
          error instanceof Error ? error.message : "Could not load teacher dashboard."
        );
      })
      .finally(() => {
        if (active) {
          setIsTeacherDashboardLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [email, isTeacher]);

  const peopleResults = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) {
      return [];
    }

    return directoryUsers
      .filter((person) => {
        const searchableFields = [
          person.displayName,
          person.username,
          person.email,
          person.usn ?? "",
          person.role,
        ];
        return searchableFields.some((field) => field.toLowerCase().includes(query));
      })
      .slice(0, 8);
  }, [directoryUsers, searchText]);

  const teacherCount = useMemo(
    () => directoryUsers.filter((person) => person.role.toLowerCase() === "teacher").length,
    [directoryUsers]
  );

  const handleLogout = () => {
    clearCurrentUser();
    navigation.reset({ index: 0, routes: [{ name: "PreLogin" }] });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning,";
    if (hour < 17) return "Good afternoon,";
    return "Good evening,";
  };

  const initials = (name || username || "Student")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  const personInitials = (displayName: string) =>
    displayName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");

  const recommendationFor = (person: DatabaseUser) =>
    person.role.toLowerCase() === "teacher"
      ? "Teacher record: keep faculty contact details updated and use this for consultation or mentorship."
      : "Student record: verify USN and contact details before creating groups, project teams, or class announcements.";

  const menuItems = [
    {
      label: "Schedule",
      subtitle: "Timetable and exam days",
      code: "SC",
      accent: "#2F52E0",
      onPress: () => navigation.navigate("Classes"),
    },
    {
      label: "Teachers",
      subtitle: "BCA 4th sem faculty",
      code: "TR",
      accent: "#0F766E",
      onPress: () => navigation.navigate("Teachers"),
    },
    {
      label: "Updates",
      subtitle: "Exam reminders",
      code: "UP",
      accent: "#B45309",
      onPress: () => navigation.navigate("Updates"),
    },
    {
      label: "Profile",
      subtitle: "About information",
      code: "ME",
      accent: "#7C3AED",
      onPress: () => navigation.navigate("Profile", userInfo),
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <GlassBackdrop />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <RVLogo compact />
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <View style={styles.welcomeRow}>
              <Text style={styles.welcomeBold}>Welcome back, {name}</Text>
            </View>
            {!!email && <Text style={styles.emailText}>{email}</Text>}
          </View>
          <TouchableOpacity style={styles.avatar} onPress={handleLogout}>
            <View style={styles.avatarInner}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={styles.onlineDot} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBox}>
          <TextInput style={styles.searchInput} placeholder="Search people in H2 database" placeholderTextColor="#ADADAD" value={searchText} onChangeText={setSearchText} />
        </View>

        {searchText.trim().length > 0 && (
          <View style={styles.searchResultsCard}>
            <Text style={styles.searchResultsTitle}>
              People in H2 database • Teachers {teacherCount}
            </Text>

            {isDirectoryLoading ? (
              <Text style={styles.searchStatusText}>Loading people from database...</Text>
            ) : directoryError ? (
              <Text style={styles.searchStatusText}>{directoryError}</Text>
            ) : peopleResults.length > 0 ? (
              peopleResults.map((person, index) => {
                const roleKey = person.role.toLowerCase();
                return (
                  <TouchableOpacity
                    key={`${person.id}-${person.username}`}
                    activeOpacity={0.86}
                    onPress={() => setSelectedPerson(person)}
                    style={[
                      styles.personRow,
                      index === peopleResults.length - 1 && styles.personRowLast,
                    ]}
                  >
                    <View style={styles.personAvatar}>
                      <Text style={styles.personAvatarText}>
                        {personInitials(person.displayName)}
                      </Text>
                    </View>

                    <View style={styles.personMeta}>
                      <Text style={styles.personName}>{person.displayName}</Text>
                      <Text style={styles.personDetails}>
                        {person.usn ? `${person.usn} • ` : ""}
                        {person.email}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.rolePill,
                        roleKey === "teacher" && styles.rolePillTeacher,
                      ]}
                    >
                      <Text style={styles.rolePillText}>{roleKey.toUpperCase()}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text style={styles.searchStatusText}>No matching people found.</Text>
            )}
          </View>
        )}

        {isTeacher && (
          <View style={styles.teacherDashboardCard}>
            <View style={styles.teacherDashboardTop}>
              <Text style={styles.teacherDashboardLabel}>TEACHER DASHBOARD</Text>
              {!!teacherDashboard && (
                <Text style={styles.teacherDashboardCount}>
                  {teacherDashboard.totalClasses} classes
                </Text>
              )}
            </View>

            {isTeacherDashboardLoading ? (
              <View style={styles.teacherLoadingRow}>
                <ActivityIndicator color="#EAF6FF" />
                <Text style={styles.teacherLoadingText}>Loading your students and classes...</Text>
              </View>
            ) : teacherDashboardError ? (
              <Text style={styles.teacherErrorText}>{teacherDashboardError}</Text>
            ) : teacherDashboard ? (
              <>
                <Text style={styles.teacherDashboardSubtitle}>
                  {teacherDashboard.totalStudents} students in your class list
                </Text>

                <Text style={styles.teacherSectionTitle}>My Classes</Text>
                {teacherDashboard.classes.map((classItem) => (
                  <View key={`${classItem.code}-${classItem.title}`} style={styles.teacherClassRow}>
                    <View style={styles.teacherClassBadge}>
                      <Text style={styles.teacherClassBadgeText}>{classItem.code}</Text>
                    </View>
                    <View style={styles.teacherClassMeta}>
                      <Text style={styles.teacherClassTitle}>{classItem.title}</Text>
                      <Text style={styles.teacherClassDetails}>
                        {classItem.schedule} • {classItem.room}
                      </Text>
                    </View>
                  </View>
                ))}

                <Text style={styles.teacherSectionTitle}>My Students</Text>
                {teacherDashboard.students.slice(0, 10).map((student) => (
                  <View key={`${student.usn}-${student.username}`} style={styles.teacherStudentRow}>
                    <Text style={styles.teacherStudentName}>{student.name}</Text>
                    <Text style={styles.teacherStudentDetails}>
                      {student.usn ? `${student.usn} • ` : ""}
                      {student.email}
                    </Text>
                  </View>
                ))}
                {teacherDashboard.totalStudents > 10 && (
                  <Text style={styles.teacherMoreText}>
                    Showing 10 of {teacherDashboard.totalStudents} students
                  </Text>
                )}
              </>
            ) : (
              <Text style={styles.teacherErrorText}>No teacher data found for this login.</Text>
            )}
          </View>
        )}

        <View style={styles.progressCard}>
          <View style={styles.progressTop}>
            <View>
              <Text style={styles.progressLabel}>CURRENT PROGRESS</Text>
              <Text style={styles.progressTitle}>BCA 4th Sem Exam Week</Text>
            </View>
            <View style={styles.weekBadge}>
              <Text style={styles.weekText}>WEEK {currentWeek}/{totalWeeks}</Text>
            </View>
          </View>
          <Text style={styles.progressPercent}>{Math.round(progress * 100)}%</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.examsLeft}>
            {examsLeft} exams: MAD 15, IKS 23, Minor/Elective 25-27
          </Text>
        </View>

        <View style={styles.quickHeader}>
          <Text style={styles.quickTitle}>Quick Access</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Semester")}>
            <Text style={styles.quickLink}>Semester</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.menuCard}
              activeOpacity={0.78}
              onPress={item.onPress}
            >
              <View style={[styles.codeBox, { backgroundColor: item.accent }]}>
                <Text style={styles.codeText}>{item.code}</Text>
              </View>
              <Text style={styles.cardTitle}>{item.label}</Text>
              <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.databaseCard}
          activeOpacity={0.82}
          onPress={() => navigation.navigate("Activities")}
        >
          <View>
            <Text style={styles.databaseLabel}>Backend Ready</Text>
            <Text style={styles.databaseTitle}>H2 database has seeded users</Text>
            <Text style={styles.databaseText}>Check /api/database/overview for live records.</Text>
          </View>
          <Text style={styles.databaseCode}>DB</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <Modal
        visible={!!selectedPerson}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedPerson(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>H2 User Overview</Text>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setSelectedPerson(null)}
              >
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalName}>{selectedPerson?.displayName ?? ""}</Text>
            <Text style={styles.modalRole}>
              {(selectedPerson?.role ?? "").toUpperCase()}
            </Text>

            <View style={styles.modalInfoBlock}>
              <Text style={styles.modalInfoLine}>ID: {selectedPerson?.id ?? "-"}</Text>
              <Text style={styles.modalInfoLine}>
                Username: {selectedPerson?.username ?? "-"}
              </Text>
              <Text style={styles.modalInfoLine}>Email: {selectedPerson?.email ?? "-"}</Text>
              <Text style={styles.modalInfoLine}>USN: {selectedPerson?.usn ?? "-"}</Text>
              <Text style={styles.modalInfoLine}>Phone: {selectedPerson?.phone ?? "-"}</Text>
            </View>

            <Text style={styles.modalRecommendationTitle}>What to do</Text>
            <Text style={styles.modalRecommendationText}>
              {selectedPerson ? recommendationFor(selectedPerson) : ""}
            </Text>
          </View>
        </View>
      </Modal>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIconActive}>HM</Text>
          <Text style={styles.navLabelActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Activities")}>
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
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Profile", userInfo)}>
          <Text style={styles.navIcon}>ME</Text>
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const BLUE = "#86D2FF";
const DARK = "#F6FAFF";

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0F1A2E" },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  greeting: { fontSize: 15, color: "rgba(239,246,255,0.82)", fontWeight: "500", marginTop: 12 },
  welcomeRow: { flexDirection: "row", alignItems: "center" },
  welcomeBold: { fontSize: 22, fontWeight: "800", color: DARK },
  emailText: { fontSize: 13, color: "rgba(239,246,255,0.75)", fontWeight: "600", marginTop: 3 },
  avatar: { position: "relative" },
  avatarInner: { width: 48, height: 48, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.2)", borderWidth: 1, borderColor: "rgba(255,255,255,0.35)", justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 14, color: "#fff", fontWeight: "900" },
  onlineDot: { position: "absolute", bottom: 2, right: 2, width: 11, height: 11, borderRadius: 6, backgroundColor: "#22C55E", borderWidth: 2, borderColor: "#0F1A2E" },
  searchBox: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.16)", borderRadius: 18, paddingHorizontal: 18, paddingVertical: 12, marginBottom: 22, borderWidth: 1, borderColor: "rgba(255,255,255,0.3)" },
  searchInput: { flex: 1, fontSize: 15, color: "#fff" },
  searchResultsCard: {
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: -8,
    marginBottom: 22,
  },
  searchResultsTitle: { fontSize: 13, fontWeight: "800", color: DARK, marginBottom: 8 },
  searchStatusText: { fontSize: 13, color: "rgba(255,255,255,0.82)", fontWeight: "600" },
  personRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.16)",
  },
  personRowLast: {
    borderBottomWidth: 0,
  },
  personAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.24)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.34)",
    marginRight: 10,
  },
  personAvatarText: { color: "#fff", fontSize: 11, fontWeight: "900" },
  personMeta: { flex: 1 },
  personName: { color: "#fff", fontSize: 14, fontWeight: "700" },
  personDetails: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 12,
    marginTop: 1,
    fontWeight: "500",
  },
  rolePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "rgba(34,197,94,0.2)",
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.38)",
  },
  rolePillTeacher: {
    backgroundColor: "rgba(59,130,246,0.2)",
    borderColor: "rgba(59,130,246,0.36)",
  },
  rolePillText: { fontSize: 10, color: "#EAF6FF", fontWeight: "800" },
  teacherDashboardCard: {
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 22,
    padding: 18,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
  },
  teacherDashboardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  teacherDashboardLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.86)",
    letterSpacing: 1,
    fontWeight: "700",
  },
  teacherDashboardCount: {
    fontSize: 12,
    color: "#EAF6FF",
    fontWeight: "800",
  },
  teacherDashboardSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.86)",
    marginBottom: 12,
    fontWeight: "600",
  },
  teacherLoadingRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 4 },
  teacherLoadingText: { color: "rgba(255,255,255,0.86)", fontSize: 13, fontWeight: "600" },
  teacherErrorText: { color: "rgba(255,220,220,0.95)", fontSize: 13, fontWeight: "700" },
  teacherSectionTitle: {
    color: "#F6FAFF",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 8,
    marginBottom: 8,
  },
  teacherClassRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 8,
  },
  teacherClassBadge: {
    minWidth: 52,
    borderRadius: 11,
    backgroundColor: "rgba(96,165,250,0.25)",
    borderWidth: 1,
    borderColor: "rgba(191,219,254,0.5)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 10,
    alignItems: "center",
  },
  teacherClassBadgeText: {
    color: "#EAF6FF",
    fontSize: 10,
    fontWeight: "900",
  },
  teacherClassMeta: { flex: 1 },
  teacherClassTitle: { color: "#fff", fontSize: 14, fontWeight: "700", marginBottom: 2 },
  teacherClassDetails: { color: "rgba(255,255,255,0.82)", fontSize: 12, fontWeight: "500" },
  teacherStudentRow: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.14)",
    paddingVertical: 8,
  },
  teacherStudentName: { color: "#fff", fontSize: 13, fontWeight: "700" },
  teacherStudentDetails: { color: "rgba(255,255,255,0.78)", fontSize: 12, marginTop: 2 },
  teacherMoreText: {
    marginTop: 8,
    color: "rgba(234,246,255,0.88)",
    fontSize: 12,
    fontWeight: "700",
  },
  progressCard: { backgroundColor: "rgba(255,255,255,0.16)", borderRadius: 22, padding: 22, marginBottom: 22, borderWidth: 1, borderColor: "rgba(255,255,255,0.3)" },
  progressTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 },
  progressLabel: { fontSize: 11, color: "rgba(255,255,255,0.85)", letterSpacing: 1, fontWeight: "600", marginBottom: 4 },
  progressTitle: { fontSize: 20, fontWeight: "800", color: "#fff" },
  weekBadge: { backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  weekText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  progressPercent: { fontSize: 42, fontWeight: "800", color: "#fff", marginBottom: 12 },
  progressBarBg: { height: 8, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 4, marginBottom: 10 },
  progressBarFill: { height: 8, backgroundColor: "#EAF6FF", borderRadius: 4 },
  examsLeft: { color: "rgba(255,255,255,0.86)", fontSize: 13, fontWeight: "500", textAlign: "right" },
  quickHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  quickTitle: { fontSize: 18, fontWeight: "900", color: DARK },
  quickLink: { fontSize: 13, fontWeight: "800", color: "#EAF6FF" },
  menuGrid: { flexDirection: "row", flexWrap: "wrap", gap: 14, marginBottom: 18 },
  menuCard: { width: "47.8%", backgroundColor: "rgba(255,255,255,0.16)", borderRadius: 18, padding: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.28)" },
  codeBox: { width: 42, height: 42, borderRadius: 12, justifyContent: "center", alignItems: "center", marginBottom: 14 },
  codeText: { color: "#fff", fontSize: 13, fontWeight: "900" },
  cardTitle: { fontSize: 17, fontWeight: "800", color: DARK, marginBottom: 5 },
  cardSubtitle: { fontSize: 12, color: "rgba(255,255,255,0.86)", fontWeight: "600", lineHeight: 17 },
  databaseCard: { backgroundColor: "rgba(255,255,255,0.18)", borderRadius: 18, padding: 18, borderWidth: 1, borderColor: "rgba(215,181,109,0.6)", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  databaseLabel: { color: "#B89143", fontSize: 11, fontWeight: "900", letterSpacing: 0.8, marginBottom: 6 },
  databaseTitle: { color: DARK, fontSize: 16, fontWeight: "900", marginBottom: 4 },
  databaseText: { color: "rgba(255,255,255,0.84)", fontSize: 12, fontWeight: "600" },
  databaseCode: { color: "#B89143", fontSize: 20, fontWeight: "900" },
  bottomSpacer: { height: 20 },
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
  modalRecommendationTitle: { color: "#DDEEFF", fontSize: 13, fontWeight: "800", marginBottom: 4 },
  modalRecommendationText: { color: "rgba(235,246,255,0.88)", fontSize: 13, lineHeight: 18 },
  bottomNav: { flexDirection: "row", alignItems: "center", justifyContent: "space-around", backgroundColor: "rgba(16,28,44,0.6)", paddingTop: 10, paddingBottom: 14, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.16)", elevation: 10 },
  navItem: { alignItems: "center", flex: 1 },
  navIcon: { fontSize: 11, marginBottom: 3, opacity: 0.75, fontWeight: "900", color: "rgba(255,255,255,0.82)" },
  navIconActive: { fontSize: 11, marginBottom: 3, fontWeight: "900", color: "#EAF6FF" },
  navLabel: { fontSize: 11, color: "rgba(255,255,255,0.78)", fontWeight: "500" },
  navLabelActive: { fontSize: 11, color: "#EAF6FF", fontWeight: "700" },
  fab: { width: 56, height: 56, borderRadius: 28, backgroundColor: "rgba(134,210,255,0.38)", borderWidth: 1, borderColor: "rgba(255,255,255,0.4)", justifyContent: "center", alignItems: "center", marginBottom: 10, shadowColor: BLUE, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 8 },
  fabPlus: { color: "#fff", fontSize: 30, fontWeight: "300", lineHeight: 34 },
});
