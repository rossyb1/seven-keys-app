import React, { useRef } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Line, Text as SvgText } from 'react-native-svg';

interface BlueCardProps {
  memberName: string;
}

export default function BlueCard({ memberName }: BlueCardProps) {
  const lightPosition = useRef(new Animated.Value(0.5)).current;
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const x = Math.max(0, Math.min(1, (gestureState.moveX - gestureState.x0 + 170) / 340));
        lightPosition.setValue(x);
      },
      onPanResponderRelease: () => {
        Animated.spring(lightPosition, {
          toValue: 0.5,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const lightOpacity = lightPosition.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.15, 0.08, 0.15],
  });

  const lightTranslateX = lightPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 100],
  });

  return (
    <View style={styles.cardContainer} {...panResponder.panHandlers}>
      {/* Edge bevel */}
      <LinearGradient
        colors={['rgba(120,160,200,0.5)', 'rgba(60,90,130,0.3)', 'rgba(20,40,70,0.4)', 'rgba(80,120,160,0.4)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.edgeBevel}
      />

      {/* Top edge catch */}
      <LinearGradient
        colors={['transparent', 'rgba(140,180,220,0.4)', 'rgba(180,210,240,0.8)', 'rgba(140,180,220,0.4)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.topEdgeCatch}
      />

      {/* Main card */}
      <LinearGradient
        colors={['#2a4a6a', '#1e3a55', '#152d45', '#0f2235', '#0c1c2c', '#091520']}
        locations={[0, 0.15, 0.35, 0.55, 0.75, 1]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.card}
      >
        {/* Brushed texture lines */}
        {[...Array(30)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.textureLine,
              {
                top: i * 7,
                opacity: i % 3 === 0 ? 0.04 : 0.02,
                height: i % 2 === 0 ? 1 : 0.5,
              },
            ]}
          />
        ))}

        {/* Dynamic light reflection */}
        <Animated.View
          style={[
            styles.lightReflection,
            {
              opacity: lightOpacity,
              transform: [{ translateX: lightTranslateX }],
            },
          ]}
        >
          <LinearGradient
            colors={['transparent', 'rgba(140,180,220,0.3)', 'rgba(180,210,240,0.5)', 'rgba(140,180,220,0.3)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        {/* Top edge highlight */}
        <LinearGradient
          colors={['transparent', 'rgba(140,180,220,0.4)', 'rgba(180,210,240,0.6)', 'rgba(140,180,220,0.4)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.topHighlight}
        />

        {/* Machined grooves */}
        <Svg style={styles.grooves} viewBox="0 0 340 215">
          <Defs>
            <SvgLinearGradient id="grooveBlue" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="rgba(0,0,0,0.3)" />
              <Stop offset="40%" stopColor="rgba(0,0,0,0.15)" />
              <Stop offset="60%" stopColor="rgba(180,210,240,0.15)" />
              <Stop offset="100%" stopColor="rgba(180,210,240,0.08)" />
            </SvgLinearGradient>
          </Defs>
          <Line x1="280" y1="-10" x2="380" y2="50" stroke="url(#grooveBlue)" strokeWidth="2" />
          <Line x1="260" y1="-10" x2="360" y2="50" stroke="url(#grooveBlue)" strokeWidth="1" opacity="0.6" />
          <Line x1="240" y1="-10" x2="340" y2="50" stroke="url(#grooveBlue)" strokeWidth="0.5" opacity="0.3" />
          <Line x1="260" y1="140" x2="400" y2="220" stroke="url(#grooveBlue)" strokeWidth="2" />
          <Line x1="240" y1="140" x2="380" y2="220" stroke="url(#grooveBlue)" strokeWidth="1" opacity="0.6" />
          <Line x1="220" y1="140" x2="360" y2="220" stroke="url(#grooveBlue)" strokeWidth="0.5" opacity="0.3" />
        </Svg>

        {/* Inner shadow overlay */}
        <View style={styles.innerShadow} />

        {/* Content */}
        <View style={styles.content}>
          {/* Top row */}
          <View style={styles.topRow}>
            <Text style={styles.brandText}>SEVEN KEYS</Text>
            <Svg width={40} height={40} viewBox="0 0 100 100">
              <Defs>
                <SvgLinearGradient id="logoBlue" x1="0%" y1="0%" x2="0%" y2="100%">
                  <Stop offset="0%" stopColor="#4a6a8a" />
                  <Stop offset="50%" stopColor="#6a8aaa" />
                  <Stop offset="100%" stopColor="#4a6a8a" />
                </SvgLinearGradient>
              </Defs>
              <SvgText
                x="50"
                y="68"
                textAnchor="middle"
                fill="url(#logoBlue)"
                fontFamily="Georgia"
                fontSize="44"
                fontWeight="700"
              >
                7K
              </SvgText>
            </Svg>
          </View>

          {/* Tier name */}
          <View style={styles.tierContainer}>
            <Text style={styles.tierText}>BLUE</Text>
          </View>

          {/* Member name */}
          <View style={styles.bottomRow}>
            <Text style={styles.memberName}>{memberName}</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: 340,
    height: 215,
    borderRadius: 14,
    position: 'relative',
  },
  edgeBevel: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 30 },
    shadowOpacity: 0.6,
    shadowRadius: 50,
    elevation: 20,
  },
  topEdgeCatch: {
    position: 'absolute',
    top: -2,
    left: 20,
    right: 20,
    height: 2,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    zIndex: 10,
  },
  card: {
    width: 340,
    height: 215,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  textureLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,1)',
  },
  lightReflection: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 150,
    left: '50%',
    marginLeft: -75,
  },
  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  grooves: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.6,
  },
  innerShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  content: {
    flex: 1,
    padding: 28,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  brandText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 4,
    color: '#6a8aaa',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: -1 },
    textShadowRadius: 0,
  },
  tierContainer: {
    position: 'absolute',
    top: '50%',
    left: 28,
    marginTop: -15,
  },
  tierText: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 7,
    color: '#5a7a9a',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: -1 },
    textShadowRadius: 2,
  },
  bottomRow: {
    alignItems: 'flex-end',
  },
  memberName: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 1.5,
    color: '#4a6a8a',
    opacity: 0.8,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: -1 },
    textShadowRadius: 0,
  },
});
