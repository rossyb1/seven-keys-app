import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, ActivityIndicator, Alert } from 'react-native';
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
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColors.primary,
  },
  content: {
    flex: 1,
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  headerTitle: {
    flex: 1,
    color: TextColors.primary,
    fontSize: Typography.fontSize.xl,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 24,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl * 2,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl * 3,
  },
  loadingText: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.base,
    marginTop: Spacing.base,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: BackgroundColors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.base,
    borderWidth: 1,
    borderColor: AccentColors.border,
    overflow: 'hidden',
    position: 'relative',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize['2xl'],
    fontWeight: '600',
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: Spacing.xs,
    alignItems: 'center',
  },
  changePhotoText: {
    color: AccentColors.primary,
    fontSize: Typography.fontSize.sm,
  },
  inputReadOnly: {
    backgroundColor: BackgroundColors.cardBg,
    opacity: 0.7,
  },
  readOnlyNote: {
    color: TextColors.tertiary,
    fontSize: Typography.fontSize.xs,
    marginTop: -Spacing.lg + Spacing.xs,
    marginBottom: Spacing.lg,
    marginLeft: Spacing.sm,
  },
  messageContainer: {
    backgroundColor: BackgroundColors.cardBg,
    borderWidth: 1,
    borderColor: AccentColors.borderLight,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    ...Shadows.sm,
  },
  errorText: {
    color: StatusColors.cancelled,
    fontSize: Typography.fontSize.sm,
    textAlign: 'center',
  },
  successText: {
    color: StatusColors.confirmed,
    fontSize: Typography.fontSize.sm,
    textAlign: 'center',
  },
  formSection: {
    marginBottom: Spacing.xl * 2,
  },
  input: {
    backgroundColor: BackgroundColors.secondary,
    borderWidth: 1,
    borderColor: AccentColors.borderLight,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    color: TextColors.primary,
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.regular,
    marginBottom: Spacing.lg,
    minHeight: 56,
    ...Shadows.sm,
  },
  inputFocused: {
    borderColor: AccentColors.primary,
    borderWidth: 2,
    ...Shadows.glow,
  },
  dropdownInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.regular,
  },
  dropdownArrow: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.sm,
  },
  bottomButtonContainer: {
    padding: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: AccentColors.border,
    backgroundColor: BackgroundColors.primary,
  },
});
