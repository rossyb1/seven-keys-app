import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, UtensilsCrossed, Waves, Music } from 'lucide-react-native';

interface VenueTypeSelectionScreenProps {
  navigation: any;
}

type VenueType = {
  id: string;
  label: string;
  icon: React.ComponentType<{ size: number; color: string; strokeWidth: number }>;
};

const VENUE_TYPES: VenueType[] = [
  { id: 'restaurant', label: 'Restaurant', icon: UtensilsCrossed },
  { id: 'beach_club', label: 'Beach Club', icon: Waves },
  { id: 'nightclub', label: 'Nightclub', icon: Music },
];

export default function VenueTypeSelectionScreen({ navigation }: VenueTypeSelectionScreenProps) {
  const handleVenueTypeSelect = (venueType: string) => {
    navigation.navigate('ReservationForm', { venueType });
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
          <Text style={styles.title}>Select Venue Type</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.subtitle}>What type of venue would you like to book?</Text>

        <View style={styles.optionsContainer}>
          {VENUE_TYPES.map((venueType) => {
            const IconComponent = venueType.icon;
            return (
              <TouchableOpacity
                key={venueType.id}
                style={styles.optionButton}
                onPress={() => handleVenueTypeSelect(venueType.id)}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  <IconComponent size={28} color="#5684C4" strokeWidth={1.5} />
                </View>
                <Text style={styles.optionText}>{venueType.label}</Text>
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
