import React, { useState } from 'react';
import { cn } from '../../../lib/utils';
import { buttonClassNames, textClassNames, iconColors } from './styles';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  className?: string;
  textClassName?: string;
  mode?: 'light' | 'dark';
  children: React.ReactNode;
  asChild?: boolean;
}

// Type for icon elements
interface IconElement extends React.ReactElement {
  props: {
    svg?: boolean;
    color?: string;
    className?: string;
    [key: string]: any;
  };
  type: string | React.JSXElementConstructor<any>;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'default',
      size = 'default',
      disabled = false,
      className = '',
      textClassName = '',
      mode = 'light',
      ...props
    },
    ref
  ) => {
    const [isPressed, setIsPressed] = useState(false);

    const containerClasses = cn(
      buttonClassNames.base,
      buttonClassNames[`size_${size}`],
      mode && variant && buttonClassNames[`${mode}_variant_${variant}`]
        ? buttonClassNames[`${mode}_variant_${variant}`]
        : '',
      isPressed && buttonClassNames.pressed && variant && buttonClassNames.pressed[variant]
        ? buttonClassNames.pressed[variant]
        : '',
      disabled && buttonClassNames.disabled,
      className
    );

    const textClasses = cn(
      textClassNames.base,
      textClassNames.size[size],
      mode && variant && textClassNames[mode] && textClassNames[mode][variant]
        ? textClassNames[mode][variant]
        : '',
      textClassName
    );

    const isIconButton = size === 'icon';

    return (
      <button
        ref={ref}
        {...props}
        disabled={disabled}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        className={containerClasses}
        style={isPressed && !buttonClassNames.pressed[variant] ? { opacity: 0.95 } : undefined}
      >
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            const elementChild = child as IconElement;

            if (elementChild.type === 'svg' || elementChild.props.svg) {
              return React.cloneElement(elementChild, {
                ...elementChild.props,
                size: isIconButton ? 20 : 16,
                color:
                  elementChild.props.color ||
                  (mode && variant && iconColors[mode] && iconColors[mode][variant]
                    ? iconColors[mode][variant]
                    : '#000000'),
                className: cn(
                  isIconButton ? 'w-5 h-5' : 'w-4 h-4 shrink-0',
                  elementChild.props.className
                ),
              });
            }
          }

          if (typeof child === 'string' || typeof child === 'number') {
            return <span className={textClasses}>{child}</span>;
          }

          return child;
        })}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
