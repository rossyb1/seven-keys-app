import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Anchor, Palmtree, Car, Plane } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ExperiencesListScreenProps {
  navigation: any;
}

interface ExperienceCategory {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ComponentType<{ size: number; color: string; strokeWidth: number }>;
  image: any;
}

const experienceCategories: ExperienceCategory[] = [
  {
    id: 'yachts',
    name: 'YACHTS',
    subtitle: 'Luxury yacht charters',
    icon: Anchor,
    image: require('../../Images/experiences-category.jpg'), // We'll use this for now
  },
  {
    id: 'desert',
    name: 'DESERT EXPERIENCES',
    subtitle: 'Dubai desert adventures',
    icon: Palmtree,
    image: require('../../Images/experiences-category.jpg'),
  },
  {
    id: 'chauffeur',
    name: 'PRIVATE CHAUFFEUR',
    subtitle: 'Professional drivers',
    icon: Car,
    image: require('../../Images/experiences-category.jpg'),
  },
  {
    id: 'private_jet',
    name: 'PRIVATE JET',
    subtitle: 'Exclusive travel',
    icon: Plane,
    image: require('../../Images/experiences-category.jpg'),
  },
];

export default function ExperiencesListScreen({ navigation }: ExperiencesListScreenProps) {
  const handleExperiencePress = (experienceId: string) => {
    switch (experienceId) {
      case 'yachts':
        navigation.navigate('YachtsList');
        break;
      case 'desert':
        navigation.navigate('DesertExperiencesList');
        break;
      case 'chauffeur':
        navigation.navigate('ChauffeurList');
        break;
      case 'private_jet':
        navigation.navigate('PrivateJetList');
        break;
      default:
        navigation.navigate('ExperienceTypeSelection');
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
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ChevronLeft size={24} color="#FFFFFF" strokeWidth={1.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>EXPERIENCES</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          {experienceCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <TouchableOpacity
                key={category.id}
                onPress={() => handleExperiencePress(category.id)}
                activeOpacity={0.9}
              >
                <ImageBackground
                  source={category.image}
                  style={styles.categoryCard}
                  imageStyle={styles.categoryImage}
                >
                  <LinearGradient
                    colors={['rgba(10, 22, 40, 0.3)', 'rgba(10, 22, 40, 0.8)']}
                    style={styles.gradient}
                  >
                    <View style={styles.iconContainer}>
                      <IconComponent size={32} color="#FFFFFF" strokeWidth={1.5} />
                    </View>
                    <View style={styles.categoryInfo}>
                      <Text style={styles.categoryName}>{category.name}</Text>
                      <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
                    </View>
                  </LinearGradient>
                </ImageBackground>
              </TouchableOpacity>
            );
          })}
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
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
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
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  categoryCard: {
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
  },
  categoryImage: {
    borderRadius: 16,
  },
  gradient: {
    flex: 1,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(86, 132, 196, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  categorySubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
