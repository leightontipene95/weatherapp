import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { capitalizeWords, formatTemperature, getWeatherEmoji, getWeatherIconUrl } from '../services/weatherService';

const { width } = Dimensions.get('window');

interface WeatherCardProps {
  city: string;
  temperature: number;
  condition: string;
  icon: string;
  onDelete?: () => void;
  isDeletable?: boolean;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  city,
  temperature,
  condition,
  icon,
  onDelete,
  isDeletable = false,
}) => {
  const { theme, isDarkMode } = useTheme();
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);

  const handleLongPress = () => {
    if (isDeletable && onDelete) {
      setShowDeleteIcon(true);
    }
  };

  const handleDeletePress = () => {
    if (onDelete) {
      onDelete();
    }
  };

  const handleCardPress = () => {
    if (showDeleteIcon) {
      setShowDeleteIcon(false);
    }
  };

  const gradientColors = isDarkMode 
    ? ['rgba(30, 58, 138, 0.9)', 'rgba(15, 23, 42, 0.9)'] as const
    : ['rgba(252, 234, 187, 0.9)', 'rgba(248, 181, 0, 0.9)'] as const;

  const shadowColor = isDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.2)';

  return (
    <TouchableOpacity 
      style={[styles.container, { shadowColor }]}
      onLongPress={handleLongPress}
      onPress={handleCardPress}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={gradientColors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Delete Icon - shown on long press */}
        {showDeleteIcon && isDeletable && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeletePress}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="close-circle" 
              size={32} 
              color="#ff4444"
            />
          </TouchableOpacity>
        )}

        {/* Header with city name and emoji */}
        <View style={styles.header}>
          <Text style={[styles.cityName, { color: theme.colors.text }]}>
            {city}
          </Text>
          <Text style={styles.weatherEmoji}>
            {getWeatherEmoji(condition, icon)}
          </Text>
        </View>

        {/* Main weather display */}
        <View style={styles.mainWeather}>
          <View style={styles.temperatureSection}>
            <Text style={[styles.temperature, { color: theme.colors.text }]}>
              {formatTemperature(temperature)}
            </Text>
          </View>

          <View style={styles.iconSection}>
            <Image
              source={{ uri: getWeatherIconUrl(icon, '4x') }}
              style={styles.weatherIcon}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Weather condition */}
        <Text style={[styles.condition, { color: theme.colors.text }]}>
          {capitalizeWords(condition)}
        </Text>

        {/* Decorative elements */}
        <View style={styles.decorativeElements}>
          <View style={[styles.decorativeDot, { backgroundColor: theme.colors.primary }]} />
          <View style={[styles.decorativeDot, { backgroundColor: theme.colors.secondary }]} />
          <View style={[styles.decorativeDot, { backgroundColor: theme.colors.accent }]} />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 40,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 24,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
  },
  gradient: {
    borderRadius: 24,
    padding: 24,
    minHeight: 200,
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cityName: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.5,
    flex: 1,
  },
  weatherEmoji: {
    fontSize: 32,
    marginLeft: 10,
  },
  mainWeather: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  temperatureSection: {
    flex: 1,
  },
  temperature: {
    fontSize: 64,
    fontWeight: '800',
    lineHeight: 70,
    letterSpacing: -2,
  },
  iconSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherIcon: {
    width: 100,
    height: 100,
  },
  condition: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    letterSpacing: 0.3,
  },
  decorativeElements: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    gap: 8,
  },
  decorativeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.6,
  },
  deleteButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default WeatherCard;