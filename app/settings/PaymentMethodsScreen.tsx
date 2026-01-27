import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BrandColors, BackgroundColors, TextColors, AccentColors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/brand';
import { ChevronLeft, CreditCard, Wallet, Check } from '../../components/icons/AppIcons';

interface PaymentMethodsScreenProps {
  navigation: any;
}

export default function PaymentMethodsScreen({ navigation }: PaymentMethodsScreenProps) {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={TextColors.primary} strokeWidth={1.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment Methods</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Note */}
        <Text style={styles.note}>
          Deposits are paid directly to venues via their payment link.
        </Text>

        <View style={styles.divider} />

        {/* Saved Cards Section */}
        <Text style={styles.sectionHeader}>SAVED CARDS</Text>
        <View style={styles.cardRow}>
          <View style={styles.cardInfo}>
            <View style={styles.cardNumberRow}>
              <CreditCard size={20} color={TextColors.secondary} strokeWidth={1.5} />
              <Text style={styles.cardNumber}> •••• •••• •••• 4242</Text>
            </View>
            <Text style={styles.cardDetails}>Visa • Expires 12/27</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.editLink}>Edit</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addCardButton}>
          <Text style={styles.addCardButtonText}>+ Add new card</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Digital Wallets Section */}
        <Text style={styles.sectionHeader}>DIGITAL WALLETS</Text>
        <View style={styles.walletRow}>
          <View style={styles.walletNameRow}>
            <Wallet size={20} color={TextColors.secondary} strokeWidth={1.5} />
            <Text style={styles.walletName}> Apple Pay</Text>
          </View>
          <View style={styles.connectedRow}>
            <Text style={styles.connectedText}>Connected </Text>
            <Check size={16} color={AccentColors.primary} strokeWidth={2} />
          </View>
        </View>
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
  note: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.sm,
    marginBottom: Spacing.xl,
    lineHeight: 20,
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
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: BackgroundColors.cardBg,
    borderWidth: 1,
    borderColor: AccentColors.borderLight,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    minHeight: 56,
    ...Shadows.sm,
  },
  cardInfo: {
    flex: 1,
  },
  cardNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardNumber: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.semibold,
    marginLeft: Spacing.sm,
  },
  cardDetails: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.sm,
  },
  editLink: {
    color: AccentColors.primary,
    fontSize: Typography.fontSize.sm,
  },
  addCardButton: {
    borderWidth: 1,
    borderColor: AccentColors.borderLight,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    backgroundColor: BackgroundColors.secondary,
    ...Shadows.sm,
  },
  addCardButtonText: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: '500',
  },
  walletRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: BackgroundColors.cardBg,
    borderWidth: 1,
    borderColor: AccentColors.borderLight,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    minHeight: 56,
    ...Shadows.sm,
  },
  walletNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletName: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.semibold,
    marginLeft: Spacing.sm,
  },
  connectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectedText: {
    color: AccentColors.primary,
    fontSize: Typography.fontSize.sm,
    fontWeight: '500',
  },
});
