import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from '../components/icons/AppIcons';
import { supabase } from '../src/lib/supabase';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import Svg, { Path } from 'react-native-svg';
import { BackgroundColors, AccentColors, TextColors, Typography, BorderRadius } from '../constants/brand';
import { useAuth } from '../src/contexts/AuthContext';

WebBrowser.maybeCompleteAuthSession();

// This generates the correct redirect URL for both Expo Go AND standalone builds
const redirectUrl = AuthSession.makeRedirectUri({
  scheme: 'sevenkeys',
  path: 'auth/callback',
});

// CRITICAL: Log this - you must add this EXACT URL to Supabase Dashboard
console.log('═══════════════════════════════════════════════════════');
console.log('🔗 OAuth redirect URL:', redirectUrl);
console.log('⚠️  Add this EXACT URL to Supabase Dashboard:');
console.log('   Authentication → URL Configuration → Redirect URLs');
console.log('═══════════════════════════════════════════════════════');

interface AuthMethodScreenProps {
  navigation: any;
  route: any;
}

// Google "G" logo
const GoogleIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </Svg>
);

// Apple logo
const AppleIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="#FFFFFF">
    <Path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </Svg>
);

export default function AuthMethodScreen({ navigation, route }: AuthMethodScreenProps) {
  const insets = useSafeAreaInsets();
  const inviteCode = route.params?.inviteCode || '';
  const { setUserDirect } = useAuth();
  
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    console.log('🚀 Google sign in started');
    setIsLoading('google');
    try {
      console.log('📤 Opening OAuth with redirect:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;

      if (data?.url) {
        console.log('🌐 Opening browser for OAuth...');
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
        console.log('🔄 OAuth result type:', result.type);
        console.log('🔄 OAuth result url:', (result as any).url || 'none');
        
        if (result.type === 'success' && result.url) {
          try {
            console.log('📍 Callback URL:', result.url);
            
            // Parse URL manually - new URL() can fail on exp:// schemes
            const callbackUrl = result.url;
            const hashIndex = callbackUrl.indexOf('#');
            const queryIndex = callbackUrl.indexOf('?');
            
            let hashParams = new URLSearchParams();
            let queryParams = new URLSearchParams();
            
            if (hashIndex !== -1) {
              hashParams = new URLSearchParams(callbackUrl.substring(hashIndex + 1));
            }
            if (queryIndex !== -1) {
              const queryEnd = hashIndex !== -1 && hashIndex > queryIndex ? hashIndex : callbackUrl.length;
              queryParams = new URLSearchParams(callbackUrl.substring(queryIndex + 1, queryEnd));
            }
            
            console.log('🔍 [Google] Hash params:', [...hashParams.entries()]);
            console.log('🔍 [Google] Query params:', [...queryParams.entries()]);
            
            // Try hash fragment first (implicit flow), then query params
            let accessToken = hashParams.get('access_token') || queryParams.get('access_token');
            let refreshToken = hashParams.get('refresh_token') || queryParams.get('refresh_token');
            
            // Check for PKCE code (Supabase returns code instead of tokens)
            if (!accessToken) {
              const code = hashParams.get('code') || queryParams.get('code');
              console.log('🔐 [Google] Looking for code, found:', code ? `${code.substring(0, 10)}...` : 'NONE');
              
              if (code) {
                console.log('🔐 [Google] PKCE code found, exchanging...');
                try {
                  const { data: sessionData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
                  console.log('🔐 [Google] Exchange result - data:', !!sessionData, 'error:', exchangeError?.message || 'none');
                  
                  if (exchangeError) {
                    console.error('❌ [Google] Code exchange failed:', exchangeError);
                    Alert.alert('Sign In Error', `Code exchange failed: ${exchangeError.message}`);
                    setIsLoading(null);
                    return;
                  }
                  
                  if (sessionData?.session) {
                    accessToken = sessionData.session.access_token;
                    refreshToken = sessionData.session.refresh_token;
                    console.log('✅ [Google] Code exchanged successfully, token:', !!accessToken);
                  } else {
                    console.error('❌ [Google] No session in exchange response');
                  }
                } catch (exchangeErr: any) {
                  console.error('❌ [Google] Exchange threw:', exchangeErr);
                  Alert.alert('Sign In Error', `Exchange error: ${exchangeErr.message}`);
                  setIsLoading(null);
                  return;
                }
              } else {
                // Check for error in callback
                const error = hashParams.get('error') || queryParams.get('error');
                const errorDesc = hashParams.get('error_description') || queryParams.get('error_description');
                if (error) {
                  console.error('❌ [Google] OAuth error:', error, errorDesc);
                  Alert.alert('Sign In Error', errorDesc || error);
                  setIsLoading(null);
                  return;
                }
              }
            }
            
            console.log('🔑 Access token found:', !!accessToken);
            
            if (accessToken) {
              console.log('🔐 [Google] Setting session...');
              
              // Fire and forget - setSession hangs due to SecureStore limits
              supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken || '',
              }).catch(() => {});
              
              // Wait for session AND AuthContext to update (AuthContext waits 2s, so we wait 4s)
              console.log('⏳ [Google] Waiting 4s for auth context...');
              await new Promise(resolve => setTimeout(resolve, 4000));
              
              // Get user from auth
              const { data: { user }, error: userError } = await supabase.auth.getUser();
              console.log('👤 [Google] getUser result:', user?.id || 'NO USER', userError?.message || '');
              
              if (!user) {
                console.log('❌ [Google] No user found after session set');
                setIsLoading(null);
                Alert.alert('Error', 'Sign in failed. Please try again.');
                return;
              }
              
              const userId = user.id;
              
              // Fetch FULL profile (not just phone/cities)
              const { data: fullProfile, error: profileErr } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();
              
              console.log('📋 [Google] Profile:', fullProfile ? `id=${fullProfile.id}, phone=${!!fullProfile.phone}, cities=${fullProfile.preferred_cities}` : 'NONE', profileErr?.code || '');
              
              // Clear loading
              setIsLoading(null);
              
              if (!fullProfile || !fullProfile.phone) {
                console.log('➡️ [Google] → CompleteProfile');
                navigation.replace('CompleteProfile', { inviteCode, userId });
              } else {
                // Profile exists - directly set it in AuthContext to trigger navigation
                console.log('➡️ [Google] Setting user directly in AuthContext...');
                setUserDirect(fullProfile);
                console.log('✅ [Google] User set, RootNavigator should switch now');
              }
              return;
            } else {
              console.error('❌ [Google] No token and no code found in callback URL');
              console.error('❌ [Google] This usually means Supabase redirect URL config is wrong');
              console.error('❌ [Google] Expected redirect URL:', redirectUrl);
              Alert.alert(
                'Sign In Error', 
                'No token received. Check that your Supabase redirect URL matches:\n\n' + redirectUrl
              );
            }
          } catch (urlError: any) {
            console.error('❌ [Google] Error:', urlError);
            Alert.alert('Error', urlError.message || 'Failed to process authentication');
          }
        } else if (result.type === 'cancel') {
          console.log('🚫 [Google] Cancelled');
        } else {
          console.log('⚠️ [Google] Result:', result.type);
        }
      }
    } catch (error: any) {
      console.error('❌ [Google] Outer error:', error);
      Alert.alert('Error', error.message || 'Failed to sign in with Google');
    } finally {
      console.log('🏁 [Google] Finally block, clearing loading');
      setIsLoading(null);
    }
  };

  const handleAppleSignIn = async () => {
    setIsLoading('apple');
    try {
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) throw error;

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
        console.log('🔄 Apple OAuth result:', result.type);
        
        if (result.type === 'success' && result.url) {
          try {
            console.log('📍 Apple callback URL:', result.url);
            
            const url = new URL(result.url);
            let params = new URLSearchParams(url.hash.substring(1));
            let accessToken = params.get('access_token');
            let refreshToken = params.get('refresh_token');
            
            if (!accessToken) {
              params = new URLSearchParams(url.search);
              accessToken = params.get('access_token');
              refreshToken = params.get('refresh_token');
            }
            
            // Check for PKCE code (Supabase returns code instead of tokens)
            if (!accessToken) {
              const code = params.get('code') || new URLSearchParams(url.search).get('code');
              if (code) {
                console.log('🔐 [Apple] PKCE code found, exchanging...');
                const { data: sessionData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
                if (exchangeError) {
                  console.error('❌ [Apple] Code exchange failed:', exchangeError);
                  Alert.alert('Sign In Error', exchangeError.message);
                  setIsLoading(null);
                  return;
                }
                accessToken = sessionData.session?.access_token || null;
                refreshToken = sessionData.session?.refresh_token || null;
                console.log('✅ [Apple] Code exchanged, token:', !!accessToken);
              }
            }
            
            console.log('🔑 Access token found:', !!accessToken);
            
            if (accessToken) {
              console.log('🔐 [Apple] Setting session...');
              
              // Don't await - hangs due to SecureStore size limits
              supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken || '',
              }).catch(err => console.log('🔐 [Apple] setSession error:', err));
              
              // Wait for session AND AuthContext to update
              await new Promise(resolve => setTimeout(resolve, 4000));
              
              const { data: { user }, error: userError } = await supabase.auth.getUser();
              console.log('👤 [Apple] User:', user?.id, userError?.message || '');
              
              if (user) {
                const { data: fullProfile } = await supabase
                  .from('users')
                  .select('*')
                  .eq('id', user.id)
                  .single();
                
                console.log('📋 [Apple] Profile:', fullProfile ? 'exists' : 'none');
                
                if (!fullProfile || !fullProfile.phone) {
                  navigation.replace('CompleteProfile', { inviteCode, userId: user.id });
                } else {
                  console.log('➡️ [Apple] Setting user directly...');
                  setUserDirect(fullProfile);
                  console.log('✅ [Apple] User set');
                }
              } else {
                Alert.alert('Error', 'Failed to get user after sign in');
              }
            } else {
              Alert.alert('Sign In Error', 'Authentication failed - no token received');
            }
          } catch (urlError: any) {
            console.error('❌ URL parsing error:', urlError);
            Alert.alert('Error', 'Failed to process authentication response');
          }
        } else if (result.type === 'cancel') {
          console.log('🚫 User cancelled OAuth');
        } else {
          console.log('⚠️ OAuth result:', result.type);
        }
      }
    } catch (error: any) {
      console.error('Apple sign in error:', error);
      Alert.alert('Error', error.message || 'Failed to sign in with Apple');
    } finally {
      setIsLoading(null);
    }
  };

  const handleEmailSignUp = () => {
    navigation.navigate('SignUp', { inviteCode });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={20} color={TextColors.secondary} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* Main Content - Centered */}
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Image
            source={require('../Images/transparent copy.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.logoText}>SEVEN KEYS</Text>
          <Text style={styles.tagline}>Your key to the extraordinary</Text>
        </View>

        {/* Auth Buttons */}
        <View style={styles.buttonsContainer}>
          {/* Primary buttons - Google & Apple */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleGoogleSignIn}
            disabled={isLoading !== null}
            activeOpacity={0.8}
          >
            {isLoading === 'google' ? (
              <ActivityIndicator color={TextColors.primary} size="small" />
            ) : (
              <>
                <GoogleIcon />
                <Text style={styles.primaryButtonText}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>

          {Platform.OS === 'ios' && (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleAppleSignIn}
              disabled={isLoading !== null}
              activeOpacity={0.8}
            >
              {isLoading === 'apple' ? (
                <ActivityIndicator color={TextColors.primary} size="small" />
              ) : (
                <>
                  <AppleIcon />
                  <Text style={styles.primaryButtonText}>Continue with Apple</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {/* Secondary - Email as text link */}
          <TouchableOpacity
            style={styles.emailLink}
            onPress={handleEmailSignUp}
            disabled={isLoading !== null}
            activeOpacity={0.6}
          >
            <Text style={styles.emailLinkText}>
              Use <Text style={styles.emailLinkAccent}>email</Text> instead
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Terms - Fixed at bottom */}
      <View style={[styles.termsContainer, { paddingBottom: insets.bottom + 20 }]}>
        <Text style={styles.terms}>
          By continuing, you agree to our{' '}
          <Text style={styles.termsLink}>Terms</Text>
          {' & '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColors.primary,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: BackgroundColors.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
    paddingBottom: 60,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 56,
  },
  logoImage: {
    width: 72,
    height: 72,
    marginBottom: 20,
  },
  logoText: {
    color: TextColors.primary,
    fontSize: 18,
    fontFamily: Typography?.fontFamily?.light || undefined,
    letterSpacing: 8,
    marginBottom: 12,
  },
  tagline: {
    color: TextColors.secondary,
    fontSize: 15,
    letterSpacing: 0.3,
  },
  buttonsContainer: {
    gap: 14,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BackgroundColors.cardBg,
    borderRadius: BorderRadius.md,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: AccentColors.border,
    gap: 14,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: TextColors.primary,
  },
  emailLink: {
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 8,
  },
  emailLinkText: {
    fontSize: 15,
    color: TextColors.secondary,
  },
  emailLinkAccent: {
    color: AccentColors.primary,
    fontWeight: '600',
  },
  termsContainer: {
    paddingHorizontal: 32,
  },
  terms: {
    textAlign: 'center',
    fontSize: 13,
    color: TextColors.tertiary,
    lineHeight: 18,
  },
  termsLink: {
    color: TextColors.secondary,
  },
});
