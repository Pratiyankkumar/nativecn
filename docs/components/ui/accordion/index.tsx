'use client';

import React, { createContext, useContext, useRef, useState } from 'react';
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

// Create contexts with default values
const AccordionContext = createContext<AccordionContextValue | null>(null);
const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

// Hook to use Accordion context with safe fallbacks
const useAccordion = () => {
  const context = useContext(AccordionContext);
  // Provide fallback values if context is not available
  if (!context) {
    return {
      value: [],
      onValueChange: () => {},
      type: 'single' as const,
      collapsible: false,
      mode: 'light' as const,
    };
  }
  return context;
};

// Hook to use AccordionItem context with safe fallbacks
const useAccordionItem = () => {
  const context = useContext(AccordionItemContext);
  // Provide fallback values if context is not available
  if (!context) {
    return {
      id: '',
      isOpen: false,
      toggleItem: () => {},
      mode: 'light' as const,
    };
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
  const thickness = Math.max(1.5, Math.floor((size || 16) / 14));
  const lineLength = (size || 16) * 0.35;
  const angle = 35; // degrees for proper chevron appearance

  return (
    <div
      className={cn('flex items-center justify-center', className || '')}
      style={{ width: size || 16, height: size || 16 }}
    >
      <div
        style={{
          width: size || 16,
          height: (size || 16) * 0.5,
          position: 'relative',
        }}
        className="flex justify-center items-center"
      >
        {/* Left side of chevron */}
        <div
          style={{
            position: 'absolute',
            width: lineLength,
            height: thickness,
            backgroundColor: color || '#000000',
            borderRadius: thickness / 2,
            transform: `translateX(${-lineLength * 0.3}px) rotate(${angle}deg)`,
          }}
        />
        {/* Right side of chevron */}
        <div
          style={{
            position: 'absolute',
            width: lineLength,
            height: thickness,
            backgroundColor: color || '#000000',
            borderRadius: thickness / 2,
            transform: `translateX(${lineLength * 0.3}px) rotate(-${angle}deg)`,
          }}
        />
      </div>
    </div>
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
  const [stateValue, setStateValue] = useState<string[]>(defaultValue || []);

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
        type: type || 'single',
        collapsible: collapsible || false,
        mode: mode || 'light',
      }}
    >
      <div className={cn(accordionClassNames?.base || '', className || '')}>{children}</div>
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
  const {
    value = [],
    onValueChange = () => {},
    type = 'single',
    collapsible = false,
    mode = 'light',
  } = useAccordion();
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
      <div
        className={cn(
          accordionItemClassNames?.base || '',
          isDark
            ? accordionItemClassNames?.theme?.dark || ''
            : accordionItemClassNames?.theme?.light || '',
          className || ''
        )}
      >
        {children}
      </div>
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
  const { isOpen = false, toggleItem = () => {}, mode = 'light' } = useAccordionItem();
  const isDark = mode === 'dark';

  // Helper function to render trigger content
  const renderTriggerContent = (content: React.ReactNode): React.ReactNode => {
    if (typeof content === 'string' || typeof content === 'number') {
      return (
        <span
          className={cn(
            accordionTriggerClassNames?.text?.base || '',
            isDark
              ? accordionTriggerClassNames?.text?.theme?.dark || ''
              : accordionTriggerClassNames?.text?.theme?.light || '',
            textClassName || ''
          )}
        >
          {content}
        </span>
      );
    }

    if (React.isValidElement(content)) {
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
    <button
      className={cn(
        accordionTriggerClassNames?.base || '',
        'flex items-center justify-between w-full',
        className || ''
      )}
      onClick={toggleItem}
      type="button"
    >
      {renderTriggerContent(children)}
      <div
        className={cn(
          'transform transition-transform duration-200',
          isOpen ? 'rotate-180' : 'rotate-0'
        )}
      >
        <ChevronDown
          size={16}
          color={
            isDark && accordionTriggerClassNames?.icon?.color
              ? accordionTriggerClassNames?.icon?.color?.dark || '#ffffff'
              : accordionTriggerClassNames?.icon?.color?.light || '#000000'
          }
        />
      </div>
    </button>
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
  const { isOpen = false, mode = 'light' } = useAccordionItem();
  const isDark = mode === 'dark';

  // Helper function to ensure all text is wrapped in span elements
  const renderContent = (content: React.ReactNode): React.ReactNode => {
    if (typeof content === 'string' || typeof content === 'number') {
      return (
        <span
          className={cn(
            accordionContentClassNames?.text?.base || '',
            isDark
              ? accordionContentClassNames?.text?.theme?.dark || ''
              : accordionContentClassNames?.text?.theme?.light || '',
            textClassName || ''
          )}
        >
          {content}
        </span>
      );
    }

    if (React.isValidElement(content)) {
      const elementContent = content as React.ReactElement<any>;
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

  return (
    <div
      className={cn(
        accordionContentClassNames?.base || '',
        'transition-all duration-200',
        isOpen ? 'h-auto opacity-100' : 'h-0 opacity-0',
        'overflow-hidden',
        className || ''
      )}
    >
      <div className={cn(accordionContentClassNames?.content?.base || '', contentClassName || '')}>
        {renderContent(children)}
      </div>
    </div>
  );
};
