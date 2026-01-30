import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackgroundColors, TextColors, AccentColors, Typography, BorderRadius, Spacing } from '../constants/brand';
import { ChevronLeft, Check } from '../components/icons/AppIcons';

interface AgeGroupScreenProps {
  navigation: any;
}

const AGE_GROUPS = ['18-25', '26-35', '36-45', '46+'];

export default function AgeGroupScreen({ navigation }: AgeGroupScreenProps) {
  const insets = useSafeAreaInsets();
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedAgeGroup) {
      navigation.navigate('Permissions');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={20} color={TextColors.primary} strokeWidth={1.5} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.headline}>Age range</Text>
          <View style={styles.accentLine} />
          <Text style={styles.subheadline}>
            Helps us tailor your recommendations
          </Text>
        </View>

        {/* Age Groups */}
        <View style={styles.ageGroupsContainer}>
          {AGE_GROUPS.map((group) => {
            const isSelected = selectedAgeGroup === group;
            return (
              <TouchableOpacity
                key={group}
                style={[
                  styles.ageGroupCard,
                  isSelected && styles.ageGroupCardSelected,
                ]}
                onPress={() => setSelectedAgeGroup(group)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.ageGroupLabel,
                    isSelected && styles.ageGroupLabelSelected,
                  ]}
                >
                  {group}
                </Text>
                {isSelected && (
                  <View style={styles.checkContainer}>
                    <Check size={16} color={AccentColors.primary} strokeWidth={2.5} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedAgeGroup && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selectedAgeGroup}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.continueButtonText,
            !selectedAgeGroup && styles.continueButtonTextDisabled,
          ]}>
            CONTINUE
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColors.primary,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: BackgroundColors.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  titleSection: {
    marginBottom: Spacing['2xl'],
  },
  headline: {
    color: TextColors.primary,
    fontSize: Typography.fontSize['3xl'],
    fontWeight: '300',
    letterSpacing: 1,
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
  },
  ageGroupsContainer: {
    gap: Spacing.md,
  },
  ageGroupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: BackgroundColors.cardBg,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: AccentColors.border,
  },
  ageGroupCardSelected: {
    backgroundColor: AccentColors.primaryMuted,
    borderColor: AccentColors.primary,
  },
  ageGroupLabel: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.lg,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  ageGroupLabelSelected: {
    color: AccentColors.primary,
  },
  checkContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: AccentColors.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.base,
  },
  continueButton: {
    backgroundColor: AccentColors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: 18,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: BackgroundColors.cardBg,
  },
  continueButtonText: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    letterSpacing: 2,
  },
  continueButtonTextDisabled: {
    color: TextColors.tertiary,
  },
});
