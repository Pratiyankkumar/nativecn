import { Easing } from 'react-native';

// Accordion base component styles
export const accordionClassNames = {
  base: '',
};

// Accordion item styles
export const accordionItemClassNames = {
  base: 'border-b',
  theme: {
    dark: 'border-border',
    light: 'border-dark-border',
  },
};

// Accordion trigger styles
export const accordionTriggerClassNames = {
  base: 'flex-row items-center justify-between py-4',
  text: {
    base: 'font-medium',
    theme: {
      dark: 'text-dark-foreground',
      light: 'text-foreground',
    },
  },
  icon: {
    color: {
      dark: '#FFFFFF',
      light: '#000000',
    },
  },
};

// Accordion content styles
export const accordionContentClassNames = {
  base: '',
  content: {
    base: 'pb-4 pt-0',
  },
  text: {
    base: 'text-sm',
    theme: {
      dark: 'text-dark-foreground',
      light: 'text-foreground',
    },
  },
};

// Animation configurations
export const animationConfigs = {
  rotation: {
    duration: 200,
    easing: Easing.cubic,
    useNativeDriver: true,
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  },
  height: {
    duration: 200,
    easing: Easing.cubic,
    useNativeDriver: false,
  },
  opacity: {
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.5, 1],
  },
};
