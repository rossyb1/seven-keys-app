import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Linking } from 'react-native';
import { BrandColors, BackgroundColors, TextColors, AccentColors, Spacing, Typography, BorderRadius } from '../../constants/brand';
import { ChevronLeft, MessageCircle, Phone } from '../../components/icons/AppIcons';
import PrimaryButton from '../../components/buttons/PrimaryButton';

interface MessageConciergeScreenProps {
  navigation: any;
}

export default function MessageConciergeScreen({ navigation }: MessageConciergeScreenProps) {
  const [message, setMessage] = useState('');

  const handleWhatsAppPress = () => {
    const phoneNumber = '+971501234567';
    const text = encodeURIComponent(message || 'Hello, I need assistance with my Seven Keys account.');
    const url = `https://wa.me/${phoneNumber}?text=${text}`;
    Linking.openURL(url).catch((err) => console.error('Error opening WhatsApp:', err));
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+971501234567').catch((err) => console.error('Error opening phone:', err));
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={TextColors.primary} strokeWidth={1.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Message Concierge</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Centered Content */}
        <View style={styles.centeredContent}>
          <MessageCircle size={64} color={AccentColors.primary} strokeWidth={1.5} />
          <Text style={styles.headline}>Need help with something?</Text>
          <Text style={styles.subtext}>
            Our concierge team is available to assist with any requests.
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Message Input */}
        <View style={styles.inputSection}>
          <TextInput
            style={styles.textInput}
            placeholder="What can we help with?"
            placeholderTextColor={TextColors.tertiary}
            value={message}
            onChangeText={setMessage}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* WhatsApp Button */}
        <PrimaryButton
          title="SEND VIA WHATSAPP"
          onPress={handleWhatsAppPress}
          style={{ width: '100%' }}
        />

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
    marginBottom: Spacing.xl * 2,
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
  centeredContent: {
    alignItems: 'center',
    marginBottom: Spacing.xl * 2,
  },
  headline: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.xl,
    fontWeight: '600',
    marginTop: Spacing.base,
    marginBottom: Spacing.base,
    textAlign: 'center',
  },
  subtext: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing.xl,
  },
  divider: {
    height: 1,
    backgroundColor: AccentColors.border,
    marginVertical: Spacing.xl,
  },
  inputSection: {
    marginBottom: Spacing.base,
  },
  textInput: {
    backgroundColor: BackgroundColors.secondary,
    borderWidth: 1,
    borderColor: AccentColors.border,
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    color: TextColors.primary,
    fontSize: Typography.fontSize.base,
    minHeight: 120,
  },
  contactLabel: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.sm,
    marginBottom: Spacing.base,
    textAlign: 'center',
  },
  phoneButton: {
    alignItems: 'center',
    paddingVertical: Spacing.base,
    marginBottom: Spacing.xl * 2,
  },
  phoneButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneNumber: {
    color: AccentColors.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: '500',
  },
});
