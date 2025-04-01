export const carouselClassNames = {
  base: 'relative',
};

export const carouselContentClassNames = {
  base: 'overflow-hidden',
  vertical: 'h-full',
  horizontal: 'flex-row',
  vertical_content: 'flex-col',
};

export const carouselItemClassNames = {
  base: 'flex-shrink-0',
};

export const carouselNavigationClassNames = {
  base: 'absolute rounded-full w-8 h-8 flex items-center justify-center z-10',

  variant: {
    default: {
      light: 'bg-primary',
      dark: 'bg-dark-primary',
    },
    outline: {
      light: 'bg-card border border-border',
      dark: 'bg-dark-card border border-dark-border',
    },
    ghost: {
      light: 'bg-transparent',
      dark: 'bg-transparent',
    },
  },

  position: {
    previous: {
      horizontal: 'left-2 top-1/2 -translate-y-1/2',
      vertical: 'top-2 left-1/2 -translate-x-1/2',
    },
    next: {
      horizontal: 'right-2 top-1/2 -translate-y-1/2',
      vertical: 'bottom-2 left-1/2 -translate-x-1/2',
    },
  },

  disabled: 'opacity-50',

  iconColor: {
    default: '#fff',
    outline: {
      light: '#111827',
      dark: '#E5E7EB',
    },
    ghost: {
      light: '#111827',
      dark: '#E5E7EB',
    },
  },
};
