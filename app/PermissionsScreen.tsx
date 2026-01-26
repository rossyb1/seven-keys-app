import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import { useAuth } from '../src/contexts/AuthContext';
import { BrandColors, BackgroundColors, TextColors, AccentColors, Spacing, BorderRadius, Typography } from '../constants/brand';
import { Bell } from '../components/icons/AppIcons';
import PrimaryButton from '../components/buttons/PrimaryButton';

interface PermissionsScreenProps {
  navigation: any;
}

export default function PermissionsScreen({ navigation }: PermissionsScreenProps) {
  const [isRequesting, setIsRequesting] = useState(false);
  const { refreshUser } = useAuth();

  const handleTurnOn = async () => {
    setIsRequesting(true);
    
    try {
      await Notifications.requestPermissionsAsync();
    } catch (e) {
      console.log('Permission request failed:', e);
    }
    
    // Directly refresh user state - this will set isAuthenticated to true
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
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.formContainer}>
          <View style={styles.iconContainer}>
            <Bell size={48} color={AccentColors.primary} strokeWidth={1.5} />
          </View>
          
          <Text style={styles.headline}>Your concierge, always on</Text>
          
          <Text style={styles.subtext}>
            Reserved tables, private events, and moments that won't wait.
          </Text>

          <PrimaryButton
            title={isRequesting ? 'REQUESTING...' : 'TURN ON NOTIFICATIONS'}
            onPress={handleTurnOn}
            disabled={isRequesting}
            style={{ width: '100%', marginBottom: Spacing.lg }}
          />

          <TouchableOpacity
            style={styles.skipLink}
            onPress={handleSkip}
            disabled={isRequesting}
          >
            <Text style={styles.skipLinkText}>Skip</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: Spacing.xl,
  },
  formContainer: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(86, 132, 196, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl * 2,
  },
  headline: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.xl,
    fontWeight: '600',
    marginBottom: Spacing.base,
    textAlign: 'center',
  },
  subtext: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
    marginBottom: Spacing.xl * 2,
    paddingHorizontal: Spacing.xl,
  },
  skipLink: {
    alignItems: 'center',
  },
  skipLinkText: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.sm,
  },
});
