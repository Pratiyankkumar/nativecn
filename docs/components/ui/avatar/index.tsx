import React, { useState, useEffect, useRef } from 'react';
import { View, Image, ImageSourcePropType, Text, StyleProp, ViewStyle } from 'react-native';

import { cn } from '../../../lib/utils';
import { avatarClassNames, avatarImageClassNames, avatarFallbackClassNames } from './styles';

/**
 * Avatar component that displays a user avatar with fallback support
 */
interface AvatarProps {
  className?: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  size?: 'sm' | 'md' | 'lg'; // predefined sizes
}

const Avatar: React.FC<AvatarProps> = ({ className = '', children, style, size = 'md' }) => {
  // Process children to ensure text is wrapped
  const renderChildren = () => {
    if (children == null) {
      return null;
    }

    // If children is a string, wrap it in a Text component
    if (typeof children === 'string') {
      return <Text>{children}</Text>;
    }

    // If children is a number, convert to string and wrap in Text
    if (typeof children === 'number') {
      return <Text>{children.toString()}</Text>;
    }

    // If children is a boolean, convert to string and wrap in Text
    if (typeof children === 'boolean') {
      return <Text>{children.toString()}</Text>;
    }

    // If children is an array, process each item
    if (Array.isArray(children)) {
      return React.Children.map(children, child => {
        if (typeof child === 'string' || typeof child === 'number' || typeof child === 'boolean') {
          return <Text>{String(child)}</Text>;
        }
        return child;
      });
    }

    // Otherwise, return as is
    return children;
  };

  // Safe rendering function
  const safeRender = () => {
    try {
      return renderChildren();
    } catch (error) {
      console.error('Error rendering Avatar children:', error);
      return null;
    }
  };

  return (
    <View
      style={style}
      className={cn(avatarClassNames.base, avatarClassNames.size[size], className)}
    >
      {safeRender()}
    </View>
  );
};

/**
 * AvatarImage component that displays the avatar image
 */
interface AvatarImageProps {
  className?: string;
  source: ImageSourcePropType;
  alt?: string;
  onLoadingStatusChange?: (isLoading: boolean) => void;
  onError?: () => void;
}

const AvatarImage: React.FC<AvatarImageProps> = ({
  className = '',
  source,
  alt,
  onLoadingStatusChange,
  onError,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Provide better source debugging
  const getSourceInfo = (src: ImageSourcePropType) => {
    if (typeof src === 'number') {
      return `Local image ID: ${src}`;
    } else if (typeof src === 'object' && src !== null) {
      if ('uri' in src && typeof src.uri === 'string') {
        return src.uri;
      }
      return 'Object source without URI';
    }
    return 'Unknown source type';
  };

  // Fix infinite loop by using a ref to track changes
  const initialLoadRef = React.useRef(true);
  const sourceRef = React.useRef(source);

  // Clean up when component unmounts
  useEffect(() => {
    // Set initial loading state
    if (onLoadingStatusChange && initialLoadRef.current) {
      onLoadingStatusChange(true);
    }
  }, []);

  // Only reset loading state on mount and when source genuinely changes
  useEffect(() => {
    // Check if this is a genuine source change, not just a re-render
    let isSourceChange = initialLoadRef.current;

    if (!isSourceChange && typeof source === 'object' && typeof sourceRef.current === 'object') {
      // For URI sources, compare the URI strings
      const oldUri = 'uri' in sourceRef.current ? sourceRef.current.uri : '';
      const newUri = 'uri' in source ? source.uri : '';
      isSourceChange = oldUri !== newUri;
    } else if (!isSourceChange) {
      // For other types, just do a reference check
      isSourceChange = source !== sourceRef.current;
    }

    if (isSourceChange) {
      // Reset component state
      setIsLoading(true);
      setHasError(false);
      setImageLoaded(false);

      // Notify loading status change
      if (onLoadingStatusChange) {
        onLoadingStatusChange(true);
      }

      // Update the source ref
      sourceRef.current = source;
      initialLoadRef.current = false;
    }
    // Only depend on source
  }, [source]);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    setImageLoaded(false);

    if (onLoadingStatusChange) {
      setTimeout(() => onLoadingStatusChange(false), 0);
    }

    if (onError) {
      setTimeout(() => onError(), 0);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
    setImageLoaded(true);

    if (onLoadingStatusChange) {
      setTimeout(() => onLoadingStatusChange(false), 0);
    }
  };

  if (hasError && !imageLoaded) {
    return null;
  }

  return (
    <Image
      className={cn(avatarImageClassNames.base, className)}
      source={source}
      accessibilityLabel={alt}
      onError={handleError}
      onLoad={handleLoad}
      resizeMode="cover"
    />
  );
};

/**
 * AvatarFallback component that is displayed when the avatar image fails to load
 */
interface AvatarFallbackProps {
  className?: string;
  delayMs?: number;
  children?: React.ReactNode;
  isImageLoading?: boolean;
  hasImageError?: boolean; // New prop to track image errors
  standalone?: boolean; // New prop to indicate this fallback is used without an image
}

const AvatarFallback: React.FC<AvatarFallbackProps> = ({
  className = '',
  delayMs = 0,
  children,
  isImageLoading = false,
  hasImageError = false,
  standalone = false, // Default to false
}) => {
  const [shouldShow, setShouldShow] = useState(delayMs === 0);
  const isLoadingRef = useRef(isImageLoading);

  // When isImageLoading changes, update our ref
  useEffect(() => {
    isLoadingRef.current = isImageLoading;
  }, [isImageLoading]);

  React.useEffect(() => {
    if (delayMs > 0) {
      const timer = setTimeout(() => {
        setShouldShow(true);
      }, delayMs);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [delayMs]);

  // We should show the fallback when:
  // 1. We're past the delay period AND
  // 2. Either:
  //    a. This is a standalone fallback (no image component) OR
  //    b. The image is still loading OR
  //    c. There was an error loading the image
  const shouldDisplayFallback = shouldShow && (standalone || isImageLoading || hasImageError);

  if (!shouldDisplayFallback) {
    return null;
  }

  // Process children to ensure text is wrapped
  const renderContent = () => {
    // If children is null or undefined, return null
    if (children == null) {
      return null;
    }

    // If children is a string, wrap it in a Text component
    if (typeof children === 'string') {
      return <Text className={avatarFallbackClassNames.text}>{children}</Text>;
    }

    // If children is a number, convert to string and wrap in Text
    if (typeof children === 'number') {
      return <Text className={avatarFallbackClassNames.text}>{children.toString()}</Text>;
    }

    // If children is a boolean, convert to string and wrap in Text
    if (typeof children === 'boolean') {
      return <Text className={avatarFallbackClassNames.text}>{children.toString()}</Text>;
    }

    // If children is an array, process each child
    if (Array.isArray(children)) {
      return React.Children.map(children, child => {
        if (typeof child === 'string' || typeof child === 'number' || typeof child === 'boolean') {
          return <Text className={avatarFallbackClassNames.text}>{String(child)}</Text>;
        }
        return child;
      });
    }

    // If it's already a valid React element, return it
    if (React.isValidElement(children)) {
      return children;
    }

    // For any other case, wrap it in a Text component to be safe
    return <Text className={avatarFallbackClassNames.text}>{String(children)}</Text>;
  };

  // Safe rendering function
  const safeRender = () => {
    try {
      return renderContent();
    } catch (error) {
      console.error('Error rendering AvatarFallback children:', error);
      return null;
    }
  };

  return <View className={cn(avatarFallbackClassNames.base, className)}>{safeRender()}</View>;
};

export { Avatar, AvatarImage, AvatarFallback };
export default Avatar;
