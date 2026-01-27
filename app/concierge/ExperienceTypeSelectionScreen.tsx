import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Anchor, Palmtree, Car, Plane } from 'lucide-react-native';

interface ExperienceTypeSelectionScreenProps {
  navigation: any;
}

type ExperienceType = {
  id: string;
  label: string;
  icon: React.ComponentType<{ size: number; color: string; strokeWidth: number }>;
};

const EXPERIENCE_TYPES: ExperienceType[] = [
  { id: 'yachts', label: 'Yachts', icon: Anchor },
  { id: 'desert', label: 'Desert Experiences', icon: Palmtree },
  { id: 'chauffeur', label: 'Private Chauffeur', icon: Car },
  { id: 'private_jet', label: 'Private Jet', icon: Plane },
];

export default function ExperienceTypeSelectionScreen({ navigation }: ExperienceTypeSelectionScreenProps) {
  const handleExperienceTypeSelect = (experienceType: string) => {
    navigation.navigate('ExperienceForm', { experienceType });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ChevronLeft size={24} color="#FFFFFF" strokeWidth={1.5} />
        </TouchableOpacity>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Select Experience Type</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.subtitle}>What type of experience would you like to book?</Text>

        <View style={styles.optionsContainer}>
          {EXPERIENCE_TYPES.map((experienceType) => {
            const IconComponent = experienceType.icon;
            return (
              <TouchableOpacity
                key={experienceType.id}
                style={styles.optionButton}
                onPress={() => handleExperienceTypeSelect(experienceType.id)}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  <IconComponent size={28} color="#5684C4" strokeWidth={1.5} />
                </View>
                <Text style={styles.optionText}>{experienceType.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  titleSection: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 32,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 16,
  },
  optionButton: {
    backgroundColor: '#111D2E',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(86, 132, 196, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});
