// Landing.tsx
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import Cloud from '../../assets/images/Cloud';
import Sun from '../../assets/images/Sun';
import { RootStackParamList } from '../../types/navigation';

type LandingNavigationProp = StackNavigationProp<RootStackParamList, 'Landing'>;

const { width } = Dimensions.get('window');

const Landing = () => {
  const navigation = useNavigation<LandingNavigationProp>();
  
  // Animation values
  const sunRotation = useSharedValue(0);
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
      false // no reverse
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

  // Animated styles
  const sunStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sunRotation.value}deg` }]
  }));

  const leftCloudStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: leftCloudOffset.value }]
  }));

  const rightCloudStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: rightCloudOffset.value }]
  }));

  const handleGetStarted = () => {
    navigation.navigate('Home');
  };

  return (
    <LinearGradient
      colors={['#fceabb', '#f8b500']}
      style={styles.container}
      start={{ x: 0.2, y: 0.1 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar style="dark" />

      <View style={styles.logoContainer}>
        <View style={styles.weatherElements}>
          <Animated.View style={[styles.leftCloudWrapper, leftCloudStyle]}>
            <Cloud width={width * 0.35} height={width * 0.21} color="#FFFFFF" />
          </Animated.View>
          <Animated.View style={[styles.sunWrapper, sunStyle]}>
            <Sun size={width * 0.32} color="#FFFFFF" />
          </Animated.View>
          <Animated.View style={[styles.rightCloudWrapper, rightCloudStyle]}>
            <Cloud width={width * 0.4} height={width * 0.24} color="#FFFFFF" />
          </Animated.View>
        </View>
      </View>

      <TouchableOpacity onPress={handleGetStarted} activeOpacity={0.85}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Get Started</Text>
        </View>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    width: '100%',
  },
  weatherElements: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.7,
    height: width * 0.45,
  },
  leftCloudWrapper: {
    position: 'absolute',
    top: 8,
    left: 0,
    zIndex: 2,
    // Drop shadow
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Android shadow
  },
  sunWrapper: {
    position: 'absolute',
    top: 16,
    left: '50%',
    marginLeft: -(width * 0.16), // Half of sun size to center it
    zIndex: 1,
    // Drop shadow
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Android shadow
  },
  rightCloudWrapper: {
    position: 'absolute',
    bottom: 8,
    right: 0,
    zIndex: 2,
    // Drop shadow
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Android shadow
  },
  button: {
    marginBottom: 80,
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 60,
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
  },
});

export default Landing;
