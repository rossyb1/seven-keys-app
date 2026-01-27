import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface VillasListScreenProps {
  navigation: any;
}

interface Villa {
  id: string;
  name: string;
  location: string;
  bedrooms: number;
  description: string;
  thumbnail: any;
}

const villas: Villa[] = [
  {
    id: 'villa_sol',
    name: 'Villa Sol',
    location: 'Ibiza, Spain',
    bedrooms: 6,
    description: 'Stunning clifftop villa with panoramic Mediterranean views',
    thumbnail: require('../../Images/villas-category.jpg'),
  },
  {
    id: 'casa_blanca',
    name: 'Casa Blanca',
    location: 'Ibiza, Spain',
    bedrooms: 8,
    description: 'Ultra-modern luxury estate with infinity pool',
    thumbnail: require('../../Images/villas-category.jpg'),
  },
  {
    id: 'villa_azure',
    name: 'Villa Azure',
    location: 'Ibiza, Spain',
    bedrooms: 5,
    description: 'Contemporary beachfront villa with private access',
    thumbnail: require('../../Images/villas-category.jpg'),
  },
  {
    id: 'finca_serenity',
    name: 'Finca Serenity',
    location: 'Ibiza, Spain',
    bedrooms: 7,
    description: 'Traditional Ibicencan estate with modern amenities',
    thumbnail: require('../../Images/villas-category.jpg'),
  },
];

export default function VillasListScreen({ navigation }: VillasListScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleVillaPress = (villaId: string) => {
    navigation.navigate('VillaDetail', { villaId });
  };

  const filteredVillas = villas.filter(villa =>
    searchQuery === '' || villa.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <Text style={styles.headerTitle}>VILLAS</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={18} color="rgba(255,255,255,0.4)" strokeWidth={1.5} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search villas..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      {/* Villas List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredVillas.map((villa) => (
          <TouchableOpacity
            key={villa.id}
            style={styles.villaCard}
            onPress={() => handleVillaPress(villa.id)}
            activeOpacity={0.8}
          >
            <View style={styles.imageContainer}>
              <Image
                source={villa.thumbnail}
                style={styles.villaImage}
                contentFit="cover"
                cachePolicy="memory-disk"
              />
              <LinearGradient
                colors={['transparent', 'rgba(9, 22, 46, 0.8)']}
                style={styles.imageOverlay}
              />
            </View>
            <View style={styles.villaInfo}>
              <Text style={styles.villaName}>{villa.name}</Text>
              <Text style={styles.villaDetails}>{villa.location} • {villa.bedrooms} Bedrooms</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  villaCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  villaImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  villaInfo: {
    padding: 16,
  },
  villaName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  villaDetails: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});
