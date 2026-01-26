import React, { useRef } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Line, Text as SvgText } from 'react-native-svg';

interface GoldCardProps {
  memberName: string;
}

export default function GoldCard({ memberName }: GoldCardProps) {
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
    outputRange: [0.4, 0.18, 0.4],
  });

  const lightTranslateX = lightPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [-120, 120],
  });

  return (
    <View style={styles.cardContainer} {...panResponder.panHandlers}>
      {/* Edge bevel */}
      <LinearGradient
        colors={['#d4b896', '#c4a060', '#8a7040', '#6a5530', '#9a7848', '#c4a468']}
        locations={[0, 0.15, 0.4, 0.6, 0.85, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.edgeBevel}
      />

      {/* Top edge catch */}
      <LinearGradient
        colors={['transparent', 'rgba(255,220,160,0.5)', 'rgba(255,235,200,0.9)', 'rgba(255,220,160,0.5)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.topEdgeCatch}
      />

      {/* Main card */}
      <LinearGradient
        colors={['#b89860', '#a8884c', '#987840', '#927242', '#987840', '#a8884c', '#b89860']}
        locations={[0, 0.15, 0.4, 0.5, 0.6, 0.85, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.card}
      >
        {/* Satin sheen base */}
        <LinearGradient
          colors={['rgba(255,240,200,0.15)', 'rgba(255,230,180,0.08)', 'transparent', 'rgba(60,40,20,0.08)', 'rgba(40,25,10,0.12)']}
          locations={[0, 0.3, 0.5, 0.7, 1]}
          style={StyleSheet.absoluteFill}
        />

        {/* Brushed texture lines */}
        {[...Array(30)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.textureLine,
              {
                top: i * 7,
                opacity: i % 3 === 0 ? 0.1 : 0.05,
                height: i % 2 === 0 ? 1 : 0.5,
                backgroundColor: i % 4 === 0 ? 'rgba(255,240,200,1)' : 'rgba(80,60,30,0.5)',
              },
            ]}
          />
        ))}

        {/* Dynamic light band */}
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
            colors={['transparent', 'rgba(255,250,230,0.25)', 'rgba(255,255,245,0.45)', 'rgba(255,250,230,0.25)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        {/* Top edge highlight */}
        <LinearGradient
          colors={['rgba(200,170,120,0.5)', 'rgba(255,235,190,0.8)', 'rgba(255,250,230,0.95)', 'rgba(255,235,190,0.8)', 'rgba(200,170,120,0.5)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.topHighlight}
        />

        {/* Bottom shadow line */}
        <View style={styles.bottomShadow} />

        {/* Machined grooves */}
        <Svg style={styles.grooves} viewBox="0 0 340 215">
          <Defs>
            <SvgLinearGradient id="grooveGold" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="rgba(60,40,15,0.4)" />
              <Stop offset="40%" stopColor="rgba(80,55,25,0.2)" />
              <Stop offset="50%" stopColor="rgba(100,70,30,0.1)" />
              <Stop offset="60%" stopColor="rgba(255,240,200,0.45)" />
              <Stop offset="100%" stopColor="rgba(255,230,180,0.25)" />
            </SvgLinearGradient>
          </Defs>
          <Line x1="275" y1="-15" x2="385" y2="55" stroke="url(#grooveGold)" strokeWidth="2.5" />
          <Line x1="252" y1="-15" x2="362" y2="55" stroke="url(#grooveGold)" strokeWidth="1.5" opacity="0.7" />
          <Line x1="229" y1="-15" x2="339" y2="55" stroke="url(#grooveGold)" strokeWidth="0.8" opacity="0.4" />
          <Line x1="255" y1="135" x2="405" y2="225" stroke="url(#grooveGold)" strokeWidth="2.5" />
          <Line x1="232" y1="135" x2="382" y2="225" stroke="url(#grooveGold)" strokeWidth="1.5" opacity="0.7" />
          <Line x1="209" y1="135" x2="359" y2="225" stroke="url(#grooveGold)" strokeWidth="0.8" opacity="0.4" />
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
                <SvgLinearGradient id="logoGold" x1="0%" y1="0%" x2="0%" y2="100%">
                  <Stop offset="0%" stopColor="#2e2010" />
                  <Stop offset="45%" stopColor="#3d2e1a" />
                  <Stop offset="55%" stopColor="#4a3820" />
                  <Stop offset="100%" stopColor="#2e2010" />
                </SvgLinearGradient>
              </Defs>
              <SvgText
                x="50"
                y="68"
                textAnchor="middle"
                fill="url(#logoGold)"
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
            <Text style={styles.tierText}>GOLD</Text>
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
    shadowColor: '#4a3520',
    shadowOffset: { width: 0, height: 30 },
    shadowOpacity: 0.5,
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
  },
  lightReflection: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 100,
    left: '50%',
    marginLeft: -50,
  },
  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  bottomShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(60,40,20,0.35)',
  },
  grooves: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  innerShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 14,
    borderWidth: 1,
    borderTopColor: 'rgba(255,240,200,0.25)',
    borderLeftColor: 'rgba(255,235,190,0.15)',
    borderRightColor: 'rgba(255,235,190,0.15)',
    borderBottomColor: 'rgba(40,25,10,0.2)',
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
    color: '#3d2e1a',
    textShadowColor: 'rgba(255,235,190,0.45)',
    textShadowOffset: { width: 0, height: 1 },
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
    color: '#2a1e10',
    textShadowColor: 'rgba(255,240,200,0.55)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  bottomRow: {
    alignItems: 'flex-end',
  },
  memberName: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 1.5,
    color: '#3d2e1a',
    textShadowColor: 'rgba(255,235,190,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0,
  },
});
