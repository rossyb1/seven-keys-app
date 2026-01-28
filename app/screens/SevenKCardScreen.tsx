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
  blue: 0,
  silver: 5000,
  gold: 25000,
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
  const getBlueSinceYear = (createdAt: string): string => {
    const date = new Date(createdAt);
    return date.getFullYear().toString();
  };

  // Helper function to format tier for card
  const getTierForCard = (tier: User['tier']): 'blue' | 'silver' | 'gold' | 'black' => {
    return tier;
  };

  // Calculate progress to next tier
  const getTierProgress = () => {
    if (!user) return null;

    const currentTier = user.tier;
    const currentPoints = user.points_balance || 0;

    // If already at Black tier, no progress needed
    if (currentTier === 'black') {
      return null;
    }

    let nextTier: User['tier'];
    let currentThreshold: number;
    let nextThreshold: number;

    switch (currentTier) {
      case 'blue':
        nextTier = 'silver';
        currentThreshold = TIER_THRESHOLDS.blue;
        nextThreshold = TIER_THRESHOLDS.silver;
        break;
      case 'silver':
        nextTier = 'gold';
        currentThreshold = TIER_THRESHOLDS.silver;
        nextThreshold = TIER_THRESHOLDS.gold;
        break;
      case 'gold':
        nextTier = 'black';
        currentThreshold = TIER_THRESHOLDS.gold;
        nextThreshold = TIER_THRESHOLDS.black;
        break;
      default:
        return null;
    }

    const pointsNeeded = nextThreshold - currentThreshold;
    const pointsProgress = Math.max(0, currentPoints - currentThreshold);
    const progressPercentage = pointsNeeded > 0 ? Math.min((pointsProgress / pointsNeeded) * 100, 100) : 0;

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
      blue: 'Blue',
      silver: 'Silver',
      gold: 'Gold',
      black: 'Black Card',
    };
    return tierMap[tier] || 'Blue';
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
  const renderBlueshipCard = () => {
    if (!user) return null;
    
    const memberName = user.full_name?.toUpperCase() || 'MEMBER';
    
    switch(user.tier?.toLowerCase()) {
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
              {renderBlueshipCard()}
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
    backgroundColor: '#0A1628',
  },
  content: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
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
  cardContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  statsSpacer: {
    width: 12,
  },
  actionsSection: {
    marginBottom: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  errorText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
  progressSection: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  progressTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  progressPoints: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#5684C4',
    borderRadius: 3,
  },
  progressRemaining: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    textAlign: 'center',
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  outlineButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  outlineButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
  pointsHistoryLink: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 40,
  },
  pointsHistoryLinkText: {
    color: '#5684C4',
    fontSize: 14,
    fontWeight: '500',
  },
});
