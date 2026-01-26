import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BrandColors, BackgroundColors, TextColors, AccentColors, Spacing, BorderRadius, Typography } from '../../constants/brand';

interface SevenKCardProps {
  memberName: string;
  tier: 'member' | 'select' | 'elite' | 'black';
  memberSince: string;
}

const TIER_LABELS = {
  member: 'MEMBER',
  select: 'SELECT',
  elite: 'ELITE',
  black: 'BLACK CARD',
};

export default function SevenKCard({ memberName, tier, memberSince }: SevenKCardProps) {
  return (
    <View style={styles.cardContainer}>
      <LinearGradient
        colors={['#101D30', '#0D1829', '#09162E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.card}
      >
        {/* Light Blue top line */}
        <View style={styles.accentLine} />
        
        {/* Horizontal texture lines */}
        <View style={styles.textureLine1} />
        <View style={styles.textureLine2} />
        <View style={styles.textureLine3} />
        <View style={styles.textureLine4} />
        
        {/* Card content */}
        <View style={styles.cardContent}>
          {/* Top section */}
          <View style={styles.topSection}>
            <Text style={styles.brandText}>SEVEN KEYS</Text>
            <Image
              source={require('../../Images/transparent copy.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          
          {/* Middle section with chip and tier */}
          <View style={styles.middleSection}>
            <View style={styles.chipContainer}>
              <View style={styles.chip}>
                <View style={styles.chipLine} />
                <View style={styles.chipLine} />
                <View style={styles.chipLine} />
                <View style={styles.chipLine} />
              </View>
            </View>
            <Text style={styles.tierText}>{TIER_LABELS[tier]}</Text>
          </View>
          
          {/* Bottom section */}
          <View style={styles.bottomSection}>
            <Text style={styles.memberName}>{memberName.toUpperCase()}</Text>
            <Text style={styles.memberSince}>{memberSince}</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    shadowColor: AccentColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  card: {
    width: 340,
    height: 215,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  accentLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: AccentColors.primary,
    opacity: 0.8,
    zIndex: 10,
  },
  textureLine1: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  textureLine2: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  textureLine3: {
    position: 'absolute',
    top: 90,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  textureLine4: {
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  cardContent: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'space-between',
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  brandText: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.semibold,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  logo: {
    width: 40,
    height: 40,
  },
  middleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  chipContainer: {
    marginRight: Spacing.base,
  },
  chip: {
    width: 45,
    height: 35,
    backgroundColor: AccentColors.primary,
    borderRadius: BorderRadius.sm,
    justifyContent: 'space-around',
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  chipLine: {
    height: 2,
    backgroundColor: BrandColors.black,
    borderRadius: 1,
  },
  tierText: {
    color: TextColors.primary,
    fontSize: Typography.fontSize['2xl'],
    fontFamily: Typography.fontFamily.bold,
    letterSpacing: 2,
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  memberName: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.regular,
    letterSpacing: 1,
  },
  memberSince: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
  },
});
