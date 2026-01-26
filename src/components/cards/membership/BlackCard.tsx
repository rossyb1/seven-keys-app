import React, { useRef } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Text as SvgText, RadialGradient } from 'react-native-svg';

interface BlackCardProps {
  memberName: string;
}

export default function BlackCard({ memberName }: BlackCardProps) {
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
    outputRange: [0.12, 0.05, 0.12],
  });

  const lightTranslateX = lightPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 100],
  });

  const depthTranslateX = lightPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 10],
  });

  return (
    <View style={styles.cardContainer} {...panResponder.panHandlers}>
      {/* Edge bevel */}
      <LinearGradient
        colors={['#2a2a2a', '#1a1a1a', '#0a0a0a', '#050505', '#0f0f0f', '#1a1a1a']}
        locations={[0, 0.15, 0.4, 0.6, 0.85, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.edgeBevel}
      />

      {/* Gold accent line - top edge */}
      <LinearGradient
        colors={['transparent', 'rgba(180,140,80,0.3)', 'rgba(212,165,116,0.7)', 'rgba(230,190,130,0.9)', 'rgba(212,165,116,0.7)', 'rgba(180,140,80,0.3)', 'transparent']}
        locations={[0, 0.15, 0.35, 0.5, 0.65, 0.85, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.goldAccentLine}
      />

      {/* Main card */}
      <View style={styles.card}>
        {/* Deep obsidian base */}
        <View style={styles.obsidianBase} />

        {/* Depth layer with parallax */}
        <Animated.View
          style={[
            styles.depthLayer,
            {
              transform: [{ translateX: depthTranslateX }],
            },
          ]}
        >
          <LinearGradient
            colors={['#0a0a0a', '#050505', '#020202', '#000000']}
            locations={[0, 0.4, 0.7, 1]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0.5, y: 0.5 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>

        {/* Secondary depth - subtle color shift */}
        <Animated.View
          style={[
            styles.secondaryDepth,
            {
              transform: [{ translateX: Animated.multiply(depthTranslateX, 1.5) }],
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(20,25,35,0.4)', 'transparent']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0.4, y: 0.3 }}
            end={{ x: 0.8, y: 0.7 }}
          />
        </Animated.View>

        {/* Top reflection - polished obsidian feel */}
        <LinearGradient
          colors={['rgba(255,255,255,0.03)', 'rgba(255,255,255,0.015)', 'transparent']}
          locations={[0, 0.3, 1]}
          style={styles.topReflection}
        />

        {/* Dynamic light sweep */}
        <Animated.View
          style={[
            styles.lightSweep,
            {
              opacity: lightOpacity,
              transform: [{ translateX: lightTranslateX }],
            },
          ]}
        >
          <LinearGradient
            colors={['transparent', 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        {/* Warm undertone - subtle gold depth */}
        <Animated.View
          style={[
            styles.warmUndertone,
            {
              transform: [{ translateX: depthTranslateX }],
            },
          ]}
        />

        {/* Inner gold accent glow */}
        <LinearGradient
          colors={['transparent', 'rgba(212,165,116,0.15)', 'rgba(212,165,116,0.3)', 'rgba(212,165,116,0.15)', 'transparent']}
          locations={[0.1, 0.3, 0.5, 0.7, 0.9]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.innerGoldLine}
        />

        {/* Gold glow spread */}
        <View style={styles.goldGlowSpread} />

        {/* Bottom edge with subtle gold */}
        <LinearGradient
          colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.6)', 'rgba(80,60,40,0.15)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.8)']}
          locations={[0, 0.3, 0.5, 0.7, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.bottomEdge}
        />

        {/* Inner shadow overlay */}
        <View style={styles.innerShadow} />

        {/* Content */}
        <View style={styles.content}>
          {/* Top row */}
          <View style={styles.topRow}>
            <Text style={styles.brandText}>SEVEN KEYS</Text>
            <Svg width={40} height={40} viewBox="0 0 100 100">
              <Defs>
                <SvgLinearGradient id="logoBlack" x1="0%" y1="0%" x2="0%" y2="100%">
                  <Stop offset="0%" stopColor="#3a3028" />
                  <Stop offset="45%" stopColor="#4a4035" />
                  <Stop offset="55%" stopColor="#5a4a3d" />
                  <Stop offset="100%" stopColor="#3a3028" />
                </SvgLinearGradient>
              </Defs>
              <SvgText
                x="50"
                y="68"
                textAnchor="middle"
                fill="url(#logoBlack)"
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
            <Text style={styles.tierText}>BLACK</Text>
          </View>

          {/* Member name */}
          <View style={styles.bottomRow}>
            <Text style={styles.memberName}>{memberName}</Text>
          </View>
        </View>
      </View>
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
    shadowOffset: { width: 0, height: 40 },
    shadowOpacity: 0.8,
    shadowRadius: 70,
    elevation: 25,
  },
  goldAccentLine: {
    position: 'absolute',
    top: -2,
    left: 40,
    right: 40,
    height: 1,
    zIndex: 10,
  },
  card: {
    width: 340,
    height: 215,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  obsidianBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#050505',
  },
  depthLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  secondaryDepth: {
    ...StyleSheet.absoluteFillObject,
  },
  topReflection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
  },
  lightSweep: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 120,
    left: '50%',
    marginLeft: -60,
  },
  warmUndertone: {
    position: 'absolute',
    top: '30%',
    left: '20%',
    right: '20%',
    bottom: '30%',
    backgroundColor: 'rgba(212,165,116,0.03)',
    borderRadius: 100,
  },
  innerGoldLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  goldGlowSpread: {
    position: 'absolute',
    top: 0,
    left: '20%',
    right: '20%',
    height: 30,
    backgroundColor: 'rgba(212,165,116,0.04)',
  },
  bottomEdge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  innerShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 14,
    borderWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.04)',
    borderLeftColor: 'rgba(0,0,0,0.5)',
    borderRightColor: 'rgba(0,0,0,0.5)',
    borderBottomColor: 'rgba(0,0,0,0.6)',
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
    color: '#5a4a3a',
    textShadowColor: 'rgba(212,165,116,0.12)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
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
    color: '#4a3d30',
    textShadowColor: 'rgba(212,165,116,0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 15,
  },
  bottomRow: {
    alignItems: 'flex-end',
  },
  memberName: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 1.5,
    color: '#4a4038',
    textShadowColor: 'rgba(212,165,116,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0,
  },
});
