import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../../lib/utils';
import { avatarClassNames, avatarImageClassNames, avatarFallbackClassNames } from './styles';

/**
 * Avatar component that displays a user avatar with fallback support
 */
interface AvatarProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  size?: 'sm' | 'md' | 'lg'; // predefined sizes
  mode?: 'light' | 'dark'; // theme mode
}

const Avatar: React.FC<AvatarProps> = ({
  className = '',
  children,
  style,
  size = 'md',
  mode = 'light',
}) => {
  // Process children to ensure text is wrapped
  const renderChildren = () => {
    if (children == null) {
      return null;
    }

    // If children is a string, wrap it in a span
    if (typeof children === 'string') {
      return <span>{children}</span>;
    }

    // If children is a number, convert to string and wrap in span
    if (typeof children === 'number') {
      return <span>{children.toString()}</span>;
    }

    // If children is a boolean, convert to string and wrap in span
    if (typeof children === 'boolean') {
      return <span>{children.toString()}</span>;
    }

    // If children is an array, process each item
    if (Array.isArray(children)) {
      return React.Children.map(children, child => {
        if (typeof child === 'string' || typeof child === 'number' || typeof child === 'boolean') {
          return <span>{String(child)}</span>;
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
    <div
      style={style}
      className={cn(
        avatarClassNames.base,
        avatarClassNames.size[size],
        mode === 'dark' ? 'dark' : '',
        className
      )}
    >
      {safeRender()}
    </div>
  );
};

/**
 * AvatarImage component that displays the avatar image
 */
interface AvatarImageProps {
  className?: string;
  source: string;
  alt?: string;
  onLoadingStatusChange?: (isLoading: boolean) => void;
  onError?: () => void;
  mode?: 'light' | 'dark'; // theme mode
}

const AvatarImage: React.FC<AvatarImageProps> = ({
  className = '',
  source,
  alt,
  onLoadingStatusChange,
  onError,
  mode = 'light',
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

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
    // Check if this is a genuine source change
    const isSourceChange = initialLoadRef.current || source !== sourceRef.current;

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
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={cn(avatarImageClassNames.base, mode === 'dark' ? 'dark' : '', className)}
      src={source}
      alt={alt}
      onError={handleError}
      onLoad={handleLoad}
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
  hasImageError?: boolean;
  standalone?: boolean;
  mode?: 'light' | 'dark'; // theme mode
}

const AvatarFallback: React.FC<AvatarFallbackProps> = ({
  className = '',
  delayMs = 0,
  children,
  isImageLoading = false,
  hasImageError = false,
  standalone = false,
  mode = 'light',
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

    // If children is a string, wrap it in a span
    if (typeof children === 'string') {
      return <span className={avatarFallbackClassNames.text}>{children}</span>;
    }

    // If children is a number, convert to string and wrap in span
    if (typeof children === 'number') {
      return <span className={avatarFallbackClassNames.text}>{children.toString()}</span>;
    }

    // If children is a boolean, convert to string and wrap in span
    if (typeof children === 'boolean') {
      return <span className={avatarFallbackClassNames.text}>{children.toString()}</span>;
    }

    // If children is an array, process each child
    if (Array.isArray(children)) {
      return React.Children.map(children, child => {
        if (typeof child === 'string' || typeof child === 'number' || typeof child === 'boolean') {
          return <span className={avatarFallbackClassNames.text}>{String(child)}</span>;
        }
        return child;
      });
    }

    // If it's already a valid React element, return it
    if (React.isValidElement(children)) {
      return children;
    }

    // For any other case, wrap it in a span to be safe
    return <span className={avatarFallbackClassNames.text}>{String(children)}</span>;
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

  return (
    <div className={cn(avatarFallbackClassNames.base, mode === 'dark' ? 'dark' : '', className)}>
      {safeRender()}
    </div>
  );
};

export { Avatar, AvatarImage, AvatarFallback };
export default Avatar;
