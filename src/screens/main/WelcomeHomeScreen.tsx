import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';

interface WelcomeHomeScreenProps {
  navigation: any;
}

export default function WelcomeHomeScreen({ navigation }: WelcomeHomeScreenProps) {
  const { user: authUser } = useAuth();
  
  // Get user's first name
  const fullName = authUser?.full_name || '';
  const firstName = fullName.split(' ')[0] || 'Member';
  
  const handleUnlock = () => {
    // Navigate to main tabs and replace so user can't go back
    navigation.replace('MainTabs');
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <ImageBackground
          source={require('../../../Images/homepage.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          {/* Gradient Overlay */}
          <LinearGradient
            colors={[
              'rgba(10,22,40,0.3)',
              'rgba(10,22,40,0.5)',
              'rgba(10,22,40,0.85)',
              'rgba(10,22,40,0.95)',
            ]}
            locations={[0, 0.4, 0.7, 1]}
            style={styles.gradientOverlay}
          >
            {/* Seven Keys Logo */}
            <Text style={styles.logo}>SEVEN KEYS</Text>

            {/* Content at Bottom */}
            <View style={styles.bottomContent}>
              <Text style={styles.welcomeHeading}>Welcome, {firstName}</Text>
              <View style={styles.accentLine} />
              <Text style={styles.bodyCopy}>
                Where every need is anticipated, every detail handled, and every experience crafted around you.
              </Text>
              
              {/* CTA Button */}
              <TouchableOpacity
                style={styles.ctaButton}
                onPress={handleUnlock}
                activeOpacity={0.8}
              >
                <Text style={styles.ctaButtonText}>UNLOCK EXTRAORDINARY</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 60,
    paddingHorizontal: 28,
  },
  logo: {
    position: 'absolute',
    top: 70,
    alignSelf: 'center',
    fontSize: 24,
    letterSpacing: 8,
    fontWeight: '300',
    color: 'rgba(255,255,255,0.9)',
  },
  bottomContent: {
    width: '100%',
  },
  welcomeHeading: {
    fontSize: 36,
    fontWeight: '300',
    letterSpacing: 1,
    color: '#FFFFFF',
    marginBottom: 0,
  },
  accentLine: {
    width: 40,
    height: 2,
    backgroundColor: '#5684C4',
    marginVertical: 16,
  },
  bodyCopy: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: 'rgba(255,255,255,0.85)',
  },
  ctaButton: {
    marginTop: 32,
    width: '100%',
    paddingVertical: 18,
    borderRadius: 12,
    backgroundColor: '#5684C4',
  },
  ctaButtonText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 2,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
