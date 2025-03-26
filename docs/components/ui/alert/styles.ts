// Alert component styles
export const alertClassNames = {
  base: 'w-full rounded-lg border p-4',
  theme: {
    light: {
      default: 'bg-background border-border text-foreground',
      destructive: 'border-destructive text-destructive',
    },
    dark: {
      default: 'bg-dark-background border-dark-border text-dark-foreground',
      destructive: 'border-dark-destructive text-dark-destructive',
    },
  },
};

// AlertTitle component styles
export const alertTitleClassNames = {
  base: 'mb-1 font-medium',
  theme: {
    light: 'text-foreground',
    dark: 'text-dark-foreground',
  },
};

// AlertDescription component styles
export const alertDescriptionClassNames = {
  base: 'text-sm',
  container: '',
  theme: {
    light: 'text-foreground',
    dark: 'text-dark-foreground',
  },
};

// Icon colors
export const iconColors = {
  light: {
    default: '#000000', // foreground
    destructive: '#dc2626', // destructive
  },
  dark: {
    default: '#ffffff', // dark-foreground
    destructive: '#ef4444', // dark-destructive
  },
};
