import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  compact?: boolean;
  light?: boolean;
};

export default function RVLogo({ compact = false, light = false }: Props) {
  return (
    <View style={styles.logoRow}>
      <View style={[styles.crest, light && styles.crestLight]}>
        <Text style={[styles.crestText, light && styles.textLight]}>RV</Text>
      </View>
      <View>
        <Text style={[styles.title, compact && styles.titleCompact, light && styles.textLight]}>
          RV UNIVERSITY
        </Text>
        {!compact && (
          <Text style={[styles.tagline, light && styles.taglineLight]}>
            Go, change the world
          </Text>
        )}
      </View>
    </View>
  );
}

const INK = "#19313A";
const GOLD = "#B89143";

const styles = StyleSheet.create({
  logoRow: { flexDirection: "row", alignItems: "center", gap: 9 },
  crest: {
    width: 38,
    height: 38,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: INK,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  crestLight: { borderColor: "#fff", backgroundColor: "rgba(255,255,255,0.14)" },
  crestText: { color: GOLD, fontWeight: "900", fontSize: 13, letterSpacing: 0 },
  title: { color: INK, fontWeight: "900", fontSize: 16, letterSpacing: 0 },
  titleCompact: { fontSize: 14 },
  tagline: { color: "#5D6970", fontSize: 10, fontWeight: "600", fontStyle: "italic" },
  taglineLight: { color: "rgba(255,255,255,0.86)" },
  textLight: { color: "#fff" },
});
