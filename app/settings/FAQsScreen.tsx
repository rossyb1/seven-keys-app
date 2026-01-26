import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BrandColors, BackgroundColors, TextColors, AccentColors, Spacing, Typography, BorderRadius } from '../../constants/brand';
import { ChevronLeft, ChevronRight } from '../../components/icons/AppIcons';

interface FAQsScreenProps {
  navigation: any;
}

const FAQ_ITEMS = [
  {
    question: 'How does Seven Keys work?',
    answer: 'Seven Keys is a members-only VIP hospitality platform. Members can discover and book exclusive venues, earn points with each booking, and unlock higher membership tiers with more benefits.',
  },
  {
    question: 'How do I earn points?',
    answer: 'You earn points for every completed booking. Points vary based on the venue and your spending. Points can be redeemed for upgrades, exclusive experiences, and more.',
  },
  {
    question: 'What are the membership tiers?',
    answer: 'We have four tiers: Member, Select, Elite, and Black Card. Each tier offers increasing benefits including priority bookings, exclusive venues, and enhanced concierge services.',
  },
  {
    question: 'How do deposits work?',
    answer: 'Deposits are required to secure your booking and are paid directly to the venue. The deposit amount varies by venue and is typically applied toward your final bill. Refund policies depend on the venue and cancellation timing.',
  },
  {
    question: 'Can I cancel a booking?',
    answer: 'Yes, you can cancel bookings through the app. Cancellation policies vary by venue and timing. Deposits may be non-refundable depending on the venue policy and how close to the booking date you cancel.',
  },
  {
    question: 'How do I contact support?',
    answer: 'You can message our concierge team directly through the app, or contact us via WhatsApp at +971 50 XXX XXXX. Our team is available to assist with any requests or questions.',
  },
];

export default function FAQsScreen({ navigation }: FAQsScreenProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={TextColors.primary} strokeWidth={1.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>FAQs</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* FAQ Items */}
        <View style={styles.faqList}>
          {FAQ_ITEMS.map((item, index) => (
            <View key={index} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.faqHeader}
                onPress={() => toggleItem(index)}
              >
                <Text style={styles.faqQuestion}>{item.question}</Text>
                <View style={[styles.faqChevronContainer, expandedIndex === index && styles.faqChevronExpanded]}>
                  <ChevronRight size={20} color={AccentColors.primary} strokeWidth={1.5} />
                </View>
              </TouchableOpacity>
              {expandedIndex === index && (
                <View style={styles.faqAnswerContainer}>
                  <Text style={styles.faqAnswer}>{item.answer}</Text>
                </View>
              )}
            </View>
          ))}
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
  faqList: {
    marginBottom: Spacing.xl * 2,
  },
  faqItem: {
    backgroundColor: BackgroundColors.cardBg,
    borderWidth: 1,
    borderColor: AccentColors.border,
    borderRadius: BorderRadius.base,
    marginBottom: Spacing.base,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.base,
    minHeight: 52,
  },
  faqQuestion: {
    flex: 1,
    color: TextColors.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: '500',
    marginRight: Spacing.base,
  },
  faqChevronContainer: {
    transform: [{ rotate: '0deg' }],
  },
  faqChevronExpanded: {
    transform: [{ rotate: '90deg' }],
  },
  faqAnswerContainer: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
  },
  faqAnswer: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.sm,
    lineHeight: 20,
  },
});
