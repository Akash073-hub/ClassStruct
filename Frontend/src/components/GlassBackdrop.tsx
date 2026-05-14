import React from "react";
import { StyleSheet, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";

export default function GlassBackdrop() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={["#0F1A2E", "#1F3C6D", "#3B6A8F", "#7FA7A2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.orbTop} />
      <View style={styles.orbRight} />
      <View style={styles.orbBottom} />
    </View>
  );
}

const styles = StyleSheet.create({
  orbTop: {
    position: "absolute",
    top: -80,
    left: -30,
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  orbRight: {
    position: "absolute",
    top: 170,
    right: -70,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(190,225,255,0.18)",
  },
  orbBottom: {
    position: "absolute",
    bottom: -110,
    left: 30,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(255,226,186,0.16)",
  },
});
