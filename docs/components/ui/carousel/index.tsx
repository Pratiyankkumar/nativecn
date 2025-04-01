import React, { createContext, useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  ViewProps,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Pressable,
  Text,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { cn } from '../../../lib/utils';

import {
  carouselClassNames,
  carouselContentClassNames,
  carouselItemClassNames,
  carouselNavigationClassNames,
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

// Define types
type CarouselContextProps = {
  scrollRef: React.RefObject<ScrollView>;
  currentIndex: number;
  scrollTo: (index: number) => void;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  itemCount: number;
  viewportWidth: number;
  viewportHeight: number;
  orientation: 'horizontal' | 'vertical';
  handleScrollEnd: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  mode: 'light' | 'dark';
};

// Create context
const CarouselContext = createContext<CarouselContextProps | null>(null);

// Custom hook to use the carousel context
function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />');
  }

  return context;
}

// Carousel Props
interface CarouselProps extends ViewProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  loop?: boolean;
  itemCount?: number;
  mode?: 'light' | 'dark';
}

// Main Carousel component
const Carousel = ({
  orientation = 'horizontal',
  className,
  children,
  loop = false,
  itemCount: propItemCount,
  mode = 'light',
  ...props
}: CarouselProps) => {
  // References and state
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemWidth, setItemWidth] = useState(0);
  const [itemHeight, setItemHeight] = useState(0);
  const [itemCount, setItemCount] = useState(propItemCount || 0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(Dimensions.get('window').width);
  const [viewportHeight, setViewportHeight] = useState(Dimensions.get('window').height);

  // Update scroll capabilities
  useEffect(() => {
    setCanScrollPrev(currentIndex > 0 || loop);
    setCanScrollNext(currentIndex < itemCount - 1 || loop);
  }, [currentIndex, itemCount, loop]);

  // Set item count from props if provided
  useEffect(() => {
    if (propItemCount !== undefined) {
      setItemCount(propItemCount);
    }
  }, [propItemCount]);

  // Function to update item count from CarouselContent
  const updateItemCount = useCallback((count: number) => {
    setItemCount(count);
  }, []);

  // Handle layout changes
  const handleLayout = useCallback(
    (event: any) => {
      const { width, height } = event.nativeEvent.layout;
      setViewportWidth(width);
      setViewportHeight(height);
      setItemWidth(width);
      setItemHeight(orientation === 'vertical' ? height : height);
    },
    [orientation]
  );

  // Scroll to a specific index
  const scrollTo = useCallback(
    (index: number) => {
      if (itemCount === 0) return;

      // Handle out of bounds with loop option
      let targetIndex = index;
      if (index < 0) {
        targetIndex = loop ? itemCount - 1 : 0;
      } else if (index >= itemCount) {
        targetIndex = loop ? 0 : itemCount - 1;
      }

      const isHorizontal = orientation === 'horizontal';
      const offset = isHorizontal ? targetIndex * itemWidth : targetIndex * viewportHeight; // Use viewportHeight for vertical scrolling

      scrollRef.current?.scrollTo({
        x: isHorizontal ? offset : 0,
        y: isHorizontal ? 0 : offset,
        animated: true,
      });

      setCurrentIndex(targetIndex);
    },
    [itemCount, itemWidth, viewportHeight, orientation, loop]
  );

  // Scroll to previous item
  const scrollPrev = useCallback(() => {
    if (currentIndex > 0) {
      scrollTo(currentIndex - 1);
    } else if (loop) {
      scrollTo(itemCount - 1);
    }
  }, [currentIndex, itemCount, loop, scrollTo]);

  // Scroll to next item
  const scrollNext = useCallback(() => {
    if (currentIndex < itemCount - 1) {
      scrollTo(currentIndex + 1);
    } else if (loop) {
      scrollTo(0);
    }
  }, [currentIndex, itemCount, loop, scrollTo]);

  // Handle scroll end to update current index
  const handleScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const isHorizontal = orientation === 'horizontal';
      const contentOffset = isHorizontal
        ? event.nativeEvent.contentOffset.x
        : event.nativeEvent.contentOffset.y;

      const viewportSize = isHorizontal ? itemWidth : viewportHeight;
      if (viewportSize === 0) return;

      const newIndex = Math.round(contentOffset / viewportSize);
      if (newIndex >= 0 && newIndex < itemCount) {
        setCurrentIndex(newIndex);
      }
    },
    [orientation, itemWidth, viewportHeight, itemCount]
  );

  // Provide context values to children
  const contextValue: CarouselContextProps = {
    scrollRef,
    currentIndex,
    scrollTo,
    scrollPrev,
    scrollNext,
    canScrollPrev,
    canScrollNext,
    itemCount,
    viewportWidth,
    viewportHeight,
    orientation,
    handleScrollEnd,
    mode,
  };

  return (
    <CarouselContext.Provider value={contextValue}>
      <View
        className={cn(
          carouselClassNames.base,
          orientation === 'vertical' ? 'h-full' : '',
          className
        )}
        accessible
        accessibilityRole="none"
        accessibilityLabel="carousel"
        onLayout={handleLayout}
        {...props}
      >
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            const childType = child.type as any;
            const isCarouselContent =
              childType === CarouselContent || (childType && childType.name === 'CarouselContent');

            if (isCarouselContent) {
              return React.cloneElement(child as React.ReactElement<CarouselContentProps>, {
                onItemCountChange: updateItemCount,
              });
            }
          }
          return child;
        })}
      </View>
    </CarouselContext.Provider>
  );
};

// Carousel Content component
interface CarouselContentProps extends ViewProps {
  className?: string;
  onItemCountChange?: (count: number) => void;
}

const CarouselContent = ({
  className,
  children,
  onItemCountChange,
  ...props
}: CarouselContentProps) => {
  const carousel = useCarousel();
  const { scrollRef, orientation, handleScrollEnd } = carousel;

  // Count React Children
  useEffect(() => {
    if (!onItemCountChange) return;

    let count = React.Children.count(children);
    onItemCountChange(count);
  }, [children, onItemCountChange]);

  return (
    <View
      className={cn(
        carouselContentClassNames.base,
        orientation === 'vertical' ? 'h-[200px]' : '',
        orientation === 'vertical' ? carouselContentClassNames.vertical : ''
      )}
    >
      <ScrollView
        ref={scrollRef}
        horizontal={orientation === 'horizontal'}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        snapToAlignment="start"
        onMomentumScrollEnd={handleScrollEnd}
        className={cn(
          orientation === 'horizontal'
            ? carouselContentClassNames.horizontal
            : carouselContentClassNames.vertical_content,
          className
        )}
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: orientation === 'vertical' ? 'flex-start' : 'center',
          height: orientation === 'vertical' ? '100%' : undefined,
        }}
        {...props}
      >
        {children}
      </ScrollView>
    </View>
  );
};

// Carousel Item component
interface CarouselItemProps extends ViewProps {
  className?: string;
}

const CarouselItem = ({ className, children, ...props }: CarouselItemProps) => {
  const { orientation, viewportWidth, viewportHeight } = useCarousel();

  return (
    <View
      accessible
      accessibilityRole="none"
      className={cn(carouselItemClassNames.base, className)}
      style={{
        width: orientation === 'horizontal' ? viewportWidth : '100%',
        height: orientation === 'vertical' ? viewportHeight : 'auto',
        flex: orientation === 'vertical' ? 1 : undefined,
      }}
      {...props}
    >
      {children}
    </View>
  );
};

// Carousel Previous button
interface CarouselNavigationProps extends ViewProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const CarouselPrevious = ({
  className,
  variant = 'outline',
  size = 'icon',
  ...props
}: CarouselNavigationProps) => {
  const { orientation, scrollPrev, canScrollPrev, mode } = useCarousel();

  // Get icon color based on variant and mode
  const getIconColor = () => {
    if (variant === 'default') {
      return carouselNavigationClassNames.iconColor.default;
    }
    return carouselNavigationClassNames.iconColor[variant][mode];
  };

  return (
    <Pressable
      accessible
      accessibilityRole="button"
      accessibilityLabel="Previous slide"
      accessibilityHint="Go to previous slide"
      accessibilityState={{ disabled: !canScrollPrev }}
      className={cn(
        carouselNavigationClassNames.base,
        carouselNavigationClassNames.position.previous[orientation],
        carouselNavigationClassNames.variant[variant][mode],
        !canScrollPrev && carouselNavigationClassNames.disabled,
        className
      )}
      disabled={!canScrollPrev}
      onPress={scrollPrev}
      {...props}
    >
      <FeatherIcon
        name={orientation === 'vertical' ? 'chevron-up' : 'chevron-left'}
        size={16}
        color={getIconColor()}
      />
      <Text className="sr-only">Previous slide</Text>
    </Pressable>
  );
};

// Carousel Next button
const CarouselNext = ({
  className,
  variant = 'outline',
  size = 'icon',
  ...props
}: CarouselNavigationProps) => {
  const { orientation, scrollNext, canScrollNext, mode } = useCarousel();

  // Get icon color based on variant and mode
  const getIconColor = () => {
    if (variant === 'default') {
      return carouselNavigationClassNames.iconColor.default;
    }
    return carouselNavigationClassNames.iconColor[variant][mode];
  };

  return (
    <Pressable
      accessible
      accessibilityRole="button"
      accessibilityLabel="Next slide"
      accessibilityHint="Go to next slide"
      accessibilityState={{ disabled: !canScrollNext }}
      className={cn(
        carouselNavigationClassNames.base,
        carouselNavigationClassNames.position.next[orientation],
        carouselNavigationClassNames.variant[variant][mode],
        !canScrollNext && carouselNavigationClassNames.disabled,
        className
      )}
      disabled={!canScrollNext}
      onPress={scrollNext}
      {...props}
    >
      <FeatherIcon
        name={orientation === 'vertical' ? 'chevron-down' : 'chevron-right'}
        size={16}
        color={getIconColor()}
      />
      <Text className="sr-only">Next slide</Text>
    </Pressable>
  );
};

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, useCarousel };
