import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AccentColors, Spacing, BorderRadius, Typography, Shadows } from '../../constants/brand';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export default function PrimaryButton({ title, onPress, disabled, style }: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[styles.container, disabled && styles.disabled, style]}
    >
      <LinearGradient
        colors={disabled ? ['#3A4A5E', '#3A4A5E'] : ['#6894D4', '#5684C4', '#4A75B5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Text style={[styles.text, disabled && styles.textDisabled]}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  disabled: {
    opacity: 0.5,
  },
  gradient: {
    paddingVertical: 18,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  textDisabled: {
    color: 'rgba(255,255,255,0.4)',
  },
});
