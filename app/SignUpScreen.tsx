import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { BrandColors, BackgroundColors, TextColors, AccentColors, Spacing, BorderRadius, Typography } from '../constants/brand';
import { ChevronLeft, ChevronRight } from '../components/icons/AppIcons';
import PrimaryButton from '../components/buttons/PrimaryButton';
import { createUser } from '../src/services/api';
import CountryCodePickerModal, { COUNTRIES, Country } from '../components/modals/CountryCodePickerModal';
import NationalityPickerModal, { NATIONALITIES, Nationality } from '../components/modals/NationalityPickerModal';

interface SignUpScreenProps {
  navigation: any;
  route: any;
}

export default function SignUpScreen({ navigation, route }: SignUpScreenProps) {
  const insets = useSafeAreaInsets();
  const inviteCode = route.params?.inviteCode || '';
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]); // Default to UAE
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedNationality, setSelectedNationality] = useState<Nationality | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showNationalityPicker, setShowNationalityPicker] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handlePhotoPicker = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library to add a profile photo.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (err) {
      console.error('Error picking image:', err);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleContinue = async () => {
    // Clear previous errors
    setError(null);
    console.log('🔄 Create account button pressed');

    // Validate all fields are filled
    if (!fullName.trim() || !email.trim() || !phoneNumber.trim() || !password || !confirmPassword) {
      setError('Please fill in all required fields');
      console.log('❌ Validation failed: missing fields');
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      console.log('❌ Validation failed: invalid email');
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      console.log('❌ Validation failed: passwords do not match');
      return;
    }

    // Validate password strength (minimum 8 characters with complexity)
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      console.log('❌ Validation failed: password too short');
      return;
    }
    
    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least one uppercase letter');
      console.log('❌ Validation failed: no uppercase letter');
      return;
    }
    
    if (!/[a-z]/.test(password)) {
      setError('Password must contain at least one lowercase letter');
      console.log('❌ Validation failed: no lowercase letter');
      return;
    }
    
    if (!/[0-9]/.test(password)) {
      setError('Password must contain at least one number');
      console.log('❌ Validation failed: no number');
      return;
    }

    // Validate invite code exists
    if (!inviteCode) {
      setError('Invalid invite code. Please go back and enter a valid code.');
      console.log('❌ Validation failed: no invite code');
      return;
    }

    setIsSubmitting(true);

    try {
      // Combine country code with phone number
      const fullPhone = `${selectedCountry.dialCode}${phoneNumber.trim()}`;
      
      // Call createUser - this handles supabase.auth.signUp() and inserting into users table
      const result = await createUser({
        email: email.trim(),
        full_name: fullName.trim(),
        phone: fullPhone,
        invite_code: inviteCode,
      });

      if (result.error) {
        // Show user-friendly error message
        let errorMessage = result.error;
        if (result.error.includes('Network') || result.error.includes('network') || result.error.includes('fetch')) {
          errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
        } else if (result.error.includes('Supabase is not configured')) {
          errorMessage = 'Server configuration error. Please contact support or try again later.';
        } else if (result.error.includes('already registered') || result.error.includes('already exists')) {
          errorMessage = 'This email is already registered. Please sign in instead.';
        }
        setError(errorMessage);
        setIsSubmitting(false);
      } else if (result.user) {
        // User created successfully - navigate immediately
        // Auth context will update automatically via onAuthStateChange
        navigation.navigate('CitySelection');
      } else {
        setError('Failed to create account. Please try again.');
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <ChevronLeft size={24} color={TextColors.primary} strokeWidth={1.5} />
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <Text style={styles.headline}>Create your profile</Text>

          <View style={styles.photoSection}>
            <TouchableOpacity 
              style={styles.photoPlaceholder}
              onPress={handlePhotoPicker}
              disabled={isSubmitting}
            >
              <View style={styles.photoCircle}>
                {photoUri ? (
                  <Image source={{ uri: photoUri }} style={styles.photoImage} />
                ) : (
                  <Text style={styles.plusIcon}>+</Text>
                )}
              </View>
            </TouchableOpacity>
            <Text style={styles.photoLabel}>Tap to add photo</Text>
          </View>

          <TextInput
            style={[
              styles.input,
              focusedField === 'fullName' && styles.inputFocused,
              error && styles.inputError,
            ]}
            placeholder="Full Name"
            placeholderTextColor={TextColors.tertiary}
            value={fullName}
            onChangeText={(text) => {
              setFullName(text);
              setError(null);
            }}
            onFocus={() => setFocusedField('fullName')}
            onBlur={() => setFocusedField(null)}
            autoCapitalize="words"
            editable={!isSubmitting}
          />

          <TextInput
            style={[
              styles.input,
              focusedField === 'email' && styles.inputFocused,
              error && styles.inputError,
            ]}
            placeholder="Email"
            placeholderTextColor={TextColors.tertiary}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError(null);
            }}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isSubmitting}
          />

          {/* Phone Number with Country Code */}
          <View style={styles.phoneContainer}>
            <TouchableOpacity
              style={[
                styles.countryCodeButton,
                focusedField === 'phone' && styles.countryCodeButtonFocused,
                error && styles.countryCodeButtonError,
              ]}
              onPress={() => setShowCountryPicker(true)}
              disabled={isSubmitting}
            >
              <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
              <Text style={styles.countryDialCode}>{selectedCountry.dialCode}</Text>
              <ChevronRight 
                size={16} 
                color={TextColors.secondary} 
                strokeWidth={1.5}
                style={styles.chevronIcon}
              />
            </TouchableOpacity>
            <TextInput
              style={[
                styles.phoneInput,
                focusedField === 'phone' && styles.inputFocused,
                error && styles.inputError,
              ]}
              placeholder="501234567"
              placeholderTextColor={TextColors.tertiary}
              value={phoneNumber}
              onChangeText={(text) => {
                // Only allow numbers
                const numericText = text.replace(/[^0-9]/g, '');
                setPhoneNumber(numericText);
                setError(null);
              }}
              onFocus={() => setFocusedField('phone')}
              onBlur={() => setFocusedField(null)}
              keyboardType="phone-pad"
              editable={!isSubmitting}
            />
          </View>

          <TextInput
            style={[
              styles.input,
              focusedField === 'password' && styles.inputFocused,
              error && styles.inputError,
            ]}
            placeholder="Password"
            placeholderTextColor={TextColors.tertiary}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError(null);
            }}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
            secureTextEntry={true}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isSubmitting}
          />

          <TextInput
            style={[
              styles.input,
              focusedField === 'confirmPassword' && styles.inputFocused,
              error && styles.inputError,
            ]}
            placeholder="Confirm Password"
            placeholderTextColor={TextColors.tertiary}
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setError(null);
            }}
            onFocus={() => setFocusedField('confirmPassword')}
            onBlur={() => setFocusedField(null)}
            secureTextEntry={true}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isSubmitting}
          />

          {/* Nationality Picker */}
          <TouchableOpacity
            style={[
              styles.input,
              styles.pickerInput,
              focusedField === 'nationality' && styles.inputFocused,
            ]}
            onPress={() => {
              setShowNationalityPicker(true);
              setFocusedField('nationality');
            }}
            disabled={isSubmitting}
          >
            <View style={styles.pickerContent}>
              {selectedNationality ? (
                <>
                  <Text style={styles.pickerFlag}>{selectedNationality.flag}</Text>
                  <Text style={styles.pickerText}>{selectedNationality.name}</Text>
                </>
              ) : (
                <Text style={styles.pickerPlaceholder}>Nationality</Text>
              )}
              <ChevronRight 
                size={16} 
                color={TextColors.secondary} 
                strokeWidth={1.5}
                style={styles.chevronIcon}
              />
            </View>
          </TouchableOpacity>

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
        </View>
      </ScrollView>

      <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + Spacing.base }]}>
        <PrimaryButton
          title={isSubmitting ? 'CREATING ACCOUNT...' : 'CONTINUE'}
          onPress={handleContinue}
          disabled={isSubmitting}
          style={{ width: '100%' }}
        />
      </View>

      {/* Country Code Picker Modal */}
      <CountryCodePickerModal
        visible={showCountryPicker}
        onClose={() => setShowCountryPicker(false)}
        selectedCountry={selectedCountry}
        onSelectCountry={setSelectedCountry}
      />

      {/* Nationality Picker Modal */}
      <NationalityPickerModal
        visible={showNationalityPicker}
        onClose={() => {
          setShowNationalityPicker(false);
          setFocusedField(null);
        }}
        selectedNationality={selectedNationality}
        onSelectNationality={setSelectedNationality}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  backButton: {
    padding: 16,
    alignSelf: 'flex-start',
    paddingTop: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  headline: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 32,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  photoPlaceholder: {
    alignItems: 'center',
  },
  photoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(86,132,196,0.1)',
    borderWidth: 2,
    borderColor: 'rgba(86,132,196,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  plusIcon: {
    color: '#5684C4',
    fontSize: 32,
    fontWeight: '300',
  },
  photoLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    marginTop: 10,
  },
  phoneContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingHorizontal: 14,
    minHeight: 56,
    minWidth: 115,
    marginRight: 10,
  },
  countryCodeButtonFocused: {
    borderColor: '#5684C4',
  },
  countryCodeButtonError: {
    borderColor: '#EF4444',
  },
  countryFlag: {
    fontSize: 18,
    marginRight: 6,
  },
  countryDialCode: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
    marginRight: 4,
  },
  chevronIcon: {
    transform: [{ rotate: '90deg' }],
  },
  phoneInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 15,
    minHeight: 56,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 15,
    marginBottom: 16,
    minHeight: 56,
  },
  pickerInput: {
    padding: 0,
    justifyContent: 'center',
  },
  pickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  pickerFlag: {
    fontSize: 18,
    marginRight: 10,
  },
  pickerText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
  },
  pickerPlaceholder: {
    flex: 1,
    color: 'rgba(255,255,255,0.35)',
    fontSize: 15,
  },
  inputFocused: {
    borderColor: '#5684C4',
    backgroundColor: 'rgba(86,132,196,0.05)',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    marginBottom: 16,
    marginTop: -8,
  },
});
