import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { AccentColors, TextColors, Spacing, Typography } from '../../constants/brand';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'large';
}

export default function LoadingState({ message = 'Loading...', size = 'large' }: LoadingStateProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={AccentColors.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing['3xl'],
  },
  message: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.base,
    marginTop: Spacing.base,
    fontFamily: Typography.fontFamily.regular,
  },
});
