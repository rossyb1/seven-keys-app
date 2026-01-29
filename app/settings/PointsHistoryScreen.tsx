import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    <SafeAreaView style={styles.container} edges={['top']}>
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
    </SafeAreaView>
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
    marginBottom: 28,
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
  balanceSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
    backgroundColor: 'rgba(86,132,196,0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(86,132,196,0.2)',
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  balanceAmount: {
    color: '#5684C4',
    fontSize: 48,
    fontWeight: '700',
    marginBottom: 2,
  },
  balanceUnit: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginBottom: 24,
  },
  transactionsList: {
    marginBottom: 40,
  },
  monthGroup: {
    marginBottom: 28,
  },
  monthHeader: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  loadingText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    marginTop: 12,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 24,
    lineHeight: 20,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    minHeight: 56,
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(86,132,196,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  transactionContent: {
    flex: 1,
  },
  transactionTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  transactionDate: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  },
  transactionPoints: {
    fontSize: 16,
    fontWeight: '700',
  },
  transactionPointsPositive: {
    color: '#22C55E',
  },
  transactionPointsNegative: {
    color: '#EF4444',
  },
});
