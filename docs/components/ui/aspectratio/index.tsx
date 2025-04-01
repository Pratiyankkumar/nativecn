import React, { useState } from 'react';
import { View, LayoutChangeEvent } from 'react-native';
import { cn } from '../../../lib/utils';

// Import styles
import { aspectRatioClassNames } from './styles';

// Types
interface AspectRatioProps {
  ratio?: number;
  className?: string;
  children: React.ReactNode;
}

// AspectRatio component
export const AspectRatio: React.FC<AspectRatioProps> = ({
  ratio = 1,
  className = '',
  children,
}) => {
  const [width, setWidth] = useState<number>(0);
  const height = width / ratio;

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width: newWidth } = event.nativeEvent.layout;
    setWidth(newWidth);
  };

  return (
    <View
      className={cn(aspectRatioClassNames.base, className)}
      onLayout={handleLayout}
      style={{
        height: height > 0 ? height : undefined,
      }}
    >
      <View className={aspectRatioClassNames.content}>{children}</View>
    </View>
  );
};
