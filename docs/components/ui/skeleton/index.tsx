import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, Platform } from 'react-native';
import { skeletonColors, animationConfig } from './styles';

// Generate a unique ID for each skeleton instance
let skeletonCounter = 0;

export const Skeleton = ({
  className,
  mode = 'light',
  animated = true,
}: {
  className: string;
  mode?: 'light' | 'dark';
  animated?: boolean;
}) => {
  // Create a unique ID for this skeleton instance
  const skeletonId = useRef(`skeleton-${skeletonCounter++}`);

  // Store the animated value in a ref so it persists between renders
  const animatedValueRef = useRef<Animated.Value | null>(null);

  // Initialize the animated value only once
  if (animatedValueRef.current === null) {
    animatedValueRef.current = new Animated.Value(0);
  }

  useEffect(() => {
    // Only set up animation if animated prop is true
    if (animated && animatedValueRef.current) {
      // Stop any existing animation and reset value
      animatedValueRef.current.stopAnimation();
      animatedValueRef.current.setValue(0);

      // Create and start the animation loop
      const animationLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValueRef.current, {
            toValue: 1,
            duration: animationConfig.duration,
            useNativeDriver: animationConfig.useNativeDriver,
          }),
          Animated.timing(animatedValueRef.current, {
            toValue: 0,
            duration: animationConfig.duration,
            useNativeDriver: animationConfig.useNativeDriver,
          }),
        ])
      );

      animationLoop.start();

      // Clean up animation when component unmounts or animation changes
      return () => {
        if (animatedValueRef.current) {
          animatedValueRef.current.stopAnimation();
        }
        animationLoop.stop();
      };
    }
  }, [animated]); // Only depend on animated prop

  // Get the base and highlight colors for the current mode
  const baseColor = mode === 'dark' ? skeletonColors.dark.base : skeletonColors.light.base;
  const highlightColor =
    mode === 'dark' ? skeletonColors.dark.highlight : skeletonColors.light.highlight;

  // Create the animated style if animation is enabled
  let animatedStyle = {};
  let webAnimationClass = '';

  if (animated) {
    if (Platform.OS === 'web') {
      // Use instance-specific class for web animation
      webAnimationClass = skeletonId.current;
    } else if (animatedValueRef.current) {
      // Use React Native's Animated API for native platforms
      const animatedBackgroundColor = animatedValueRef.current.interpolate({
        inputRange: [0, 1],
        outputRange: [baseColor, highlightColor],
      });
      animatedStyle = { backgroundColor: animatedBackgroundColor };
    }
  }

  // Base style with background color
  const baseStyle = {
    backgroundColor: baseColor,
    // Add these styles to ensure the component is visible
    overflow: 'hidden' as const,
    opacity: 1,
  };

  // Combine all styles
  const combinedStyle = animated && Platform.OS !== 'web' ? [baseStyle, animatedStyle] : baseStyle;

  // Handle web animation - update or create instance-specific style element
  useEffect(() => {
    if (Platform.OS === 'web' && animated) {
      const styleId = `${skeletonId.current}-style`;
      const webStyles = `
        @keyframes ${skeletonId.current}Pulse {
          0%, 100% { background-color: ${baseColor}; }
          50% { background-color: ${highlightColor}; }
        }
        
        .${skeletonId.current} {
          animation: ${skeletonId.current}Pulse ${animationConfig.duration * 2}ms infinite;
          background-color: ${baseColor};
        }
      `;

      // Update or create the style element for this instance
      if (typeof document !== 'undefined') {
        let styleEl = document.getElementById(styleId);

        if (!styleEl) {
          styleEl = document.createElement('style');
          styleEl.id = styleId;
          document.head.appendChild(styleEl);
        }

        styleEl.innerHTML = webStyles;
      }

      // Clean up on unmount
      return () => {
        if (typeof document !== 'undefined') {
          const styleEl = document.getElementById(styleId);
          if (styleEl) {
            styleEl.remove();
          }
        }
      };
    }
  }, [animated, baseColor, highlightColor, mode]);

  // Use the appropriate View component
  return Platform.OS === 'web' && animated ? (
    <View className={`${className} ${skeletonId.current}`} style={baseStyle} />
  ) : animated ? (
    <Animated.View className={className} style={combinedStyle} />
  ) : (
    <View className={className} style={baseStyle} />
  );
};
