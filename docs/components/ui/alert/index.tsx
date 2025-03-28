import React from 'react';
import { View, Text } from 'react-native';
import { cn } from '../../../lib/utils';
import Feather from 'react-native-vector-icons/Feather';

// Import styles
import {
  alertClassNames,
  alertTitleClassNames,
  alertDescriptionClassNames,
  iconColors,
} from './styles';

// Types for custom icon rendering
type IconProps = {
  name: string;
  size: number;
  color: string;
};

// Create a wrapper component to fix TypeScript compatibility issues
const FeatherIcon = ({ name, size, color }: IconProps) => {
  // Use the two-step type assertion pattern (first to unknown, then to the desired type)
  // This is the recommended TypeScript pattern for type assertions when types don't overlap
  const IconComponent = Feather as unknown as React.FC<IconProps>;
  return <IconComponent name={name} size={size} color={color} />;
};

// Types for the Alert component
interface AlertProps {
  variant?: 'default' | 'destructive';
  className?: string;
  children: React.ReactNode;
  icon?: string; // Name of the Feather icon
  mode?: 'light' | 'dark'; // Added mode prop to replace useTheme
  // Custom icon renderer if not using Feather
  renderIcon?: (props: IconProps) => React.ReactNode;
}

// Alert component
export const Alert: React.FC<AlertProps> = ({
  variant = 'default',
  className = '',
  children,
  icon,
  mode = 'light', // Default to light mode
  renderIcon,
}) => {
  const isDark = mode === 'dark';

  // Get the appropriate color for the icon based on variant and mode
  const iconColor = isDark
    ? iconColors.dark[variant as keyof typeof iconColors.dark]
    : iconColors.light[variant as keyof typeof iconColors.light];

  return (
    <View
      className={cn(
        alertClassNames.base,
        isDark ? alertClassNames.theme.dark[variant] : alertClassNames.theme.light[variant],
        className
      )}
    >
      {icon && (
        <View style={{ position: 'absolute', left: 16, top: 16 }}>
          {/* If a custom renderIcon function is provided, use it */}
          {renderIcon ? (
            renderIcon({ name: icon, size: 16, color: iconColor })
          ) : (
            <FeatherIcon name={icon} size={16} color={iconColor} />
          )}
        </View>
      )}
      <View style={{ marginLeft: icon ? 28 : 0 }}>{children}</View>
    </View>
  );
};

// AlertTitle component
interface AlertTitleProps {
  className?: string;
  children: React.ReactNode;
  mode?: 'light' | 'dark'; // Added mode prop
}

export const AlertTitle: React.FC<AlertTitleProps> = ({
  className = '',
  children,
  mode = 'light', // Default to light mode
}) => {
  const isDark = mode === 'dark';

  return (
    <Text
      className={cn(
        alertTitleClassNames.base,
        isDark ? alertTitleClassNames.theme.dark : alertTitleClassNames.theme.light,
        className
      )}
    >
      {children}
    </Text>
  );
};

// AlertDescription component
interface AlertDescriptionProps {
  className?: string;
  children: React.ReactNode;
  mode?: 'light' | 'dark'; // Added mode prop
}

export const AlertDescription: React.FC<AlertDescriptionProps> = ({
  className = '',
  children,
  mode = 'light', // Default to light mode
}) => {
  const isDark = mode === 'dark';

  // Helper function to ensure text content is wrapped in Text components
  const renderContent = (content: React.ReactNode): React.ReactNode => {
    if (typeof content === 'string' || typeof content === 'number') {
      return (
        <Text
          className={cn(
            alertDescriptionClassNames.base,
            isDark ? alertDescriptionClassNames.theme.dark : alertDescriptionClassNames.theme.light,
            className
          )}
        >
          {content}
        </Text>
      );
    }

    if (React.isValidElement(content)) {
      const elementProps = content.props as any;
      // If it's already a Text component or has no children, return as is
      if ((content.type as any) === Text || (elementProps && !elementProps.children)) {
        return content;
      }

      // For other elements with children, recursively process their children
      if (elementProps && elementProps.children) {
        return React.cloneElement(
          content,
          elementProps,
          React.Children.map(
            elementProps.children,
            (child): React.ReactNode => renderContent(child)
          )
        );
      }

      return content;
    }

    if (Array.isArray(content)) {
      return content.map((item, index) => (
        <React.Fragment key={index}>{renderContent(item)}</React.Fragment>
      ));
    }

    return content;
  };

  return (
    <View className={cn(alertDescriptionClassNames.container, className)}>
      {renderContent(children)}
    </View>
  );
};
