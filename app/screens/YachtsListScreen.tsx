import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface YachtsListScreenProps {
  navigation: any;
}

interface Yacht {
  id: string;
  name: string;
  size: string;
  description: string;
  thumbnail: any;
}

const yachts: Yacht[] = [
  {
    id: 'morrigan',
    name: 'Morrigan',
    size: '70ft',
    description: 'Luxury yacht perfect for cruising Dubai waters',
    thumbnail: require('../../Images/yachts/morrigan_03.jpeg'),
  },
  {
    id: 'matrix',
    name: 'Matrix',
    size: '82ft',
    description: 'Premium luxury yacht experience',
    thumbnail: require('../../Images/yachts/morrigan_03.jpeg'), // Placeholder - need real image
  },
  {
    id: 'my_serenity',
    name: 'My Serenity',
    size: '70ft',
    description: 'Elegant and comfortable yacht charter',
    thumbnail: require('../../Images/yachts/morrigan_03.jpeg'), // Placeholder - need real image
  },
  {
    id: 'c52',
    name: 'C52',
    size: '52ft',
    description: 'Sporty and modern yacht',
    thumbnail: require('../../Images/yachts/morrigan_03.jpeg'), // Placeholder - need real image
  },
];

export default function YachtsListScreen({ navigation }: YachtsListScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleYachtPress = (yachtId: string) => {
    navigation.navigate('YachtDetail', { yachtId });
  };

  const filteredYachts = yachts.filter(yacht =>
    searchQuery === '' || yacht.name.toLowerCase().includes(searchQuery.toLowerCase())
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
        <Text style={styles.headerTitle}>YACHTS</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={18} color="rgba(255,255,255,0.4)" strokeWidth={1.5} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search yachts..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      {/* Yachts List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredYachts.map((yacht) => (
          <TouchableOpacity
            key={yacht.id}
            style={styles.yachtCard}
            onPress={() => handleYachtPress(yacht.id)}
            activeOpacity={0.8}
          >
            <View style={styles.imageContainer}>
              <Image
                source={yacht.thumbnail}
                style={styles.yachtImage}
                contentFit="cover"
                cachePolicy="memory-disk"
              />
              <LinearGradient
                colors={['transparent', 'rgba(9, 22, 46, 0.8)']}
                style={styles.imageOverlay}
              />
            </View>
            <View style={styles.yachtInfo}>
              <Text style={styles.yachtName}>{yacht.name}</Text>
              <Text style={styles.yachtDetails}>Yacht • {yacht.size}</Text>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111D2E',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
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
    padding: 16,
    gap: 16,
  },
  yachtCard: {
    backgroundColor: '#111D2E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(86, 132, 196, 0.1)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    overflow: 'hidden',
    position: 'relative',
  },
  yachtImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  yachtInfo: {
    padding: 16,
  },
  yachtName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  yachtDetails: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
});
