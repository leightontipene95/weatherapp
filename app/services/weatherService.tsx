import AsyncStorage from '@react-native-async-storage/async-storage';

// OpenWeatherMap API configuration
const API_KEY = 'c9a5d606d7e0b0658f47494e1afe53eb'; // Replace with your actual API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const LAST_CITY_KEY = 'last_searched_city';

// Weather data interfaces
export interface WeatherData {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface MainWeatherInfo {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

export interface WeatherResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: WeatherData[];
  base: string;
  main: MainWeatherInfo;
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface WeatherError {
  cod: string | number;
  message: string;
}

// Custom error class for weather API errors
export class WeatherAPIError extends Error {
  public cod: string | number;
  
  constructor(error: WeatherError) {
    super(error.message);
    this.name = 'WeatherAPIError';
    this.cod = error.cod;
  }
}

/**
 * Fetches current weather data for a given city
 * @param cityName - The name of the city to fetch weather for
 * @returns Promise<WeatherResponse> - The weather data
 * @throws WeatherAPIError - When the API request fails
 */
export const getCurrentWeather = async (cityName: string): Promise<WeatherResponse> => {
  if (!cityName.trim()) {
    throw new WeatherAPIError({
      cod: '400',
      message: 'City name cannot be empty'
    });
  }

  if (!API_KEY) {
    throw new WeatherAPIError({
      cod: '401',
      message: 'Please set your OpenWeatherMap API key in weatherService.tsx'
    });
  }

  try {
    const url = `${BASE_URL}/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new WeatherAPIError({
        cod: data.cod || response.status,
        message: data.message || 'Failed to fetch weather data'
      });
    }

    // Save the successfully searched city
    await saveLastSearchedCity(cityName);
    
    return data as WeatherResponse;
  } catch (error) {
    if (error instanceof WeatherAPIError) {
      throw error;
    }
    
    // Handle network or other errors
    throw new WeatherAPIError({
      cod: 'NETWORK_ERROR',
      message: 'Network error. Please check your internet connection.'
    });
  }
};

/**
 * Fetches current weather data for given coordinates (latitude and longitude)
 * @param lat - Latitude coordinate
 * @param lon - Longitude coordinate
 * @returns Promise<WeatherResponse> - The weather data
 * @throws WeatherAPIError - When the API request fails
 */
export const fetchWeatherByCoords = async (lat: number, lon: number): Promise<WeatherResponse> => {
  if (typeof lat !== 'number' || typeof lon !== 'number') {
    throw new WeatherAPIError({
      cod: '400',
      message: 'Invalid coordinates: latitude and longitude must be numbers'
    });
  }

  if (lat < -90 || lat > 90) {
    throw new WeatherAPIError({
      cod: '400',
      message: 'Invalid latitude: must be between -90 and 90'
    });
  }

  if (lon < -180 || lon > 180) {
    throw new WeatherAPIError({
      cod: '400',
      message: 'Invalid longitude: must be between -180 and 180'
    });
  }

  if (!API_KEY) {
    throw new WeatherAPIError({
      cod: '401',
      message: 'Please set your OpenWeatherMap API key in weatherService.tsx'
    });
  }

  try {
    const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new WeatherAPIError({
        cod: data.cod || response.status,
        message: data.message || 'Failed to fetch weather data for the given coordinates'
      });
    }

    return data as WeatherResponse;
  } catch (error) {
    if (error instanceof WeatherAPIError) {
      throw error;
    }
    
    // Handle network or other errors
    throw new WeatherAPIError({
      cod: 'NETWORK_ERROR',
      message: 'Network error. Please check your internet connection.'
    });
  }
};

/**
 * Gets the weather icon URL from OpenWeatherMap
 * @param iconCode - The icon code from the weather response
 * @param size - The size of the icon (1x, 2x, 4x)
 * @returns string - The complete icon URL
 */
export const getWeatherIconUrl = (iconCode: string, size: '1x' | '2x' | '4x' = '2x'): string => {
  const sizeMap = {
    '1x': '',
    '2x': '@2x',
    '4x': '@4x'
  };
  
  return `https://openweathermap.org/img/wn/${iconCode}${sizeMap[size]}.png`;
};

/**
 * Converts temperature from Celsius to Fahrenheit
 * @param celsius - Temperature in Celsius
 * @returns number - Temperature in Fahrenheit
 */
export const celsiusToFahrenheit = (celsius: number): number => {
  return Math.round((celsius * 9/5) + 32);
};

/**
 * Formats temperature with degree symbol
 * @param temp - Temperature value
 * @param unit - Temperature unit ('C' or 'F')
 * @returns string - Formatted temperature string
 */
export const formatTemperature = (temp: number, unit: 'C' | 'F' = 'C'): string => {
  return `${Math.round(temp)}°${unit}`;
};

/**
 * Capitalizes the first letter of each word in a string
 * @param str - The string to capitalize
 * @returns string - Capitalized string
 */
export const capitalizeWords = (str: string): string => {
  return str.replace(/\b\w/g, char => char.toUpperCase());
};

/**
 * Saves the last searched city to AsyncStorage
 * @param cityName - City name to save
 */
export const saveLastSearchedCity = async (cityName: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(LAST_CITY_KEY, cityName.trim());
  } catch (error) {
    console.warn('Failed to save last searched city:', error);
  }
};

/**
 * Gets the last searched city from AsyncStorage
 * @returns Promise<string | null> - The last searched city or null
 */
export const getLastSearchedCity = async (): Promise<string | null> => {
  try {
    const city = await AsyncStorage.getItem(LAST_CITY_KEY);
    return city;
  } catch (error) {
    console.warn('Failed to get last searched city:', error);
    return null;
  }
};

/**
 * Clears the last searched city from AsyncStorage
 */
export const clearLastSearchedCity = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(LAST_CITY_KEY);
  } catch (error) {
    console.warn('Failed to clear last searched city:', error);
  }
};

/**
 * Validates if a city name is valid for API requests
 * @param cityName - City name to validate
 * @returns boolean - True if valid, false otherwise
 */
export const isValidCityName = (cityName: string): boolean => {
  const trimmed = cityName.trim();
  
  // Check if empty
  if (!trimmed) return false;
  
  // Check minimum length
  if (trimmed.length < 2) return false;
  
  // Check maximum length (reasonable limit)
  if (trimmed.length > 100) return false;
  
  // Allow letters, spaces, hyphens, apostrophes, and periods
  const validPattern = /^[a-zA-Z\s\-'.]+$/;
  return validPattern.test(trimmed);
};

/**
 * Gets weather condition emoji based on weather main category
 * @param weatherMain - Main weather condition from API
 * @param iconCode - Weather icon code for day/night detection
 * @returns string - Weather emoji
 */
export const getWeatherEmoji = (weatherMain: string, iconCode?: string): string => {
  const isNight = iconCode?.includes('n');
  
  switch (weatherMain.toLowerCase()) {
    case 'clear':
      return isNight ? '🌙' : '☀️';
    case 'clouds':
      return '☁️';
    case 'rain':
      return '🌧️';
    case 'drizzle':
      return '🌦️';
    case 'thunderstorm':
      return '⛈️';
    case 'snow':
      return '❄️';
    case 'mist':
    case 'fog':
    case 'haze':
      return '🌫️';
    case 'dust':
    case 'sand':
      return '🌪️';
    default:
      return '🌤️';
  }
};