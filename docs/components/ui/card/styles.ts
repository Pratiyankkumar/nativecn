export const cardClassNames = {
  base: 'flex flex-col gap-6 rounded-xl border py-6 shadow-sm',
  light: {
    container: 'bg-card border-border',
    text: 'text-card-foreground',
  },
  dark: {
    container: 'bg-dark-card border-dark-border',
    text: 'text-dark-card-foreground',
  },
};

export const cardHeaderClassNames = {
  base: 'flex flex-col gap-1.5 px-6',
};

export const cardTitleClassNames = {
  base: 'font-semibold leading-none',
  light: 'text-foreground',
  dark: 'text-dark-foreground',
};

export const cardDescriptionClassNames = {
  base: 'text-sm',
  light: 'text-muted-foreground',
  dark: 'text-dark-muted-foreground',
};

export const cardContentClassNames = {
  base: 'px-6',
};

export const cardFooterClassNames = {
  base: 'flex flex-row items-center px-6',
};
