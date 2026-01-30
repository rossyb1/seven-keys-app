import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { useAuth } from '../src/contexts/AuthContext';
import { BackgroundColors, TextColors, AccentColors, Typography, BorderRadius, Spacing } from '../constants/brand';
import { Bell } from '../components/icons/AppIcons';

interface PermissionsScreenProps {
  navigation: any;
}

export default function PermissionsScreen({ navigation }: PermissionsScreenProps) {
  const insets = useSafeAreaInsets();
  const [isRequesting, setIsRequesting] = useState(false);
  const { refreshUser } = useAuth();

  const handleTurnOn = async () => {
    setIsRequesting(true);
    
    try {
      await Notifications.requestPermissionsAsync();
    } catch (e) {
      console.log('Permission request failed:', e);
    }
    
    const success = await refreshUser();
    console.log('User refresh result:', success);
    
    setIsRequesting(false);
  };

  const handleSkip = async () => {
    setIsRequesting(true);
    
    const success = await refreshUser();
    console.log('User refresh result:', success);
    
    setIsRequesting(false);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Bell size={40} color={AccentColors.primary} strokeWidth={1.5} />
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.headline}>Never miss a moment</Text>
          <View style={styles.accentLine} />
          <Text style={styles.subheadline}>
            Get notified about booking confirmations, exclusive invitations, and last-minute availability.
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleTurnOn}
            disabled={isRequesting}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>
              {isRequesting ? 'ENABLING...' : 'ENABLE NOTIFICATIONS'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
            disabled={isRequesting}
            activeOpacity={0.6}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom note */}
      <View style={[styles.bottomNote, { paddingBottom: insets.bottom + 20 }]}>
        <Text style={styles.bottomNoteText}>
          Change anytime in settings
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColors.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: AccentColors.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  headline: {
    color: TextColors.primary,
    fontSize: Typography.fontSize['2xl'],
    fontWeight: '300',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  accentLine: {
    width: 40,
    height: 2,
    backgroundColor: AccentColors.primary,
    marginVertical: Spacing.base,
  },
  subheadline: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.base,
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
  },
  buttonsContainer: {
    width: '100%',
    gap: Spacing.base,
  },
  primaryButton: {
    backgroundColor: AccentColors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: 18,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    letterSpacing: 2,
  },
  skipButton: {
    paddingVertical: Spacing.base,
    alignItems: 'center',
  },
  skipButtonText: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.base,
  },
  bottomNote: {
    paddingHorizontal: Spacing.xl,
  },
  bottomNoteText: {
    color: TextColors.tertiary,
    fontSize: Typography.fontSize.sm,
    textAlign: 'center',
  },
});
