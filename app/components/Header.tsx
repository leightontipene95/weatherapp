import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import Cloud from '../../assets/images/Cloud';
import Moon from '../../assets/images/Moon';
import Sun from '../../assets/images/Sun';
import { useTheme } from '../contexts/ThemeContext';
import { DarkModeToggle } from './DarkModeToggle';

const { width } = Dimensions.get('window');
const ELEMENT_SIZE_RATIO = 0.2; // Smaller size for header
const MOON_SIZE_RATIO = 0.13; // Even smaller moon

export const Header = () => {
  const { theme, isDarkMode } = useTheme();

  const containerStyle = useAnimatedStyle(() => ({
    width: '100%',
    height: width * 0.37, // Adjusted height to accommodate padding and content
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  }));

  const sunStyle = useAnimatedStyle(() => ({
    opacity: isDarkMode ? 0 : 1,
  }));

  const moonStyle = useAnimatedStyle(() => ({
    opacity: isDarkMode ? 1 : 0,
  }));

  return (
    <Animated.View style={[containerStyle]}>
      <LinearGradient
        colors={isDarkMode ? ['rgba(15, 23, 42, 0.9)', 'rgba(30, 58, 138, 0.9)'] : ['rgba(248, 181, 0, 0.9)', 'rgba(252, 234, 187, 0.9)']}
        style={styles.gradientContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.contentContainer}>
          <View style={styles.weatherElements}>
            <Animated.View style={[styles.moonWrapper, moonStyle]}>
              <Moon size={width * MOON_SIZE_RATIO} color="#FFFFFF" />
            </Animated.View>
            <Animated.View style={[styles.sunWrapper, sunStyle]}>
              <Sun size={width * ELEMENT_SIZE_RATIO} color="#FFFFFF" />
            </Animated.View>
            <View style={styles.leftCloudWrapper}>
              <Cloud 
                width={width * ELEMENT_SIZE_RATIO} 
                height={width * ELEMENT_SIZE_RATIO * 0.6} 
                color="#FFFFFF" 
              />
            </View>
            <View style={styles.rightCloudWrapper}>
              <Cloud 
                width={width * ELEMENT_SIZE_RATIO * 1.1} 
                height={width * ELEMENT_SIZE_RATIO * 0.65} 
                color="#FFFFFF" 
              />
            </View>
          </View>
          {/* Dark mode toggle */}
          <DarkModeToggle size="small" />
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    flex: 1,
  },
  weatherElements: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.4,
    height: width * 0.25,
  },
  sunWrapper: {
    position: 'absolute',
    top: width * 0.02,
    left: 0,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  moonWrapper: {
    position: 'absolute',
    top: width * 0.08,
    left: 1,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  leftCloudWrapper: {
    position: 'absolute',
    top: width * 0.06,
    left: width * 0.12,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  rightCloudWrapper: {
    position: 'absolute',
    top: width * 0.1,
    left: width * 0.18,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default Header;