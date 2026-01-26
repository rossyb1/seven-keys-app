import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { BrandColors, BackgroundColors, AccentColors, Typography } from '../constants/brand';

interface SplashScreenProps {
  navigation: any;
}

export default function SplashScreen({ navigation }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('InviteCode');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../Images/transparent copy.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.brand}>SEVEN KEYS</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 24,
  },
  brand: {
    color: AccentColors.primary,
    fontSize: Typography.fontSize['2xl'],
    fontFamily: Typography.fontFamily.light,
    letterSpacing: 8,
    textShadowColor: AccentColors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
});
