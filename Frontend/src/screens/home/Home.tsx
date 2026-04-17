import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../../App";

type HomeRouteProp = RouteProp<AuthStackParamList, "Home">;
type HomeNavProp = NativeStackNavigationProp<AuthStackParamList, "Home">;

type Props = {
  route: HomeRouteProp;
  navigation: HomeNavProp;
};

export default function HomeScreen({ route, navigation }: Props) {
  const { role, name } = route.params;
  const isTeacher = role === "teacher";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.welcome}>Welcome, {name}</Text>
        <Text style={styles.role}>{isTeacher ? "Teacher Panel" : "Student Panel"}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.itemCard}>
          <Text style={styles.itemTitle}>Attendance</Text>
          <Text style={styles.itemText}>
            {isTeacher ? "Update and review attendance records." : "Check your attendance status."}
          </Text>
        </View>

        <View style={styles.itemCard}>
          <Text style={styles.itemTitle}>Marks</Text>
          <Text style={styles.itemText}>
            {isTeacher ? "Edit internal and external marks." : "View your marks and progress."}
          </Text>
        </View>

        <View style={styles.itemCard}>
          <Text style={styles.itemTitle}>Mentorship</Text>
          <Text style={styles.itemText}>Connect juniors and seniors in one place.</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: "PreLogin" }],
          })
        }
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8BBDB3",
    padding: 16,
  },
  headerCard: {
    backgroundColor: "#1e2235",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  welcome: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
  },
  role: {
    color: "rgba(255,255,255,0.85)",
    marginTop: 6,
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    gap: 12,
  },
  itemCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },
  itemTitle: {
    color: "#1e2235",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  itemText: {
    color: "#5f6672",
    fontSize: 14,
    lineHeight: 20,
  },
  logoutBtn: {
    marginTop: "auto",
    backgroundColor: "#1e2235",
    borderRadius: 14,
    alignItems: "center",
    paddingVertical: 14,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
