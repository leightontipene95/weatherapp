import React, { useEffect } from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { useDarkMode } from '../hooks/useDarkMode';

export type DarkModeToggleProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
};

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ value, onValueChange }) => {
  const [isDark, setIsDark] = useDarkMode(value);

  // Sync the external state with our persisted state
  useEffect(() => {
    if (value !== isDark) {
      onValueChange(isDark);
    }
  }, [isDark]);

  // Handle both internal and external state changes
  const handleToggle = (newValue: boolean) => {
    setIsDark(newValue);
    onValueChange(newValue);
  };

  return (
    <View style={styles.toggleContainer}>
      <Switch
        value={isDark}
        onValueChange={handleToggle}
        thumbColor={isDark ? '#FFFFFF' : '#FFFFFF'}
        trackColor={{ false: 'rgba(255,255,255,0.4)', true: 'rgba(255,255,255,0.4)' }}
        ios_backgroundColor="rgba(255,255,255,0.4)"
        style={styles.switch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    padding: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  switch: {
    transform: [{ scale: 1.2 }],
  },
});

export default DarkModeToggle;
