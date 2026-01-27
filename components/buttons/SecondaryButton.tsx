import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { AccentColors, BackgroundColors, TextColors, Spacing, BorderRadius, Typography } from '../../constants/brand';

interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export default function SecondaryButton({ title, onPress, disabled, style }: SecondaryButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[styles.container, disabled && styles.disabled, style]}
    >
      <Text style={[styles.text, disabled && styles.textDisabled]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: BackgroundColors.secondary,
    borderWidth: 1,
    borderColor: AccentColors.border,
    borderRadius: BorderRadius.base,
    paddingVertical: Spacing.base + 2,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.semibold,
    letterSpacing: 1,
  },
  textDisabled: {
    color: TextColors.tertiary,
  },
});
