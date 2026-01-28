import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandColors, BackgroundColors, TextColors, AccentColors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/brand';
import { ChevronLeft, CreditCard, Wallet, Check } from '../../components/icons/AppIcons';

interface PaymentMethodsScreenProps {
  navigation: any;
}

export default function PaymentMethodsScreen({ navigation }: PaymentMethodsScreenProps) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
  note: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    marginBottom: 20,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: 20,
  },
  sectionHeader: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    minHeight: 56,
  },
  cardInfo: {
    flex: 1,
  },
  cardNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardNumber: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 8,
  },
  cardDetails: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    marginTop: 4,
    marginLeft: 28,
  },
  editLink: {
    color: '#5684C4',
    fontSize: 13,
    fontWeight: '500',
  },
  addCardButton: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  addCardButtonText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: '500',
  },
  walletRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 16,
    minHeight: 56,
  },
  walletNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 10,
  },
  connectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectedText: {
    color: '#5684C4',
    fontSize: 13,
    fontWeight: '500',
  },
});
