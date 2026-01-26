import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BrandColors, BackgroundColors, TextColors, AccentColors, Spacing, Typography, BorderRadius } from '../../constants/brand';
import { ChevronLeft } from '../../components/icons/AppIcons';
import PrimaryButton from '../../components/buttons/PrimaryButton';

interface ChangeTimeScreenProps {
  navigation: any;
  route: any;
}

const TIME_SLOTS = [
  '12:00 PM', '1:00 PM', '2:00 PM',
  '3:00 PM', '4:00 PM', '5:00 PM',
  '6:00 PM', '7:00 PM', '8:00 PM',
  '9:00 PM', '10:00 PM', '11:00 PM',
];

export default function ChangeTimeScreen({ navigation, route }: ChangeTimeScreenProps) {
  const booking = route.params?.booking || { time: '8:00 PM' };
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={TextColors.primary} strokeWidth={1.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Change Time</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Current Time */}
        <Text style={styles.currentTime}>Current time: {booking.time}</Text>

        {/* Time Selection */}
        <View style={styles.timeSection}>
          <View style={styles.timeGrid}>
            {TIME_SLOTS.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeSlot,
                  selectedTime === time && styles.timeSlotSelected,
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    selectedTime === time && styles.timeSlotTextSelected,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Warning */}
        <View style={styles.warningBox}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningText}>
            Changes must be requested 24+ hours before your booking.
          </Text>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.bottomButtonContainer}>
        <PrimaryButton
          title="SUBMIT REQUEST"
          onPress={() => {
            if (selectedTime) {
              // Handle time change request
              navigation.goBack();
            }
          }}
          disabled={!selectedTime}
        />
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
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  backArrow: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.xl,
    fontWeight: '300',
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
  currentTime: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.base,
    marginBottom: Spacing.xl * 2,
  },
  timeSection: {
    marginBottom: Spacing.xl,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.base,
  },
  timeSlot: {
    width: '30%',
    backgroundColor: BackgroundColors.cardBg,
    borderWidth: 1,
    borderColor: AccentColors.border,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  timeSlotSelected: {
    borderColor: AccentColors.primary,
    borderWidth: 2,
    backgroundColor: 'rgba(86, 132, 196, 0.1)',
  },
  timeSlotText: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: '500',
  },
  timeSlotTextSelected: {
    color: AccentColors.primary,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    marginBottom: Spacing.xl * 2,
  },
  warningIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  warningText: {
    flex: 1,
    color: TextColors.secondary,
    fontSize: Typography.fontSize.sm,
    lineHeight: 20,
  },
  bottomButtonContainer: {
    padding: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: AccentColors.border,
    backgroundColor: BackgroundColors.primary,
  },
});
