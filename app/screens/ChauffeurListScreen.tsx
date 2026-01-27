import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ChauffeurListScreenProps {
  navigation: any;
}

interface ChauffeurService {
  id: string;
  name: string;
  vehicle: string;
  description: string;
  thumbnail: any;
}

const services: ChauffeurService[] = [
  {
    id: 'luxury_sedan',
    name: 'Luxury Sedan',
    vehicle: 'Mercedes S-Class',
    description: 'Premium chauffeur service for business and leisure',
    thumbnail: require('../../Images/experiences-category.jpg'),
  },
  {
    id: 'suv_service',
    name: 'Luxury SUV',
    vehicle: 'Range Rover Autobiography',
    description: 'Spacious luxury transport for families and groups',
    thumbnail: require('../../Images/experiences-category.jpg'),
  },
  {
    id: 'executive_van',
    name: 'Executive Van',
    vehicle: 'Mercedes V-Class',
    description: 'Perfect for corporate events and airport transfers',
    thumbnail: require('../../Images/experiences-category.jpg'),
  },
];

export default function ChauffeurListScreen({ navigation }: ChauffeurListScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleServicePress = (serviceId: string) => {
    navigation.navigate('MessageConcierge');
  };

  const filteredServices = services.filter(service =>
    searchQuery === '' || service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <ArrowLeft size={24} color="#FFFFFF" strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PRIVATE CHAUFFEUR</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={18} color="rgba(255,255,255,0.4)" strokeWidth={1.5} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search services..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredServices.map((service) => (
          <TouchableOpacity key={service.id} style={styles.card} onPress={() => handleServicePress(service.id)} activeOpacity={0.8}>
            <View style={styles.imageContainer}>
              <Image source={service.thumbnail} style={styles.image} contentFit="cover" cachePolicy="memory-disk" />
              <LinearGradient colors={['transparent', 'rgba(9, 22, 46, 0.8)']} style={styles.imageOverlay} />
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{service.name}</Text>
              <Text style={styles.details}>{service.vehicle}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1628' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  headerTitle: { flex: 1, color: '#FFFFFF', fontSize: 18, fontWeight: '600', letterSpacing: 1.5, textAlign: 'center' },
  headerSpacer: { width: 40 },
  searchContainer: { paddingHorizontal: 20, paddingVertical: 12 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.06)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, gap: 10, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)' },
  searchInput: { flex: 1, color: '#FFFFFF', fontSize: 15 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  card: { marginBottom: 16, borderRadius: 16, overflow: 'hidden', backgroundColor: 'rgba(255, 255, 255, 0.04)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)' },
  imageContainer: { width: '100%', height: 200, position: 'relative' },
  image: { width: '100%', height: '100%' },
  imageOverlay: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '50%' },
  info: { padding: 16 },
  name: { fontSize: 20, fontWeight: '600', color: '#FFFFFF', marginBottom: 4 },
  details: { fontSize: 14, color: 'rgba(255, 255, 255, 0.6)' },
});
