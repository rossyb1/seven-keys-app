import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import PrimaryButton from '../../components/buttons/PrimaryButton';

const { width } = Dimensions.get('window');

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
    description: 'Experience luxury on the water with our flagship 70ft yacht. Perfect for cruising Dubai\'s stunning coastline with family and friends.',
    images: [
      require('../../Images/yachts/morrigan_cover.jpg'),
      require('../../Images/yachts/morrigan_02.jpg'),
      require('../../Images/yachts/morrigan_03.jpg'),
      require('../../Images/yachts/morrigan_04.jpg'),
      require('../../Images/yachts/morrigan_05.jpg'),
    ],
    details: {
      capacity: 'Up to 12 guests',
      crew: 'Professional captain & crew',
      amenities: [
        'Spacious deck area',
        'Air-conditioned interior',
        'Premium sound system',
        'Water sports equipment',
        'Catering available',
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
        'Expansive deck area',
        'Luxury air-conditioned cabins',
        'High-end entertainment system',
        'Water sports equipment',
        'Premium catering available',
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
        'Comfortable seating areas',
        'Air-conditioned interior',
        'Quality sound system',
        'Water sports equipment',
        'Catering available',
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
        'Modern deck layout',
        'Air-conditioned cabin',
        'Quality audio system',
        'Water sports equipment',
        'Light refreshments available',
      ],
    },
  },
};

export default function YachtDetailScreen({ navigation, route }: YachtDetailScreenProps) {
  const { yachtId } = route.params;
  const yacht = yachtsData[yachtId];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!yacht) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Yacht not found</Text>
      </SafeAreaView>
    );
  }

  const handleBooking = () => {
    navigation.navigate('ExperienceTypeSelection');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ChevronLeft size={24} color="#FFFFFF" strokeWidth={1.5} />
          </TouchableOpacity>
        </View>

        {/* Image Gallery */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setActiveImageIndex(index);
          }}
          style={styles.imageGallery}
        >
          {yacht.images.map((image, index) => (
            <Image
              key={index}
              source={image}
              style={styles.yachtImage}
              contentFit="cover"
              cachePolicy="memory-disk"
            />
          ))}
        </ScrollView>

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

        {/* Yacht Info */}
        <View style={styles.content}>
          <View style={styles.headerInfo}>
            <Text style={styles.yachtName}>{yacht.name}</Text>
            <Text style={styles.yachtSize}>{yacht.size}</Text>
          </View>

          <Text style={styles.description}>{yacht.description}</Text>

          {/* Details */}
          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Capacity:</Text>
              <Text style={styles.detailValue}>{yacht.details.capacity}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Crew:</Text>
              <Text style={styles.detailValue}>{yacht.details.crew}</Text>
            </View>
          </View>

          {/* Amenities */}
          <View style={styles.amenitiesSection}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            {yacht.details.amenities.map((amenity, index) => (
              <View key={index} style={styles.amenityItem}>
                <View style={styles.amenityDot} />
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>

          {/* Book Button */}
          <View style={styles.buttonContainer}>
            <PrimaryButton
              title="REQUEST BOOKING"
              onPress={handleBooking}
            />
          </View>
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
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(10, 22, 40, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageGallery: {
    height: 400,
  },
  yachtImage: {
    width: width,
    height: 400,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
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
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  yachtName: {
    fontSize: 32,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  yachtSize: {
    fontSize: 20,
    fontWeight: '500',
    color: '#5684C4',
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 24,
    marginBottom: 24,
  },
  detailsSection: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.6)',
    width: 100,
  },
  detailValue: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  amenitiesSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  amenityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#5684C4',
    marginRight: 12,
  },
  amenityText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  buttonContainer: {
    marginTop: 8,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});
