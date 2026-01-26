import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '../types/database';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile from users table
  const fetchUserProfile = async (userId: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // If user profile doesn't exist yet (mid-signup), return null
        if (error.code === 'PGRST116') {
          console.log('User profile not found yet - user may be mid-signup');
          return null;
        }
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data as User;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Check initial session and fetch user profile
  useEffect(() => {
    let isMounted = true;
    
    const checkSession = async () => {
      try {
        // Check if Supabase is configured
        const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
          console.warn('⚠️ Supabase not configured - skipping session check');
          if (isMounted) {
            setUser(null);
            setIsLoading(false);
          }
          return;
        }

        // Add timeout to prevent hanging (increased to 10 seconds)
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session check timeout')), 10000)
        );
        
        const sessionPromise = supabase.auth.getSession();
        const { data: { session }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any;

        if (!isMounted) return;

        if (error) {
          console.error('Error getting session:', error);
          // Don't fail completely on network errors - just set user to null
          if (isMounted) {
            setUser(null);
            setIsLoading(false);
          }
          return;
        }

        if (session?.user) {
          // User has auth session, fetch their profile
          const userProfile = await fetchUserProfile(session.user.id);
          if (isMounted) {
            setUser(userProfile);
          }
        } else {
          setUser(null);
        }
      } catch (error: any) {
        console.error('Error checking session:', error);
        // On timeout or network error, just set user to null (not authenticated)
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkSession();

    // Listen for auth state changes
    let subscription: any;
    try {
      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('🔄 Auth state changed:', event, session?.user?.id);

          if (session?.user) {
            // User signed in or session refreshed
            console.log('👤 Fetching user profile for:', session.user.id);
            const userProfile = await fetchUserProfile(session.user.id);
            console.log('📋 User profile result:', userProfile ? 'Found' : 'Not found');
            
            if (isMounted) {
              setUser(userProfile);
              console.log('✅ User state updated in context');
            }
          } else {
            // User signed out
            console.log('👋 User signed out');
            if (isMounted) {
              setUser(null);
            }
          }

          // Ensure loading state is cleared after auth state change
          if (isMounted) {
            setIsLoading(false);
          }
        }
      );
      subscription = data.subscription;
    } catch (error) {
      console.error('Error setting up auth listener:', error);
      if (isMounted) {
        setIsLoading(false);
      }
    }

    // Cleanup subscription on unmount
    return () => {
      isMounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        throw error;
      }
      // User state will be updated via onAuthStateChange listener
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const refreshUser = async (): Promise<boolean> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const userProfile = await fetchUserProfile(session.user.id);
        if (userProfile) {
          setUser(userProfile);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error refreshing user:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signOut,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
