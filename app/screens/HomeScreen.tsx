import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, ChevronRight } from 'lucide-react-native';

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
  const [searchQuery, setSearchQuery] = useState('');

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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>DISCOVER</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="rgba(255,255,255,0.4)" strokeWidth={1.5} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search venues, experiences..."
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* Category Cards */}
        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              onPress={() => handleCategoryPress(category)}
              activeOpacity={0.9}
            >
              <ImageBackground
                source={category.image}
                style={styles.categoryImage}
                resizeMode="cover"
              >
                <LinearGradient
                  colors={['rgba(10,22,40,0.88)', 'rgba(10,22,40,0.5)', 'rgba(10,22,40,0.15)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.categoryGradient}
                >
                  <View style={styles.categoryContent}>
                    <View style={styles.categoryTextContainer}>
                      <Text style={styles.categoryName}>{category.name}</Text>
                      <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
                    </View>
                    <ChevronRight size={24} color="rgba(255,255,255,0.4)" strokeWidth={1.5} />
                  </View>
                </LinearGradient>
              </ImageBackground>
            </TouchableOpacity>
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
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '600',
    letterSpacing: 3,
    color: '#FFFFFF',
  },
  searchContainer: {
    marginBottom: 28,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
  },
  categoriesContainer: {
    gap: 12,
  },
  categoryCard: {
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 20,
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
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  categorySubtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
  },
});
