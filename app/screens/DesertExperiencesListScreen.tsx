import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface DesertExperiencesListScreenProps {
  navigation: any;
}

interface DesertExperience {
  id: string;
  name: string;
  duration: string;
  description: string;
  thumbnail: any;
}

const experiences: DesertExperience[] = [
  {
    id: 'sunset_safari',
    name: 'Sunset Desert Safari',
    duration: '6 hours',
    description: 'Premium desert adventure with dune bashing and dinner',
    thumbnail: require('../../Images/experiences-category.jpg'),
  },
  {
    id: 'private_camp',
    name: 'Private Desert Camp',
    duration: 'Overnight',
    description: 'Exclusive Bedouin-style camp experience',
    thumbnail: require('../../Images/experiences-category.jpg'),
  },
  {
    id: 'falcon_experience',
    name: 'Falconry Experience',
    duration: '3 hours',
    description: 'Traditional falcon handling and desert exploration',
    thumbnail: require('../../Images/experiences-category.jpg'),
  },
  {
    id: 'hot_air_balloon',
    name: 'Hot Air Balloon',
    duration: '4 hours',
    description: 'Sunrise balloon flight over Dubai desert',
    thumbnail: require('../../Images/experiences-category.jpg'),
  },
];

export default function DesertExperiencesListScreen({ navigation }: DesertExperiencesListScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleExperiencePress = (experienceId: string) => {
    navigation.navigate('DesertExperienceDetail', { experienceId });
  };

  const filteredExperiences = experiences.filter(exp =>
    searchQuery === '' || exp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#FFFFFF" strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>DESERT EXPERIENCES</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={18} color="rgba(255,255,255,0.4)" strokeWidth={1.5} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search experiences..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredExperiences.map((experience) => (
          <TouchableOpacity
            key={experience.id}
            style={styles.card}
            onPress={() => handleExperiencePress(experience.id)}
            activeOpacity={0.8}
          >
            <View style={styles.imageContainer}>
              <Image
                source={experience.thumbnail}
                style={styles.image}
                contentFit="cover"
                cachePolicy="memory-disk"
              />
              <LinearGradient
                colors={['transparent', 'rgba(9, 22, 46, 0.8)']}
                style={styles.imageOverlay}
              />
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{experience.name}</Text>
              <Text style={styles.details}>Desert • {experience.duration}</Text>
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
  card: {
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
  image: {
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
  info: {
    padding: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});
