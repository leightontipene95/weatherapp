import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import Cloud from '../../assets/images/Cloud';
import Moon from '../../assets/images/Moon';
import Sun from '../../assets/images/Sun';
import { useDarkMode } from '../hooks/useDarkMode';

const { width } = Dimensions.get('window');
const ELEMENT_SIZE_RATIO = 0.2; // Smaller size for header
const MOON_SIZE_RATIO = 0.13; // Even smaller moon

export const Header = () => {
  const [isDark] = useDarkMode();

  const sunStyle = useAnimatedStyle(() => ({
    opacity: isDark ? 0 : 1,
  }));

  const moonStyle = useAnimatedStyle(() => ({
    opacity: isDark ? 1 : 0,
  }));

  const handleSettingsPress = () => {
    // Handle settings press
    console.log('Settings pressed');
  };

  return (
    <View style={styles.container}>
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
      <Pressable 
        style={({pressed}) => [
          styles.settingsButton,
          pressed && styles.settingsButtonPressed
        ]}
        onPress={handleSettingsPress}
      >
        <Ionicons 
          name="settings-outline" 
          size={24} 
          color={isDark ? "#FFFFFF" : "#333333"} 
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: width * 0.25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
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
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingsButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: [{ scale: 0.95 }],
  },
});

export default Header;