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
  Anchor,
  Star,
  Check,
  MessageCircle,
  X,
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface YachtDetailScreenProps {
  navigation: any;
  route: any;
}

interface YachtData {
  id: string;
  name: string;
  size: string;
  description: string;
  images: any[];
  details: {
    capacity: string;
    crew: string;
    amenities: string[];
  };
}

const yachtsData: Record<string, YachtData> = {
  morrigan: {
    id: 'morrigan',
    name: 'Morrigan',
    size: '70ft',
    description: 'Step aboard Morrigan, a magnificent 70ft Galeon yacht designed for exceptional experiences in Dubai. Boasting luxurious interiors and spacious outdoor areas, Morrigan offers the ultimate blend of elegance, comfort, and adventure. Whether you\'re cruising along Dubai\'s vibrant coastline, anchoring at the stunning Palm Jumeirah, or exploring the iconic World Islands, Morrigan promises an unforgettable escape on the water. With 1 Master and 1 VIP cabin, Morrigan accommodates up to 4 overnight guests, making it perfect for intimate gatherings or extended charters. Its capacity of 12 ensures there\'s plenty of room for celebrations, corporate events, or leisurely family outings.',
    images: [
      require('../../Images/yachts/morrigan_cover.jpg'),
      require('../../Images/yachts/morrigan_02.jpg'),
      require('../../Images/yachts/morrigan_03.jpg'),
      require('../../Images/yachts/morrigan_04.jpg'),
      require('../../Images/yachts/morrigan_05.jpg'),
      require('../../Images/yachts/morrigan_06.jpg'),
    ],
    details: {
      capacity: 'Up to 12 guests',
      crew: 'Professional captain & crew',
      amenities: [
        'Gourmet Dining',
        'Premium Beverages',
        'Special Occasions & Celebrations',
        'Water Sports',
        'Entertainment & Media',
        'Tailored Corporate Events',
        'Wellness & Relaxation',
        'Floating Cinema',
      ],
    },
  },
  matrix: {
    id: 'matrix',
    name: 'Matrix',
    size: '82ft',
    description: 'Our largest and most luxurious yacht, offering unparalleled comfort and style for the ultimate Dubai experience.',
    images: [
      require('../../Images/yachts/matrix_01.jpg'),
      require('../../Images/yachts/matrix_02.jpg'),
      require('../../Images/yachts/matrix_03.jpg'),
      require('../../Images/yachts/matrix_04.jpg'),
      require('../../Images/yachts/matrix_05.jpg'),
    ],
    details: {
      capacity: 'Up to 15 guests',
      crew: 'Professional captain & crew',
      amenities: [
        'Gourmet Dining',
        'Premium Beverages',
        'Special Occasions & Celebrations',
        'Water Sports',
        'Entertainment & Media',
        'Tailored Corporate Events',
        'Wellness & Relaxation',
        'Floating Cinema',
      ],
    },
  },
  my_serenity: {
    id: 'my_serenity',
    name: 'My Serenity',
    size: '70ft',
    description: 'Elegant and comfortable, My Serenity offers a peaceful escape on Dubai\'s beautiful waters.',
    images: [
      require('../../Images/yachts/serenity_01.jpg'),
      require('../../Images/yachts/serenity_02.jpg'),
      require('../../Images/yachts/serenity_03.jpg'),
      require('../../Images/yachts/serenity_04.jpg'),
      require('../../Images/yachts/serenity_05.jpg'),
    ],
    details: {
      capacity: 'Up to 12 guests',
      crew: 'Professional captain & crew',
      amenities: [
        'Gourmet Dining',
        'Premium Beverages',
        'Special Occasions & Celebrations',
        'Water Sports',
        'Entertainment & Media',
        'Tailored Corporate Events',
        'Wellness & Relaxation',
        'Floating Cinema',
      ],
    },
  },
  c52: {
    id: 'c52',
    name: 'C52',
    size: '52ft',
    description: 'Sporty and modern, the C52 is perfect for those seeking a thrilling yet luxurious yacht experience.',
    images: [
      require('../../Images/yachts/c52_01.jpg'),
      require('../../Images/yachts/c52_02.jpg'),
      require('../../Images/yachts/c52_03.jpg'),
      require('../../Images/yachts/c52_04.jpg'),
      require('../../Images/yachts/c52_05.jpg'),
      require('../../Images/yachts/c52_06.jpg'),
    ],
    details: {
      capacity: 'Up to 8 guests',
      crew: 'Professional captain & crew',
      amenities: [
        'Gourmet Dining',
        'Premium Beverages',
        'Special Occasions & Celebrations',
        'Water Sports',
        'Entertainment & Media',
        'Tailored Corporate Events',
        'Wellness & Relaxation',
        'Floating Cinema',
      ],
    },
  },
};

export default function YachtDetailScreen({ navigation, route }: YachtDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const { yachtId } = route.params;
  const yacht = yachtsData[yachtId];
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const heroScrollRef = useRef<ScrollView>(null);
  const fullscreenListRef = useRef<FlatList>(null);

  if (!yacht) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Yacht not found</Text>
      </View>
    );
  }

  const backButtonTop = insets.top + 12;
  const heroSectionHeight = 280 + insets.top;

  const handleBooking = () => {
    navigation.navigate('ExperienceTypeSelection');
  };

  const handleConcierge = () => {
    navigation.navigate('MessageConcierge', { yacht });
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
      // Sync hero scroll position
      heroScrollRef.current?.scrollTo({ x: index * width, animated: false });
    }
  };

  // Get yacht initial for logo
  const yachtInitial = yacht.name[0]?.toUpperCase() || 'Y';

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
            {yacht.images.map((image, index) => (
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

          {/* Yacht Info at Bottom */}
          <View style={styles.yachtInfoContainer} pointerEvents="none">
            <View style={styles.yachtInfoRow}>
              <View style={styles.logoBox}>
                <Text style={styles.logoText}>{yachtInitial}</Text>
              </View>
              <View style={styles.yachtInfoText}>
                <Text style={styles.yachtName}>{yacht.name}</Text>
                <View style={styles.yachtMeta}>
                  <Text style={styles.yachtType}>Luxury Yacht</Text>
                  <Text style={styles.yachtSeparator}> • </Text>
                  <Text style={styles.yachtSize}>{yacht.size}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Image Indicator */}
        <View style={styles.indicatorContainer}>
          {yacht.images.map((_, index) => (
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
                <Users size={16} color="#5684C4" strokeWidth={1.5} />
                <Text style={styles.infoText}>{yacht.details.capacity}</Text>
              </View>
            </View>
            <View style={styles.infoRowDivider} />
            <View style={styles.infoRow}>
              <View style={styles.infoRowLeft}>
                <Anchor size={16} color="#5684C4" strokeWidth={1.5} />
                <Text style={styles.infoText}>{yacht.details.crew}</Text>
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
              <Text style={styles.benefitText}>Complimentary welcome drinks</Text>
            </View>
            <View style={styles.benefitItem}>
              <Check size={16} color="#5684C4" strokeWidth={2} />
              <Text style={styles.benefitText}>Dedicated concierge service</Text>
            </View>
          </View>

          {/* Onboard Experiences Card */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>ONBOARD EXPERIENCES</Text>
            <View style={styles.pillsContainer}>
              {yacht.details.amenities.map((amenity, index) => (
                <View key={index} style={styles.pill}>
                  <Text style={styles.pillText}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* About Card */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>ABOUT</Text>
            <Text style={styles.aboutText}>{yacht.description}</Text>
          </View>

          {/* Gallery Preview Card */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>GALLERY</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.galleryScroll}
            >
              {yacht.images.map((image, index) => (
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
          
          {/* Close Button */}
          <TouchableOpacity
            style={[styles.closeButton, { top: insets.top + 12 }]}
            onPress={() => setShowFullscreen(false)}
            activeOpacity={0.7}
          >
            <View style={styles.closeButtonCircle}>
              <X size={22} color="#FFFFFF" strokeWidth={2} />
            </View>
          </TouchableOpacity>

          {/* Image Counter */}
          <View style={[styles.imageCounter, { top: insets.top + 20 }]}>
            <Text style={styles.imageCounterText}>
              {activeImageIndex + 1} / {yacht.images.length}
            </Text>
          </View>

          {/* Fullscreen Images */}
          <FlatList
            ref={fullscreenListRef}
            data={yacht.images}
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

          {/* Bottom Indicator */}
          <View style={[styles.fullscreenIndicator, { bottom: insets.bottom + 30 }]}>
            {yacht.images.map((_, index) => (
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
  yachtInfoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  yachtInfoRow: {
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
  yachtInfoText: {
    flex: 1,
  },
  yachtName: {
    fontSize: 26,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  yachtMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yachtType: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  yachtSeparator: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  yachtSize: {
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
  // Fullscreen Modal Styles
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
