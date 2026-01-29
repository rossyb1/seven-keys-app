import React, { useState } from 'react';
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
import { BrandColors, BackgroundColors, TextColors, AccentColors, Spacing, BorderRadius, Typography } from '../constants/brand';
import { ChevronLeft } from '../components/icons/AppIcons';
import PrimaryButton from '../components/buttons/PrimaryButton';
import { validateInviteCode } from '../src/services/api';

interface InviteCodeScreenProps {
  navigation: any;
}

export default function InviteCodeScreen({ navigation }: InviteCodeScreenProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    if (!inviteCode.trim()) {
      return;
    }

    setIsValidating(true);
    setError(null);

    try {
      // Add a timeout wrapper to ensure we don't hang forever
      const timeoutId = setTimeout(() => {
        setIsValidating(false);
        setError('Request is taking too long. Please check your connection and try again.');
      }, 12000); // 12 second timeout

      const result = await validateInviteCode(inviteCode.trim());
      
      clearTimeout(timeoutId);

      if (result.valid) {
        // Navigate to SignUp with invite code as param
        navigation.navigate('SignUp', { inviteCode: inviteCode.trim().toUpperCase() });
      } else {
        setError(result.error || 'Invalid or already used invite code');
      }
    } catch (err: any) {
      console.error('Invite code validation error:', err);
      setError(err.message || 'Failed to validate invite code. Please check your connection and try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleWaitlist = () => {
    Alert.alert(
      'Coming Soon',
      'The waitlist feature will be available soon.',
      [{ text: 'OK' }]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={24} color={TextColors.primary} strokeWidth={1.5} />
        </TouchableOpacity>

        <View style={styles.formContainer}>
          <Text style={styles.headline}>Enter your invitation code</Text>

          <TextInput
            style={[
              styles.input,
              isFocused && styles.inputFocused,
              error && styles.inputError,
            ]}
            placeholder="Enter code"
            placeholderTextColor={TextColors.tertiary}
            value={inviteCode}
            onChangeText={(text) => {
              setInviteCode(text);
              setError(null); // Clear error when user types
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoCapitalize="characters"
            autoCorrect={false}
            editable={!isValidating}
          />

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <PrimaryButton
            title={isValidating ? 'VALIDATING...' : 'CONTINUE'}
            onPress={handleContinue}
            disabled={!inviteCode.trim() || isValidating}
            style={{ width: '100%', marginBottom: Spacing.base }}
          />

          <TouchableOpacity
            style={styles.waitlistLink}
            onPress={handleWaitlist}
          >
            <Text style={styles.waitlistLinkText}>Don't have a code? Request an invitation</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  content: {
    flex: 1,
    paddingTop: 24,
  },
  backButton: {
    padding: 16,
    alignSelf: 'flex-start',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  headline: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 48,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 20,
    minHeight: 56,
    textAlign: 'center',
    letterSpacing: 4,
    fontWeight: '600',
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
    marginTop: -12,
    textAlign: 'center',
  },
  waitlistLink: {
    alignItems: 'center',
    marginTop: 8,
  },
  waitlistLinkText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
  },
});
