import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface AudioVisualizerProps {
  isPlaying: boolean;
}

export function AudioVisualizer({ isPlaying }: AudioVisualizerProps) {
  const barsCount = 40;
  const barAnimations = useRef(
    Array.from({ length: barsCount }, () => new Animated.Value(0.1))
  ).current;

  useEffect(() => {
    if (isPlaying) {
      const animateBars = () => {
        const animations = barAnimations.map((anim, index) =>
          Animated.loop(
            Animated.sequence([
              Animated.timing(anim, {
                toValue: Math.random() * 0.8 + 0.2,
                duration: 150 + Math.random() * 300,
                useNativeDriver: false,
              }),
              Animated.timing(anim, {
                toValue: Math.random() * 0.6 + 0.1,
                duration: 150 + Math.random() * 300,
                useNativeDriver: false,
              }),
            ])
          )
        );

        Animated.stagger(50, animations).start();
      };

      animateBars();
    } else {
      barAnimations.forEach(anim => {
        Animated.timing(anim, {
          toValue: 0.1,
          duration: 500,
          useNativeDriver: false,
        }).start();
      });
    }
  }, [isPlaying]);

  return (
    <View style={styles.container}>
      <View style={styles.visualizer}>
        {barAnimations.map((anim, index) => (
          <Animated.View
            key={index}
            style={[
              styles.bar,
              {
                height: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [4, 80],
                }),
                backgroundColor: anim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: ['#00D4FF', '#0099CC', '#FF6B6B'],
                }),
                shadowOpacity: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.2, 0.8],
                }),
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  visualizer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: width - 80,
    height: 100,
    paddingHorizontal: 20,
  },
  bar: {
    width: 3,
    borderRadius: 2,
    marginHorizontal: 1,
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
    elevation: 5,
  },
});