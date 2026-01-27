import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { User, CreditCard, MapPin, Bell, BarChart3, MessageCircle, HelpCircle, LogOut, Trash2, ChevronRight } from 'lucide-react-native';
import { BrandColors, BackgroundColors, TextColors, AccentColors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/brand';
import { getUserProfile, signOut } from '../../src/services/api';
import { useAuth } from '../../src/contexts/AuthContext';
import type { User as UserType } from '../../src/types/database';
import { BlueCard, SilverCard, GoldCard, BlackCard } from '../../src/components/cards/membership';

interface ProfileScreenProps {
  navigation: any;
}

const ACCOUNT_ITEMS = [
  { icon: User, label: 'Personal Details', screen: 'PersonalDetails' },
  { icon: CreditCard, label: 'Payment Methods', screen: 'PaymentMethods' },
  { icon: MapPin, label: 'Preferred Cities', screen: 'PreferredCities' },
  { icon: Bell, label: 'Notification Settings', screen: 'NotificationSettings' },
];

const POINTS_ITEMS = [
  { icon: BarChart3, label: 'Points History', screen: 'PointsHistory' },
];

const SUPPORT_ITEMS = [
  { icon: MessageCircle, label: 'Message Concierge', screen: 'MessageConcierge' },
  { icon: HelpCircle, label: 'FAQs', screen: 'FAQs' },
];

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const fetchProfile = async () => {
        setIsLoading(true);
        try {
          const result = await getUserProfile();
          if (result.error) {
            console.error('Error fetching profile:', result.error);
          } else {
            setUser(result.user);
          }
        } catch (err: any) {
          console.error('Error fetching profile:', err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchProfile();
    }, [])
  );

  // Render member card based on tier
  const renderMemberCard = () => {
    const memberName = user?.full_name?.toUpperCase() || 'MEMBER';
    
    switch (user?.tier) {
      case 'black':
        return <BlackCard memberName={memberName} />;
      case 'gold':
        return <GoldCard memberName={memberName} />;
      case 'silver':
        return <SilverCard memberName={memberName} />;
      case 'blue':
      default:
        return <BlueCard memberName={memberName} />;
    }
  };

  // Get tier color for stats
  const getTierColor = () => {
    switch (user?.tier) {
      case 'black': return '#D4A574';
      case 'gold': return '#D4AF37';
      case 'silver': return '#A0A5AA';
      default: return '#5684C4';
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              // Call signOut from API service
              const result = await signOut();
              
              if (result.error) {
                Alert.alert('Error', result.error);
                return;
              }

              // The AuthContext's onAuthStateChange listener will automatically
              // catch the signOut event and update the auth state (set user to null)
              // This will cause App.tsx's RootNavigator to automatically switch
              // from AppStack to AuthStack, showing the login flow (Splash -> InviteCode)
              // No manual navigation reset needed - React will handle the stack switch
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  // Handle navigation for menu items
  const handleMenuPress = (screen: string) => {
    if (screen === 'PersonalDetails') {
      navigation.navigate('PersonalDetails');
    } else if (screen === 'PaymentMethods') {
      navigation.navigate('PaymentMethods');
    } else if (screen === 'PreferredCities') {
      navigation.navigate('PreferredCities');
    } else if (screen === 'NotificationSettings') {
      navigation.navigate('NotificationSettings');
    } else if (screen === 'PointsHistory') {
      navigation.navigate('PointsHistory');
    } else if (screen === 'MessageConcierge') {
      navigation.navigate('MessageConcierge');
    } else if (screen === 'FAQs') {
      navigation.navigate('FAQs');
    }
  };
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + Spacing.base }}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* Card Hero */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={AccentColors.primary} />
          </View>
        ) : user ? (
          <>
            <TouchableOpacity 
              style={styles.cardContainer} 
              onPress={() => navigation.navigate('SevenKCard')}
              activeOpacity={0.95}
            >
              <View style={{ transform: [{ scale: 0.85 }] }}>
                {renderMemberCard()}
              </View>
            </TouchableOpacity>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: getTierColor() }]}>
                  {(user?.points_balance || 0).toLocaleString()}
                </Text>
                <Text style={styles.statLabel}>points</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{user?.total_bookings || 0}</Text>
                <Text style={styles.statLabel}>bookings</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{user?.venues_visited || 0}</Text>
                <Text style={styles.statLabel}>venues</Text>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Unable to load profile</Text>
          </View>
        )}

        <View style={styles.divider} />

        {/* Account Section */}
        <Text style={styles.sectionHeader}>ACCOUNT</Text>
        <View style={styles.menuList}>
          {ACCOUNT_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => handleMenuPress(item.screen)}
            >
              <View style={styles.menuItemLeft}>
                <item.icon size={20} color={TextColors.secondary} strokeWidth={1.5} />
                <Text style={styles.menuItemText}>{item.label}</Text>
              </View>
              <ChevronRight size={20} color={TextColors.tertiary} strokeWidth={1.5} />
            </TouchableOpacity>
          ))}
          {/* The 7K Card */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('SevenKCard')}
          >
            <View style={styles.menuItemLeft}>
              <CreditCard size={20} color={TextColors.secondary} strokeWidth={1.5} />
              <Text style={styles.menuItemText}>The 7K Card</Text>
            </View>
            <ChevronRight size={20} color={TextColors.tertiary} strokeWidth={1.5} />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Points Section */}
        <Text style={styles.sectionHeader}>POINTS</Text>
        <View style={styles.menuList}>
          {POINTS_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => handleMenuPress(item.screen)}
            >
              <View style={styles.menuItemLeft}>
                <item.icon size={20} color={TextColors.secondary} strokeWidth={1.5} />
                <Text style={styles.menuItemText}>{item.label}</Text>
              </View>
              <ChevronRight size={20} color={TextColors.tertiary} strokeWidth={1.5} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.divider} />

        {/* Support Section */}
        <Text style={styles.sectionHeader}>SUPPORT</Text>
        <View style={styles.menuList}>
          {SUPPORT_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => handleMenuPress(item.screen)}
            >
              <View style={styles.menuItemLeft}>
                <item.icon size={20} color={TextColors.secondary} strokeWidth={1.5} />
                <Text style={styles.menuItemText}>{item.label}</Text>
              </View>
              <ChevronRight size={20} color={TextColors.tertiary} strokeWidth={1.5} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.divider} />

        {/* Log Out */}
        <TouchableOpacity style={styles.logOutButton} onPress={handleSignOut}>
          <LogOut size={18} color={TextColors.secondary} strokeWidth={1.5} />
          <Text style={styles.logOutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* Delete Account */}
        <TouchableOpacity style={styles.deleteAccountButton}>
          <Trash2 size={16} color={TextColors.tertiary} strokeWidth={1.5} />
          <Text style={styles.deleteAccountText}>Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>
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
    paddingHorizontal: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    color: TextColors.primary,
    fontSize: Typography.fontSize['2xl'],
    fontFamily: Typography.fontFamily.light,
  },
  cardContainer: {
    alignItems: 'center',
    marginBottom: Spacing.base,
    shadowColor: '#5684C4',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: BackgroundColors.cardBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: AccentColors.borderLight,
    marginBottom: Spacing.base,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.base,
  },
  statValue: {
    color: TextColors.primary,
    fontSize: Typography.fontSize['2xl'],
    fontFamily: Typography.fontFamily.bold,
  },
  statLabel: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.regular,
    marginTop: Spacing.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl * 2,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl * 2,
  },
  errorText: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.base,
  },
  divider: {
    height: 1,
    backgroundColor: AccentColors.border,
    marginVertical: Spacing.xl,
  },
  sectionHeader: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.semibold,
    letterSpacing: Typography.letterSpacing.normal,
    marginBottom: Spacing.base,
  },
  menuList: {
    marginBottom: Spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: BackgroundColors.cardBg,
    borderWidth: 1,
    borderColor: AccentColors.borderLight,
    borderRadius: 12,
    padding: Spacing.base,
    minHeight: 56,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.semibold,
    marginLeft: Spacing.base,
  },
  logOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.base,
    marginBottom: Spacing.base,
  },
  logOutText: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.base,
    marginLeft: Spacing.sm,
  },
  deleteAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.base,
    marginBottom: Spacing.xl * 2,
  },
  deleteAccountText: {
    color: TextColors.tertiary,
    fontSize: Typography.fontSize.sm,
    marginLeft: Spacing.sm,
  },
});
