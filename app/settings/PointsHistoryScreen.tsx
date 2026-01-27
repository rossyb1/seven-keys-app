import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { BrandColors, BackgroundColors, TextColors, AccentColors, Spacing, Typography, BorderRadius, StatusColors, Shadows } from '../../constants/brand';
import { ChevronLeft, Check, Users, Heart, Edit, CreditCard } from '../../components/icons/AppIcons';
import { getPointsHistory } from '../../src/services/api';
import { getUserProfile } from '../../src/services/api';
import type { PointsTransaction } from '../../src/services/api';

interface PointsHistoryScreenProps {
  navigation: any;
}

export default function PointsHistoryScreen({ navigation }: PointsHistoryScreenProps) {
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pointsBalance, setPointsBalance] = useState<number>(0);

  // Fetch points history and user balance on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch user profile for current balance
        const profileResult = await getUserProfile();
        if (profileResult.user) {
          setPointsBalance(profileResult.user.points_balance);
        }

        // Fetch points history
        const historyResult = await getPointsHistory();
        if (historyResult.error) {
          setError(historyResult.error);
        } else {
          setTransactions(historyResult.transactions);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load points history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    
    return `${dayName} ${day} ${month}`;
  };

  // Helper function to format month header
  const formatMonthHeader = (dateString: string): string => {
    const date = new Date(dateString);
    const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Helper function to get transaction label and icon
  const getTransactionInfo = (transaction: PointsTransaction) => {
    // Check description first for more specific labels
    const desc = transaction.description?.toLowerCase() || '';
    
    if (desc.includes('venue spend') || desc.includes('spend') || desc.includes('dining')) {
      return {
        label: transaction.description || 'Venue Spend',
        icon: CreditCard,
      };
    } else if (desc.includes('booking completed') || desc.includes('completed')) {
      return {
        label: transaction.description || 'Booking Completed',
        icon: Check,
      };
    } else if (desc.includes('referral') && desc.includes('signup')) {
      return {
        label: transaction.description || 'Referral Joined',
        icon: Users,
      };
    } else if (desc.includes('referral') && desc.includes('booking')) {
      return {
        label: transaction.description || 'Referral Booking',
        icon: Heart,
      };
    } else if (transaction.type === 'adjustment') {
      return {
        label: transaction.description || 'Adjustment',
        icon: Edit,
      };
    } else if (transaction.type === 'earned') {
      return {
        label: transaction.description || 'Points Earned',
        icon: Check,
      };
    } else if (transaction.type === 'redeemed') {
      return {
        label: transaction.description || 'Points Redeemed',
        icon: Heart,
      };
    } else if (transaction.type === 'expired') {
      return {
        label: transaction.description || 'Points Expired',
        icon: Edit,
      };
    } else {
      return {
        label: transaction.description || 'Transaction',
        icon: Check,
      };
    }
  };

  // Group transactions by month
  const groupTransactionsByMonth = (transactions: PointsTransaction[]) => {
    const groups: Record<string, PointsTransaction[]> = {};
    
    transactions.forEach((transaction) => {
      const monthKey = formatMonthHeader(transaction.created_at);
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(transaction);
    });

    // Convert to array and sort by date (newest first)
    return Object.entries(groups)
      .map(([month, items]) => ({
        month,
        items: items.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ),
      }))
      .sort((a, b) => {
        // Sort months by date (newest first)
        const dateA = new Date(a.items[0].created_at);
        const dateB = new Date(b.items[0].created_at);
        return dateB.getTime() - dateA.getTime();
      });
  };

  const groupedTransactions = groupTransactionsByMonth(transactions);
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={TextColors.primary} strokeWidth={1.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Points History</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Total Balance */}
        <View style={styles.balanceSection}>
          <Text style={styles.balanceLabel}>TOTAL BALANCE</Text>
          <Text style={styles.balanceAmount}>{pointsBalance.toLocaleString()}</Text>
          <Text style={styles.balanceUnit}>points</Text>
        </View>

        <View style={styles.divider} />

        {/* Transactions */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={AccentColors.primary} />
            <Text style={styles.loadingText}>Loading points history...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : groupedTransactions.length > 0 ? (
          <View style={styles.transactionsList}>
            {groupedTransactions.map((group, groupIndex) => (
              <View key={groupIndex} style={styles.monthGroup}>
                <Text style={styles.monthHeader}>{group.month}</Text>
                {group.items.map((transaction) => {
                  const transactionInfo = getTransactionInfo(transaction);
                  const IconComponent = transactionInfo.icon;
                  const isPositive = transaction.amount > 0;
                  
                  return (
                    <View key={transaction.id} style={styles.transactionRow}>
                      <View style={styles.transactionIconContainer}>
                        <IconComponent 
                          size={20} 
                          color={TextColors.secondary} 
                          strokeWidth={1.5} 
                        />
                      </View>
                      <View style={styles.transactionContent}>
                        <Text style={styles.transactionTitle}>
                          {transactionInfo.label}
                        </Text>
                        <Text style={styles.transactionDate}>
                          {formatDate(transaction.created_at)}
                        </Text>
                      </View>
                      <Text 
                        style={[
                          styles.transactionPoints,
                          isPositive ? styles.transactionPointsPositive : styles.transactionPointsNegative,
                        ]}
                      >
                        {isPositive ? '+' : ''}{transaction.amount.toLocaleString()}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No points history yet. Make a booking to start earning points!
            </Text>
          </View>
        )}
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
  balanceSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  balanceLabel: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.semibold,
    letterSpacing: Typography.letterSpacing.normal,
    marginBottom: Spacing.sm,
  },
  balanceAmount: {
    color: AccentColors.primary,
    fontSize: Typography.fontSize['5xl'],
    fontFamily: Typography.fontFamily.bold,
    marginBottom: Spacing.xs / 2,
  },
  balanceUnit: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.base,
  },
  divider: {
    height: 1,
    backgroundColor: AccentColors.border,
    marginBottom: Spacing.xl,
  },
  transactionsList: {
    marginBottom: Spacing.xl * 2,
  },
  monthGroup: {
    marginBottom: Spacing.xl * 2,
  },
  monthHeader: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.semibold,
    letterSpacing: Typography.letterSpacing.normal,
    marginBottom: Spacing.base,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl * 2,
  },
  loadingText: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.base,
    marginTop: Spacing.base,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl * 2,
  },
  errorText: {
    color: StatusColors.cancelled,
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl * 3,
  },
  emptyText: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: BackgroundColors.cardBg,
    borderWidth: 1,
    borderColor: AccentColors.borderLight,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    marginBottom: Spacing.sm,
    minHeight: 56,
    ...Shadows.sm,
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: BackgroundColors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.base,
  },
  transactionContent: {
    flex: 1,
  },
  transactionTitle: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.semibold,
    marginBottom: Spacing.xs / 2,
  },
  transactionDate: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.sm,
  },
  transactionPoints: {
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.bold,
  },
  transactionPointsPositive: {
    color: StatusColors.confirmed,
  },
  transactionPointsNegative: {
    color: StatusColors.cancelled,
  },
});
