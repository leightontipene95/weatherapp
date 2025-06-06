import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { fetchWeatherByCoords, getCurrentWeather, isValidCityName, WeatherResponse } from '../services/weatherService';
import Header from './Header';
import { SearchBar } from './SearchBar';
import { WeatherCard } from './WeatherCard';

const CITIES_STORAGE_KEY = '@weather_app_cities';

export default function Home() {
  const { theme } = useTheme();
  const [searchCity, setSearchCity] = useState('');
  const [locationWeather, setLocationWeather] = useState<WeatherResponse | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  
  // Dynamic list of cities to display weather cards for
  const [cities, setCities] = useState<string[]>([]);
  
  // State for cities weather data
  const [citiesWeather, setCitiesWeather] = useState<Record<string, WeatherResponse | null>>({});
  const [loadingCities, setLoadingCities] = useState<Record<string, boolean>>({});

  // Save cities to AsyncStorage
  const saveCitiesToStorage = async (citiesToSave: string[]) => {
    try {
      await AsyncStorage.setItem(CITIES_STORAGE_KEY, JSON.stringify(citiesToSave));
    } catch (error) {
      console.error('Error saving cities to storage:', error);
    }
  };

  // Load cities from AsyncStorage
  const loadCitiesFromStorage = async (): Promise<string[]> => {
    try {
      const storedCities = await AsyncStorage.getItem(CITIES_STORAGE_KEY);
      if (storedCities) {
        return JSON.parse(storedCities);
      }
    } catch (error) {
      console.error('Error loading cities from storage:', error);
    }
    return [];
  };

  const getCurrentLocationWeather = async () => {
    setIsLoadingLocation(true);
    try {
      // Request permission to access location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission',
          'Permission to access location was denied. Please enable location access in your device settings to get weather for your current location.'
        );
        return;
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Fetch weather data using coordinates
      const weatherData = await fetchWeatherByCoords(
        location.coords.latitude,
        location.coords.longitude
      );

      setLocationWeather(weatherData);
    } catch (error) {
      console.error('Error getting location weather:', error);
      Alert.alert(
        'Error',
        'Failed to get weather for your current location. Please try again.'
      );
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const fetchCitiesWeather = async (citiesToFetch: string[] = cities) => {
    // Initialize loading states for the cities we're fetching
    const initialLoading = citiesToFetch.reduce((acc, city) => {
      acc[city] = true;
      return acc;
    }, {} as Record<string, boolean>);
    
    setLoadingCities(prev => ({ ...prev, ...initialLoading }));

    try {
      // Fetch weather for all cities in parallel
      const weatherPromises = citiesToFetch.map(async (city) => {
        try {
          const weatherData = await getCurrentWeather(city);
          return { city, data: weatherData, error: null };
        } catch (error) {
          console.error(`Error fetching weather for ${city}:`, error);
          return { city, data: null, error };
        }
      });

      // Wait for all promises to settle (success or failure)
      const results = await Promise.allSettled(weatherPromises);
      
      // Process results and update state
      const newCitiesWeather: Record<string, WeatherResponse | null> = {};
      const newLoadingStates: Record<string, boolean> = {};

      results.forEach((result, index) => {
        const city = citiesToFetch[index];
        newLoadingStates[city] = false;
        
        if (result.status === 'fulfilled') {
          newCitiesWeather[city] = result.value.data;
        } else {
          newCitiesWeather[city] = null;
          // You could show individual error messages per city if needed
        }
      });

      setCitiesWeather(prev => ({ ...prev, ...newCitiesWeather }));
      setLoadingCities(prev => ({ ...prev, ...newLoadingStates }));
    } catch (error) {
      console.error('Error in fetchCitiesWeather:', error);
      // Reset loading states in case of unexpected error
      const resetLoading = citiesToFetch.reduce((acc, city) => {
        acc[city] = false;
        return acc;
      }, {} as Record<string, boolean>);
      setLoadingCities(prev => ({ ...prev, ...resetLoading }));
    }
  };

  useEffect(() => {
    const initializeCities = async () => {
      // Load cities from storage on initial load
      const storedCities = await loadCitiesFromStorage();
      if (storedCities.length > 0) {
        setCities(storedCities);
        // Fetch weather for loaded cities
        fetchCitiesWeather(storedCities);
      }
    };

    getCurrentLocationWeather();
    initializeCities();
  }, []);

  const handleSearch = async () => {
    const cityName = searchCity.trim();
    
    if (!cityName) {
      Alert.alert('Invalid Input', 'Please enter a city name.');
      return;
    }

    // Validate city name format
    if (!isValidCityName(cityName)) {
      Alert.alert(
        'Invalid City Name',
        'Please enter a valid city name using only letters, spaces, hyphens, apostrophes, and periods.'
      );
      return;
    }

    // Check if city is already in the list (case-insensitive)
    const cityExists = cities.some(city => 
      city.toLowerCase() === cityName.toLowerCase()
    );

    if (cityExists) {
      Alert.alert('City Already Added', `${cityName} is already in your weather list.`);
      setSearchCity(''); // Clear search input
      return;
    }

    try {
      // Add city to the list
      const updatedCities = [...cities, cityName];
      setCities(updatedCities);
      
      // Fetch weather for the new city
      await fetchCitiesWeather([cityName]);
      
      // Save updated cities list to storage
      await saveCitiesToStorage(updatedCities);
      
      // Clear search input on success
      setSearchCity('');
      
      // Show success message
      Alert.alert('Success', `${cityName} has been added to your weather list!`);
    } catch (error) {
      // Remove city from list if weather fetch failed
      setCities(cities);
      console.error('Error adding city:', error);
      Alert.alert(
        'Error',
        `Failed to get weather data for ${cityName}. Please check the city name and try again.`
      );
    }
  };

  const handleDeleteCity = (cityToDelete: string) => {
    Alert.alert(
      'Delete City',
      `Are you sure you want to remove ${cityToDelete} from your weather list?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Remove city from the list
            const updatedCities = cities.filter(city => city !== cityToDelete);
            setCities(updatedCities);
            
            // Clean up related weather data and loading states
            setCitiesWeather(prev => {
              const updated = { ...prev };
              delete updated[cityToDelete];
              return updated;
            });
            
            setLoadingCities(prev => {
              const updated = { ...prev };
              delete updated[cityToDelete];
              return updated;
            });
            
            // Save updated cities list to storage
            saveCitiesToStorage(updatedCities);
            
            Alert.alert('Success', `${cityToDelete} has been removed from your weather list.`);
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header />
      <View style={styles.searchBarContainer}>
        <SearchBar
          value={searchCity}
          onChangeText={setSearchCity}
          onSearch={handleSearch}
          placeholder="Search for a city..."
        />
      </View>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Current Location Weather Card */}
        {locationWeather && (
          <View style={styles.cardContainer}>
            <WeatherCard
              city={`${locationWeather.name}, ${locationWeather.sys.country}`}
              temperature={locationWeather.main.temp}
              condition={locationWeather.weather[0].main}
              icon={locationWeather.weather[0].icon}
            />
          </View>
        )}
        
        {/* Loading state for location weather */}
        {isLoadingLocation && (
          <View style={styles.cardContainer}>
            <WeatherCard
              city="Getting your location..."
              temperature={0}
              condition="Loading"
              icon="01d"
            />
          </View>
        )}
        
        {/* Render weather cards for each city in the list */}
        {cities.map((city) => {
          const weatherData = citiesWeather[city];
          const isLoading = loadingCities[city];
          
          if (isLoading) {
            return (
              <View key={`${city}-loading-container`} style={styles.cardContainer}>
                <WeatherCard
                  key={`${city}-loading`}
                  city={`Loading ${city}...`}
                  temperature={0}
                  condition="Loading"
                  icon="01d"
                  isDeletable={false}
                />
              </View>
            );
          }
          
          if (weatherData) {
            return (
              <View key={`${city}-${weatherData.id}-container`} style={styles.cardContainer}>
                <WeatherCard
                  key={`${city}-${weatherData.id}`}
                  city={`${weatherData.name}, ${weatherData.sys.country}`}
                  temperature={weatherData.main.temp}
                  condition={weatherData.weather[0].main}
                  icon={weatherData.weather[0].icon}
                  onDelete={() => handleDeleteCity(city)}
                  isDeletable={true}
                />
              </View>
            );
          }
          
          // Error state - show a basic card with error indication
          return (
            <View key={`${city}-error-container`} style={styles.cardContainer}>
              <WeatherCard
                key={`${city}-error`}
                city={`${city} - Error`}
                temperature={0}
                condition="Error"
                icon="01d"
                onDelete={() => handleDeleteCity(city)}
                isDeletable={true}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  searchBarContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  cardContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
});
