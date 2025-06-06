import React from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface DarkModeToggleProps {
  size?: 'small' | 'medium' | 'large';
  style?: any;
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ 
  size = 'medium',
  style 
}) => {
  const { theme, toggleTheme, isDarkMode } = useTheme();
  const animatedValue = React.useRef(new Animated.Value(isDarkMode ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isDarkMode ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isDarkMode, animatedValue]);

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          width: 40,
          height: 22,
          borderRadius: 11,
          thumbSize: 18,
          thumbMargin: 2,
        };
      case 'large':
        return {
          width: 60,
          height: 32,
          borderRadius: 16,
          thumbSize: 28,
          thumbMargin: 2,
        };
      default: // medium
        return {
          width: 50,
          height: 28,
          borderRadius: 14,
          thumbSize: 24,
          thumbMargin: 2,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const trackColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.border, theme.colors.primary],
  });

  const thumbTranslateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [sizeStyles.thumbMargin, sizeStyles.width - sizeStyles.thumbSize - sizeStyles.thumbMargin],
  });

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      activeOpacity={0.7}
      style={[styles.container, style]}
      accessibilityLabel={`Toggle ${isDarkMode ? 'light' : 'dark'} mode`}
      accessibilityRole="switch"
      accessibilityState={{ checked: isDarkMode }}
    >
      <Animated.View
        style={[
          styles.track,
          {
            width: sizeStyles.width,
            height: sizeStyles.height,
            borderRadius: sizeStyles.borderRadius,
            backgroundColor: trackColor,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              width: sizeStyles.thumbSize,
              height: sizeStyles.thumbSize,
              borderRadius: sizeStyles.thumbSize / 2,
              transform: [{ translateX: thumbTranslateX }],
              backgroundColor: theme.colors.surface,
            },
          ]}
        >
          <View style={styles.iconContainer}>
            {isDarkMode ? (
              // Moon icon
              <View style={[styles.moonIcon, { backgroundColor: theme.colors.text }]} />
            ) : (
              // Sun icon
              <View style={[styles.sunIcon, { backgroundColor: theme.colors.text }]} />
            )}
          </View>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  track: {
    justifyContent: 'center',
    position: 'relative',
  },
  thumb: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sunIcon: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  moonIcon: {
    width: 8,
    height: 8,
    borderRadius: 4,
    transform: [{ rotate: '45deg' }],
  },
});

export default DarkModeToggle;