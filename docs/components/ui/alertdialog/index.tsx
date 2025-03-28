import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
  StyleSheet,
  LayoutChangeEvent,
} from 'react-native';
import { cn } from '../../../lib/utils';

// Import styles
import {
  alertDialogClassNames,
  alertDialogTriggerClassNames,
  alertDialogContentClassNames,
  alertDialogHeaderClassNames,
  alertDialogFooterClassNames,
  alertDialogTitleClassNames,
  alertDialogDescriptionClassNames,
  alertDialogActionClassNames,
  alertDialogCancelClassNames,
  animationConfigs,
} from './styles';

// Import Button component
import Button from '../button/index';

// Types
type AlertDialogContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  mode: 'light' | 'dark';
};

// Create context
const AlertDialogContext = createContext<AlertDialogContextValue | null>(null);

// Hook to use AlertDialog context
const useAlertDialog = () => {
  const context = useContext(AlertDialogContext);
  if (!context) {
    throw new Error('useAlertDialog must be used within an AlertDialog');
  }
  return context;
};

// Root AlertDialog component
interface AlertDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  mode?: 'light' | 'dark';
  children: React.ReactNode;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  open: controlledOpen,
  onOpenChange,
  mode = 'light',
  children,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = (newOpen: boolean) => {
    if (isControlled) {
      onOpenChange?.(newOpen);
    } else {
      setUncontrolledOpen(newOpen);
    }
  };

  return (
    <AlertDialogContext.Provider value={{ open, setOpen, mode }}>
      <View className={cn(alertDialogClassNames.base)}>{children}</View>
    </AlertDialogContext.Provider>
  );
};

// AlertDialogTrigger component
interface AlertDialogTriggerProps {
  className?: string;
  children: React.ReactNode;
  asChild?: boolean;
}

export const AlertDialogTrigger: React.FC<AlertDialogTriggerProps> = ({
  className = '',
  children,
  asChild = false,
}) => {
  const { setOpen } = useAlertDialog();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onPress: () => setOpen(true),
    });
  }

  return (
    <Pressable
      className={cn(alertDialogTriggerClassNames.base, className)}
      onPress={() => setOpen(true)}
    >
      {children}
    </Pressable>
  );
};

// AlertDialogContent component
interface AlertDialogContentProps {
  className?: string;
  children: React.ReactNode;
}

export const AlertDialogContent: React.FC<AlertDialogContentProps> = ({
  className = '',
  children,
}) => {
  const { open, setOpen, mode } = useAlertDialog();
  const isDark = mode === 'dark';

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // Single ready state to avoid race conditions
  const [isReady, setIsReady] = useState(false);
  const contentRef = useRef<View>(null);

  useEffect(() => {
    if (open) {
      // Start animations when dialog opens
      setIsReady(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: animationConfigs.fade.duration,
          useNativeDriver: animationConfigs.fade.useNativeDriver,
        }),
        Animated.timing(scaleAnim, {
          toValue: animationConfigs.scale.outputRange[1],
          duration: animationConfigs.scale.duration,
          useNativeDriver: animationConfigs.scale.useNativeDriver,
        }),
      ]).start();
    } else {
      // Reset the ready state when dialog closes
      setIsReady(false);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: animationConfigs.fade.duration,
          useNativeDriver: animationConfigs.fade.useNativeDriver,
        }),
        Animated.timing(scaleAnim, {
          toValue: animationConfigs.scale.outputRange[0],
          duration: animationConfigs.scale.duration,
          useNativeDriver: animationConfigs.scale.useNativeDriver,
        }),
      ]).start();
    }
  }, [open]);

  // Modified handleLayout function
  const handleLayout = (event: LayoutChangeEvent) => {
    // We still want to capture layout, but no longer conditional on animation
    if (!isReady && open) {
      setIsReady(true);
    }
  };

  if (!open) return null;

  return (
    <Modal transparent visible={open} animationType="none" onRequestClose={() => setOpen(false)}>
      {/* Background overlay */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            opacity: fadeAnim,
          },
        ]}
      >
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>
      </Animated.View>

      {/* Content wrapper with flexbox centering */}
      <View className="flex-1 justify-center items-center p-4">
        {/* Dialog content with animation */}
        <Animated.View
          ref={contentRef}
          onLayout={handleLayout}
          className={cn(
            alertDialogContentClassNames.base,
            isDark
              ? alertDialogContentClassNames.theme.dark
              : alertDialogContentClassNames.theme.light,
            className
          )}
          style={{
            width: '100%',
            maxWidth: 450,
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
            backgroundColor: isDark ? '#1c1c1c' : '#ffffff',
            borderWidth: 1,
            borderColor: isDark ? '#2d2d2d' : '#e4e4e7',
            borderRadius: 8,
            padding: 24,
            // Use StyleSheet for consistent rendering
            ...StyleSheet.flatten({
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }),
          }}
        >
          <View className="gap-4 w-full">{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
};

// AlertDialogHeader component
interface AlertDialogHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export const AlertDialogHeader: React.FC<AlertDialogHeaderProps> = ({
  className = '',
  children,
}) => {
  return <View className={cn(alertDialogHeaderClassNames.base, className)}>{children}</View>;
};

// AlertDialogFooter component
interface AlertDialogFooterProps {
  className?: string;
  children: React.ReactNode;
}

export const AlertDialogFooter: React.FC<AlertDialogFooterProps> = ({
  className = '',
  children,
}) => {
  // For small screens, column-reverse like in original component
  // For larger screens, we'll use row and justify-end
  const { width } = Dimensions.get('window');
  const isSmallScreen = true; // Equivalent to tailwind sm breakpoint

  return (
    <View
      className={cn(
        isSmallScreen
          ? alertDialogFooterClassNames.smallScreen
          : alertDialogFooterClassNames.largeScreen,
        className
      )}
    >
      {children}
    </View>
  );
};

// AlertDialogTitle component
interface AlertDialogTitleProps {
  className?: string;
  children: React.ReactNode;
}

export const AlertDialogTitle: React.FC<AlertDialogTitleProps> = ({ className = '', children }) => {
  const { mode } = useAlertDialog();
  const isDark = mode === 'dark';

  return (
    <Text
      className={cn(
        alertDialogTitleClassNames.base,
        isDark ? alertDialogTitleClassNames.theme.dark : alertDialogTitleClassNames.theme.light,
        className
      )}
    >
      {children}
    </Text>
  );
};

// AlertDialogDescription component
interface AlertDialogDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

export const AlertDialogDescription: React.FC<AlertDialogDescriptionProps> = ({
  className = '',
  children,
}) => {
  const { mode } = useAlertDialog();
  const isDark = mode === 'dark';

  // Helper function to ensure text content is wrapped in Text components
  const renderContent = (content: React.ReactNode): React.ReactNode => {
    if (typeof content === 'string' || typeof content === 'number') {
      return (
        <Text
          className={cn(
            alertDialogDescriptionClassNames.base,
            isDark
              ? alertDialogDescriptionClassNames.theme.dark
              : alertDialogDescriptionClassNames.theme.light,
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
      if ((content.type as any)?.name === 'Text' || (elementProps && !elementProps.children)) {
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
    <View className={cn(alertDialogDescriptionClassNames.container, className)}>
      {renderContent(children)}
    </View>
  );
};

// AlertDialogAction component
interface AlertDialogActionProps {
  className?: string;
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export const AlertDialogAction: React.FC<AlertDialogActionProps> = ({
  className = '',
  children,
  onPress,
  variant = 'default',
}) => {
  const { setOpen, mode } = useAlertDialog();

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
    setOpen(false);
  };

  return (
    <Button
      variant={variant}
      mode={mode}
      className={cn(alertDialogActionClassNames.base, className)}
      onPress={handlePress}
    >
      {children}
    </Button>
  );
};

// AlertDialogCancel component
interface AlertDialogCancelProps {
  className?: string;
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export const AlertDialogCancel: React.FC<AlertDialogCancelProps> = ({
  className = '',
  children,
  onPress,
  variant = 'outline',
}) => {
  const { setOpen, mode } = useAlertDialog();
  const { width } = Dimensions.get('window');
  const isSmallScreen = true;

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
    setOpen(false);
  };

  return (
    <Button
      variant={variant || 'outline'}
      mode={mode}
      className={cn(
        isSmallScreen ? alertDialogCancelClassNames.smallScreen : '',
        alertDialogCancelClassNames.base,
        className
      )}
      onPress={handlePress}
    >
      {children}
    </Button>
  );
};
