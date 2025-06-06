import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const DARK_MODE_KEY = '@weather_app_dark_mode';

export const useDarkMode = (initialValue: boolean = false) => {
  const [isDark, setIsDark] = useState(initialValue);

  // Load the saved dark mode state when the hook is first used
  useEffect(() => {
    const loadSavedDarkMode = async () => {
      try {
        const savedValue = await AsyncStorage.getItem(DARK_MODE_KEY);
        if (savedValue !== null) {
          setIsDark(JSON.parse(savedValue));
        }
      } catch (error) {
        console.error('Error loading dark mode state:', error);
      }
    };

    loadSavedDarkMode();
  }, []);

  // Update the stored value whenever dark mode changes
  const setDarkMode = async (value: boolean) => {
    try {
      await AsyncStorage.setItem(DARK_MODE_KEY, JSON.stringify(value));
      setIsDark(value);
    } catch (error) {
      console.error('Error saving dark mode state:', error);
      setIsDark(value); // Still update the state even if saving fails
    }
  };

  return [isDark, setDarkMode] as const;
};
