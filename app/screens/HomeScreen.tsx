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
    image: require('../../Images/events-category.png'), 
    subtitle: 'Worldwide', 
    enabled: false 
  },
  { 
    id: 'experiences', 
    name: 'EXPERIENCES', 
    image: require('../../Images/experiences-category.jpg'), 
    subtitle: 'Yachts & more', 
    enabled: false 
  },
  { 
    id: 'villas', 
    name: 'VILLAS', 
    image: require('../../Images/villas-category.jpg'), 
    subtitle: 'Ibiza • Coming Soon', 
    enabled: false 
  },
];

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleCategoryPress = (category: Category) => {
    if (category.enabled) {
      navigation.navigate('CategoryVenues', {
        categoryId: category.id,
        categoryName: category.name,
      });
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
    paddingTop: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '300',
    letterSpacing: 4,
    color: '#FFFFFF',
  },
  searchContainer: {
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
  },
  categoriesContainer: {
    gap: 14,
  },
  categoryCard: {
    height: 110,
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
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
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 2,
    marginBottom: 4,
  },
  categorySubtitle: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
  },
});
