import React, { useState } from 'react';
import {
  Pressable,
  Text,
  View,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';

import { cn } from '../../../lib/utils';

import { badgeClassNames, textClassNames } from './styles';

interface BadgeProps extends Omit<TouchableOpacityProps, 'style'> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
  textClassName?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  mode?: 'light' | 'dark';
  children: React.ReactNode;
  interactive?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
  textClassName = '',
  style,
  mode = 'light',
  interactive = false,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const containerClasses = cn(
    badgeClassNames.base,
    badgeClassNames[`${mode}_variant_${variant}`],
    interactive && isPressed && badgeClassNames.pressed[variant],
    className
  );

  const textClasses = cn(textClassNames.base, textClassNames[mode][variant], textClassName);

  // Component selection based on interactive flag
  const Component = interactive ? Pressable : View;

  // Only apply press handlers if interactive
  const interactiveProps = interactive
    ? {
        onPressIn: () => setIsPressed(true),
        onPressOut: () => setIsPressed(false),
        android_ripple: { color: 'rgba(0, 0, 0, 0.1)' },
        ...props,
      }
    : {};

  return (
    <Component
      className={containerClasses}
      style={[
        style,
        interactive && isPressed && !badgeClassNames.pressed[variant] && { opacity: 0.95 },
      ]}
      {...interactiveProps}
    >
      {typeof children === 'string' ? <Text className={textClasses}>{children}</Text> : children}
    </Component>
  );
};

export { Badge };
export default Badge;
