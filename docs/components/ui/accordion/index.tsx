import React, { createContext, useContext, useRef, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { cn } from '../../../lib/utils';

// Import styles
import {
  accordionClassNames,
  accordionItemClassNames,
  accordionTriggerClassNames,
  accordionContentClassNames,
  animationConfigs,
} from './styles';

// Types
type AccordionContextValue = {
  value: string[];
  onValueChange: (value: string[]) => void;
  type: 'single' | 'multiple';
  collapsible?: boolean;
  mode?: 'light' | 'dark';
};

type AccordionItemContextValue = {
  id: string;
  isOpen: boolean;
  toggleItem: () => void;
  mode: 'light' | 'dark';
};

// Create contexts
const AccordionContext = createContext<AccordionContextValue | null>(null);
const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

// Hook to use Accordion context
const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('useAccordion must be used within an Accordion');
  }
  return context;
};

// Hook to use AccordionItem context
const useAccordionItem = () => {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error('useAccordionItem must be used within an AccordionItem');
  }
  return context;
};

// Custom ChevronDown component instead of using Feather icons
const ChevronDown: React.FC<{
  size?: number;
  color?: string;
  className?: string;
}> = ({ size = 16, color = '#000000', className = '' }) => {
  // Create a proper chevron using two lines meeting at a point
  const thickness = Math.max(1.5, Math.floor(size / 14));
  const lineLength = size * 0.35;
  const angle = 35; // degrees for proper chevron appearance

  return (
    <View
      className={cn('items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <View
        style={{
          width: size,
          height: size * 0.5,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* Left side of chevron */}
        <View
          style={{
            position: 'absolute',
            width: lineLength,
            height: thickness,
            backgroundColor: color,
            borderRadius: thickness / 2,
            transform: [{ translateX: -lineLength * 0.3 }, { rotate: `${angle}deg` }],
          }}
        />
        {/* Right side of chevron */}
        <View
          style={{
            position: 'absolute',
            width: lineLength,
            height: thickness,
            backgroundColor: color,
            borderRadius: thickness / 2,
            transform: [{ translateX: lineLength * 0.3 }, { rotate: `-${angle}deg` }],
          }}
        />
      </View>
    </View>
  );
};

// Root Accordion component
interface AccordionProps {
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  defaultValue?: string[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
  className?: string;
  mode?: 'light' | 'dark';
  children: React.ReactNode;
}

export const Accordion: React.FC<AccordionProps> = ({
  type = 'single',
  collapsible = false,
  defaultValue = [],
  value,
  onValueChange,
  className = '',
  mode = 'light',
  children,
}) => {
  const [stateValue, setStateValue] = useState<string[]>(defaultValue);

  const handleValueChange = (newValue: string[]) => {
    if (onValueChange) {
      onValueChange(newValue);
    } else {
      setStateValue(newValue);
    }
  };

  const accordionValue = value !== undefined ? value : stateValue;

  return (
    <AccordionContext.Provider
      value={{
        value: accordionValue,
        onValueChange: handleValueChange,
        type,
        collapsible,
        mode,
      }}
    >
      <View className={cn(accordionClassNames.base, className)}>{children}</View>
    </AccordionContext.Provider>
  );
};

// AccordionItem component
interface AccordionItemProps {
  id: string;
  className?: string;
  children: React.ReactNode;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({ id, className = '', children }) => {
  const { value, onValueChange, type, collapsible, mode = 'light' } = useAccordion();
  const isDark = mode === 'dark';

  const isOpen = value.includes(id);

  const toggleItem = () => {
    if (type === 'single') {
      if (isOpen) {
        if (collapsible) {
          onValueChange([]);
        }
      } else {
        onValueChange([id]);
      }
    } else {
      if (isOpen) {
        onValueChange(value.filter(v => v !== id));
      } else {
        onValueChange([...value, id]);
      }
    }
  };

  return (
    <AccordionItemContext.Provider value={{ id, isOpen, toggleItem, mode }}>
      <View
        className={cn(
          accordionItemClassNames.base,
          isDark ? accordionItemClassNames.theme.dark : accordionItemClassNames.theme.light,
          className
        )}
      >
        {children}
      </View>
    </AccordionItemContext.Provider>
  );
};

// AccordionTrigger component
interface AccordionTriggerProps {
  className?: string;
  textClassName?: string;
  children: React.ReactNode;
}

export const AccordionTrigger: React.FC<AccordionTriggerProps> = ({
  className = '',
  textClassName = '',
  children,
}) => {
  const { isOpen, toggleItem, mode } = useAccordionItem();
  const isDark = mode === 'dark';

  const rotateAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isOpen ? 1 : 0,
      duration: animationConfigs.rotation.duration,
      easing: animationConfigs.rotation.easing,
      useNativeDriver: animationConfigs.rotation.useNativeDriver,
    }).start();
  }, [isOpen]);

  const rotation = rotateAnim.interpolate({
    inputRange: animationConfigs.rotation.inputRange,
    outputRange: animationConfigs.rotation.outputRange,
  });

  // Helper function to render trigger content
  const renderTriggerContent = (content: React.ReactNode): React.ReactNode => {
    if (typeof content === 'string' || typeof content === 'number') {
      return (
        <Text
          className={cn(
            accordionTriggerClassNames.text.base,
            isDark
              ? accordionTriggerClassNames.text.theme.dark
              : accordionTriggerClassNames.text.theme.light,
            textClassName
          )}
        >
          {content}
        </Text>
      );
    }

    if (React.isValidElement(content)) {
      const elementContent = content as React.ReactElement<any>;
      // If it's already a Text component or has no children, return as is
      if (
        (elementContent.type as any) === Text ||
        (elementContent.props && !elementContent.props.children)
      ) {
        return content;
      }

      // For other components that might contain text, we keep them as is
      // Most custom components should handle their own text wrapping
      return content;
    }

    if (Array.isArray(content)) {
      return content.map((item, index) => (
        <React.Fragment key={index}>{renderTriggerContent(item)}</React.Fragment>
      ));
    }

    return content;
  };

  return (
    <Pressable
      className={cn(accordionTriggerClassNames.base, className)}
      onPress={toggleItem}
      android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
    >
      {renderTriggerContent(children)}
      <Animated.View style={{ transform: [{ rotate: rotation }] }}>
        <ChevronDown
          size={16}
          color={
            isDark
              ? accordionTriggerClassNames.icon.color.dark
              : accordionTriggerClassNames.icon.color.light
          }
        />
      </Animated.View>
    </Pressable>
  );
};

// AccordionContent component
interface AccordionContentProps {
  className?: string;
  contentClassName?: string;
  textClassName?: string;
  children: React.ReactNode;
}

export const AccordionContent: React.FC<AccordionContentProps> = ({
  className = '',
  contentClassName = '',
  textClassName = '',
  children,
}) => {
  const { isOpen, mode } = useAccordionItem();
  const isDark = mode === 'dark';

  const heightAnim = useRef(new Animated.Value(0)).current;
  const [contentHeight, setContentHeight] = useState(0);

  // Helper function to ensure all text is wrapped in Text components
  const renderContent = (content: React.ReactNode): React.ReactNode => {
    if (typeof content === 'string' || typeof content === 'number') {
      return (
        <Text
          className={cn(
            accordionContentClassNames.text.base,
            isDark
              ? accordionContentClassNames.text.theme.dark
              : accordionContentClassNames.text.theme.light,
            textClassName
          )}
        >
          {content}
        </Text>
      );
    }

    if (React.isValidElement(content)) {
      const elementContent = content as React.ReactElement<any>;
      // If it's already a Text component or has no children, return as is
      if (
        (elementContent.type as any) === Text ||
        (elementContent.props && !elementContent.props.children)
      ) {
        return content;
      }

      // For other elements with children, recursively process their children
      if (elementContent.props && elementContent.props.children) {
        return React.cloneElement(
          elementContent,
          { ...elementContent.props },
          React.Children.map(
            elementContent.props.children,
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

  React.useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: isOpen ? 1 : 0,
      duration: animationConfigs.height.duration,
      easing: animationConfigs.height.easing,
      useNativeDriver: animationConfigs.height.useNativeDriver,
    }).start();
  }, [isOpen, contentHeight]);

  const animatedHeight = heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, contentHeight],
  });

  const animatedOpacity = heightAnim.interpolate({
    inputRange: animationConfigs.opacity.inputRange,
    outputRange: animationConfigs.opacity.outputRange,
  });

  const handleLayout = event => {
    const { height } = event.nativeEvent.layout;
    if (height > 0 && height !== contentHeight) {
      setContentHeight(height);
    }
  };

  // We use a simple hidden content renderer that measures its own height with onLayout
  if (!isOpen && contentHeight === 0) {
    return (
      <View style={{ height: 0, overflow: 'hidden' }}>
        <View onLayout={handleLayout}>
          <View className={cn(accordionContentClassNames.content.base, contentClassName)}>
            {renderContent(children)}
          </View>
        </View>
      </View>
    );
  }

  return (
    <Animated.View
      style={{
        height: animatedHeight,
        opacity: animatedOpacity,
        overflow: 'hidden',
      }}
      className={cn(accordionContentClassNames.base, className)}
    >
      <View
        className={cn(accordionContentClassNames.content.base, contentClassName)}
        onLayout={isOpen ? handleLayout : undefined}
      >
        {renderContent(children)}
      </View>
    </Animated.View>
  );
};
