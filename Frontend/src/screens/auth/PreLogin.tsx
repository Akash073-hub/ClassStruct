import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
  FlatList,
  ViewToken,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// ─── Slide Data ───────────────────────────────────────────────
const SLIDES = [
  {
    id: '1',
    tag: 'ACADEMICS',
    emoji: '🎓',
    title: 'Track your\nCGPA in\nreal-time.',
    description:
      'See your semester-wise grades, subject scores, and overall CGPA — updated the moment results are published.',
    accent: '#3DBFAB',
    bg: '#0D1B2A',
    cardBg: '#122333',
    tagColor: '#3DBFAB',
    shape: 'circle',
  },
  {
    id: '2',
    tag: 'SCHEDULE',
    emoji: '🗓️',
    title: 'Never miss\na class\nagain.',
    description:
      'Your full timetable at a glance — room numbers, professor names, and live updates when classes are rescheduled.',
    accent: '#F4A836',
    bg: '#1A0F00',
    cardBg: '#251500',
    tagColor: '#F4A836',
    shape: 'triangle',
  },
  {
    id: '3',
    tag: 'ATTENDANCE',
    emoji: '✅',
    title: 'Stay above\nthe 75%\nthreshold.',
    description:
      "Live attendance percentage per subject with alerts when you're getting close to the danger zone.",
    accent: '#E85D75',
    bg: '#1A0A0E',
    cardBg: '#260D13',
    tagColor: '#E85D75',
    shape: 'diamond',
  },
  {
    id: '4',
    tag: 'FACULTY',
    emoji: '👨‍🏫',
    title: 'Know your\nprofessors\nbetter.',
    description:
      'Office hours, contact info, subjects taught — everything you need to reach the right person fast.',
    accent: '#7C6FFF',
    bg: '#0C0A1A',
    cardBg: '#130F28',
    tagColor: '#7C6FFF',
    shape: 'hexagon',
  },
  {
    id: '5',
    tag: 'MARKS',
    emoji: '📊',
    title: 'Marks &\nresults,\ninstantly.',
    description:
      'Teachers upload marks directly — internal assessments, practicals, and finals all in one place.',
    accent: '#3DBFAB',
    bg: '#071512',
    cardBg: '#0C1F1C',
    tagColor: '#3DBFAB',
    shape: 'circle',
  },
];

// ─── Decorative Shape Component ───────────────────────────────
const Shape = ({ type, color }: { type: string; color: string }) => {
  if (type === 'circle') {
    return (
      <View style={[shapeStyles.circle, { borderColor: color + '40' }]}>
        <View
          style={[shapeStyles.circleInner, { borderColor: color + '25' }]}
        />
      </View>
    );
  }
  if (type === 'diamond') {
    return (
      <View
        style={[
          shapeStyles.diamond,
          { borderColor: color + '40', transform: [{ rotate: '45deg' }] },
        ]}
      />
    );
  }
  if (type === 'hexagon') {
    return (
      <View style={shapeStyles.hexWrap}>
        {[0, 1, 2].map(i => (
          <View
            key={i}
            style={[
              shapeStyles.hexRing,
              {
                width: 140 + i * 50,
                height: 140 + i * 50,
                borderRadius: (140 + i * 50) / 2,
                borderColor: color + (i === 0 ? '50' : i === 1 ? '30' : '15'),
              },
            ]}
          />
        ))}
      </View>
    );
  }
  // triangle / default
  return (
    <View style={shapeStyles.hexWrap}>
      <View
        style={[
          shapeStyles.hexRing,
          {
            width: 160,
            height: 160,
            borderRadius: 80,
            borderColor: color + '35',
          },
        ]}
      />
      <View
        style={[
          shapeStyles.hexRing,
          {
            width: 220,
            height: 220,
            borderRadius: 110,
            borderColor: color + '20',
          },
        ]}
      />
    </View>
  );
};

// ─── Single Slide ─────────────────────────────────────────────
const Slide = ({
  item,
  index,
  scrollX,
}: {
  item: (typeof SLIDES)[0];
  index: number;
  scrollX: Animated.Value;
}) => {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const emojiScale = scrollX.interpolate({
    inputRange,
    outputRange: [0.6, 1, 0.6],
    extrapolate: 'clamp',
  });

  const textOpacity = scrollX.interpolate({
    inputRange,
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
  });

  const textSlide = scrollX.interpolate({
    inputRange,
    outputRange: [30, 0, -30],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.slide, { width, backgroundColor: item.bg }]}>
      {/* Background shape */}
      <View style={styles.shapeContainer}>
        <Shape type={item.shape} color={item.accent} />
      </View>

      {/* Emoji illustration */}
      <Animated.View
        style={[styles.emojiWrap, { transform: [{ scale: emojiScale }] }]}
      >
        <View
          style={[
            styles.emojiCard,
            { backgroundColor: item.cardBg, borderColor: item.accent + '30' },
          ]}
        >
          <Text style={styles.emoji}>{item.emoji}</Text>
        </View>
      </Animated.View>

      {/* Text block */}
      <Animated.View
        style={[
          styles.textBlock,
          { opacity: textOpacity, transform: [{ translateX: textSlide }] },
        ]}
      >
        <View style={[styles.tag, { backgroundColor: item.accent + '20' }]}>
          <Text style={[styles.tagText, { color: item.accent }]}>
            {item.tag}
          </Text>
        </View>

        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </Animated.View>
    </View>
  );
};

// ─── Main Onboarding Screen ───────────────────────────────────
type OnboardingScreenProps = {
  onGetStarted: () => void;
  onSkip?: () => void;
};

export default function OnboardingScreen({
  onGetStarted,
  onSkip,
}: OnboardingScreenProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const isLast = activeIndex === SLIDES.length - 1;
  const currentSlide = SLIDES[activeIndex];

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex(prev => {
        const next = prev < SLIDES.length - 1 ? prev + 1 : prev;
        flatListRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setActiveIndex(viewableItems[0].index ?? 0);
      }
    },
  ).current;

  const goNext = () => {
    if (isLast) {
      onGetStarted();
    } else {
      const next = activeIndex + 1;
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      setActiveIndex(next);
    }
  };

  // Animated button bg
  const btnBg = currentSlide.accent;

  return (
    <View style={[styles.container, { backgroundColor: currentSlide.bg }]}>
      <StatusBar barStyle="light-content" backgroundColor={currentSlide.bg} />

      {/* Skip */}
      <TouchableOpacity
        style={styles.skipBtn}
        onPress={onSkip ?? onGetStarted}
        activeOpacity={0.7}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Slides */}
      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item, index }) => (
          <Slide item={item} index={index} scrollX={scrollX} />
        )}
      />

      {/* Bottom controls */}
      <View style={[styles.bottomBar, { backgroundColor: currentSlide.bg }]}>
        {/* Dot indicators */}
        <View style={styles.dotsRow}>
          {SLIDES.map((s, i) => {
            const dotWidth = scrollX.interpolate({
              inputRange: [(i - 1) * width, i * width, (i + 1) * width],
              outputRange: [8, 24, 8],
              extrapolate: 'clamp',
            });
            const dotOpacity = scrollX.interpolate({
              inputRange: [(i - 1) * width, i * width, (i + 1) * width],
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={s.id}
                style={[
                  styles.dot,
                  {
                    width: dotWidth,
                    opacity: dotOpacity,
                    backgroundColor: currentSlide.accent,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Next / Get Started */}
        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: btnBg }]}
          onPress={goNext}
          activeOpacity={0.85}
        >
          <Text style={styles.nextBtnText}>
            {isLast ? 'Get Started →' : 'Next →'}
          </Text>
        </TouchableOpacity>

        {/* Already have account */}
        <TouchableOpacity
          onPress={onGetStarted}
          activeOpacity={0.7}
          style={styles.loginLinkRow}
        >
          <Text style={styles.loginLinkText}>
            Already have an account?{' '}
            <Text
              style={[styles.loginLinkBold, { color: currentSlide.accent }]}
            >
              Log In
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipBtn: {
    position: 'absolute',
    top: 52,
    right: 24,
    zIndex: 10,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  skipText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // Slide
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingBottom: 20,
    paddingHorizontal: 28,
  },
  shapeContainer: {
    position: 'absolute',
    top: height * 0.08,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },

  // Emoji card
  emojiWrap: {
    marginBottom: 40,
    marginTop: 40,
  },
  emojiCard: {
    width: 130,
    height: 130,
    borderRadius: 36,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  emoji: {
    fontSize: 60,
  },

  // Text block
  textBlock: {
    alignItems: 'flex-start',
    width: '100%',
    paddingBottom: 20,
  },
  tag: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 16,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 48,
    letterSpacing: -1.5,
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 23,
    fontWeight: '400',
    maxWidth: 320,
  },

  // Bottom
  bottomBar: {
    paddingHorizontal: 28,
    paddingBottom: 40,
    paddingTop: 8,
    alignItems: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  nextBtn: {
    width: '100%',
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    shadowOpacity: 0.4,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  loginLinkRow: {
    paddingVertical: 4,
  },
  loginLinkText: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 13.5,
  },
  loginLinkBold: {
    fontWeight: '700',
  },
});

// ─── Shape Styles ─────────────────────────────────────────────
const shapeStyles = StyleSheet.create({
  circle: {
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleInner: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
  },
  diamond: {
    width: 160,
    height: 160,
    borderWidth: 1.5,
    borderRadius: 18,
  },
  hexWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 260,
    height: 260,
  },
  hexRing: {
    position: 'absolute',
    borderWidth: 1,
  },
});
