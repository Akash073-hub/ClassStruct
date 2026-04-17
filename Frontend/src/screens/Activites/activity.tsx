import React, { useState } from "react";
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
  TextInput, ScrollView, StatusBar,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../../App";

type Props = NativeStackScreenProps<AuthStackParamList, "Activities">;

const ACTIVITIES = [
  {
    id: "1", emoji: "🧠", bg: "#DDEEFF", title: "UX Design Workshop",
    meta: "🕑 Today, 2:00 PM • 2h", tag: "JOINABLE",
    tagColor: "#22C55E", tagBg: "#DCFCE7", participants: "+12",
    action: "Register", actionStyle: "filled",
  },
  {
    id: "2", emoji: "📖", bg: "#FFF3DC", title: "CS301 Group Study",
    meta: "📍 Main Library, Floor 3", tag: "FILLING UP",
    tagColor: "#F59E0B", tagBg: "#FEF3C7", participants: "+2",
    action: "Join", actionStyle: "filled",
  },
  {
    id: "3", emoji: "💻", bg: "#EDE9FF", title: "Python Hackathon",
    meta: "🕑 Sep 15, 9:00 AM • 8h", tag: "TOMORROW",
    tagColor: "#6366F1", tagBg: "#EDE9FF", participants: "+45",
    action: "Details", actionStyle: "outline",
  },
  {
    id: "4", emoji: "⚽", bg: "#D1FAE5", title: "Friendly Football",
    meta: "📍 Campus Sports Field", tag: "OPEN",
    tagColor: "#22C55E", tagBg: "#DCFCE7", participants: "+8",
    action: "Join", actionStyle: "filled",
  },
];

const BLUE = "#2F52E0";
const DARK = "#1A1A2E";

export default function ActivitiesScreen({ navigation }: Props) {
  const [search, setSearch] = useState("");
  const filtered = ACTIVITIES.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F6FB" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Activities</Text>
            <Text style={styles.subtitle}>Find your next event</Text>
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <Text style={styles.filterIcon}>☰</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search activities..."
            placeholderTextColor="#ADADAD"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Cards */}
        {filtered.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
              <Text style={styles.iconEmoji}>{item.emoji}</Text>
            </View>
            <View style={styles.cardBody}>
              <View style={styles.cardTop}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <View style={[styles.tag, { backgroundColor: item.tagBg }]}>
                  <Text style={[styles.tagText, { color: item.tagColor }]}>{item.tag}</Text>
                </View>
              </View>
              <Text style={styles.cardMeta}>{item.meta}</Text>
              <View style={styles.cardBottom}>
                <View style={styles.avatarRow}>
                  <View style={[styles.miniAvatar, { backgroundColor: "#ccc" }]} />
                  <View style={[styles.miniAvatar, { backgroundColor: "#aaa", marginLeft: -8 }]} />
                  <Text style={styles.participantCount}>{item.participants}</Text>
                </View>
                <TouchableOpacity style={[styles.actionBtn, item.actionStyle === "outline" ? styles.actionOutline : styles.actionFilled]}>
                  <Text style={[styles.actionText, item.actionStyle === "outline" ? styles.actionTextOutline : styles.actionTextFilled]}>
                    {item.action}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.goBack()}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIconActive}>📅</Text>
          <Text style={styles.navLabelActive}>Activities</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.fab}>
          <Text style={styles.fabPlus}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>👥</Text>
          <Text style={styles.navLabel}>Network</Text>
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
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  title: { fontSize: 28, fontWeight: "800", color: DARK },
  subtitle: { fontSize: 14, color: "#ADADAD", marginTop: 2 },
  filterBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 3 },
  filterIcon: { fontSize: 18 },
  searchBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 50, paddingHorizontal: 18, paddingVertical: 12, marginBottom: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  searchIcon: { fontSize: 16, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: DARK },
  card: { flexDirection: "row", backgroundColor: "#fff", borderRadius: 20, padding: 16, marginBottom: 14, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2, alignItems: "flex-start" },
  iconBox: { width: 54, height: 54, borderRadius: 16, justifyContent: "center", alignItems: "center", marginRight: 14, flexShrink: 0 },
  iconEmoji: { fontSize: 24 },
  cardBody: { flex: 1 },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 },
  cardTitle: { fontSize: 16, fontWeight: "800", color: DARK, flex: 1, marginRight: 8 },
  tag: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, flexShrink: 0 },
  tagText: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  cardMeta: { fontSize: 13, color: "#888", marginBottom: 4 },
  cardBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
  avatarRow: { flexDirection: "row", alignItems: "center" },
  miniAvatar: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: "#fff" },
  participantCount: { marginLeft: 6, fontSize: 13, color: "#888", fontWeight: "600" },
  actionBtn: { paddingHorizontal: 22, paddingVertical: 9, borderRadius: 50 },
  actionFilled: { backgroundColor: BLUE },
  actionOutline: { borderWidth: 1.5, borderColor: BLUE },
  actionText: { fontSize: 14, fontWeight: "700" },
  actionTextFilled: { color: "#fff" },
  actionTextOutline: { color: BLUE },
  bottomNav: { flexDirection: "row", alignItems: "center", justifyContent: "space-around", backgroundColor: "#fff", paddingTop: 10, paddingBottom: 14, borderTopWidth: 1, borderTopColor: "#EEE", elevation: 10 },
  navItem: { alignItems: "center", flex: 1 },
  navIcon: { fontSize: 20, marginBottom: 2, opacity: 0.45 },
  navIconActive: { fontSize: 20, marginBottom: 2 },
  navLabel: { fontSize: 11, color: "#ADADAD", fontWeight: "500" },
  navLabelActive: { fontSize: 11, color: BLUE, fontWeight: "700" },
  fab: { width: 56, height: 56, borderRadius: 28, backgroundColor: BLUE, justifyContent: "center", alignItems: "center", marginBottom: 10, shadowColor: BLUE, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 8 },
  fabPlus: { color: "#fff", fontSize: 30, fontWeight: "300", lineHeight: 34 },
});
