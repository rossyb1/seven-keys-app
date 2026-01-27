import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandColors, BackgroundColors, TextColors, AccentColors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/brand';
import { ChevronLeft } from '../../components/icons/AppIcons';

interface NotificationSettingsScreenProps {
  navigation: any;
}

interface ToggleItem {
  label: string;
  value: boolean;
}

export default function NotificationSettingsScreen({ navigation }: NotificationSettingsScreenProps) {
  const [bookingConfirmations, setBookingConfirmations] = useState(true);
  const [bookingReminders, setBookingReminders] = useState(true);
  const [pointsEarned, setPointsEarned] = useState(false);
  const [tierUpgrades, setTierUpgrades] = useState(true);
  const [newVenues, setNewVenues] = useState(true);
  const [exclusiveEvents, setExclusiveEvents] = useState(true);

  const ToggleSwitch = ({ value, onToggle }: { value: boolean; onToggle: () => void }) => (
    <TouchableOpacity
      style={[styles.toggle, value && styles.toggleActive]}
      onPress={onToggle}
    >
      <View style={[styles.toggleThumb, value && styles.toggleThumbActive]} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={TextColors.primary} strokeWidth={1.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Booking Updates Section */}
        <Text style={styles.sectionHeader}>BOOKING UPDATES</Text>
        <View style={styles.toggleList}>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Booking confirmations</Text>
            <ToggleSwitch
              value={bookingConfirmations}
              onToggle={() => setBookingConfirmations(!bookingConfirmations)}
            />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Booking reminders</Text>
            <ToggleSwitch
              value={bookingReminders}
              onToggle={() => setBookingReminders(!bookingReminders)}
            />
          </View>
        </View>

        <View style={styles.divider} />

        {/* Points & Status Section */}
        <Text style={styles.sectionHeader}>POINTS & STATUS</Text>
        <View style={styles.toggleList}>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Points earned</Text>
            <ToggleSwitch
              value={pointsEarned}
              onToggle={() => setPointsEarned(!pointsEarned)}
            />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Tier upgrades</Text>
            <ToggleSwitch
              value={tierUpgrades}
              onToggle={() => setTierUpgrades(!tierUpgrades)}
            />
          </View>
        </View>

        <View style={styles.divider} />

        {/* Marketing Section */}
        <Text style={styles.sectionHeader}>MARKETING</Text>
        <View style={styles.toggleList}>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>New venues</Text>
            <ToggleSwitch
              value={newVenues}
              onToggle={() => setNewVenues(!newVenues)}
            />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Exclusive events</Text>
            <ToggleSwitch
              value={exclusiveEvents}
              onToggle={() => setExclusiveEvents(!exclusiveEvents)}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColors.primary,
  },
  content: {
    flex: 1,
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  headerTitle: {
    flex: 1,
    color: TextColors.primary,
    fontSize: Typography.fontSize.xl,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 24,
  },
  sectionHeader: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.semibold,
    letterSpacing: Typography.letterSpacing.normal,
    marginBottom: Spacing.base,
  },
  toggleList: {
    marginBottom: Spacing.xl,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: BackgroundColors.cardBg,
    borderWidth: 1,
    borderColor: AccentColors.borderLight,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    marginBottom: Spacing.sm,
    minHeight: 56,
    ...Shadows.sm,
  },
  toggleLabel: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.semibold,
  },
  toggle: {
    width: 56,
    height: 32,
    borderRadius: 16,
    backgroundColor: BackgroundColors.secondary,
    borderWidth: 1,
    borderColor: AccentColors.border,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: AccentColors.primary,
    borderColor: AccentColors.primary,
  },
  toggleThumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: TextColors.tertiary,
  },
  toggleThumbActive: {
    backgroundColor: BrandColors.black,
    alignSelf: 'flex-end',
  },
  divider: {
    height: 1,
    backgroundColor: AccentColors.border,
    marginVertical: Spacing.xl,
  },
});
