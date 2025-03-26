'use client';

import React from 'react';
import { cn } from '../../../lib/utils';
import type { IconType } from 'react-icons';

// Import styles
import {
  alertClassNames,
  alertTitleClassNames,
  alertDescriptionClassNames,
  iconColors,
} from './styles';

// Updated types for custom icon rendering
type IconProps = {
  size: number;
  color: string;
};

// Types for the Alert component
interface AlertProps {
  variant?: 'default' | 'destructive';
  className?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  mode?: 'light' | 'dark';
  renderIcon?: (props: IconProps) => React.ReactNode;
}

// Alert component
export const Alert: React.FC<AlertProps> = ({
  variant = 'default',
  className = '',
  children,
  icon,
  mode = 'light',
  renderIcon,
}) => {
  const isDark = mode === 'dark';

  const iconColor = isDark
    ? iconColors.dark[variant as keyof typeof iconColors.dark]
    : iconColors.light[variant as keyof typeof iconColors.light];

  return (
    <div
      className={cn(
        alertClassNames.base,
        isDark ? alertClassNames.theme.dark[variant] : alertClassNames.theme.light[variant],
        'relative flex flex-row items-start justify-start',
        className
      )}
    >
      {(icon || renderIcon) && (
        <div className="">
          {renderIcon ? (
            renderIcon({ size: 16, color: iconColor })
          ) : (
            <div className="flex items-center justify-center mt-[3px]" style={{ color: iconColor }}>
              {icon}
            </div>
          )}
        </div>
      )}
      <div className={cn('flex flex-col', icon || renderIcon ? 'ml-3' : '')}>{children}</div>
    </div>
  );
};

// AlertTitle component
interface AlertTitleProps {
  className?: string;
  children: React.ReactNode;
  mode?: 'light' | 'dark';
}

export const AlertTitle: React.FC<AlertTitleProps> = ({
  className = '',
  children,
  mode = 'light',
}) => {
  const isDark = mode === 'dark';

  return (
    <h5
      className={cn(
        alertTitleClassNames.base,
        isDark ? alertTitleClassNames.theme.dark : alertTitleClassNames.theme.light,
        className
      )}
    >
      {children}
    </h5>
  );
};

// AlertDescription component
interface AlertDescriptionProps {
  className?: string;
  children: React.ReactNode;
  mode?: 'light' | 'dark';
}

export const AlertDescription: React.FC<AlertDescriptionProps> = ({
  className = '',
  children,
  mode = 'light',
}) => {
  const isDark = mode === 'dark';

  // Helper function to ensure text content is properly styled
  const renderContent = (content: React.ReactNode): React.ReactNode => {
    if (typeof content === 'string' || typeof content === 'number') {
      return (
        <p
          className={cn(
            alertDescriptionClassNames.base,
            isDark ? alertDescriptionClassNames.theme.dark : alertDescriptionClassNames.theme.light,
            className
          )}
        >
          {content}
        </p>
      );
    }

    if (React.isValidElement(content)) {
      const elementProps = content.props as any;
      // If it's already a paragraph or has no children, return as is
      if (content.type === 'p' || (elementProps && !elementProps.children)) {
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
    <div className={cn(alertDescriptionClassNames.container, className)}>
      {renderContent(children)}
    </div>
  );
};
