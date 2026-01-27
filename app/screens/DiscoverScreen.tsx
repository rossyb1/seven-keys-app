import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Alert,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Search } from 'lucide-react-native';
import { BackgroundColors, TextColors, AccentColors, Spacing, Typography, BorderRadius } from '../../constants/brand';

interface DiscoverScreenProps {
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

export default function DiscoverScreen({ navigation }: DiscoverScreenProps) {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');

  const handleCategoryPress = (category: Category) => {
    if (category.enabled) {
      // Navigate to CategoryVenuesScreen (we'll create this later)
      navigation.navigate('CategoryVenues', {
        categoryId: category.id,
        categoryName: category.name,
      });
    } else {
      Alert.alert(
        'Coming Soon!',
        "We'll notify you when this is available.",
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + Spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>DISCOVER</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color={TextColors.tertiary} strokeWidth={1.5} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search venues, experiences..."
              placeholderTextColor={TextColors.tertiary}
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
                  colors={['rgba(10,22,40,0.88)', 'rgba(10,22,40,0.15)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.categoryGradient}
                >
                  <View style={styles.categoryContent}>
                    <View style={styles.categoryTextContainer}>
                      <Text style={styles.categoryName}>{category.name}</Text>
                      <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
                    </View>
                    <Text style={styles.categoryArrow}>›</Text>
                  </View>
                </LinearGradient>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl * 2,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '300',
    letterSpacing: 4,
    color: '#FFFFFF',
    fontFamily: Typography.fontFamily.light,
  },
  searchContainer: {
    marginBottom: Spacing.xl,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BackgroundColors.secondary,
    borderWidth: 1,
    borderColor: 'rgba(86, 132, 196, 0.1)',
    borderRadius: BorderRadius.base,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: TextColors.primary,
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.regular,
  },
  categoriesContainer: {
    gap: 14,
  },
  categoryCard: {
    height: 110,
    borderRadius: 16,
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
    paddingHorizontal: Spacing.xl,
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
    marginBottom: Spacing.xs / 2,
    fontFamily: Typography.fontFamily.medium,
  },
  categorySubtitle: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    fontFamily: Typography.fontFamily.regular,
  },
  categoryArrow: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 32,
    fontWeight: '300',
    marginLeft: Spacing.base,
  },
});
