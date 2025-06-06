// Landing.tsx
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import Cloud from '../../assets/images/Cloud';
import Moon from '../../assets/images/Moon';
import Sun from '../../assets/images/Sun';
import { DarkModeToggle } from '../components/DarkModeToggle';
import { useTheme } from '../contexts/ThemeContext';

type LandingNavigationProp = StackNavigationProp

const { width } = Dimensions.get('window');

const Landing = () => {
  const { theme, isDarkMode } = useTheme();
  const themeProgress = useSharedValue(isDarkMode ? 1 : 0);
  const navigation = useNavigation<LandingNavigationProp>();
  
  // Animation values
  const sunRotation = useSharedValue(0);
  const sunScale = useSharedValue(1);
  const moonScale = useSharedValue(1);
  const sunOpacity = useSharedValue(1);
  const moonOpacity = useSharedValue(0);
  const leftCloudOffset = useSharedValue(0);
  const rightCloudOffset = useSharedValue(0);

  useEffect(() => {
    // Continuous sun rotation
    sunRotation.value = withRepeat(
      withTiming(360, {
        duration: 20000,
        easing: Easing.linear
      }),
      -1, // infinite repeat
      true // no reverse
    );

    // Gentle floating animation for clouds
    leftCloudOffset.value = withRepeat(
      withSpring(8, {
        damping: 3,
        stiffness: 4,
        mass: 0.5
      }),
      -1, // infinite repeat
      true  // reverse
    );

    rightCloudOffset.value = withRepeat(
      withSpring(-8, {
        damping: 3,
        stiffness: 4,
        mass: 0.5
      }),
      -1, // infinite repeat
      true  // reverse
    );
  }, []);

  // Animate theme transition
  useEffect(() => {
    themeProgress.value = withTiming(isDarkMode ? 1 : 0, { duration: 300 });
    
    if (isDarkMode) {
      // Fade out sun
      sunOpacity.value = withTiming(0, { duration: 300 });
      // Fade in moon
      moonOpacity.value = withTiming(1, { duration: 300 });
    } else {
      // Fade in sun
      sunOpacity.value = withTiming(1, { duration: 300 });
      // Fade out moon
      moonOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [isDarkMode]);

  const handleGetStarted = () => {
    // Stop continuous rotation to prevent jitter during large scale
    cancelAnimation(sunRotation);
    // Animate clouds and celestial body
    rightCloudOffset.value = withTiming(-width, { duration: 1000 });
    leftCloudOffset.value = withTiming(width, { duration: 1000 });

    // Delay scale animation by 1 second
    setTimeout(() => {
      if (isDarkMode) {
        moonScale.value = withTiming(15, { duration: 1000, easing: Easing.inOut(Easing.ease) });
      } else {
        sunScale.value = withTiming(15, { duration: 1000, easing: Easing.inOut(Easing.ease) });
      }
    }, 1000);

    // Navigate to Home after animations
    setTimeout(() => {
      navigation.navigate('Home');
    }, 2000);
  };

  const sunStyle = useAnimatedStyle(() => ({
    opacity: sunOpacity.value,
    transform: [
      { rotate: `${sunRotation.value}deg` },
      { scale: sunScale.value }
    ],
  }));

  const moonStyle = useAnimatedStyle(() => ({
    opacity: moonOpacity.value,
    transform: [
      { scale: moonScale.value }
    ]
  }));

  const leftCloudStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: leftCloudOffset.value }],
  }));

  const rightCloudStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: rightCloudOffset.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({ opacity: themeProgress.value }));

  return (
    <>
      <LinearGradient
        colors={['#fceabb', '#f8b500']}
        style={styles.container}
        start={{ x: 0.2, y: 0.1 }}
        end={{ x: 1, y: 1 }}
      />
      <Animated.View style={[styles.absoluteFill, overlayStyle]}>  
        <LinearGradient
          colors={['#1E3A8A', '#0F172A']}
          style={styles.container}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
      <View style={styles.contentWrapper}>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />

        <View style={styles.toggleWrapper}>
          <DarkModeToggle size="medium" />
        </View>

        <View style={styles.logoContainer}>
          <View style={styles.weatherElements}>
            <Animated.View style={[styles.moonWrapper, moonStyle]}>
              <Moon size={width * 0.42} color="#FFFFFF" />
            </Animated.View>
            <Animated.View style={[styles.sunWrapper, sunStyle]}>
              <Sun size={width * 0.42} color="#FFFFFF" />
            </Animated.View>
            <Animated.View style={[styles.leftCloudWrapper, leftCloudStyle]}>
              <Cloud width={width * 0.45} height={width * 0.27} color="#FFFFFF" />
            </Animated.View>
            <Animated.View style={[styles.rightCloudWrapper, rightCloudStyle]}>
              <Cloud width={width * 0.5} height={width * 0.3} color="#FFFFFF" />
            </Animated.View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleGetStarted} activeOpacity={0.85}>
            <View style={styles.button}>
              <Text style={[styles.buttonText, { color: isDarkMode ? '#1E3A8A' : '#f8b500' }]}>Get Started</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
  },
  contentWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    width: '100%',
    overflow: 'visible',
  },
  weatherElements: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.7,
    height: width * 0.45,
    overflow: 'visible',
  },
  leftCloudWrapper: {
    position: 'absolute',
    top: 12, // Adjusted for larger size
    left: -20, // Moved further left
    zIndex: 2,
    // Drop shadow
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Android shadow
  },
  rightCloudWrapper: {
    position: 'absolute',
    bottom: 16, // Moved slightly downward
    right: -20, // Maintained split positioning
    zIndex: 2,
    // Drop shadow
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Android shadow
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
  button: {
    marginBottom: 80,
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    minWidth: 140,
    borderRadius: 50,
    elevation: 5,
    shadowColor: '#333',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  buttonText: {
    color: '#f8b500',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  sunWrapper: {
    position: 'absolute',
    top: 20, // Adjusted for larger size
    left: '50%',
    marginLeft: -(width * 0.21), // Half of new sun size to center it
    zIndex: 1,
    // Drop shadow
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Android shadow
  },
  moonWrapper: {
    position: 'absolute',
    top: 20,
    left: '50%',
    marginLeft: -(width * 0.21),
    zIndex: 1,
    // Drop shadow
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Android shadow
  },
  toggleWrapper: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
});

export default Landing;
