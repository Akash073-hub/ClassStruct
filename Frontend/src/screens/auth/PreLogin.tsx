import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";

export default function PreLogin({ navigation }: { navigation?: any }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [
    {
      category: "DATA MANAGEMENT",
      title: "Centralized Student Records",
      description:
        "Eliminate scattered data. Manage academic records, activities, and achievements in one secure system.",
    },
    {
      category: "ACADEMIC TRACKING",
      title: "Your Complete Profile",
      description:
        "Access your grades, participation history, and achievements instantly without manual searching.",
    },
    {
      category: "MENTORSHIP",
      title: "Connect & Collaborate",
      description:
        "Bridge the gap between juniors and seniors for better guidance, mentorship, and academic support.",
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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Image Section */}
      <View style={styles.imageSection}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
          }}
          style={styles.backgroundImage}
        />

        <View style={styles.highlightOverlay} />
        <View style={styles.gradientBlur} />
      </View>

      {/* Card */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View style={styles.categoryContainer}>
            <Text style={styles.category}>{slides[activeIndex].category}</Text>
            <View style={styles.categoryLine} />
          </View>

          <Text style={styles.title}>{slides[activeIndex].title}</Text>

          <Text style={styles.description}>
            {slides[activeIndex].description}
          </Text>

          {/* Dots */}
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

          {/* Next Button */}
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextText}>
              {activeIndex === slides.length - 1 ? "Get Started" : "Next →"}
            </Text>
          </TouchableOpacity>

         
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8BBDB3",
  },

  imageSection: {
    flex: 1,
    width: "100%",
    position: "relative",
  },

  backgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },

  highlightOverlay: {
    position: "absolute",
    top: "25%",
    left: "8%",
    right: "8%",
    height: 180,
    backgroundColor: "rgba(255,122,122,0.12)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,122,122,0.25)",
  },

  gradientBlur: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: "rgba(139,189,179,0.95)",
  },

  cardContainer: {
    alignItems: "center",
    paddingBottom: 40,
  },

  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 35,
    padding: 35,
    marginTop: -60,
    alignItems: "center",
  },

  categoryContainer: {
    alignItems: "center",
    marginBottom: 15,
  },

  category: {
    color: "#ff7a7a",
    fontWeight: "800",
    fontSize: 12,
    letterSpacing: 3,
  },

  categoryLine: {
    width: 40,
    height: 3,
    backgroundColor: "#ff7a7a",
    marginTop: 8,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    marginVertical: 10,
    color: "#1a1a2e",
    textAlign: "center",
  },

  description: {
    fontSize: 15,
    color: "#666",
    lineHeight: 24,
    marginBottom: 30,
    textAlign: "center",
  },

  dots: {
    flexDirection: "row",
    marginBottom: 30,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 6,
  },

  activeDot: {
    width: 28,
    backgroundColor: "#ff7a7a",
  },

  nextBtn: {
    backgroundColor: "#1e2235",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 15,
  },

  nextText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
  },

  skip: {
    color: "#888",
    fontSize: 14,
  },
});
