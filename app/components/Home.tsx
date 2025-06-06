import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useDarkMode } from '../hooks/useDarkMode';
import Header from './Header';

export default function Home() {
  const [isDark] = useDarkMode();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={isDark ? ['#1E3A8A', '#0F172A'] : ['#fceabb', '#f8b500']}
        style={styles.gradient}
        start={{ x: 0.2, y: 0.1 }}
        end={{ x: 1, y: 1 }}
      />
      <Header />
      <View style={styles.content}>
        <Text style={[styles.text, { color: isDark ? '#FFFFFF' : '#333' }]}>
          Welcome to Home Screen
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
