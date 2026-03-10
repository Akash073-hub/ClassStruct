import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// ---------- SVG-free icon replacements using text/emoji ----------
const IconAt = () => <Text style={styles.inputIcon}>@</Text>;
const IconEye = ({ show }: { show: boolean }) => (
  <Text style={styles.inputIcon}>{show ? '🙈' : '👁'}</Text>
);
const IconGoogle = () => (
  <View style={styles.socialIconCircle}>
    <Text style={styles.socialIconText}>G</Text>
  </View>
);
const IconApple = () => (
  <View style={[styles.socialIconCircle, { backgroundColor: '#000' }]}>
    <Text style={[styles.socialIconText, { color: '#fff' }]}>🍎</Text>
  </View>
);
const IconFacebook = () => (
  <View style={[styles.socialIconCircle, { backgroundColor: '#1877F2' }]}>
    <Text style={[styles.socialIconText, { color: '#fff' }]}>f</Text>
  </View>
);

type LoginScreenProps = {
  onLogin?: (
    role: 'student' | 'teacher',
    username: string,
    password: string,
  ) => void;
  onCreateNew?: () => void;
  onForgotPassword?: () => void;
};

export default function LoginScreen({
  onLogin,
  onCreateNew,
  onForgotPassword,
}: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'student' | 'teacher'>('student');

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const cardScale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(cardScale, {
        toValue: 1,
        friction: 7,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = () => {
    onLogin?.(role, username, password);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="#3DBFAB" />

      {/* Teal background with decorative blobs */}
      <View style={styles.background}>
        <View style={styles.blobTopLeft} />
        <View style={styles.blobBottomRight} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Role Toggle — Student / Teacher */}
        <Animated.View
          style={[
            styles.roleToggleContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <TouchableOpacity
            style={[styles.roleBtn, role === 'student' && styles.roleBtnActive]}
            onPress={() => setRole('student')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.roleBtnText,
                role === 'student' && styles.roleBtnTextActive,
              ]}
            >
              Student
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleBtn, role === 'teacher' && styles.roleBtnActive]}
            onPress={() => setRole('teacher')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.roleBtnText,
                role === 'teacher' && styles.roleBtnTextActive,
              ]}
            >
              Teacher
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Card */}
        <Animated.View
          style={[
            styles.card,
            {
              opacity: fadeAnim,
              transform: [{ scale: cardScale }, { translateY: slideAnim }],
            },
          ]}
        >
          {/* Play-button accent (matches design) */}
          <View style={styles.playButton}>
            <Text style={styles.playIcon}>▶</Text>
          </View>

          {/* Heading */}
          <Text style={styles.heading}>Hey,</Text>
          <Text style={styles.headingBold}>Login Now.</Text>
          <Text style={styles.subHeading}>
            If you are new /{' '}
            <Text style={styles.createLink} onPress={onCreateNew}>
              Create New
            </Text>
          </Text>

          {/* Username */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#aaa"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <IconAt />
          </View>

          {/* Password */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(p => !p)}
              activeOpacity={0.7}
            >
              <IconEye show={showPassword} />
            </TouchableOpacity>
          </View>

          {/* Forgot */}
          <View style={styles.forgotRow}>
            <Text style={styles.forgotText}>Forgot Passcode? / </Text>
            <TouchableOpacity onPress={onForgotPassword} activeOpacity={0.7}>
              <Text style={styles.forgotReset}>Reset</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleLogin}
            activeOpacity={0.85}
          >
            <Text style={styles.loginBtnText}>Login</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Buttons */}
          <View style={styles.socialRow}>
            <TouchableOpacity activeOpacity={0.8}>
              <IconGoogle />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8}>
              <IconApple />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8}>
              <IconFacebook />
            </TouchableOpacity>
          </View>

          {/* Skip */}
          <TouchableOpacity activeOpacity={0.7} style={styles.skipRow}>
            <Text style={styles.skipText}>Skip Now</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─────────────────────────── STYLES ───────────────────────────
const TEAL = '#3DBFAB';
const TEAL_DARK = '#2ea898';
const CARD_BG = '#F5F5F0';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TEAL,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: TEAL,
    overflow: 'hidden',
  },
  blobTopLeft: {
    position: 'absolute',
    top: -80,
    left: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  blobBottomRight: {
    position: 'absolute',
    bottom: 60,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 20,
  },

  // Role Toggle
  roleToggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.20)',
    borderRadius: 30,
    padding: 4,
    marginBottom: 28,
    width: width * 0.72,
  },
  roleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 26,
    alignItems: 'center',
  },
  roleBtnActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  roleBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 0.3,
  },
  roleBtnTextActive: {
    color: TEAL_DARK,
  },

  // Card
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: CARD_BG,
    borderRadius: 28,
    padding: 30,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  playButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  playIcon: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 3,
  },
  heading: {
    fontSize: 32,
    fontWeight: '300',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  headingBold: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1a1a1a',
    letterSpacing: -1,
    marginBottom: 10,
  },
  subHeading: {
    fontSize: 13.5,
    color: '#888',
    marginBottom: 28,
  },
  createLink: {
    color: '#1a1a1a',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },

  // Inputs
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 14,
    height: 54,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '400',
  },
  inputIcon: {
    fontSize: 18,
    color: '#bbb',
    paddingLeft: 6,
  },

  // Forgot
  forgotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
    marginTop: 2,
  },
  forgotText: {
    fontSize: 13,
    color: '#888',
  },
  forgotReset: {
    fontSize: 13,
    color: '#1a1a1a',
    fontWeight: '700',
  },

  // Login button
  loginBtn: {
    backgroundColor: TEAL,
    borderRadius: 16,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 22,
    shadowColor: TEAL,
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#aaa',
    fontSize: 13,
  },

  // Social
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 18,
  },
  socialIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0ec',
    borderWidth: 1,
    borderColor: '#e4e4e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIconText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },

  // Skip
  skipRow: {
    alignItems: 'center',
    paddingTop: 4,
  },
  skipText: {
    fontSize: 13.5,
    color: '#aaa',
    letterSpacing: 0.2,
  },
});
