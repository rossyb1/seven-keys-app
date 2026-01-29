import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Calendar, Users, Clock, Sparkles, ArrowRight, Compass, LayoutGrid } from 'lucide-react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { getUserProfile, getNextUpcomingBooking } from '../../src/services/api';
import AnimatedPressable from '../../src/components/AnimatedPressable';
import type { User, Booking } from '../../src/types/database';

interface HomeScreenProps {
  navigation: any;
}

interface Category {
  id: string;
  name: string;
  image: any;
  subtitle: string;
  enabled: boolean;
}

// Tier thresholds for progress calculation
const TIER_THRESHOLDS = {
  blue: 0,
  silver: 5000,
  gold: 25000,
  black: 100000,
};

const categories: Category[] = [
  { 
    id: 'restaurants', 
    name: 'RESTAURANTS & BARS', 
    image: require('../../Images/restaurants-category.jpg'), 
    subtitle: '17 venues', 
    enabled: true 
  },
  { 
    id: 'beach_clubs', 
    name: 'BEACH CLUBS', 
    image: require('../../Images/beachclub-category.jpg'), 
    subtitle: '8 venues', 
    enabled: true 
  },
  { 
    id: 'events', 
    name: 'EVENTS', 
    image: require('../../Images/events-category.jpg'), 
    subtitle: 'Worldwide', 
    enabled: false 
  },
  { 
    id: 'experiences', 
    name: 'EXPERIENCES', 
    image: require('../../Images/experiences-category.jpg'), 
    subtitle: 'Yachts & more', 
    enabled: true 
  },
  { 
    id: 'villas', 
    name: 'VILLAS', 
    image: require('../../Images/villas-category.jpg'), 
    subtitle: 'Ibiza & more', 
    enabled: true 
  },
];

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { user: authUser } = useAuth();
  const scrollViewRef = useRef<ScrollView>(null);
  const [user, setUser] = useState<User | null>(null);
  const [upcomingBooking, setUpcomingBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data and upcoming booking
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const profileResult = await getUserProfile();
          if (profileResult.user) {
            setUser(profileResult.user);
          }

          // Optimized: fetch only the next upcoming booking server-side
          const bookingResult = await getNextUpcomingBooking();
          setUpcomingBooking(bookingResult.booking || null);
        } catch (error) {
          console.error('Error fetching home data:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }, [])
  );

  const handleCategoryPress = (category: Category) => {
    if (category.enabled) {
      if (category.id === 'experiences') {
        navigation.navigate('ExperiencesList');
      } else if (category.id === 'villas') {
        navigation.navigate('VillasList');
      } else {
        navigation.navigate('CategoryVenues', {
          categoryId: category.id,
          categoryName: category.name,
        });
      }
    } else {
      Alert.alert(
        'Coming Soon',
        "We'll notify you when this is available.",
        [{ text: 'OK' }]
      );
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getFirstName = () => {
    if (!user?.full_name) return '';
    return user.full_name.split(' ')[0];
  };

  const formatBookingDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getTierColors = (tier: string): [string, string] => {
    switch (tier?.toLowerCase()) {
      case 'black': return ['#2a2a2a', '#1a1a1a'];
      case 'gold': return ['#D4AF37', '#B8860B'];
      case 'silver': return ['#A8A8A8', '#71717a'];
      default: return ['#4A7DB8', '#1e3a5f']; // Blue
    }
  };

  const getTierProgress = () => {
    if (!user) return { progress: 0, nextTier: 'Silver', pointsNeeded: 5000 };
    
    const points = user.points_balance || 0;
    const tier = user.tier?.toLowerCase() || 'blue';
    
    if (tier === 'black') return { progress: 100, nextTier: 'Black', pointsNeeded: 0 };
    
    let currentThreshold = 0;
    let nextThreshold = 5000;
    let nextTier = 'Silver';
    
    if (tier === 'blue') {
      currentThreshold = 0;
      nextThreshold = TIER_THRESHOLDS.silver;
      nextTier = 'Silver';
    } else if (tier === 'silver') {
      currentThreshold = TIER_THRESHOLDS.silver;
      nextThreshold = TIER_THRESHOLDS.gold;
      nextTier = 'Gold';
    } else if (tier === 'gold') {
      currentThreshold = TIER_THRESHOLDS.gold;
      nextThreshold = TIER_THRESHOLDS.black;
      nextTier = 'Black';
    }
    
    const pointsInTier = points - currentThreshold;
    const pointsNeeded = nextThreshold - currentThreshold;
    const progress = Math.min((pointsInTier / pointsNeeded) * 100, 100);
    
    return { progress, nextTier, pointsNeeded: nextThreshold - points };
  };

  const scrollToCategories = () => {
    scrollViewRef.current?.scrollTo({ y: 350, animated: true });
  };

  const tierProgress = getTierProgress();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting & Points Row */}
        <View style={styles.greetingRow}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            {user && <Text style={styles.userName}>{getFirstName()}</Text>}
            <Text style={styles.tagline}>Priority access to the best spots</Text>
          </View>
          {user && (user.points_balance || 0) > 0 ? (
            <TouchableOpacity 
              style={styles.pointsBadge}
              onPress={() => navigation.navigate('SevenKCard')}
            >
              <Sparkles size={14} color="#5684C4" strokeWidth={2} />
              <Text style={styles.pointsText}>{user.points_balance?.toLocaleString()}</Text>
            </TouchableOpacity>
          ) : user ? (
            <TouchableOpacity 
              style={styles.pointsBadgeEmpty}
              onPress={() => navigation.navigate('SevenKCard')}
            >
              <Text style={styles.pointsTextEmpty}>Start earning</Text>
              <ArrowRight size={12} color="rgba(255,255,255,0.5)" strokeWidth={2} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Compact Membership Card with tier accent */}
        {user && (
          <TouchableOpacity 
            style={styles.membershipCard}
            onPress={() => navigation.navigate('SevenKCard')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={getTierColors(user.tier || 'blue')}
              style={styles.tierAccent}
            />
            <View style={styles.membershipContent}>
              <View style={styles.membershipTop}>
                <View style={styles.membershipLeft}>
                  <Text style={styles.membershipLabel}>7K MEMBER</Text>
                  <Text style={styles.membershipTier}>{user.tier?.toUpperCase() || 'BLUE'}</Text>
                </View>
                <ChevronRight size={20} color="rgba(255,255,255,0.4)" strokeWidth={1.5} />
              </View>
              {/* Mini progress bar */}
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <LinearGradient
                    colors={getTierColors(user.tier || 'blue')}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.progressFill, { width: `${tierProgress.progress}%` }]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {tierProgress.pointsNeeded > 0 
                    ? `${tierProgress.pointsNeeded.toLocaleString()} pts to ${tierProgress.nextTier}`
                    : 'Max tier reached'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Upcoming Booking or Empty State */}
        <View style={styles.bookingSection}>
          <Text style={styles.sectionTitle}>UPCOMING</Text>
          {isLoading ? (
            <View style={styles.bookingCard}>
              <ActivityIndicator size="small" color="#5684C4" />
            </View>
          ) : upcomingBooking ? (
            <TouchableOpacity 
              style={styles.bookingCard}
              onPress={() => navigation.navigate('Bookings')}
              activeOpacity={0.8}
            >
              <View style={styles.bookingInfo}>
                <Text style={styles.bookingVenue}>
                  {(upcomingBooking as any).venues?.name || (upcomingBooking as any).venue?.name || 'Venue'}
                </Text>
                <View style={styles.bookingDetails}>
                  <View style={styles.bookingDetailItem}>
                    <Calendar size={12} color="rgba(255,255,255,0.5)" strokeWidth={1.5} />
                    <Text style={styles.bookingDetailText}>
                      {formatBookingDate((upcomingBooking as any).booking_date)}
                    </Text>
                  </View>
                  {(upcomingBooking as any).booking_time && (
                    <View style={styles.bookingDetailItem}>
                      <Clock size={12} color="rgba(255,255,255,0.5)" strokeWidth={1.5} />
                      <Text style={styles.bookingDetailText}>
                        {formatTime((upcomingBooking as any).booking_time)}
                      </Text>
                    </View>
                  )}
                  <View style={styles.bookingDetailItem}>
                    <Users size={12} color="rgba(255,255,255,0.5)" strokeWidth={1.5} />
                    <Text style={styles.bookingDetailText}>
                      {(upcomingBooking as any).party_size} guests
                    </Text>
                  </View>
                </View>
              </View>
              <ChevronRight size={20} color="rgba(255,255,255,0.4)" strokeWidth={1.5} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.emptyBookingCard}
              onPress={scrollToCategories}
              activeOpacity={0.8}
            >
              <View style={styles.emptyBookingIcon}>
                <Compass size={24} color="#5684C4" strokeWidth={1.5} />
              </View>
              <Text style={styles.emptyBookingTitle}>Where to tonight?</Text>
              <Text style={styles.emptyBookingText}>Skip the queues, get the best tables</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderIcon}>
            <LayoutGrid size={14} color="#5684C4" strokeWidth={2} />
          </View>
          <Text style={styles.sectionHeaderText}>EXPLORE</Text>
        </View>

        {/* Category Cards */}
        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <AnimatedPressable
              key={category.id}
              style={styles.categoryCard}
              onPress={() => handleCategoryPress(category)}
              scaleValue={0.98}
              hapticType="light"
            >
              <ImageBackground
                source={category.image}
                style={styles.categoryImage}
                resizeMode="cover"
              >
                <LinearGradient
                  colors={['rgba(10,22,40,0.75)', 'rgba(10,22,40,0.35)', 'rgba(10,22,40,0.1)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.categoryGradient}
                >
                  <View style={styles.categoryContent}>
                    <View style={styles.categoryTextContainer}>
                      <Text style={styles.categoryName}>{category.name}</Text>
                      <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
                    </View>
                    <View style={styles.categoryArrow}>
                      <ChevronRight size={22} color="rgba(255,255,255,0.6)" strokeWidth={2} />
                    </View>
                  </View>
                </LinearGradient>
              </ImageBackground>
            </AnimatedPressable>
          ))}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 120,
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 2,
  },
  userName: {
    fontSize: 28,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 4,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(86,132,196,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(86,132,196,0.25)',
  },
  pointsText: {
    color: '#5684C4',
    fontSize: 14,
    fontWeight: '700',
  },
  pointsBadgeEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  pointsTextEmpty: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontWeight: '500',
  },
  membershipCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 14,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  tierAccent: {
    width: 4,
  },
  membershipContent: {
    flex: 1,
    padding: 14,
  },
  membershipTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  membershipLeft: {
    flex: 1,
  },
  membershipLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.5,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 2,
  },
  membershipTier: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  progressContainer: {
    gap: 6,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
  },
  bookingSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 10,
  },
  bookingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    padding: 16,
    minHeight: 70,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingVenue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  bookingDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  bookingDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bookingDetailText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  emptyBookingCard: {
    backgroundColor: 'rgba(86,132,196,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(86,132,196,0.2)',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
  },
  emptyBookingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(86,132,196,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyBookingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  emptyBookingText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
  },
  emptyBookingCta: {
    fontSize: 14,
    color: '#5684C4',
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  sectionHeaderIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: 'rgba(86,132,196,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: 'rgba(255,255,255,0.6)',
  },
  categoriesContainer: {
    gap: 14,
  },
  categoryCard: {
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryTextContainer: {
    flex: 1,
  },
  categoryName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  categorySubtitle: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 14,
  },
  categoryArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
