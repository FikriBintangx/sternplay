import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export function FloatingElements() {
  const elements = useRef(
    Array.from({ length: 8 }, (_, index) => ({
      animation: new Animated.Value(0),
      x: Math.random() * width,
      y: Math.random() * height,
      size: 20 + Math.random() * 40,
      delay: index * 1000,
    }))
  ).current;

  useEffect(() => {
    const animateElements = () => {
      elements.forEach((element, index) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(element.delay),
            Animated.timing(element.animation, {
              toValue: 1,
              duration: 3000 + Math.random() * 2000,
              useNativeDriver: true,
            }),
            Animated.timing(element.animation, {
              toValue: 0,
              duration: 3000 + Math.random() * 2000,
              useNativeDriver: true,
            }),
          ])
        ).start();
      });
    };

    animateElements();
  }, []);

  return (
    <View style={styles.container}>
      {elements.map((element, index) => (
        <Animated.View
          key={index}
          style={[
            styles.element,
            {
              left: element.x,
              top: element.y,
              width: element.size,
              height: element.size,
              opacity: element.animation.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 0.3, 0],
              }),
              transform: [
                {
                  scale: element.animation.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0.5, 1.2, 0.5],
                  }),
                },
                {
                  rotate: element.animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  element: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 212, 255, 0.3)',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});