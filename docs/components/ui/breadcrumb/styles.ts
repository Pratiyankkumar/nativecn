export const breadcrumbClassNames = {
  base: '',
};

export const breadcrumbListClassNames = {
  base: 'flex-row flex-wrap items-center gap-1.5 sm:gap-2.5',
  light: 'text-muted-foreground',
  dark: 'text-dark-muted-foreground',
};

export const breadcrumbItemClassNames = {
  base: 'flex-row items-center gap-1.5',
};

export const breadcrumbLinkClassNames = {
  text: {
    base: 'text-sm',
    light: {
      default: 'text-muted-foreground',
      pressed: 'text-foreground',
    },
    dark: {
      default: 'text-dark-muted-foreground',
      pressed: 'text-dark-foreground',
    },
  },
};

export const breadcrumbPageClassNames = {
  base: 'text-sm font-normal',
  light: 'text-foreground',
  dark: 'text-dark-foreground',
};

export const breadcrumbSeparatorClassNames = {
  base: '',
  iconColor: {
    light: '#6B7280',
    dark: '#6B7280',
  },
};

export const breadcrumbEllipsisClassNames = {
  base: 'items-center justify-center w-9 h-9',
  iconColor: {
    light: '#6B7280',
    dark: '#6B7280',
  },
};
