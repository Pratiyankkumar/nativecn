// AlertDialog styling
export const alertDialogClassNames = {
  base: 'relative',
};

// AlertDialogTrigger styling
export const alertDialogTriggerClassNames = {
  base: '',
};

// AlertDialogContent styling
export const alertDialogContentClassNames = {
  base: 'relative border rounded-lg p-6 shadow-lg',
  theme: {
    light: 'bg-white border-gray-200',
    dark: 'bg-gray-900 border-gray-700',
  },
};

// AlertDialogHeader styling
export const alertDialogHeaderClassNames = {
  base: 'flex flex-col space-y-2 text-center sm:text-left',
};

// AlertDialogFooter styling
export const alertDialogFooterClassNames = {
  base: 'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
};

// AlertDialogTitle styling
export const alertDialogTitleClassNames = {
  base: 'text-lg font-semibold leading-none tracking-tight',
  theme: {
    light: 'text-gray-900',
    dark: 'text-gray-50',
  },
};

// AlertDialogDescription styling
export const alertDialogDescriptionClassNames = {
  base: 'text-sm',
  theme: {
    light: 'text-gray-500',
    dark: 'text-gray-400',
  },
  container: 'mt-2',
};

// AlertDialogAction styling
export const alertDialogActionClassNames = {
  base: 'mt-2 sm:mt-0',
};

// AlertDialogCancel styling
export const alertDialogCancelClassNames = {
  base: 'mt-2 sm:mt-0',
};
