import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BrandColors, BackgroundColors, TextColors, AccentColors, Spacing, Typography, BorderRadius } from '../../constants/brand';
import { ChevronLeft } from '../../components/icons/AppIcons';
import PrimaryButton from '../../components/buttons/PrimaryButton';

interface AddGuestsScreenProps {
  navigation: any;
  route: any;
}

export default function AddGuestsScreen({ navigation, route }: AddGuestsScreenProps) {
  const booking = route.params?.booking || { guests: 4 };
  const [newPartySize, setNewPartySize] = useState(booking.guests);

  const increment = () => {
    if (newPartySize < 20) setNewPartySize(newPartySize + 1);
  };

  const decrement = () => {
    if (newPartySize > booking.guests) setNewPartySize(newPartySize - 1);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={TextColors.primary} strokeWidth={1.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Guests</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Current Party Size */}
        <Text style={styles.currentSize}>Current party size: {booking.guests} guests</Text>

        {/* Party Size Selector */}
        <View style={styles.partySizeSection}>
          <Text style={styles.partySizeLabel}>New party size</Text>
          <View style={styles.stepper}>
            <TouchableOpacity
              style={[
                styles.stepperButton,
                newPartySize <= booking.guests && styles.stepperButtonDisabled,
              ]}
              onPress={decrement}
              disabled={newPartySize <= booking.guests}
            >
              <Text
                style={[
                  styles.stepperButtonText,
                  newPartySize <= booking.guests && styles.stepperButtonTextDisabled,
                ]}
              >
                -
              </Text>
            </TouchableOpacity>
            <View style={styles.stepperValue}>
              <Text style={styles.stepperValueText}>{newPartySize}</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.stepperButton,
                newPartySize === 20 && styles.stepperButtonDisabled,
              ]}
              onPress={increment}
              disabled={newPartySize === 20}
            >
              <Text
                style={[
                  styles.stepperButtonText,
                  newPartySize === 20 && styles.stepperButtonTextDisabled,
                ]}
              >
                +
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Warning */}
        <View style={styles.warningBox}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningText}>
            Adding guests may affect your table assignment.
          </Text>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.bottomButtonContainer}>
        <PrimaryButton
          title="SUBMIT REQUEST"
          onPress={() => {
            if (newPartySize > booking.guests) {
              // Handle add guests request
              navigation.goBack();
            }
          }}
          disabled={newPartySize === booking.guests}
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
  currentSize: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.base,
    marginBottom: Spacing.xl * 2,
  },
  partySizeSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  partySizeLabel: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.base,
    marginBottom: Spacing.xl,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepperButton: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.base,
    backgroundColor: BackgroundColors.cardBg,
    borderWidth: 1,
    borderColor: AccentColors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperButtonDisabled: {
    opacity: 0.3,
  },
  stepperButtonText: {
    color: TextColors.primary,
    fontSize: Typography.fontSize['2xl'],
    fontWeight: '300',
  },
  stepperButtonTextDisabled: {
    color: TextColors.tertiary,
  },
  stepperValue: {
    width: 120,
    alignItems: 'center',
    marginHorizontal: Spacing.xl,
  },
  stepperValueText: {
    color: TextColors.primary,
    fontSize: Typography.fontSize['3xl'],
    fontWeight: '600',
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
