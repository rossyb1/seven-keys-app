import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BrandColors, BackgroundColors, TextColors, AccentColors, Spacing, BorderRadius, Typography, Shadows } from '../../constants/brand';

interface StatsCardProps {
  value: string | number;
  label: string;
  variant?: 'default' | 'gold';
}

export default function StatsCard({ value, label, variant = 'default' }: StatsCardProps) {
  return (
    <View
      style={[
        styles.card,
        variant === 'gold' && styles.cardGold,
      ]}
    >
      <Text
        style={[
          styles.value,
          variant === 'gold' && styles.valueGold,
        ]}
      >
        {value}
      </Text>
      <Text
        style={[
          styles.label,
          variant === 'gold' && styles.labelGold,
        ]}
      >
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: 'rgba(16, 29, 48, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(86, 132, 196, 0.15)',
    borderRadius: 16,
    padding: Spacing.lg,
    minHeight: 90,
    justifyContent: 'center',
    ...Shadows.sm,
  },
  cardGold: {
    borderColor: 'rgba(86, 132, 196, 0.4)',
    backgroundColor: 'rgba(86, 132, 196, 0.08)',
    ...Shadows.rewardGlow,
  },
  value: {
    color: TextColors.primary,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  valueGold: {
    color: AccentColors.reward,
  },
  label: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.xs,
    fontWeight: '500',
    letterSpacing: 1,
  },
  labelGold: {
    color: TextColors.secondary,
  },
});
