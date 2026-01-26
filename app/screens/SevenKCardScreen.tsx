import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BrandColors, BackgroundColors, TextColors, AccentColors, Spacing, Typography, BorderRadius } from '../../constants/brand';
import SevenKCard from '../../components/cards/SevenKCard';
import StatsCard from '../../components/cards/StatsCard';
import { BlueCard, SilverCard, GoldCard, BlackCard } from '../../src/components/cards/membership';
import { ChevronLeft, Download, Wallet } from '../../components/icons/AppIcons';
import { getUserProfile } from '../../src/services/api';
import { useAuth } from '../../src/contexts/AuthContext';
import type { User } from '../../src/types/database';

interface SevenKCardScreenProps {
  navigation: any;
}

// Tier thresholds
const TIER_THRESHOLDS = {
  member: 0,
  select: 5000,
  elite: 25000,
  black: 100000,
};

export default function SevenKCardScreen({ navigation }: SevenKCardScreenProps) {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
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
            // Fallback to auth context user if available
            setUser(authUser);
          } else {
            setUser(result.user);
          }
        } catch (err: any) {
          console.error('Error fetching profile:', err);
          // Fallback to auth context user if available
          setUser(authUser);
        } finally {
          setIsLoading(false);
        }
      };

      fetchProfile();
    }, [authUser])
  );

  // Helper function to get member since year
  const getMemberSinceYear = (createdAt: string): string => {
    const date = new Date(createdAt);
    return date.getFullYear().toString();
  };

  // Helper function to format tier for card
  const getTierForCard = (tier: User['tier']): 'member' | 'select' | 'elite' | 'black' => {
    return tier;
  };

  // Calculate progress to next tier
  const getTierProgress = () => {
    if (!user) return null;

    const currentTier = user.tier;
    const currentPoints = user.points_balance;

    // If already at Black tier, no progress needed
    if (currentTier === 'black') {
      return null;
    }

    let nextTier: User['tier'];
    let currentThreshold: number;
    let nextThreshold: number;

    switch (currentTier) {
      case 'member':
        nextTier = 'select';
        currentThreshold = TIER_THRESHOLDS.member;
        nextThreshold = TIER_THRESHOLDS.select;
        break;
      case 'select':
        nextTier = 'elite';
        currentThreshold = TIER_THRESHOLDS.select;
        nextThreshold = TIER_THRESHOLDS.elite;
        break;
      case 'elite':
        nextTier = 'black';
        currentThreshold = TIER_THRESHOLDS.elite;
        nextThreshold = TIER_THRESHOLDS.black;
        break;
      default:
        return null;
    }

    const pointsNeeded = nextThreshold - currentThreshold;
    const pointsProgress = currentPoints - currentThreshold;
    const progressPercentage = Math.min((pointsProgress / pointsNeeded) * 100, 100);

    return {
      currentTier,
      nextTier,
      currentPoints,
      pointsNeeded,
      pointsProgress,
      progressPercentage,
      nextThreshold,
    };
  };

  // Format tier name for display
  const formatTierName = (tier: User['tier']): string => {
    const tierMap: Record<User['tier'], string> = {
      member: 'Member',
      select: 'Select',
      elite: 'Elite',
      black: 'Black Card',
    };
    return tierMap[tier] || 'Member';
  };

  // Handle share card
  const handleShareCard = () => {
    Alert.alert('Share Card', 'Card sharing feature coming soon!');
  };

  // Handle add to Apple Wallet
  const handleAddToAppleWallet = () => {
    Alert.alert('Add to Apple Wallet', 'Apple Wallet integration coming soon!');
  };

  // Handle add to Google Wallet
  const handleAddToGoogleWallet = () => {
    Alert.alert('Add to Google Wallet', 'Google Wallet integration coming soon!');
  };

  // Render membership card based on tier
  const renderMembershipCard = () => {
    if (!user) return null;
    
    const memberName = user.full_name?.toUpperCase() || 'MEMBER';
    
    switch(user.tier?.toLowerCase()) {
      case 'black':
        return <BlackCard memberName={memberName} />;
      case 'elite':
        return <GoldCard memberName={memberName} />;
      case 'select':
        return <SilverCard memberName={memberName} />;
      case 'member':
      default:
        return <BlueCard memberName={memberName} />;
    }
  };

  const tierProgress = user ? getTierProgress() : null;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={TextColors.primary} strokeWidth={1.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Card</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* SevenK Card */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={AccentColors.primary} />
          </View>
        ) : user ? (
          <>
            <View style={styles.cardContainer}>
              {renderMembershipCard()}
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
              <StatsCard 
                value={user.points_balance.toLocaleString()} 
                label="Points" 
                variant="gold" 
              />
              <View style={styles.statsSpacer} />
              <StatsCard 
                value={formatTierName(user.tier)} 
                label="Tier" 
              />
            </View>

            {/* Tier Progress */}
            {tierProgress && (
              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressTitle}>
                    Progress to {formatTierName(tierProgress.nextTier)}
                  </Text>
                  <Text style={styles.progressPoints}>
                    {tierProgress.pointsProgress.toLocaleString()} / {tierProgress.pointsNeeded.toLocaleString()} points
                  </Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[
                      styles.progressBar,
                      { width: `${tierProgress.progressPercentage}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.progressRemaining}>
                  {tierProgress.pointsNeeded - tierProgress.pointsProgress > 0
                    ? `${(tierProgress.pointsNeeded - tierProgress.pointsProgress).toLocaleString()} points until ${formatTierName(tierProgress.nextTier)}`
                    : 'You\'ve reached the next tier!'}
                </Text>
              </View>
            )}
          </>
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Unable to load membership card</Text>
          </View>
        )}

        {/* Action Buttons */}
        {user && (
          <View style={styles.actionsSection}>
            <TouchableOpacity 
              style={styles.outlineButton}
              onPress={handleShareCard}
            >
              <View style={styles.outlineButtonContent}>
                <Download size={20} color={TextColors.primary} strokeWidth={1.5} />
                <Text style={[styles.outlineButtonText, { marginLeft: Spacing.sm }]}>Share Card</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.outlineButton}
              onPress={handleAddToAppleWallet}
            >
              <View style={styles.outlineButtonContent}>
                <Wallet size={20} color={TextColors.primary} strokeWidth={1.5} />
                <Text style={[styles.outlineButtonText, { marginLeft: Spacing.sm }]}>Add to Apple Wallet</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.outlineButton}
              onPress={handleAddToGoogleWallet}
            >
              <View style={styles.outlineButtonContent}>
                <Wallet size={20} color={TextColors.primary} strokeWidth={1.5} />
                <Text style={[styles.outlineButtonText, { marginLeft: Spacing.sm }]}>Add to Google Wallet</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* View Points History Link */}
        <TouchableOpacity
          style={styles.pointsHistoryLink}
          onPress={() => navigation.navigate('PointsHistory')}
        >
          <Text style={styles.pointsHistoryLinkText}>View Points History</Text>
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
  cardContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: Spacing.xl * 2,
  },
  statsSpacer: {
    width: Spacing.base,
  },
  actionsSection: {
    marginBottom: Spacing.xl,
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
  progressSection: {
    backgroundColor: BackgroundColors.cardBg,
    borderWidth: 1,
    borderColor: AccentColors.border,
    borderRadius: BorderRadius.base,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  progressTitle: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
  },
  progressPoints: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.sm,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: BackgroundColors.secondary,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressBar: {
    height: '100%',
    backgroundColor: AccentColors.primary,
    borderRadius: BorderRadius.sm,
  },
  progressRemaining: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.sm,
    textAlign: 'center',
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: AccentColors.border,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
    marginBottom: Spacing.base,
  },
  outlineButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  outlineButtonText: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: '500',
  },
  pointsHistoryLink: {
    alignItems: 'center',
    paddingVertical: Spacing.base,
    marginBottom: Spacing.xl * 2,
  },
  pointsHistoryLinkText: {
    color: AccentColors.primary,
    fontSize: Typography.fontSize.base,
  },
});
