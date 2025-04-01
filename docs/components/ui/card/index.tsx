import React from 'react';
import { View, Text, ViewProps, TextProps } from 'react-native';
import { cn } from '../../../lib/utils';

import {
  cardClassNames,
  cardHeaderClassNames,
  cardTitleClassNames,
  cardDescriptionClassNames,
  cardContentClassNames,
  cardFooterClassNames,
} from './styles';

// Main Card container
interface CardProps extends ViewProps {
  className?: string;
  mode?: 'light' | 'dark';
}

const Card = ({ className, mode = 'light', ...props }: CardProps) => {
  return (
    <View
      className={cn(
        cardClassNames.base,
        cardClassNames[mode].container,
        cardClassNames[mode].text,
        className
      )}
      {...props}
    />
  );
};

// Card Header
interface CardHeaderProps extends ViewProps {
  className?: string;
}

const CardHeader = ({ className, ...props }: CardHeaderProps) => {
  return <View className={cn(cardHeaderClassNames.base, className)} {...props} />;
};

// Card Title
interface CardTitleProps extends TextProps {
  className?: string;
  mode?: 'light' | 'dark';
}

const CardTitle = ({ className, mode = 'light', ...props }: CardTitleProps) => {
  return (
    <Text
      className={cn(cardTitleClassNames.base, cardTitleClassNames[mode], className)}
      {...props}
    />
  );
};

// Card Description
interface CardDescriptionProps extends TextProps {
  className?: string;
  mode?: 'light' | 'dark';
}

const CardDescription = ({ className, mode = 'light', ...props }: CardDescriptionProps) => {
  return (
    <Text
      className={cn(cardDescriptionClassNames.base, cardDescriptionClassNames[mode], className)}
      {...props}
    />
  );
};

// Card Content
interface CardContentProps extends ViewProps {
  className?: string;
}

const CardContent = ({ className, ...props }: CardContentProps) => {
  return <View className={cn(cardContentClassNames.base, className)} {...props} />;
};

// Card Footer
interface CardFooterProps extends ViewProps {
  className?: string;
}

const CardFooter = ({ className, ...props }: CardFooterProps) => {
  return <View className={cn(cardFooterClassNames.base, className)} {...props} />;
};

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
