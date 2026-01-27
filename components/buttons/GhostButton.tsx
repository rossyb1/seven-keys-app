import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { AccentColors, TextColors, Spacing, BorderRadius, Typography } from '../../constants/brand';

interface GhostButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export default function GhostButton({ title, onPress, disabled, style }: GhostButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[styles.container, disabled && styles.disabled, style]}
    >
      <Text style={[styles.text, disabled && styles.textDisabled]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: AccentColors.primary,
    borderRadius: BorderRadius.base,
    paddingVertical: Spacing.base + 2,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  disabled: {
    opacity: 0.5,
    borderColor: AccentColors.border,
  },
  text: {
    color: AccentColors.primary,
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.semibold,
    letterSpacing: 1,
  },
  textDisabled: {
    color: TextColors.tertiary,
  },
});
