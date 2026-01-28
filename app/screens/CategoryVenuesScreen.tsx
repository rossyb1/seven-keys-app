import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search } from 'lucide-react-native';
import { supabase } from '../../src/lib/supabase';
import type { Venue } from '../../src/types/database';
import VenueCard from '../../components/cards/VenueCard';

type Props = {
  route: { params: { categoryId: string; categoryName: string } };
  navigation: any;
};

export default function CategoryVenuesScreen({ route, navigation }: Props) {
  const { categoryId, categoryName } = route.params;
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');

  // Cities array for filter
  const cities = ['All', 'Dubai', 'Marbella', 'Ibiza'];

  // Map categoryId to database type
  const getVenueType = (catId: string): Venue['type'] | null => {
    const typeMap: Record<string, Venue['type']> = {
      'restaurants': 'restaurant',
      'beach_clubs': 'beach_club',
      'events': 'event',
      'nightclubs': 'nightclub',
    };
    return typeMap[catId] || null;
  };

  useEffect(() => {
    const fetchVenues = async () => {
      setLoading(true);
      
      const venueType = getVenueType(categoryId);
      
      if (!venueType) {
        setVenues([]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('venues')
          .select('*')
          .eq('type', venueType)
          .eq('status', 'active')
          .order('name')
          .limit(50); // Pagination - load 50 at a time

        if (error) {
          console.error('Error fetching venues:', error);
          setVenues([]);
        } else {
          setVenues((data as Venue[]) || []);
        }
      } catch (err) {
        console.error('Exception fetching venues:', err);
        setVenues([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [categoryId]);

  // Filter venues based on search and city
  const filteredVenues = useMemo(() => {
    return venues.filter(venue => {
      const matchesSearch = searchQuery === '' || 
        venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.location?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity = selectedCity === 'All' || 
        venue.city?.toLowerCase() === selectedCity.toLowerCase();
      return matchesSearch && matchesCity;
    });
  }, [venues, searchQuery, selectedCity]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#FFFFFF" strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{categoryName}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={18} color="rgba(255,255,255,0.4)" strokeWidth={1.5} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search venues..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      {/* City Filter Pills */}
      <View style={styles.cityFilterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cityFilterContent}
        >
          {cities.map((city) => {
            const isSelected = selectedCity === city;
            return (
              <TouchableOpacity
                key={city}
                style={[
                  styles.cityPill,
                  isSelected ? styles.cityPillSelected : styles.cityPillUnselected,
                ]}
                onPress={() => setSelectedCity(city)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.cityPillText,
                    isSelected ? styles.cityPillTextSelected : styles.cityPillTextUnselected,
                  ]}
                >
                  {city}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5684C4" />
        </View>
      ) : filteredVenues.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No venues found</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.venuesScrollView}
          contentContainerStyle={styles.venuesScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredVenues.map((venue) => (
            <VenueCard
              key={venue.id}
              venue={venue}
              onPress={() => navigation.navigate('VenueDetail', { venue })}
              width="100%"
            />
          ))}
        </ScrollView>
      )}
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.3,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  searchContainer: {
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 16,
  },
  cityFilterContainer: {
    marginBottom: 16,
    paddingLeft: 20,
  },
  cityFilterContent: {
    gap: 8,
    alignItems: 'center',
    paddingRight: 20,
  },
  cityPill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cityPillSelected: {
    backgroundColor: '#5684C4',
  },
  cityPillUnselected: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(255,255,255,0.15)',
  },
  cityPillText: {
    fontSize: 13,
  },
  cityPillTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  cityPillTextUnselected: {
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    textAlign: 'center',
  },
  venuesScrollView: {
    flex: 1,
  },
  venuesScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 100,
    gap: 12,
  },
});
