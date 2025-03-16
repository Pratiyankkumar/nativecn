/* tslint:disable */
/* eslint-disable */
// @ts-nocheck /* This line will be removed when copied to user project */
import React, { useState } from 'react';
import {
  Pressable,
  Text,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';

import { cn } from '../../../lib/utils';

import { buttonClassNames, textClassNames, iconColors } from './styles';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  className?: string;
  textClassName?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  mode?: 'light' | 'dark';
  children: React.ReactNode;
  asChild?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'default',
  size = 'default',
  disabled = false,
  className = '',
  textClassName = '',
  style,
  mode = 'light',
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const containerClasses = cn(
    buttonClassNames.base,
    buttonClassNames[`size_${size}`],
    buttonClassNames[`${mode}_variant_${variant}`],
    isPressed && buttonClassNames.pressed[variant],
    disabled && buttonClassNames.disabled,
    className
  );

  const textClasses = cn(
    textClassNames.base,
    textClassNames.size[size],
    textClassNames[mode][variant],
    textClassName
  );

  const isIconButton = size === 'icon';

  return (
    <Pressable
      {...props}
      disabled={disabled}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      android_ripple={variant !== 'link' ? { color: 'rgba(0, 0, 0, 0.1)' } : null}
      className={containerClasses}
      style={[style, isPressed && !buttonClassNames.pressed[variant] && { opacity: 0.95 }]}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && (child.type === 'svg' || child.props.svg)) {
          return React.cloneElement(child, {
            ...child.props,
            size: isIconButton ? 20 : 16,
            color: child.props.color || iconColors[mode][variant],
            className: cn(isIconButton ? 'w-5 h-5' : 'w-4 h-4 shrink-0', child.props.className),
          });
        } else if (typeof child === 'string' || typeof child === 'number') {
          return <Text className={textClasses}>{child}</Text>;
        }
        return child;
      })}
    </Pressable>
  );
};

export default Button;
