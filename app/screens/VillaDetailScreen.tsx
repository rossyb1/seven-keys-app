import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  FlatList,
  StatusBar,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronLeft,
  Users,
  Home,
  Star,
  Check,
  MessageCircle,
  X,
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface VillaDetailScreenProps {
  navigation: any;
  route: any;
}

interface VillaData {
  id: string;
  name: string;
  location: string;
  bedrooms: number;
  description: string;
  images: any[];
  details: {
    capacity: string;
    staff: string;
    amenities: string[];
  };
}

const villasData: Record<string, VillaData> = {
  villa_sol: {
    id: 'villa_sol',
    name: 'Villa Sol',
    location: 'Ibiza, Spain',
    bedrooms: 6,
    description: 'Perched on a dramatic clifftop overlooking the Mediterranean, Villa Sol represents the pinnacle of Ibiza luxury. This stunning 6-bedroom estate combines contemporary architecture with traditional Ibizencan charm, offering breathtaking sunset views and complete privacy. The property features expansive terraces, an infinity pool that appears to merge with the sea, and meticulously landscaped gardens.',
    images: [
      require('../../Images/villas-category.jpg'),
      require('../../Images/villas-category.jpg'),
      require('../../Images/villas-category.jpg'),
    ],
    details: {
      capacity: 'Up to 12 guests',
      staff: 'Full-time concierge & housekeeping',
      amenities: [
        'Private Chef Available',
        'Infinity Pool & Jacuzzi',
        'Home Cinema',
        'Fitness Studio',
        'Wine Cellar',
        'Private Beach Access',
        'Helipad',
        'Spa & Wellness Area',
      ],
    },
  },
  casa_blanca: {
    id: 'casa_blanca',
    name: 'Casa Blanca',
    location: 'Ibiza, Spain',
    bedrooms: 8,
    description: 'An architectural masterpiece of ultra-modern design, Casa Blanca sets new standards for luxury living in Ibiza. This expansive 8-bedroom villa features cutting-edge smart home technology, minimalist aesthetics, and world-class amenities throughout.',
    images: [
      require('../../Images/villas-category.jpg'),
      require('../../Images/villas-category.jpg'),
    ],
    details: {
      capacity: 'Up to 16 guests',
      staff: 'Dedicated villa team',
      amenities: [
        'Private Chef Available',
        'Infinity Pool & Jacuzzi',
        'Home Cinema',
        'Fitness Studio',
        'Wine Cellar',
        'Private Beach Access',
        'Helipad',
        'Spa & Wellness Area',
      ],
    },
  },
  villa_azure: {
    id: 'villa_azure',
    name: 'Villa Azure',
    location: 'Ibiza, Spain',
    bedrooms: 5,
    description: 'Contemporary beachfront luxury villa with direct beach access and stunning views. Perfect blend of modern comfort and Mediterranean charm.',
    images: [
      require('../../Images/villas-category.jpg'),
    ],
    details: {
      capacity: 'Up to 10 guests',
      staff: 'Concierge & housekeeping',
      amenities: [
        'Private Chef Available',
        'Infinity Pool & Jacuzzi',
        'Home Cinema',
        'Fitness Studio',
        'Wine Cellar',
        'Private Beach Access',
        'Helipad',
        'Spa & Wellness Area',
      ],
    },
  },
  finca_serenity: {
    id: 'finca_serenity',
    name: 'Finca Serenity',
    location: 'Ibiza, Spain',
    bedrooms: 7,
    description: 'Traditional Ibicencan finca meticulously restored with modern luxury amenities while preserving authentic architectural charm.',
    images: [
      require('../../Images/villas-category.jpg'),
    ],
    details: {
      capacity: 'Up to 14 guests',
      staff: 'Full villa team',
      amenities: [
        'Private Chef Available',
        'Infinity Pool & Jacuzzi',
        'Home Cinema',
        'Fitness Studio',
        'Wine Cellar',
        'Private Beach Access',
        'Helipad',
        'Spa & Wellness Area',
      ],
    },
  },
};

export default function VillaDetailScreen({ navigation, route }: VillaDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const { villaId } = route.params;
  const villa = villasData[villaId];
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const heroScrollRef = useRef<ScrollView>(null);
  const fullscreenListRef = useRef<FlatList>(null);

  if (!villa) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Villa not found</Text>
      </View>
    );
  }

  const backButtonTop = insets.top + 12;
  const heroSectionHeight = 280 + insets.top;

  const handleBooking = () => {
    navigation.navigate('MessageConcierge', { villa });
  };

  const handleConcierge = () => {
    navigation.navigate('MessageConcierge', { villa });
  };

  const handleHeroScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    if (index !== activeImageIndex) {
      setActiveImageIndex(index);
    }
  };

  const openFullscreen = (index: number) => {
    setActiveImageIndex(index);
    setShowFullscreen(true);
  };

  const handleFullscreenScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    if (index !== activeImageIndex) {
      setActiveImageIndex(index);
      heroScrollRef.current?.scrollTo({ x: index * width, animated: false });
    }
  };

  const villaInitial = villa.name[0]?.toUpperCase() || 'V';

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image Section - Swipeable */}
        <View style={[styles.heroSection, { height: heroSectionHeight }]}>
          <ScrollView
            ref={heroScrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleHeroScroll}
            scrollEventThrottle={16}
          >
            {villa.images.map((image, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.95}
                onPress={() => openFullscreen(index)}
                style={{ width, height: heroSectionHeight }}
              >
                <Image
                  source={image}
                  style={{ width, height: heroSectionHeight }}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Gradient Overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(10, 22, 40, 0.6)', '#0A1628']}
            locations={[0, 0.6, 1]}
            style={styles.heroGradient}
            pointerEvents="none"
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

          {/* Villa Info at Bottom */}
          <View style={styles.villaInfoContainer} pointerEvents="none">
            <View style={styles.villaInfoRow}>
              <View style={styles.logoBox}>
                <Text style={styles.logoText}>{villaInitial}</Text>
              </View>
              <View style={styles.villaInfoText}>
                <Text style={styles.villaName}>{villa.name}</Text>
                <View style={styles.villaMeta}>
                  <Text style={styles.villaType}>Luxury Villa</Text>
                  <Text style={styles.villaSeparator}> • </Text>
                  <Text style={styles.villaLocation}>{villa.location}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Image Indicator */}
        <View style={styles.indicatorContainer}>
          {villa.images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                activeImageIndex === index && styles.indicatorActive,
              ]}
            />
          ))}
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          {/* Quick Info Card */}
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <View style={styles.infoRowLeft}>
                <Home size={16} color="#5684C4" strokeWidth={1.5} />
                <Text style={styles.infoText}>{villa.bedrooms} Bedrooms</Text>
              </View>
            </View>
            <View style={styles.infoRowDivider} />
            <View style={styles.infoRow}>
              <View style={styles.infoRowLeft}>
                <Users size={16} color="#5684C4" strokeWidth={1.5} />
                <Text style={styles.infoText}>{villa.details.capacity}</Text>
              </View>
            </View>
            <View style={styles.infoRowDivider} />
            <View style={styles.infoRow}>
              <View style={styles.infoRowLeft}>
                <Star size={16} color="#5684C4" strokeWidth={1.5} />
                <Text style={styles.infoText}>{villa.details.staff}</Text>
              </View>
            </View>
          </View>

          {/* Member Benefits Card */}
          <View style={styles.card}>
            <View style={styles.benefitsHeader}>
              <Star size={16} color="#C9A96E" fill="#C9A96E" strokeWidth={1.5} />
              <Text style={styles.benefitsLabel}>MEMBER BENEFITS</Text>
            </View>
            <View style={styles.benefitItem}>
              <Check size={16} color="#5684C4" strokeWidth={2} />
              <Text style={styles.benefitText}>Priority booking</Text>
            </View>
            <View style={styles.benefitItem}>
              <Check size={16} color="#5684C4" strokeWidth={2} />
              <Text style={styles.benefitText}>Complimentary airport transfers</Text>
            </View>
            <View style={styles.benefitItem}>
              <Check size={16} color="#5684C4" strokeWidth={2} />
              <Text style={styles.benefitText}>Dedicated concierge service</Text>
            </View>
          </View>

          {/* Villa Amenities Card */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>VILLA AMENITIES</Text>
            <View style={styles.pillsContainer}>
              {villa.details.amenities.map((amenity, index) => (
                <View key={index} style={styles.pill}>
                  <Text style={styles.pillText}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* About Card */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>ABOUT</Text>
            <Text style={styles.aboutText}>{villa.description}</Text>
          </View>

          {/* Gallery Preview Card */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>GALLERY</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.galleryScroll}
            >
              {villa.images.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => openFullscreen(index)}
                  activeOpacity={0.8}
                >
                  <Image
                    source={image}
                    style={[
                      styles.galleryThumb,
                      activeImageIndex === index && styles.galleryThumbActive,
                    ]}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomCTA, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={styles.conciergeButton}
          onPress={handleConcierge}
          activeOpacity={0.7}
        >
          <MessageCircle size={20} color="#5684C4" strokeWidth={1.5} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={handleBooking}
          activeOpacity={0.8}
        >
          <Text style={styles.bookButtonText}>Request Booking</Text>
        </TouchableOpacity>
      </View>

      {/* Fullscreen Gallery Modal */}
      <Modal
        visible={showFullscreen}
        transparent={true}
        animationType="fade"
        statusBarTranslucent
      >
        <View style={styles.fullscreenContainer}>
          <StatusBar barStyle="light-content" backgroundColor="black" />
          
          <TouchableOpacity
            style={[styles.closeButton, { top: insets.top + 12 }]}
            onPress={() => setShowFullscreen(false)}
            activeOpacity={0.7}
          >
            <View style={styles.closeButtonCircle}>
              <X size={22} color="#FFFFFF" strokeWidth={2} />
            </View>
          </TouchableOpacity>

          <View style={[styles.imageCounter, { top: insets.top + 20 }]}>
            <Text style={styles.imageCounterText}>
              {activeImageIndex + 1} / {villa.images.length}
            </Text>
          </View>

          <FlatList
            ref={fullscreenListRef}
            data={villa.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={activeImageIndex}
            getItemLayout={(_, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            onMomentumScrollEnd={handleFullscreenScroll}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.fullscreenImageContainer}>
                <Image
                  source={item}
                  style={styles.fullscreenImage}
                  contentFit="contain"
                  cachePolicy="memory-disk"
                />
              </View>
            )}
          />

          <View style={[styles.fullscreenIndicator, { bottom: insets.bottom + 30 }]}>
            {villa.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  activeImageIndex === index && styles.indicatorActive,
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
    width: '100%',
    overflow: 'hidden',
  },
  heroGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(10, 22, 40, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  villaInfoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  villaInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(10, 22, 40, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  villaInfoText: {
    flex: 1,
  },
  villaName: {
    fontSize: 26,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  villaMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  villaType: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  villaSeparator: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  villaLocation: {
    fontSize: 14,
    color: '#C9A96E',
    fontWeight: '500',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  indicatorActive: {
    backgroundColor: '#5684C4',
    width: 24,
  },
  contentSection: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 1,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  infoRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  infoRowDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 12,
  },
  benefitsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  benefitsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#C9A96E',
    letterSpacing: 1,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  benefitText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pill: {
    backgroundColor: 'rgba(86, 132, 196, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(86, 132, 196, 0.25)',
  },
  pillText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  aboutText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.75)',
    lineHeight: 24,
  },
  galleryScroll: {
    marginTop: 4,
    marginHorizontal: -4,
  },
  galleryThumb: {
    width: 100,
    height: 70,
    borderRadius: 10,
    marginHorizontal: 4,
    opacity: 0.7,
  },
  galleryThumbActive: {
    opacity: 1,
    borderWidth: 2,
    borderColor: '#5684C4',
  },
  bottomCTA: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: '#0A1628',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    gap: 12,
  },
  conciergeButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(86, 132, 196, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(86, 132, 196, 0.3)',
  },
  bookButton: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#5684C4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
  },
  closeButtonCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageCounter: {
    position: 'absolute',
    right: 20,
    zIndex: 10,
  },
  imageCounterText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  fullscreenImageContainer: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: width,
    height: height * 0.7,
  },
  fullscreenIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
});
