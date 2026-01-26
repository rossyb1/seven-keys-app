import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { getVenues } from '../../src/services/api';
import { getVenueImage } from '../../src/utils/venueImages';
import type { Venue } from '../../src/types/database';
import PrimaryButton from '../../components/buttons/PrimaryButton';

const BACKGROUND_COLOR = '#0A1628';
const INPUT_BG = '#111D2E';
const ACCENT_COLOR = '#5684C4';
const BORDER_RADIUS = 12;

interface RecommendationsScreenProps {
  navigation: any;
}

const CATEGORIES = ['Dinner', 'Drinks', 'Beach Club'];
const CUISINES = ['Italian', 'Japanese', 'Mediterranean', 'Steakhouse', 'Asian', 'Any'];
const VIBES_DINNER = ['Romantic', 'Lively', 'Chill', 'Trendy'];
const VIBES_DRINKS = ['Rooftop', 'Lounge', 'Bar', 'Club'];
const AREAS = ['DIFC', 'Marina', 'Downtown', 'JBR', 'Any'];

export default function RecommendationsScreen({ navigation }: RecommendationsScreenProps) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<string | null>(null);
  const [cuisine, setCuisine] = useState<string | null>(null);
  const [vibe, setVibe] = useState<string | null>(null);
  const [area, setArea] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (step === 3) {
      fetchRecommendations();
    }
  }, [step]);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      const filters: any = {};
      
      if (category === 'Dinner') {
        filters.type = 'restaurant';
        if (cuisine && cuisine !== 'Any') {
          // Map cuisine to vibe_tags or filter by name
          filters.vibe = cuisine.toLowerCase();
        }
      } else if (category === 'Drinks') {
        filters.type = 'restaurant'; // Most drink venues are restaurants
        if (vibe && vibe !== 'Any') {
          filters.vibe = vibe.toLowerCase();
        }
      } else if (category === 'Beach Club') {
        filters.type = 'beach_club';
      }

      if (area && area !== 'Any') {
        filters.city = area;
      }

      const result = await getVenues(filters);
      if (result.venues) {
        // Limit to 3 recommendations
        setRecommendations(result.venues.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (selectedCategory: string) => {
    setCategory(selectedCategory);
    if (selectedCategory === 'Beach Club') {
      // Skip to step 3 (results)
      setStep(3);
    } else {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 1) {
      navigation.goBack();
    } else if (step === 2) {
      setStep(1);
      setCuisine(null);
      setVibe(null);
      setArea(null);
    } else {
      setStep(2);
      setRecommendations([]);
    }
  };

  const handleBookNow = (venue: Venue) => {
    navigation.navigate('ReservationForm', { venue });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <ChevronLeft size={24} color="#FFFFFF" strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Get Recommendations</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {step === 1 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>What are you looking for?</Text>
            <View style={styles.buttonGrid}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={styles.categoryButton}
                  onPress={() => handleCategorySelect(cat)}
                >
                  <Text style={styles.categoryButtonText}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {step === 2 && category === 'Dinner' && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Cuisine preference?</Text>
            <View style={styles.buttonGrid}>
              {CUISINES.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.filterButton,
                    cuisine === c && styles.filterButtonSelected,
                  ]}
                  onPress={() => setCuisine(c)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      cuisine === c && styles.filterButtonTextSelected,
                    ]}
                  >
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.stepTitle}>What vibe?</Text>
            <View style={styles.buttonGrid}>
              {VIBES_DINNER.map((v) => (
                <TouchableOpacity
                  key={v}
                  style={[
                    styles.filterButton,
                    vibe === v && styles.filterButtonSelected,
                  ]}
                  onPress={() => setVibe(v)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      vibe === v && styles.filterButtonTextSelected,
                    ]}
                  >
                    {v}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.stepTitle}>Area preference?</Text>
            <View style={styles.buttonGrid}>
              {AREAS.map((a) => (
                <TouchableOpacity
                  key={a}
                  style={[
                    styles.filterButton,
                    area === a && styles.filterButtonSelected,
                  ]}
                  onPress={() => setArea(a)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      area === a && styles.filterButtonTextSelected,
                    ]}
                  >
                    {a}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.continueButton}>
              <PrimaryButton
                title="GET RECOMMENDATIONS"
                onPress={() => setStep(3)}
                disabled={!cuisine || !vibe || !area}
              />
            </View>
          </View>
        )}

        {step === 2 && category === 'Drinks' && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>What vibe?</Text>
            <View style={styles.buttonGrid}>
              {VIBES_DRINKS.map((v) => (
                <TouchableOpacity
                  key={v}
                  style={[
                    styles.filterButton,
                    vibe === v && styles.filterButtonSelected,
                  ]}
                  onPress={() => setVibe(v)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      vibe === v && styles.filterButtonTextSelected,
                    ]}
                  >
                    {v}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.stepTitle}>Area preference?</Text>
            <View style={styles.buttonGrid}>
              {AREAS.map((a) => (
                <TouchableOpacity
                  key={a}
                  style={[
                    styles.filterButton,
                    area === a && styles.filterButtonSelected,
                  ]}
                  onPress={() => setArea(a)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      area === a && styles.filterButtonTextSelected,
                    ]}
                  >
                    {a}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.continueButton}>
              <PrimaryButton
                title="GET RECOMMENDATIONS"
                onPress={() => setStep(3)}
                disabled={!vibe || !area}
              />
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Recommendations</Text>
            {isLoading ? (
              <Text style={styles.loadingText}>Finding the perfect venues...</Text>
            ) : recommendations.length > 0 ? (
              recommendations.map((venue) => {
                const localImage = getVenueImage(venue.name);
                return (
                  <View key={venue.id} style={styles.venueCard}>
                    {localImage && (
                      <Image source={localImage} style={styles.venueImage} resizeMode="cover" />
                    )}
                    <View style={styles.venueInfo}>
                      <Text style={styles.venueName}>{venue.name}</Text>
                      <Text style={styles.venueType}>
                        {venue.type === 'restaurant' ? 'Restaurant' :
                         venue.type === 'beach_club' ? 'Beach Club' :
                         venue.type === 'nightclub' ? 'Nightclub' : venue.type}
                        {venue.location && ` • ${venue.location}`}
                      </Text>
                      <TouchableOpacity
                        style={styles.bookButton}
                        onPress={() => handleBookNow(venue)}
                      >
                        <Text style={styles.bookButtonText}>Book Now</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            ) : (
              <Text style={styles.noResultsText}>No venues found. Try adjusting your filters.</Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  stepContent: {
    padding: 16,
    paddingBottom: 100,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
    marginTop: 8,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  categoryButton: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: INPUT_BG,
    borderRadius: BORDER_RADIUS,
    padding: 24,
    alignItems: 'center',
  },
  categoryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  filterButton: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: INPUT_BG,
    borderRadius: BORDER_RADIUS,
    padding: 16,
    alignItems: 'center',
  },
  filterButtonSelected: {
    backgroundColor: ACCENT_COLOR,
  },
  filterButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  filterButtonTextSelected: {
    color: '#FFFFFF',
  },
  continueButton: {
    marginTop: 24,
  },
  venueCard: {
    backgroundColor: INPUT_BG,
    borderRadius: BORDER_RADIUS,
    marginBottom: 16,
    overflow: 'hidden',
  },
  venueImage: {
    width: '100%',
    height: 180,
  },
  venueInfo: {
    padding: 16,
  },
  venueName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  venueType: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  bookButton: {
    backgroundColor: ACCENT_COLOR,
    borderRadius: BORDER_RADIUS,
    padding: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 40,
  },
  noResultsText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 40,
  },
});
