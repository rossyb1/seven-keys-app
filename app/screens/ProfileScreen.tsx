import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, Alert, Share } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { User, CreditCard, MapPin, Bell, BarChart3, MessageCircle, HelpCircle, LogOut, Trash2, ChevronRight, Gift, Copy, Users } from 'lucide-react-native';
import { BrandColors, BackgroundColors, TextColors, AccentColors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/brand';
import { getProfileWithReferrals, signOut } from '../../src/services/api';
import { useAuth } from '../../src/contexts/AuthContext';
import type { User as UserType } from '../../src/types/database';
import { BlueCard, SilverCard, GoldCard, BlackCard } from '../../src/components/cards/membership';
import * as Clipboard from 'expo-clipboard';

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
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralCount, setReferralCount] = useState(0);

  // Fetch user profile when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const fetchProfile = async () => {
        setIsLoading(true);
        try {
          // Optimized: single call for profile + referral info
          const result = await getProfileWithReferrals();
          if (result.error) {
            console.error('Error fetching profile:', result.error);
          } else {
            setUser(result.user);
            setReferralCode(result.referralCode);
            setReferralCount(result.referralCount);
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

  const handleShareReferral = async () => {
    if (!referralCode) return;
    try {
      await Share.share({
        message: `Join me on Seven Keys — the exclusive concierge app for Dubai's best venues. Use my invite code: ${referralCode}\n\nWe both get 250 bonus points! 🎉`,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleCopyCode = async () => {
    if (!referralCode) return;
    await Clipboard.setStringAsync(referralCode);
    Alert.alert('Copied!', 'Your invite code has been copied to clipboard.');
  };

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
              {renderMemberCard()}
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

        {/* Invite Friends Section - Prominent placement */}
        {referralCode && (
          <View style={styles.inviteCardProminent}>
            <View style={styles.inviteHeader}>
              <View style={styles.inviteIconContainerLarge}>
                <Gift size={22} color="#5684C4" strokeWidth={1.5} />
              </View>
              <View style={styles.inviteInfo}>
                <Text style={styles.inviteTitleLarge}>Invite Friends, Earn Points</Text>
                <Text style={styles.inviteSubtitle}>You both get 250 points per invite</Text>
              </View>
            </View>
            <View style={styles.inviteCodeRowProminent}>
              <Text style={styles.inviteCodeLabelProminent}>YOUR CODE</Text>
              <TouchableOpacity style={styles.inviteCodeBadgeProminent} onPress={handleCopyCode}>
                <Text style={styles.inviteCodeTextProminent}>{referralCode}</Text>
                <Copy size={14} color="#5684C4" strokeWidth={2} />
              </TouchableOpacity>
            </View>
            {referralCount > 0 && (
              <View style={styles.inviteStatsRow}>
                <Users size={14} color="rgba(255,255,255,0.7)" strokeWidth={1.5} />
                <Text style={styles.inviteStatsTextProminent}>
                  {referralCount} friend{referralCount !== 1 ? 's' : ''} invited • {(referralCount * 250).toLocaleString()} pts earned
                </Text>
              </View>
            )}
            <TouchableOpacity style={styles.shareButtonProminent} onPress={handleShareReferral}>
              <Text style={styles.shareButtonTextProminent}>SHARE INVITE</Text>
            </TouchableOpacity>
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
                <View style={styles.menuIconContainer}>
                  <item.icon size={18} color="#5684C4" strokeWidth={1.5} />
                </View>
                <Text style={styles.menuItemText}>{item.label}</Text>
              </View>
              <ChevronRight size={18} color="rgba(255,255,255,0.3)" strokeWidth={2} />
            </TouchableOpacity>
          ))}
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
                <View style={styles.menuIconContainer}>
                  <item.icon size={18} color="#5684C4" strokeWidth={1.5} />
                </View>
                <Text style={styles.menuItemText}>{item.label}</Text>
              </View>
              <ChevronRight size={18} color="rgba(255,255,255,0.3)" strokeWidth={2} />
            </TouchableOpacity>
          ))}
        </View>

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
                <View style={styles.menuIconContainer}>
                  <item.icon size={18} color="#5684C4" strokeWidth={1.5} />
                </View>
                <Text style={styles.menuItemText}>{item.label}</Text>
              </View>
              <ChevronRight size={18} color="rgba(255,255,255,0.3)" strokeWidth={2} />
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
    marginBottom: Spacing.lg,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  cardContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    marginBottom: Spacing.xl,
    overflow: 'hidden',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  statValue: {
    color: TextColors.primary,
    fontSize: 32,
    fontFamily: Typography.fontFamily.bold,
    marginBottom: 2,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    fontFamily: Typography.fontFamily.regular,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 16,
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
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: 20,
  },
  sectionHeader: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    fontFamily: Typography.fontFamily.semibold,
    letterSpacing: 1.5,
    marginBottom: Spacing.md,
  },
  menuList: {
    marginBottom: Spacing.xs,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: Spacing.base,
    minHeight: 56,
    marginBottom: 8,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(86,132,196,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 14,
  },
  inviteCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(86,132,196,0.15)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  inviteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  inviteIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(86,132,196,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inviteInfo: {
    marginLeft: 12,
    flex: 1,
  },
  inviteTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  inviteSubtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
  },
  inviteCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  inviteCodeLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  inviteCodeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(86,132,196,0.12)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(86,132,196,0.25)',
  },
  inviteCodeText: {
    color: '#5684C4',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
  },
  inviteStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  inviteStatsText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
  },
  shareButton: {
    backgroundColor: '#5684C4',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  logOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 8,
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  logOutText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 10,
  },
  deleteAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginBottom: 40,
  },
  deleteAccountText: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 13,
    marginLeft: 8,
  },
  // Prominent Invite Card Styles (subtle version)
  inviteCardProminent: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(86,132,196,0.25)',
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  inviteIconContainerLarge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(86,132,196,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inviteTitleLarge: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  inviteCodeRowProminent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  inviteCodeLabelProminent: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  inviteCodeBadgeProminent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inviteCodeTextProminent: {
    color: '#5684C4',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
  },
  inviteStatsTextProminent: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
  },
  shareButtonProminent: {
    backgroundColor: '#5684C4',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  shareButtonTextProminent: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
