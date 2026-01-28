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
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 16,
    minHeight: 90,
    justifyContent: 'center',
  },
  cardGold: {
    borderColor: 'rgba(86,132,196,0.25)',
    backgroundColor: 'rgba(86,132,196,0.08)',
  },
  value: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  valueGold: {
    color: '#5684C4',
  },
  label: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
  },
  labelGold: {
    color: 'rgba(255,255,255,0.5)',
  },
});
