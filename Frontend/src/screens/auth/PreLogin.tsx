import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'PreLogin'>;
};

const { width } = Dimensions.get('window');

export default function PreLoginScreen({
  navigation,
}: Props): React.JSX.Element {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const btnAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(btnAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.4,
          duration: 1800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f3ee" />

      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <Text style={styles.appName}>ClassStruct</Text>
      </Animated.View>

      {/* Hero Image */}
      <Animated.View
        style={[
          styles.imageContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Animated.View style={[styles.glowRing, { opacity: glowAnim }]} />
        {/* Replace with your actual image: source={require('../../assets/images/hero.png')} */}
        <ImageBackground
          source={{ uri: 'https://placekitten.com/400/400' }}
          style={styles.heroImage}
          imageStyle={styles.heroImageStyle}
        >
          <View style={styles.imageOverlay} />
        </ImageBackground>
      </Animated.View>

      {/* Text Content */}
      <Animated.View
        style={[
          styles.textContent,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Text style={styles.tagline}>Get started</Text>
        <Text style={styles.description}>
          Wanna know what's happening on{'\n'}campus?{' '}
          <Text style={styles.highlight}>Join aboard</Text> and get to{'\n'}
          know everything about your{'\n'}classmates and faculty.
        </Text>
      </Animated.View>

      {/* Next Button */}
      <Animated.View style={[styles.btnContainer, { opacity: btnAnim }]}>
        <TouchableOpacity
          style={styles.nextBtn}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.85}
        >
          <Text style={styles.nextBtnText}>next →</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Dots indicator */}
      <View style={styles.dots}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f3ee',
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 12,
    paddingBottom: 8,
  },
  appName: {
    fontFamily: 'serif',
    fontSize: 18,
    color: '#1a1a2e',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 12,
    position: 'relative',
  },
  glowRing: {
    position: 'absolute',
    width: width * 0.78,
    height: width * 0.78,
    borderRadius: 28,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#f0a500',
    shadowColor: '#f0a500',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 20,
    zIndex: 0,
  },
  heroImage: {
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: 24,
    overflow: 'hidden',
    zIndex: 1,
  },
  heroImageStyle: {
    borderRadius: 24,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,5,20,0.15)',
    borderRadius: 24,
  },
  textContent: {
    marginTop: 32,
    flex: 1,
  },
  tagline: {
    fontSize: 13,
    color: '#888',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 12,
    fontFamily: 'monospace',
  },
  description: {
    fontSize: 20,
    color: '#1a1a2e',
    lineHeight: 30,
    fontWeight: '700',
    fontFamily: 'serif',
  },
  highlight: {
    color: '#5ba8a0',
  },
  btnContainer: {
    alignItems: 'flex-end',
    paddingBottom: 12,
  },
  nextBtn: {
    backgroundColor: '#5ba8a0',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 50,
    shadowColor: '#5ba8a0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingBottom: 20,
    paddingTop: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#ccc',
  },
  dotActive: {
    backgroundColor: '#5ba8a0',
    width: 20,
  },
});
