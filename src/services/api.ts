import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import type { User, Venue, Booking, WaitlistEntry } from '../types/database';

// ============================================================================
// Invite Code Functions
// ============================================================================

export async function validateInviteCode(
  code: string
): Promise<{ valid: boolean; error?: string }> {
  const upperCode = code.toUpperCase().trim();
  
  // Test codes ONLY work in development (disabled in production)
  if (__DEV__) {
    const TEST_CODES = ['TEST', 'TEST123', 'DEMO', 'DEV'];
    if (TEST_CODES.includes(upperCode)) {
      console.log('✅ Using test invite code (DEV ONLY - disabled in production)');
      return { valid: true };
    }
  }

  // Check if Supabase is properly configured
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
    console.warn('⚠️ Supabase not configured - invite code validation disabled');
    return { 
      valid: false, 
      error: 'Supabase is not configured. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file. For testing, use code: TEST' 
    };
  }

  try {
    // Add timeout to prevent hanging (reduced to 8 seconds)
    const timeoutPromise = new Promise<{ valid: boolean; error?: string }>((_, reject) =>
      setTimeout(() => reject(new Error('Connection timeout. Please check your internet connection and try again.')), 8000)
    );

    const queryPromise = (async () => {
      console.log('🔍 Validating invite code with Supabase...');
      const { data, error } = await supabase
        .from('invite_codes')
        .select('id, status')
        .eq('code', upperCode)
        .eq('status', 'unused')
        .single();

      if (error) {
        console.error('Supabase error:', error);
        if (error.code === 'PGRST116') {
          // No rows returned
          return { valid: false, error: 'Invalid or already used invite code' };
        }
        // Check if it's a network/connection error
        if (error.message?.includes('fetch') || error.message?.includes('network') || error.message?.includes('timeout')) {
          return { valid: false, error: 'Connection error. Please check your internet and try again.' };
        }
        return { valid: false, error: error.message || 'Failed to validate invite code' };
      }

      if (!data) {
        return { valid: false, error: 'Invalid invite code' };
      }

      console.log('✅ Invite code validated successfully');
      return { valid: true };
    })();

    return await Promise.race([queryPromise, timeoutPromise]);
  } catch (error: any) {
    console.error('validateInviteCode error:', error);
    const errorMessage = error.message || 'Failed to validate invite code';
    
    // Provide helpful message based on error type
    if (errorMessage.includes('timeout') || errorMessage.includes('Connection timeout')) {
      return { 
        valid: false, 
        error: 'Request timed out. Please check your internet connection. For testing, try code: TEST' 
      };
    }
    
    return { 
      valid: false, 
      error: errorMessage 
    };
  }
}

export async function markInviteCodeUsed(
  code: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('invite_codes')
      .update({
        status: 'used',
        used_by: userId,
        used_at: new Date().toISOString(),
      })
      .eq('code', code.toUpperCase())
      .eq('status', 'unused');

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to mark invite code as used' };
  }
}

// ============================================================================
// User Functions
// ============================================================================

// Helper function to complete a partial signup (auth user exists but profile doesn't)
async function completePartialSignup(
  authUserId: string,
  userData: { email: string; full_name: string; phone: string; invite_code: string }
): Promise<{ user: User | null; error?: string }> {
  console.log('🔄 Attempting to complete partial signup for:', authUserId);
  
  try {
    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUserId)
      .single();
    
    if (existingProfile) {
      console.log('✅ Profile already exists, returning it');
      return { user: existingProfile as User };
    }
    
    // Try to create the profile
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        id: authUserId,
        email: userData.email,
        full_name: userData.full_name,
        phone: userData.phone,
        tier: 'member',
        points_balance: 0,
        preferred_cities: JSON.stringify([]),
        invite_code_used: userData.invite_code.toUpperCase(),
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Failed to complete partial signup:', insertError);
      return { user: null, error: insertError.message };
    }
    
    console.log('✅ Partial signup completed successfully');
    return { user: newUser as User };
  } catch (error: any) {
    console.error('❌ Exception completing partial signup:', error);
    return { user: null, error: error.message || 'Failed to complete signup' };
  }
}

export async function createUser(userData: {
  email: string;
  full_name: string;
  phone: string;
  invite_code: string;
}): Promise<{ user: User | null; error?: string }> {
  try {
    // Check if Supabase is properly configured
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    
    console.log('🔍 createUser - Environment check:');
    console.log('  URL:', supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'MISSING');
    console.log('  Key:', supabaseAnonKey ? 'SET' : 'MISSING');
    
    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
      console.error('❌ Supabase not configured');
      console.error('  supabaseUrl:', supabaseUrl);
      console.error('  supabaseAnonKey:', supabaseAnonKey ? 'SET' : 'MISSING');
      return { 
        user: null, 
        error: 'Supabase is not configured. Please check your .env file and restart the Expo server with: npx expo start --clear' 
      };
    }
    
    // Verify Supabase client is using real URL (not placeholder)
    const actualSupabaseUrl = (supabase as any).supabaseUrl || supabaseUrl;
    console.log('🔍 Verifying Supabase client:');
    console.log('  Expected URL:', supabaseUrl);
    console.log('  Actual client URL:', actualSupabaseUrl);
    
    if (actualSupabaseUrl.includes('placeholder')) {
      console.error('❌ Supabase client is using placeholder URL!');
      return {
        user: null,
        error: 'Supabase client is not properly configured. Please restart the app with: npx expo start --clear'
      };
    }

    // Generate a cryptographically secure random password
    // Uses expo-crypto which is properly supported in React Native
    const randomPassword = `${Crypto.randomUUID()}${Crypto.randomUUID()}`.replace(/-/g, '').slice(0, 24) + 'Aa1!';

    // REMOVED: Pre-check for existing email
    // This was blocking legitimate signups. We'll let the database constraints handle duplicates.
    // If auth user exists but profile doesn't, we'll complete the signup.
    console.log('🔍 Skipping pre-check - will let database handle duplicates');

    // Retry logic for network errors
    const maxRetries = 3;
    let lastError: any = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 createUser attempt ${attempt}/${maxRetries}`);

        // Add timeout to prevent hanging (15 seconds)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        
        const timeoutPromise = new Promise<{ user: User | null; error?: string }>((_, reject) =>
          setTimeout(() => reject(new Error('Network request timed out. Please check your internet connection and try again.')), 15000)
        );

        const signUpPromise = (async () => {
          // Sign up user with Supabase Auth
          console.log('📤 Attempting Supabase auth.signUp...');
          console.log('  Supabase URL:', supabaseUrl);
          console.log('  Email:', userData.email);
          console.log('  Supabase client configured:', supabaseUrl && !supabaseUrl.includes('placeholder'));
          
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: userData.email,
            password: randomPassword,
          });
          
          console.log('📥 auth.signUp response:');
          console.log('  Has data:', !!authData);
          console.log('  Has user:', !!authData?.user);
          console.log('  User ID:', authData?.user?.id);
          console.log('  Has error:', !!authError);
          console.log('  Error:', authError);

          if (authError) {
            console.error('❌ Auth error:', authError);
            console.error('  Code:', authError.status || authError.code);
            console.error('  Message:', authError.message);
            
            // Check for network errors
            if (authError.message?.includes('fetch') || 
                authError.message?.includes('network') || 
                authError.message?.includes('Network request failed') ||
                authError.message?.includes('Failed to fetch')) {
              throw new Error('NETWORK_ERROR');
            }
            
            // Check if user already exists - try to complete partial signup
            if (authError.message?.includes('already registered') || 
                authError.message?.includes('already exists') ||
                authError.message?.includes('User already registered') ||
                authError.status === 422) {
              
              console.log('🔄 Auth user already exists - checking if profile exists...');
              
              // Check if profile exists in users table
              const { data: existingProfile, error: profileError } = await supabase
                .from('users')
                .select('*')
                .eq('email', userData.email)
                .single();
              
              if (existingProfile) {
                console.log('✅ Profile exists - user should sign in');
                return { user: null, error: 'This email is already registered. Please sign in instead.' };
              }
              
              // Profile doesn't exist - this is a partial signup
              // We need the auth user ID. Try to get it via password reset or admin API
              // For now, we can't complete it without the user ID, so return helpful error
              console.log('⚠️ Auth user exists but profile doesn\'t - partial signup');
              console.log('💡 User needs to complete signup via password reset or contact support');
              
              return { 
                user: null, 
                error: 'An account with this email was started but not completed. Please use "Forgot Password" to reset and complete your signup, or contact support.' 
              };
            }
            
            // Don't retry for non-network errors
            return { user: null, error: authError.message || 'Failed to create account' };
          }

          if (!authData.user) {
            return { user: null, error: 'Failed to create authentication user' };
          }

          console.log('✅ Auth user created:', authData.user.id);

          // Check if user already exists (in case of retry after partial success)
          console.log('🔍 Checking if user profile already exists...');
          const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .single();

          if (existingUser) {
            console.log('✅ User profile already exists, returning existing user');
            return { user: existingUser as User };
          }

          // Insert into users table
          console.log('📤 Inserting user profile...');
          console.log('  User ID:', authData.user.id);
          console.log('  Email:', userData.email);
          console.log('  Full name:', userData.full_name);
          console.log('  Phone:', userData.phone);
          
          const insertPayload = {
            id: authData.user.id,
            email: userData.email,
            full_name: userData.full_name,
            phone: userData.phone,
            tier: 'member',
            points_balance: 0,
            preferred_cities: JSON.stringify([]),
            invite_code_used: userData.invite_code.toUpperCase(),
          };
          
          console.log('  Insert payload:', JSON.stringify(insertPayload, null, 2));
          
          const { data: newUser, error: userError } = await supabase
            .from('users')
            .insert(insertPayload)
            .select()
            .single();
          
          console.log('📥 users.insert response:');
          console.log('  Has data:', !!newUser);
          console.log('  New user ID:', newUser?.id);
          console.log('  Has error:', !!userError);
          console.log('  Error code:', userError?.code);
          console.log('  Error message:', userError?.message);
          console.log('  Error details:', userError?.details);
          console.log('  Error hint:', userError?.hint);

          if (userError) {
            console.error('❌ User profile error:', userError);
            console.error('  Code:', userError.code);
            console.error('  Message:', userError.message);
            console.error('  Details:', userError.details);
            console.error('  Hint:', userError.hint);
            
            // Check for constraint violations (duplicate email, etc.)
            if (userError.code === '23505' || userError.code === '23514') {
              console.log('🔄 Constraint violation detected, attempting recovery...');
              
              // Try to fetch user by ID first (in case it was created in a previous attempt)
              console.log('🔍 Checking if user exists by ID:', authData.user.id);
              const { data: existingUserById, error: fetchError } = await supabase
                .from('users')
                .select('*')
                .eq('id', authData.user.id)
                .single();
              
              if (existingUserById) {
                console.log('✅ Found existing user by ID, returning it');
                return { user: existingUserById as User };
              }
              
              // Try to fetch user by email (in case email is the constraint)
              console.log('🔍 Checking if user exists by email:', userData.email);
              const { data: existingUserByEmail, error: fetchEmailError } = await supabase
                .from('users')
                .select('*')
                .eq('email', userData.email)
                .single();
              
              if (existingUserByEmail) {
                console.log('✅ Found existing user by email');
                // The email exists but with different ID - this is a data inconsistency
                // For now, return error asking to sign in
                return { user: null, error: 'This email is already registered with a different account. Please sign in instead.' };
              }
              
              // If we get here, it's a constraint violation we can't recover from
              if (userError.message?.includes('email') || userError.message?.includes('Email')) {
                return { user: null, error: 'This email is already registered. Please sign in instead.' };
              }
              if (userError.message?.includes('id') || userError.message?.includes('user')) {
                return { user: null, error: 'Account already exists. Please sign in instead.' };
              }
              
              // Generic constraint violation
              console.error('❌ Unhandled constraint violation:', userError);
              return { user: null, error: 'This account already exists. Please sign in instead.' };
            }
            
            // Check for network errors
            if (userError.message?.includes('fetch') || 
                userError.message?.includes('network') || 
                userError.message?.includes('Network request failed') ||
                userError.message?.includes('Failed to fetch')) {
              throw new Error('NETWORK_ERROR');
            }
            return { user: null, error: userError.message || 'Failed to create user profile' };
          }

          console.log('✅ User profile created:', newUser.id);

          // Mark invite code as used (non-blocking)
          try {
            const markResult = await markInviteCodeUsed(userData.invite_code, authData.user.id);
            if (!markResult.success) {
              console.warn('⚠️ Failed to mark invite code as used:', markResult.error);
            }
          } catch (markError) {
            console.warn('⚠️ Error marking invite code as used:', markError);
          }

          // Ensure session is refreshed so auth context picks up the new user
          console.log('🔄 Refreshing session...');
          try {
            const { data: { session }, error: refreshError } = await supabase.auth.getSession();
            if (refreshError) {
              console.warn('⚠️ Session refresh warning:', refreshError.message);
            } else if (session) {
              console.log('✅ Session refreshed, user ID:', session.user.id);
            }
          } catch (refreshErr) {
            console.warn('⚠️ Session refresh exception:', refreshErr);
          }

          return { user: newUser as User };
        })();

        const result = await Promise.race([signUpPromise, timeoutPromise]);
        
        // If we got here, the request succeeded
        if (result.user) {
          console.log('✅ createUser succeeded');
          return result;
        }
        
        // If it's not a network error, return immediately
        if (result.error && !result.error.includes('Network') && !result.error.includes('timeout')) {
          return result;
        }
        
        // Otherwise, it's a network error - we'll retry
        lastError = result.error || 'Network error';
        
      } catch (error: any) {
        console.error(`❌ createUser attempt ${attempt} failed:`, error);
        console.error('  Error type:', typeof error);
        console.error('  Error code:', error?.code);
        console.error('  Error message:', error?.message);
        console.error('  Full error:', JSON.stringify(error, null, 2));
        
        lastError = error;
        
        // Check if it's a constraint violation (don't retry these)
        const errorCode = error?.code || error?.error?.code;
        const errorMessage = error?.message || error?.error?.message || '';
        
        if (errorCode === '23505' || errorCode === '23514' || 
            errorMessage.includes('violates') || 
            errorMessage.includes('constraint') ||
            errorMessage.includes('duplicate') ||
            errorMessage.includes('already exists') ||
            errorMessage.includes('unique constraint')) {
          console.error('❌ Constraint violation - not retrying');
          if (errorMessage.includes('email') || errorMessage.includes('Email')) {
            return { user: null, error: 'This email is already registered. Please sign in instead.' };
          }
          return { user: null, error: 'This account already exists. Please sign in instead.' };
        }
        
        // If it's not a network error, don't retry
        if (errorMessage && 
            !errorMessage.includes('Network') && 
            !errorMessage.includes('timeout') &&
            !errorMessage.includes('NETWORK_ERROR') &&
            !errorMessage.includes('fetch')) {
          return { user: null, error: errorMessage };
        }
        
        // Wait before retrying (exponential backoff)
        if (attempt < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          console.log(`⏳ Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    // All retries failed
    console.error('❌ createUser failed after all retries');
    return { 
      user: null, 
      error: lastError?.message || 'Network error. Please check your internet connection and try again.' 
    };
    
  } catch (error: any) {
    console.error('❌ createUser exception:', error);
    
    // Provide user-friendly error messages
    if (error.message?.includes('timeout') || error.message?.includes('timed out')) {
      return { user: null, error: 'Request timed out. Please check your internet connection and try again.' };
    }
    
    if (error.message?.includes('fetch') || error.message?.includes('network') || error.message?.includes('Network request failed')) {
      return { user: null, error: 'Network error. Please check your internet connection and try again.' };
    }
    
    return { user: null, error: error.message || 'Failed to create user. Please try again.' };
  }
}

export async function getCurrentUser(): Promise<{ user: User | null; error?: string }> {
  try {
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      return { user: null, error: sessionError.message };
    }

    if (!session?.user) {
      return { user: null };
    }

    // Fetch user profile from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (userError) {
      return { user: null, error: userError.message };
    }

    return { user: userData as User };
  } catch (error: any) {
    return { user: null, error: error.message || 'Failed to get current user' };
  }
}

export async function getUserProfile(): Promise<{ user: User | null; error?: string }> {
  try {
    // Get current user ID
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { user: null, error: 'You must be logged in to view your profile' };
    }

    // Fetch user profile from users table
    const { data: userData, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      if (profileError.code === 'PGRST116') {
        return { user: null, error: 'User profile not found' };
      }
      return { user: null, error: profileError.message };
    }

    return { user: userData as User };
  } catch (error: any) {
    return { user: null, error: error.message || 'Failed to fetch user profile' };
  }
}

export async function updateUserProfile(updates: {
  full_name?: string;
  phone?: string;
  photo_url?: string;
}): Promise<{ user: User | null; error?: string }> {
  try {
    // Get current user ID
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { user: null, error: 'You must be logged in to update your profile' };
    }

    // Build update object with only provided fields
    const updateData: any = {};
    if (updates.full_name !== undefined) {
      updateData.full_name = updates.full_name;
    }
    if (updates.phone !== undefined) {
      updateData.phone = updates.phone;
    }
    if (updates.photo_url !== undefined) {
      updateData.photo_url = updates.photo_url;
    }

    // Check if there are any fields to update
    if (Object.keys(updateData).length === 0) {
      return { user: null, error: 'No fields provided to update' };
    }

    // Update user profile
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      return { user: null, error: updateError.message };
    }

    return { user: updatedUser as User };
  } catch (error: any) {
    return { user: null, error: error.message || 'Failed to update user profile' };
  }
}

// ============================================================================
// Venue Functions
// ============================================================================

export async function getVenues(filters?: {
  city?: string;
  type?: string;
  vibe?: string;
}): Promise<{ venues: Venue[]; error?: string }> {
  try {
    let query = supabase
      .from('venues')
      .select('*')
      .eq('status', 'active')
      .order('name', { ascending: true });

    if (filters?.city) {
      query = query.eq('city', filters.city);
    }

    if (filters?.type) {
      query = query.eq('type', filters.type);
    }

    if (filters?.vibe) {
      query = query.contains('vibe_tags', [filters.vibe]);
    }

    const { data, error } = await query;

    if (error) {
      return { venues: [], error: error.message };
    }

    return { venues: (data || []) as Venue[] };
  } catch (error: any) {
    return { venues: [], error: error.message || 'Failed to fetch venues' };
  }
}

export async function getVenueById(id: string): Promise<{ venue: Venue | null; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return { venue: null, error: 'Venue not found' };
      }
      return { venue: null, error: error.message };
    }

    return { venue: data as Venue };
  } catch (error: any) {
    return { venue: null, error: error.message || 'Failed to fetch venue' };
  }
}

// ============================================================================
// Booking Functions
// ============================================================================

export async function createBooking(bookingData: {
  venue_id: string;
  booking_date: string;
  booking_time: string;
  party_size: number;
  table_preference?: string;
  special_requests?: string;
}): Promise<{ booking: Booking | null; error?: string }> {
  try {
    // Get current user ID from session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return { booking: null, error: 'You must be logged in to create a booking' };
    }

    // Calculate is_urgent (true if booking_date is within 48 hours)
    const bookingDateTime = new Date(`${bookingData.booking_date}T${bookingData.booking_time}`);
    const now = new Date();
    const hoursUntilBooking = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    const isUrgent = hoursUntilBooking <= 48 && hoursUntilBooking > 0;

    // Get venue to check deposit requirements
    const venueResult = await getVenueById(bookingData.venue_id);
    if (!venueResult.venue) {
      return { booking: null, error: 'Venue not found' };
    }

    const depositRequired = venueResult.venue.requires_deposit;

    // Insert booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: session.user.id,
        venue_id: bookingData.venue_id,
        status: 'pending',
        booking_date: bookingData.booking_date,
        booking_time: bookingData.booking_time,
        party_size: bookingData.party_size,
        table_preference: bookingData.table_preference || null,
        special_requests: bookingData.special_requests || null,
        deposit_required: depositRequired,
        deposit_confirmed: false,
        minimum_spend: venueResult.venue.minimum_spend,
        final_spend: null,
        points_earned: 0,
        no_show: false,
        is_urgent: isUrgent,
      })
      .select()
      .single();

    if (bookingError) {
      return { booking: null, error: bookingError.message };
    }

    return { booking: booking as Booking };
  } catch (error: any) {
    return { booking: null, error: error.message || 'Failed to create booking' };
  }
}

export async function getUserBookings(): Promise<{
  bookings: (Booking & { venue: Pick<Venue, 'id' | 'name' | 'type' | 'location' | 'photos'> })[];
  error?: string;
}> {
  try {
    // Get current user ID
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { bookings: [], error: 'You must be logged in to view bookings' };
    }

    // Query bookings with venue join - select only needed venue fields
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        venues (
          id,
          name,
          type,
          location,
          photos
        )
      `)
      .eq('user_id', user.id)
      .order('booking_date', { ascending: false });

    if (error) {
      return { bookings: [], error: error.message };
    }

    // Transform the data to match our return type
    const bookingsWithVenues = (data || []).map((booking: any) => ({
      ...booking,
      venue: booking.venues,
    }));

    // Remove the nested venues property
    bookingsWithVenues.forEach((booking: any) => {
      delete booking.venues;
    });

    return { bookings: bookingsWithVenues as (Booking & { venue: Pick<Venue, 'id' | 'name' | 'type' | 'location' | 'photos'> })[] };
  } catch (error: any) {
    return { bookings: [], error: error.message || 'Failed to fetch bookings' };
  }
}

export async function getBookingById(bookingId: string): Promise<{
  booking: (Booking & { venue: Venue }) | null;
  error?: string;
}> {
  try {
    // Get current user ID to verify ownership
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { booking: null, error: 'You must be logged in to view bookings' };
    }

    // Query booking with venue join
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        venues (*)
      `)
      .eq('id', bookingId)
      .eq('user_id', user.id) // Ensure user can only view their own bookings
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return { booking: null, error: 'Booking not found' };
      }
      return { booking: null, error: error.message };
    }

    // Transform the data
    const bookingWithVenue = {
      ...data,
      venue: data.venues,
    };
    delete (bookingWithVenue as any).venues;

    return { booking: bookingWithVenue as Booking & { venue: Venue } };
  } catch (error: any) {
    return { booking: null, error: error.message || 'Failed to fetch booking' };
  }
}

export async function cancelBooking(
  bookingId: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get current user ID to verify ownership
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: 'You must be logged in to cancel bookings' };
    }

    // Update booking status to cancelled
    const updateData: any = {
      status: 'cancelled',
    };

    if (reason) {
      updateData.cancellation_reason = reason;
    }

    const { error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', bookingId)
      .eq('user_id', user.id); // Ensure user can only cancel their own bookings

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to cancel booking' };
  }
}

export async function updateBookingStatus(
  bookingId: string,
  status: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get current user ID to verify ownership
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: 'You must be logged in to update bookings' };
    }

    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)
      .eq('user_id', user.id); // Ensure user can only update their own bookings

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update booking status' };
  }
}

// ============================================================================
// Points Functions
// ============================================================================

export type PointsTransaction = {
  id: string;
  user_id: string;
  amount: number;
  type: 'earned' | 'redeemed' | 'expired' | 'adjustment';
  description: string | null;
  booking_id: string | null;
  created_at: string;
};

export async function getPointsHistory(): Promise<{
  transactions: PointsTransaction[];
  error?: string;
}> {
  try {
    // Get current user ID
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { transactions: [], error: 'You must be logged in to view points history' };
    }

    // Query points transactions for this user
    const { data, error } = await supabase
      .from('points_transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return { transactions: [], error: error.message };
    }

    return { transactions: (data || []) as PointsTransaction[] };
  } catch (error: any) {
    return { transactions: [], error: error.message || 'Failed to fetch points history' };
  }
}

// ============================================================================
// Auth Functions
// ============================================================================

export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    // Sign out from Supabase (this will clear the session from AsyncStorage automatically)
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return { success: false, error: error.message };
    }

    // Clear any additional local storage/cache if needed
    // Supabase already clears auth session from AsyncStorage, but we can clear other app data
    try {
      // Clear any app-specific cache keys if you have them
      // await AsyncStorage.removeItem('app_cache_key');
    } catch (storageError) {
      // Non-critical - continue with sign out even if cache clearing fails
      console.warn('Error clearing local cache:', storageError);
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to sign out' };
  }
}

// ============================================================================
// Waitlist Functions
// ============================================================================

export async function joinWaitlist(data: {
  full_name: string;
  email: string;
  phone?: string;
  instagram_handle?: string;
  cities?: string[];
  source?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('waitlist').insert({
      full_name: data.full_name,
      email: data.email,
      phone: data.phone || null,
      instagram_handle: data.instagram_handle || null,
      cities: data.cities || [],
      source: data.source || null,
      status: 'pending',
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to join waitlist' };
  }
}
