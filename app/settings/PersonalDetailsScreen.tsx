import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandColors, BackgroundColors, TextColors, AccentColors, Spacing, Typography, BorderRadius, StatusColors, Shadows } from '../../constants/brand';
import { ChevronLeft, Camera } from '../../components/icons/AppIcons';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import { getUserProfile, updateUserProfile } from '../../src/services/api';
import type { User } from '../../src/types/database';

interface PersonalDetailsScreenProps {
  navigation: any;
}

export default function PersonalDetailsScreen({ navigation }: PersonalDetailsScreenProps) {
  const [user, setUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [nationality, setNationality] = useState('British');
  const [ageGroup, setAgeGroup] = useState('26-35');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getUserProfile();
        if (result.error) {
          setError(result.error);
        } else if (result.user) {
          setUser(result.user);
          setFullName(result.user.full_name);
          setEmail(result.user.email);
          setPhone(result.user.phone || '');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Helper function to get initials from name
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle photo upload (placeholder)
  const handlePhotoUpload = () => {
    Alert.alert(
      'Change Photo',
      'Photo upload feature coming soon!',
      [{ text: 'OK' }]
    );
    // TODO: Implement image picker and Supabase Storage upload
    // For now, this is a placeholder
  };

  // Handle save
  const handleSave = async () => {
    if (!user) return;

    // Validate inputs
    if (!fullName.trim()) {
      setError('Full name is required');
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Build update object with only changed fields
      const updates: { full_name?: string; phone?: string } = {};
      
      if (fullName.trim() !== user.full_name) {
        updates.full_name = fullName.trim();
      }
      
      if (phone.trim() !== (user.phone || '')) {
        updates.phone = phone.trim() || null;
      }

      // Check if there are any changes
      if (Object.keys(updates).length === 0) {
        setSuccessMessage('No changes to save');
        setIsSaving(false);
        return;
      }

      const result = await updateUserProfile(updates);

      if (result.error) {
        setError(result.error);
      } else if (result.user) {
        setUser(result.user);
        setSuccessMessage('Profile updated successfully!');
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={TextColors.primary} strokeWidth={1.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Personal Details</Text>
          <View style={styles.headerSpacer} />
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={AccentColors.primary} />
            <Text style={styles.loadingText}>Loading profile...</Text>
          </View>
        ) : (
          <>
            {/* Avatar */}
            <View style={styles.avatarSection}>
              <TouchableOpacity onPress={handlePhotoUpload} activeOpacity={0.8}>
                <View style={styles.avatar}>
                  {user?.photo_url ? (
                    <Image
                      source={{ uri: user.photo_url }}
                      style={styles.avatarImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text style={styles.avatarText}>
                      {user ? getInitials(user.full_name) : '--'}
                    </Text>
                  )}
                  <View style={styles.avatarOverlay}>
                    <Camera size={24} color={TextColors.primary} strokeWidth={1.5} />
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={handlePhotoUpload}>
                <Text style={styles.changePhotoText}>Change photo</Text>
              </TouchableOpacity>
            </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <TextInput
            style={[
              styles.input,
              focusedField === 'fullName' && styles.inputFocused,
            ]}
            placeholder="Full Name"
            placeholderTextColor={TextColors.tertiary}
            value={fullName}
            onChangeText={setFullName}
            onFocus={() => setFocusedField('fullName')}
            onBlur={() => setFocusedField(null)}
            autoCapitalize="words"
          />

          <TextInput
            style={[
              styles.input,
              styles.inputReadOnly,
            ]}
            placeholder="Email"
            placeholderTextColor={TextColors.tertiary}
            value={email}
            editable={false}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text style={styles.readOnlyNote}>Email cannot be changed</Text>

          <TextInput
            style={[
              styles.input,
              focusedField === 'phone' && styles.inputFocused,
            ]}
            placeholder="Phone"
            placeholderTextColor={TextColors.tertiary}
            value={phone}
            onChangeText={setPhone}
            onFocus={() => setFocusedField('phone')}
            onBlur={() => setFocusedField(null)}
            keyboardType="phone-pad"
          />

          <TouchableOpacity
            style={[
              styles.input,
              styles.dropdownInput,
              focusedField === 'nationality' && styles.inputFocused,
            ]}
            onPress={() => setFocusedField('nationality')}
          >
            <Text style={styles.dropdownText}>{nationality}</Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.input,
              styles.dropdownInput,
              focusedField === 'ageGroup' && styles.inputFocused,
            ]}
            onPress={() => setFocusedField('ageGroup')}
          >
            <Text style={styles.dropdownText}>{ageGroup}</Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.messageContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Success Message */}
        {successMessage && (
          <View style={styles.messageContainer}>
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        )}
          </>
        )}
      </ScrollView>

      {/* Save Button */}
      {!isLoading && user && (
        <View style={styles.bottomButtonContainer}>
          <PrimaryButton
            title={isSaving ? "SAVING..." : "SAVE CHANGES"}
            onPress={handleSave}
            disabled={isSaving}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  content: {
    flex: 1,
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  headerTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  headerSpacer: {
    width: 24,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    marginTop: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(86,132,196,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(86,132,196,0.3)',
    overflow: 'hidden',
    position: 'relative',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    color: '#5684C4',
    fontSize: 32,
    fontWeight: '600',
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 6,
    alignItems: 'center',
  },
  changePhotoText: {
    color: '#5684C4',
    fontSize: 13,
    fontWeight: '500',
  },
  inputReadOnly: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    opacity: 0.6,
  },
  readOnlyNote: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 11,
    marginTop: -12,
    marginBottom: 16,
    marginLeft: 4,
  },
  messageContainer: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    textAlign: 'center',
  },
  successText: {
    color: '#22C55E',
    fontSize: 13,
    textAlign: 'center',
  },
  formSection: {
    marginBottom: 40,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 15,
    marginBottom: 16,
    minHeight: 56,
  },
  inputFocused: {
    borderColor: '#5684C4',
    borderWidth: 1.5,
    backgroundColor: 'rgba(86,132,196,0.05)',
  },
  dropdownInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  dropdownArrow: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
  },
  bottomButtonContainer: {
    padding: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: AccentColors.border,
    backgroundColor: BackgroundColors.primary,
  },
});
