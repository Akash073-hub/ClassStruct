import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from "react-native";

export default function PreLogin({ navigation }: { navigation?: any }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [
    {
      category: "BCA APP",
      title: "All student records, one place",
      description: "Academics, activities, and achievements in one secure view.",
    },
    {
      category: "PROFILE",
      title: "Track your progress instantly",
      description: "See your results, participation, and history anytime.",
    },
    {
      category: "MENTORSHIP",
      title: "Learn with seniors",
      description: "Connect juniors and seniors for guidance and collaboration.",
    },
  ];

  const handleNext = () => {
    if (activeIndex < slides.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else {
      navigation?.navigate?.("Login");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.imageSection}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
          }}
          style={styles.backgroundImage}
        />
        <View style={styles.imageTint} />
        <View style={styles.heroContent}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{slides[activeIndex].category}</Text>
          </View>
          <Text style={styles.heroTitle}>ClassStruct</Text>
        </View>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>{slides[activeIndex].title}</Text>
          <Text style={styles.description}>{slides[activeIndex].description}</Text>
          <View style={styles.dots}>
            {slides.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setActiveIndex(index)}
              >
                <View
                  style={[
                    styles.dot,
                    activeIndex === index && styles.activeDot,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextText}>
              {activeIndex === slides.length - 1 ? "Get Started" : "Continue"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8BBDB3",
  },

  imageSection: {
    height: "56%",
    width: "100%",
    position: "relative",
  },

  backgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },

  imageTint: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: "rgba(30,34,53,0.28)",
  },

  heroContent: {
    position: "absolute",
    top: 22,
    left: 20,
    right: 20,
    gap: 12,
  },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.32)",
  },

  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
  },

  heroTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.4,
  },

  cardContainer: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 16,
    marginTop: -34,
  },

  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 8,
  },

  title: {
    fontSize: 29,
    fontWeight: "800",
    marginBottom: 10,
    color: "#1e2235",
    textAlign: "center",
    lineHeight: 36,
  },

  description: {
    fontSize: 15,
    color: "#5f6672",
    lineHeight: 22,
    marginBottom: 26,
    textAlign: "center",
    paddingHorizontal: 6,
  },

  dots: {
    flexDirection: "row",
    marginBottom: 24,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 5,
  },

  activeDot: {
    width: 26,
    backgroundColor: "#ff7a7a",
  },

  nextBtn: {
    backgroundColor: "#1e2235",
    paddingVertical: 15,
    paddingHorizontal: 48,
    borderRadius: 999,
    minWidth: 180,
    alignItems: "center",
  },

  nextText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
