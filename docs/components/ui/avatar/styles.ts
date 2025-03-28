export const avatarClassNames = {
  base: 'relative shrink-0 overflow-hidden rounded-full',

  size: {
    sm: 'h-6 w-6', // 24px
    md: 'h-10 w-10', // 40px
    lg: 'h-16 w-16', // 64px
  },
};

export const avatarImageClassNames = {
  base: 'aspect-square h-full w-full absolute top-0 left-0 right-0 bottom-0',
};

export const avatarFallbackClassNames = {
  base: 'absolute inset-0 flex items-center justify-center rounded-full bg-muted',
  text: 'text-sm font-medium',
};
