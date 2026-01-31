import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../src/lib/supabase';
import PrimaryButton from '../components/buttons/PrimaryButton';
import CountryCodePickerModal, { COUNTRIES, Country } from '../components/modals/CountryCodePickerModal';
import { ChevronRight } from '../components/icons/AppIcons';

interface CompleteProfileScreenProps {
  navigation: any;
  route: any;
}

const BACKGROUND = '#0A1628';
const CARD_BG = '#111D2E';
const ACCENT = '#5684C4';

export default function CompleteProfileScreen({ navigation, route }: CompleteProfileScreenProps) {
  const insets = useSafeAreaInsets();
  const { inviteCode, userId } = route.params || {};
  
  const [userName, setUserName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]); // UAE default
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's name from auth
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Try to get name from user metadata
        const name = user.user_metadata?.full_name || 
                     user.user_metadata?.name ||
                     user.email?.split('@')[0] || 
                     '';
        setUserName(name);
      }
    };
    fetchUserData();
  }, []);

  const handleComplete = async () => {
    console.log('🔵 handleComplete called');
    console.log('🔵 phoneNumber:', phoneNumber);
    console.log('🔵 userId from route:', userId);
    
    if (!phoneNumber.trim()) {
      setError('Please enter your phone number');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const fullPhone = `${selectedCountry.dialCode}${phoneNumber.replace(/\s/g, '')}`;
      console.log('🔵 fullPhone:', fullPhone);
      
      // Get auth user data for email
      const { data: { user: authUser } } = await supabase.auth.getUser();
      console.log('🔵 authUser:', authUser?.id, authUser?.email);
      
      if (!authUser) {
        throw new Error('No authenticated user found');
      }

      // Use authUser.id if userId from route is missing
      const finalUserId = userId || authUser.id;
      console.log('🔵 finalUserId:', finalUserId);

      // Check if profile already exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('users')
        .select('id')
        .eq('id', finalUserId)
        .single();

      console.log('🔵 existingProfile:', existingProfile, 'fetchError:', fetchError?.message);

      if (existingProfile) {
        // Profile exists - update it
        console.log('📝 Updating existing profile...');
        const { error: updateError } = await supabase
          .from('users')
          .update({
            phone: fullPhone,
            full_name: userName || authUser.user_metadata?.full_name || authUser.email?.split('@')[0],
            invite_code_used: inviteCode?.toUpperCase() || null,
          })
          .eq('id', finalUserId);

        if (updateError) {
          console.error('❌ Update error:', updateError);
          throw updateError;
        }
        console.log('✅ Profile updated!');
      } else {
        // Profile doesn't exist - create it
        console.log('📝 Creating new profile for OAuth user...');
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: finalUserId,
            email: authUser.email,
            full_name: userName || authUser.user_metadata?.full_name || authUser.email?.split('@')[0],
            phone: fullPhone,
            tier: 'blue',
            points_balance: 100,
            preferred_cities: [], // Empty array - will be set in onboarding
            invite_code_used: inviteCode?.toUpperCase() || null,
          });

        if (insertError) {
          console.error('❌ Insert error:', insertError);
          throw insertError;
        }
        console.log('✅ Profile created!');
      }

      console.log('✅ Profile saved, navigating to city selection...');
      // Navigate to city selection
      navigation.replace('CitySelection');
      
    } catch (err: any) {
      console.error('❌ Complete profile error:', err);
      setError(err.message || 'Failed to complete profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* Welcome */}
        <Text style={styles.title}>Welcome{userName ? `, ${userName.split(' ')[0]}` : ''}!</Text>
        <Text style={styles.subtitle}>Just one more thing — we need your phone number for booking confirmations.</Text>

        {/* Phone Input */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.phoneRow}>
            <TouchableOpacity
              style={styles.countryButton}
              onPress={() => setShowCountryPicker(true)}
            >
              <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
              <Text style={styles.countryCode}>{selectedCountry.dialCode}</Text>
              <ChevronRight size={16} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
            <TextInput
              style={styles.phoneInput}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Phone number"
              placeholderTextColor="rgba(255,255,255,0.3)"
              keyboardType="phone-pad"
              autoFocus
            />
          </View>
        </View>

        {/* Error */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Why we need it */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Venues will use this number to confirm your bookings and contact you if needed.
          </Text>
        </View>
      </View>

      {/* Submit Button */}
      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 16 }]}>
        <PrimaryButton
          title={isSubmitting ? 'SAVING...' : 'CONTINUE'}
          onPress={handleComplete}
          disabled={isSubmitting || !phoneNumber.trim()}
        />
      </View>

      {/* Country Picker Modal */}
      <CountryCodePickerModal
        visible={showCountryPicker}
        onClose={() => setShowCountryPicker(false)}
        onSelectCountry={(country: Country) => {
          setSelectedCountry(country);
          setShowCountryPicker(false);
        }}
        selectedCountry={selectedCountry}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 40,
    lineHeight: 24,
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  phoneRow: {
    flexDirection: 'row',
    gap: 12,
  },
  countryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 6,
  },
  countryFlag: {
    fontSize: 20,
  },
  countryCode: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  phoneInput: {
    flex: 1,
    backgroundColor: CARD_BG,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: 'rgba(86,132,196,0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(86,132,196,0.2)',
  },
  infoText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 20,
  },
  bottomContainer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
});
