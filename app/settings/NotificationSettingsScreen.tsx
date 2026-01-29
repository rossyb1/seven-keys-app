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
    backgroundColor: '#0A1628',
  },
  content: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  headerTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  headerSpacer: {
    width: 24,
  },
  sectionHeader: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  toggleList: {
    marginBottom: 8,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    minHeight: 56,
  },
  toggleLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
  toggle: {
    width: 52,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#5684C4',
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  toggleThumbActive: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-end',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: 20,
  },
});
