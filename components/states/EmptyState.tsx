import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextColors, AccentColors, Spacing, Typography, BorderRadius, BackgroundColors } from '../../constants/brand';
import { LucideIcon } from 'lucide-react-native';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  message: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon: Icon, title, message, action }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {Icon && (
        <View style={styles.iconContainer}>
          <Icon size={48} color={TextColors.tertiary} strokeWidth={1.5} />
        </View>
      )}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {action && <View style={styles.actionContainer}>{action}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl * 2,
    paddingVertical: Spacing['3xl'],
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.full,
    backgroundColor: BackgroundColors.secondary,
    borderWidth: 1,
    borderColor: AccentColors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.xl,
    fontFamily: Typography.fontFamily.semibold,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  message: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.regular,
    textAlign: 'center',
    lineHeight: Typography.fontSize.base * Typography.lineHeight.relaxed,
    marginBottom: Spacing.xl,
  },
  actionContainer: {
    marginTop: Spacing.base,
  },
});
