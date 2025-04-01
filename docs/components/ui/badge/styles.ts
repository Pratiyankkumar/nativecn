export const badgeClassNames = {
  base: 'inline-flex items-center rounded-full px-2.5 py-0.5 border',

  light_variant_default: 'border-transparent bg-primary',
  light_variant_secondary: 'border-transparent bg-secondary',
  light_variant_destructive: 'border-transparent bg-destructive',
  light_variant_outline: 'border-border',

  dark_variant_default: 'border-transparent bg-dark-primary',
  dark_variant_secondary: 'border-transparent bg-dark-secondary',
  dark_variant_destructive: 'border-transparent bg-dark-destructive',
  dark_variant_outline: 'border-dark-border',

  pressed: {
    default: 'opacity-80',
    secondary: 'opacity-80',
    destructive: 'opacity-80',
    outline: 'opacity-80',
  },
};

export const textClassNames = {
  base: 'text-xs font-semibold',

  light: {
    default: 'text-primary-foreground',
    secondary: 'text-secondary-foreground',
    destructive: 'text-white',
    outline: 'text-foreground',
  },

  dark: {
    default: 'text-dark-primary-foreground',
    secondary: 'text-dark-secondary-foreground',
    destructive: 'text-white',
    outline: 'text-dark-foreground',
  },
};
