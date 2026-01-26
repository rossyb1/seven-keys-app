import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandColors, BackgroundColors, TextColors, AccentColors, Spacing, BorderRadius, Typography } from '../constants/brand';
import { ChevronLeft } from '../components/icons/AppIcons';
import PrimaryButton from '../components/buttons/PrimaryButton';

interface AgeGroupScreenProps {
  navigation: any;
}

const AGE_GROUPS = ['18-25', '26-35', '36-45', '46+'];

export default function AgeGroupScreen({ navigation }: AgeGroupScreenProps) {
  const insets = useSafeAreaInsets();
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <ChevronLeft size={24} color={TextColors.primary} strokeWidth={1.5} />
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <Text style={styles.headline}>What's your age group?</Text>

          <View style={styles.ageGroupsList}>
            {AGE_GROUPS.map((ageGroup) => {
              const isSelected = selectedAgeGroup === ageGroup;
              return (
                <TouchableOpacity
                  key={ageGroup}
                  style={[
                    styles.ageGroupCard,
                    isSelected && styles.ageGroupCardSelected,
                  ]}
                  onPress={() => setSelectedAgeGroup(ageGroup)}
                >
                  <Text
                    style={[
                      styles.ageGroupText,
                      isSelected && styles.ageGroupTextSelected,
                    ]}
                  >
                    {ageGroup}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + Spacing.base }]}>
        <PrimaryButton
          title="CONTINUE"
          onPress={() => {
            if (selectedAgeGroup) {
              navigation.navigate('Permissions');
            }
          }}
          disabled={!selectedAgeGroup}
          style={{ width: '100%' }}
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
  backButton: {
    padding: Spacing.base,
    alignSelf: 'flex-start',
    paddingTop: Spacing.xl,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.base,
  },
  headline: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.xl,
    fontWeight: '600',
    marginBottom: Spacing.xl * 2,
  },
  ageGroupsList: {
    marginBottom: Spacing.xl,
  },
  buttonContainer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.base,
  },
  ageGroupCard: {
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.base,
    borderWidth: 1,
    borderColor: AccentColors.border,
    backgroundColor: BackgroundColors.secondary,
    alignItems: 'center',
  },
  ageGroupCardSelected: {
    borderColor: AccentColors.primary,
    borderWidth: 2,
  },
  ageGroupText: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.lg,
    fontWeight: '500',
  },
  ageGroupTextSelected: {
    color: AccentColors.primary,
  },
});
