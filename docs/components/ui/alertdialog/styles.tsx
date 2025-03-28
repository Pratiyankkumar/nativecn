// AlertDialog styling
export const alertDialogClassNames = {
  base: '',
};

// AlertDialogTrigger styling
export const alertDialogTriggerClassNames = {
  base: '',
};

// AlertDialogContent styling
export const alertDialogContentClassNames = {
  base: 'border rounded-lg p-6 overflow-hidden',
  theme: {
    light: 'bg-background border-border',
    dark: 'bg-dark-background border-dark-border',
  },
};

// AlertDialogHeader styling
export const alertDialogHeaderClassNames = {
  base: 'flex-col space-y-2 items-center',
};

// AlertDialogFooter styling
export const alertDialogFooterClassNames = {
  base: '',
  smallScreen: 'flex-col-reverse',
  largeScreen: 'flex-row justify-end space-x-2',
};

// AlertDialogTitle styling
export const alertDialogTitleClassNames = {
  base: 'text-lg font-semibold text-center',
  theme: {
    light: 'text-foreground',
    dark: 'text-dark-foreground',
  },
};

// AlertDialogDescription styling
export const alertDialogDescriptionClassNames = {
  base: 'text-sm text-center',
  theme: {
    light: 'text-muted-foreground',
    dark: 'text-dark-muted-foreground',
  },
  container: '',
};

// AlertDialogAction styling
export const alertDialogActionClassNames = {
  base: '',
};

// AlertDialogCancel styling
export const alertDialogCancelClassNames = {
  base: '',
  smallScreen: 'mt-2',
};

// Animation configurations
export const animationConfigs = {
  fade: {
    duration: 200,
    useNativeDriver: true,
    inputRange: [0, 1],
    outputRange: [0, 1],
  },
  scale: {
    duration: 200,
    useNativeDriver: true,
    inputRange: [0, 1],
    outputRange: [0.95, 1],
  },
};
