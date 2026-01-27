import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface PrivateJetListScreenProps {
  navigation: any;
}

interface JetService {
  id: string;
  name: string;
  category: string;
  description: string;
  thumbnail: any;
}

const jets: JetService[] = [
  {
    id: 'light_jet',
    name: 'Light Jet',
    category: '6-8 passengers',
    description: 'Perfect for short to medium-haul flights',
    thumbnail: require('../../Images/experiences-category.jpg'),
  },
  {
    id: 'midsize_jet',
    name: 'Midsize Jet',
    category: '8-9 passengers',
    description: 'Ideal for transcontinental travel',
    thumbnail: require('../../Images/experiences-category.jpg'),
  },
  {
    id: 'heavy_jet',
    name: 'Heavy Jet',
    category: '12-16 passengers',
    description: 'Ultimate luxury for long-range international flights',
    thumbnail: require('../../Images/experiences-category.jpg'),
  },
];

export default function PrivateJetListScreen({ navigation }: PrivateJetListScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleJetPress = (jetId: string) => {
    navigation.navigate('MessageConcierge');
  };

  const filteredJets = jets.filter(jet =>
    searchQuery === '' || jet.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <ArrowLeft size={24} color="#FFFFFF" strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PRIVATE JET</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={18} color="rgba(255,255,255,0.4)" strokeWidth={1.5} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jets..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredJets.map((jet) => (
          <TouchableOpacity key={jet.id} style={styles.card} onPress={() => handleJetPress(jet.id)} activeOpacity={0.8}>
            <View style={styles.imageContainer}>
              <Image source={jet.thumbnail} style={styles.image} contentFit="cover" cachePolicy="memory-disk" />
              <LinearGradient colors={['transparent', 'rgba(9, 22, 46, 0.8)']} style={styles.imageOverlay} />
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{jet.name}</Text>
              <Text style={styles.details}>{jet.category}</Text>
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
