import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_CITY_KEY = 'LAST_SEARCHED_CITY';

export const saveLastCity = async (city: string) => {
  try {
    await AsyncStorage.setItem(LAST_CITY_KEY, city);
  } catch (e) {
    console.error('Failed to save city', e);
  }
};

export const getLastCity = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(LAST_CITY_KEY);
  } catch (e) {
    console.error('Failed to load city', e);
    return null;
  }
};
