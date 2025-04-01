import React, { useState } from 'react';
import { View, Text, Pressable, ViewProps, TextProps, PressableProps } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { cn } from '../../../lib/utils';

import {
  breadcrumbClassNames,
  breadcrumbListClassNames,
  breadcrumbItemClassNames,
  breadcrumbLinkClassNames,
  breadcrumbPageClassNames,
  breadcrumbSeparatorClassNames,
  breadcrumbEllipsisClassNames,
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

// Main Breadcrumb container (replaces nav element)
interface BreadcrumbProps extends ViewProps {
  className?: string;
}

const Breadcrumb = ({ className, ...props }: BreadcrumbProps) => {
  return (
    <View
      accessible
      accessibilityRole="header"
      accessibilityLabel="breadcrumb"
      className={cn(breadcrumbClassNames.base, className)}
      {...props}
    />
  );
};

// BreadcrumbList (replaces ol element)
interface BreadcrumbListProps extends ViewProps {
  className?: string;
  mode?: 'light' | 'dark';
}

const BreadcrumbList = ({ className, mode = 'light', ...props }: BreadcrumbListProps) => {
  return (
    <View
      accessible
      className={cn(
        breadcrumbListClassNames.base,
        mode === 'dark' ? breadcrumbListClassNames.dark : breadcrumbListClassNames.light,
        className
      )}
      {...props}
    />
  );
};

// BreadcrumbItem (replaces li element)
interface BreadcrumbItemProps extends ViewProps {
  className?: string;
}

const BreadcrumbItem = ({ className, ...props }: BreadcrumbItemProps) => {
  return <View accessible className={cn(breadcrumbItemClassNames.base, className)} {...props} />;
};

// BreadcrumbLink (replaces a element)
interface BreadcrumbLinkProps extends PressableProps {
  className?: string;
  textClassName?: string;
  asChild?: boolean;
  mode?: 'light' | 'dark';
}

const BreadcrumbLink = ({
  className,
  textClassName,
  asChild = false,
  children,
  mode = 'light',
  ...props
}: BreadcrumbLinkProps) => {
  const [isPressed, setIsPressed] = useState(false);

  // If asChild is true and children is a valid element, we render the children directly
  if (asChild && React.isValidElement(children)) {
    const childElement = children as React.ReactElement<{ className?: string }>;
    return React.cloneElement(childElement, {
      ...props,
      // Only add className if the child supports it
      ...(childElement.props.className !== undefined && {
        className: cn(className, childElement.props.className),
      }),
    });
  }

  return (
    <Pressable
      className={cn(className)}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text
          className={cn(
            breadcrumbLinkClassNames.text.base,
            breadcrumbLinkClassNames.text[mode].default,
            isPressed && breadcrumbLinkClassNames.text[mode].pressed,
            textClassName
          )}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
};

// BreadcrumbPage (replaces span for current page)
interface BreadcrumbPageProps extends TextProps {
  className?: string;
  mode?: 'light' | 'dark';
}

const BreadcrumbPage = ({ className, mode = 'light', ...props }: BreadcrumbPageProps) => {
  return (
    <Text
      accessibilityRole="text"
      className={cn(
        breadcrumbPageClassNames.base,
        mode === 'dark' ? breadcrumbPageClassNames.dark : breadcrumbPageClassNames.light,
        className
      )}
      {...props}
    />
  );
};

// BreadcrumbSeparator (replaces li for separator)
interface BreadcrumbSeparatorProps extends ViewProps {
  className?: string;
  children?: React.ReactNode;
  mode?: 'light' | 'dark';
}

const BreadcrumbSeparator = ({
  children,
  className,
  mode = 'light',
  ...props
}: BreadcrumbSeparatorProps) => {
  const iconColor = breadcrumbSeparatorClassNames.iconColor[mode];

  return (
    <View
      accessible
      importantForAccessibility="no"
      className={cn(breadcrumbSeparatorClassNames.base, className)}
      {...props}
    >
      {children ?? <FeatherIcon name="chevron-right" size={14} color={iconColor} />}
    </View>
  );
};

// BreadcrumbEllipsis (replaces span for ellipsis)
interface BreadcrumbEllipsisProps extends ViewProps {
  className?: string;
  mode?: 'light' | 'dark';
}

const BreadcrumbEllipsis = ({ className, mode = 'light', ...props }: BreadcrumbEllipsisProps) => {
  const iconColor = breadcrumbEllipsisClassNames.iconColor[mode];

  return (
    <View
      accessible
      importantForAccessibility="no"
      accessibilityLabel="More breadcrumbs"
      className={cn(breadcrumbEllipsisClassNames.base, className)}
      {...props}
    >
      <FeatherIcon name="more-horizontal" size={16} color={iconColor} />
      <Text className="sr-only">More</Text>
    </View>
  );
};

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
