import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { cn } from '../../../lib/utils';

// Import styles
import {
  alertDialogClassNames,
  alertDialogTriggerClassNames,
  alertDialogContentClassNames,
  alertDialogHeaderClassNames,
  alertDialogFooterClassNames,
  alertDialogTitleClassNames,
  alertDialogDescriptionClassNames,
  alertDialogActionClassNames,
  alertDialogCancelClassNames,
} from './styles';

// Import Button component
import Button from '../button/index';

// Types
type AlertDialogContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  mode: 'light' | 'dark';
};

// Create context
const AlertDialogContext = createContext<AlertDialogContextValue | null>(null);

// Hook to use AlertDialog context
const useAlertDialog = () => {
  const context = useContext(AlertDialogContext);
  if (!context) {
    throw new Error('useAlertDialog must be used within an AlertDialog');
  }
  return context;
};

// Root AlertDialog component
interface AlertDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  mode?: 'light' | 'dark';
  children: React.ReactNode;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  open: controlledOpen,
  onOpenChange,
  mode = 'light',
  children,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = (newOpen: boolean) => {
    if (isControlled) {
      onOpenChange?.(newOpen);
    } else {
      setUncontrolledOpen(newOpen);
    }
  };

  return (
    <AlertDialogContext.Provider value={{ open, setOpen, mode }}>
      <div className={cn(alertDialogClassNames.base)}>{children}</div>
    </AlertDialogContext.Provider>
  );
};

// AlertDialogTrigger component
interface AlertDialogTriggerProps {
  className?: string;
  children: React.ReactNode;
  asChild?: boolean;
}

export const AlertDialogTrigger: React.FC<AlertDialogTriggerProps> = ({
  className = '',
  children,
  asChild = false,
}) => {
  const { setOpen, mode } = useAlertDialog();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: () => setOpen(true),
    });
  }

  return (
    <Button
      variant="default"
      mode={mode}
      className={cn(alertDialogTriggerClassNames.base, className)}
      onClick={() => setOpen(true)}
    >
      {children}
    </Button>
  );
};

// AlertDialogContent component
interface AlertDialogContentProps {
  className?: string;
  children: React.ReactNode;
}

export const AlertDialogContent: React.FC<AlertDialogContentProps> = ({
  className = '',
  children,
}) => {
  const { open, setOpen, mode } = useAlertDialog();
  const isDark = mode === 'dark';
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80">
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div
          ref={contentRef}
          className={cn(
            alertDialogContentClassNames.base,
            isDark
              ? alertDialogContentClassNames.theme.dark
              : alertDialogContentClassNames.theme.light,
            'w-full max-w-md transform rounded-lg shadow-xl transition-all',
            className
          )}
        >
          <div className="gap-4 w-full">{children}</div>
        </div>
      </div>
    </div>
  );
};

// AlertDialogHeader component
interface AlertDialogHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export const AlertDialogHeader: React.FC<AlertDialogHeaderProps> = ({
  className = '',
  children,
}) => {
  return <div className={cn(alertDialogHeaderClassNames.base, className)}>{children}</div>;
};

// AlertDialogFooter component
interface AlertDialogFooterProps {
  className?: string;
  children: React.ReactNode;
}

export const AlertDialogFooter: React.FC<AlertDialogFooterProps> = ({
  className = '',
  children,
}) => {
  return (
    <div
      className={cn(
        alertDialogFooterClassNames.base,
        'mt-6 flex flex-col-reverse sm:flex-row gap-2 sm:gap-3',
        className
      )}
    >
      {children}
    </div>
  );
};

// AlertDialogTitle component
interface AlertDialogTitleProps {
  className?: string;
  children: React.ReactNode;
}

export const AlertDialogTitle: React.FC<AlertDialogTitleProps> = ({ className = '', children }) => {
  const { mode } = useAlertDialog();
  const isDark = mode === 'dark';

  return (
    <h2
      className={cn(
        alertDialogTitleClassNames.base,
        isDark ? alertDialogTitleClassNames.theme.dark : alertDialogTitleClassNames.theme.light,
        className
      )}
    >
      {children}
    </h2>
  );
};

// AlertDialogDescription component
interface AlertDialogDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

export const AlertDialogDescription: React.FC<AlertDialogDescriptionProps> = ({
  className = '',
  children,
}) => {
  const { mode } = useAlertDialog();
  const isDark = mode === 'dark';

  return (
    <div className={cn(alertDialogDescriptionClassNames.container, className)}>
      <p
        className={cn(
          alertDialogDescriptionClassNames.base,
          isDark
            ? alertDialogDescriptionClassNames.theme.dark
            : alertDialogDescriptionClassNames.theme.light
        )}
      >
        {children}
      </p>
    </div>
  );
};

// AlertDialogAction component
interface AlertDialogActionProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export const AlertDialogAction: React.FC<AlertDialogActionProps> = ({
  className = '',
  children,
  onClick,
  variant = 'default',
}) => {
  const { setOpen, mode } = useAlertDialog();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    setOpen(false);
  };

  return (
    <Button
      variant={variant}
      mode={mode}
      className={cn(alertDialogActionClassNames.base, className)}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
};

// AlertDialogCancel component
interface AlertDialogCancelProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export const AlertDialogCancel: React.FC<AlertDialogCancelProps> = ({
  className = '',
  children,
  onClick,
  variant = 'outline',
}) => {
  const { setOpen, mode } = useAlertDialog();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    setOpen(false);
  };

  return (
    <Button
      variant={variant}
      mode={mode}
      className={cn(alertDialogCancelClassNames.base, className)}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
};
