import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Linking,
  Dimensions,
  FlatList,
  Modal,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronLeft,
  MapPin,
  Clock,
  CreditCard,
  Star,
  Check,
  MessageCircle,
  Shirt,
  X,
} from 'lucide-react-native';
import type { Venue } from '../../src/types/database';
import { getVenueImage } from '../../src/utils/venueImages';
import { getVenueGallery } from '../../src/utils/venueGallery';
import { getVenueLogo } from '../../src/utils/venueLogos';
import { Image } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface VenueDetailScreenProps {
  navigation: any;
  route: any;
}

// Helper function to format venue type for display
const formatVenueType = (type: Venue['type']): string => {
  const typeMap: Record<Venue['type'], string> = {
    'restaurant': 'Restaurant',
    'beach_club': 'Beach Club',
    'nightclub': 'Nightclub',
    'event': 'Event',
  };
  return typeMap[type] || type;
};

// Get price indicator based on minimum spend
const getPriceIndicator = (minSpend: number | null): string => {
  if (!minSpend) return '$$';
  if (minSpend < 500) return '$';
  if (minSpend < 1000) return '$$';
  if (minSpend < 2000) return '$$$';
  return '$$$$';
};

// Format 24h time to 12h format
const formatTime = (time24: string): string => {
  const [hours, minutes] = time24.split(':').map(Number);
  if (isNaN(hours)) return time24;
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return minutes ? `${hours12}:${String(minutes).padStart(2, '0')}${period}` : `${hours12}${period}`;
};

// Format a time range like "18:00-23:30" to "6PM - 11:30PM"
const formatTimeRange = (range: string): string => {
  if (range.toLowerCase() === 'closed') return 'Closed';
  const parts = range.split('-').map(t => t.trim());
  if (parts.length === 2) {
    return `${formatTime(parts[0])} - ${formatTime(parts[1])}`;
  }
  // Handle multiple ranges like "12:00-14:30, 18:00-23:30"
  if (range.includes(',')) {
    const ranges = range.split(',').map(r => {
      const [start, end] = r.trim().split('-').map(t => t.trim());
      return `${formatTime(start)} - ${formatTime(end)}`;
    });
    return ranges.join(', ');
  }
  return range;
};

// Format operating hours - smart display
const formatOperatingHours = (hours: Record<string, string> | null): string => {
  if (!hours) return 'Hours vary';
  
  const entries = Object.entries(hours).filter(([_, time]) => time);
  if (entries.length === 0) return 'Hours vary';
  
  // Get unique non-closed hours
  const openHours = entries.filter(([_, time]) => time.toLowerCase() !== 'closed').map(([_, time]) => time);
  const uniqueHours = new Set(openHours);
  
  // If all open days have same hours, show "Daily [hours]" or "[hours] (closed [day])"
  if (uniqueHours.size === 1) {
    const closedDays = entries.filter(([_, time]) => time.toLowerCase() === 'closed');
    const timeFormatted = formatTimeRange(Array.from(uniqueHours)[0]);
    if (closedDays.length === 0) {
      return `Daily ${timeFormatted}`;
    } else if (closedDays.length === 1) {
      const closedDay = closedDays[0][0].charAt(0).toUpperCase() + closedDays[0][0].slice(1, 3);
      return `${timeFormatted} (Closed ${closedDay})`;
    }
    return `${timeFormatted}`;
  }
  
  // Get today's hours
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = days[new Date().getDay()];
  const todayHours = hours[today];
  
  if (todayHours) {
    return `Today: ${formatTimeRange(todayHours)}`;
  }
  
  return 'See hours';
};

export default function VenueDetailScreen({ navigation, route }: VenueDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const venue = route.params?.venue as Venue | undefined;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const fullscreenListRef = useRef<FlatList>(null);
  const heroListRef = useRef<FlatList>(null);

  if (!venue) {
    navigation.goBack();
    return null;
  }

  // Calculate back button top position: status bar height + padding
  const backButtonTop = insets.top + 12;
  
  // Hero section total height: visible image (220px) + status bar area
  // This allows the image to extend behind the status bar but be fully visible when scrolling
  const heroSectionHeight = 220 + insets.top;

  // Get venue images - prefer gallery, fallback to single image
  const galleryImages = getVenueGallery(venue.name);
  const localImage = getVenueImage(venue.name);
  const remoteImages = venue.photos && venue.photos.length > 0 ? venue.photos : [];
  const images = galleryImages || (localImage ? [localImage] : remoteImages);
  const currentImage = images[currentImageIndex] || null;
  const hasMultipleImages = images.length > 1;
  
  // Handle image scroll
  const handleImageScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentImageIndex(slideIndex);
  };

  // Fullscreen gallery
  const openFullscreen = (index: number) => {
    setCurrentImageIndex(index);
    setShowFullscreen(true);
  };

  const handleFullscreenScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    if (index !== currentImageIndex) {
      setCurrentImageIndex(index);
      // Sync hero scroll position
      heroListRef.current?.scrollToIndex({ index, animated: false });
    }
  };

  // Get venue initial for logo
  const venueInitial = venue.name[0]?.toUpperCase() || 'V';
  const venueLogo = getVenueLogo(venue.name);

  // Handle directions
  const handleDirections = () => {
    const address = venue.location || venue.city || 'Dubai';
    const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
    Linking.openURL(mapsUrl).catch(err => console.error('Error opening maps:', err));
  };

  // Handle make reservation
  const handleMakeReservation = () => {
    navigation.navigate('SelectDate', { venue });
  };

  // Handle concierge
  const handleConcierge = () => {
    navigation.navigate('MessageConcierge', { venue });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image Section */}
        <View style={[styles.heroSection, { height: heroSectionHeight }]}>
          {images.length > 0 ? (
            <>
              <FlatList
                ref={heroListRef}
                data={images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleImageScroll}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => openFullscreen(index)}
                  >
                    <ImageBackground
                      source={typeof item === 'string' ? { uri: item } : item}
                      style={[styles.heroImage, { width: SCREEN_WIDTH }]}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                )}
              />
              
              {/* Back Button */}
              <TouchableOpacity
                style={[styles.backButton, { top: backButtonTop }]}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
              >
                <View style={styles.backButtonCircle}>
                  <ChevronLeft size={20} color="#FFFFFF" strokeWidth={2} />
                </View>
              </TouchableOpacity>

              {/* Image Dots Indicator */}
              {hasMultipleImages && (
                <View style={styles.dotsContainer}>
                  {images.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.dot,
                        index === currentImageIndex && styles.dotActive,
                      ]}
                    />
                  ))}
                </View>
              )}

              {/* Venue Info at Bottom Left */}
              <View style={styles.venueInfoContainer}>
                <View style={styles.venueInfoRow}>
                  <View style={styles.logoBox}>
                    {venueLogo ? (
                      <Image source={venueLogo} style={styles.logoImage} resizeMode="contain" />
                    ) : (
                      <Text style={styles.logoText}>{venueInitial}</Text>
                    )}
                  </View>
                  <View style={styles.venueInfoText}>
                    <Text style={styles.venueName}>{venue.name}</Text>
                  </View>
                </View>
              </View>
            </>
          ) : (
            <View style={[styles.heroImagePlaceholder, { height: heroSectionHeight }]}>
              <LinearGradient
                colors={['#1A2A3A', '#0A1628']}
                style={[styles.heroGradient, { height: heroSectionHeight }]}
              >
                <TouchableOpacity
                  style={[styles.backButton, { top: backButtonTop }]}
                  onPress={() => navigation.goBack()}
                  activeOpacity={0.7}
                >
                  <View style={styles.backButtonCircle}>
                    <ChevronLeft size={20} color="#FFFFFF" strokeWidth={2} />
                  </View>
                </TouchableOpacity>
                <View style={styles.venueInfoContainer}>
                  <View style={styles.venueInfoRow}>
                    <View style={styles.logoBox}>
                      {venueLogo ? (
                        <Image source={venueLogo} style={styles.logoImage} resizeMode="contain" />
                      ) : (
                        <Text style={styles.logoText}>{venueInitial}</Text>
                      )}
                    </View>
                    <View style={styles.venueInfoText}>
                      <Text style={styles.venueName}>{venue.name}</Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </View>
          )}
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          {/* Quick Info Card */}
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.infoRow}
              onPress={handleDirections}
              activeOpacity={0.7}
            >
              <View style={[styles.infoRowLeft, { flex: 1 }]}>
                <MapPin size={16} color="#5684C4" strokeWidth={1.5} />
                <Text style={styles.infoText} numberOfLines={2}>{venue.location || venue.city || 'Dubai'}</Text>
              </View>
              <Text style={styles.directionsLink}>Directions →</Text>
            </TouchableOpacity>
            <View style={styles.infoRowDivider} />
            <View style={styles.infoRow}>
              <View style={styles.infoRowLeft}>
                <Clock size={16} color="#5684C4" strokeWidth={1.5} />
                <Text style={styles.infoText}>
                  {formatOperatingHours(venue.operating_hours)}
                </Text>
              </View>
            </View>
            {venue.minimum_spend && (
              <>
                <View style={styles.infoRowDivider} />
                <View style={styles.infoRow}>
                  <View style={styles.infoRowLeft}>
                    <CreditCard size={16} color="#5684C4" strokeWidth={1.5} />
                    <Text style={styles.infoText}>
                      Min. spend AED {venue.minimum_spend.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>

          {/* Member Benefits Card */}
          <View style={styles.benefitsCard}>
            <View style={styles.benefitsHeader}>
              <Star size={12} color="#5684C4" fill="#5684C4" />
              <Text style={styles.benefitsLabel}>MEMBER BENEFITS</Text>
            </View>
            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <Check size={16} color="#5684C4" strokeWidth={2} />
                <Text style={styles.benefitText}>Priority reservations</Text>
              </View>
              <View style={styles.benefitItem}>
                <Check size={16} color="#5684C4" strokeWidth={2} />
                <Text style={styles.benefitText}>Best table allocation</Text>
              </View>
            </View>
          </View>

          {/* About Card */}
          {venue.description && (
            <View style={styles.card}>
              <Text style={styles.cardLabel}>ABOUT</Text>
              <Text style={styles.descriptionText}>{venue.description}</Text>
            </View>
          )}

          {/* Dress Code Card */}
          <View style={styles.card}>
            <View style={styles.dressCodeHeader}>
              <View style={styles.dressCodeHeaderLeft}>
                <Shirt size={16} color="#5684C4" strokeWidth={1.5} />
                <Text style={styles.cardLabel}>DRESS CODE</Text>
              </View>
              <View style={styles.dressCodeBadge}>
                <Text style={styles.dressCodeBadgeText}>Smart Casual</Text>
              </View>
            </View>
            <Text style={styles.dressCodeNote}>
              No sportswear, shorts, or flip-flops.
            </Text>
          </View>

          {/* Opening Hours Card */}
          {venue.operating_hours && (
            <View style={styles.card}>
              <View style={styles.hoursHeader}>
                <Clock size={16} color="#5684C4" strokeWidth={1.5} />
                <Text style={styles.cardLabel}>OPENING HOURS</Text>
              </View>
              <View style={styles.hoursList}>
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                  const hours = venue.operating_hours?.[day];
                  const isToday = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][new Date().getDay()] === day;
                  const isClosed = hours?.toLowerCase() === 'closed';
                  return (
                    <View key={day} style={[styles.hoursRow, isToday && styles.hoursRowToday]}>
                      <Text style={[styles.hoursDay, isToday && styles.hoursDayToday]}>
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </Text>
                      <Text style={[styles.hoursTime, isClosed && styles.hoursTimeClosed, isToday && styles.hoursTimeToday]}>
                        {hours ? formatTimeRange(hours) : '—'}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom CTA Bar */}
      <View style={[styles.ctaBar, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={styles.conciergeButton}
          onPress={handleConcierge}
          activeOpacity={0.7}
        >
          <MessageCircle size={20} color="#5684C4" strokeWidth={1.5} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.reservationButton}
          onPress={handleMakeReservation}
          activeOpacity={0.8}
        >
          <Text style={styles.reservationButtonText}>Make a Reservation</Text>
        </TouchableOpacity>
      </View>

      {/* Fullscreen Gallery Modal */}
      <Modal
        visible={showFullscreen}
        transparent={true}
        animationType="fade"
        statusBarTranslucent
      >
        <View style={styles.fsContainer}>
          <StatusBar barStyle="light-content" backgroundColor="black" />

          {/* Close Button */}
          <TouchableOpacity
            style={[styles.fsCloseButton, { top: insets.top + 12 }]}
            onPress={() => setShowFullscreen(false)}
            activeOpacity={0.7}
          >
            <View style={styles.fsCloseButtonCircle}>
              <X size={22} color="#FFFFFF" strokeWidth={2} />
            </View>
          </TouchableOpacity>

          {/* Image Counter */}
          <View style={[styles.fsImageCounter, { top: insets.top + 20 }]}>
            <Text style={styles.fsImageCounterText}>
              {currentImageIndex + 1} / {images.length}
            </Text>
          </View>

          {/* Fullscreen Images */}
          <FlatList
            ref={fullscreenListRef}
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={currentImageIndex}
            getItemLayout={(_, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
            onMomentumScrollEnd={handleFullscreenScroll}
            keyExtractor={(_, index) => `fs-${index}`}
            renderItem={({ item }) => (
              <View style={styles.fsImageContainer}>
                <Image
                  source={typeof item === 'string' ? { uri: item } : item}
                  style={styles.fsImage}
                  resizeMode="contain"
                />
              </View>
            )}
          />

          {/* Bottom Indicator */}
          <View style={[styles.fsIndicator, { bottom: insets.bottom + 30 }]}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.fsDot,
                  currentImageIndex === index && styles.fsDotActive,
                ]}
              />
            ))}
          </View>
        </View>
      </Modal>
    </View>
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
    paddingBottom: 120,
  },
  heroSection: {
    position: 'relative',
    marginTop: 0,
    overflow: 'hidden',
  },
  heroImage: {
    height: '100%',
  },
  heroImagePlaceholder: {
    width: '100%',
    backgroundColor: '#1A2A3A',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  dotActive: {
    backgroundColor: '#FFFFFF',
    width: 16,
  },
  venueInfoContainer: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    right: 20,
  },
  venueInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  logoBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(26,42,58,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  venueInfoText: {
    flex: 1,
  },
  venueName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  venueMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  venueType: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
  },
  venueSeparator: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
  },
  priceIndicator: {
    color: '#5684C4',
    fontSize: 13,
    fontWeight: '600',
  },
  contentSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.35)',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
  },
  directionsLink: {
    color: '#5684C4',
    fontSize: 13,
    fontWeight: '600',
  },
  infoRowDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 14,
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  pillText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  benefitsCard: {
    backgroundColor: 'rgba(86,132,196,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(86,132,196,0.25)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  benefitsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  benefitsLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#5684C4',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    fontWeight: '500',
  },
  descriptionText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    lineHeight: 22,
  },
  dressCodeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dressCodeHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dressCodeBadge: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  dressCodeBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  dressCodeNote: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
  },
  ctaBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(9,22,46,0.98)',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  conciergeButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reservationButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#5684C4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reservationButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  // Fullscreen Modal Styles
  fsContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  fsCloseButton: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
  },
  fsCloseButtonCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fsImageCounter: {
    position: 'absolute',
    right: 20,
    zIndex: 10,
  },
  fsImageCounterText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  fsImageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fsImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.7,
  },
  fsIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  fsDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  fsDotActive: {
    backgroundColor: '#FFFFFF',
    width: 16,
  },
  // Opening Hours Styles
  hoursHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  hoursList: {
    gap: 10,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  hoursRowToday: {
    backgroundColor: 'rgba(86,132,196,0.15)',
    marginHorizontal: -12,
    paddingHorizontal: 12,
    borderRadius: 8,
    paddingVertical: 8,
  },
  hoursDay: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
  hoursDayToday: {
    color: '#5684C4',
    fontWeight: '600',
  },
  hoursTime: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
  },
  hoursTimeClosed: {
    color: 'rgba(255,255,255,0.4)',
  },
  hoursTimeToday: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
