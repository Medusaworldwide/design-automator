import { useEffect, useState, useRef } from "react";
import { useToast, type Toast } from "@/hooks/use-toast";
import {
  Toast as ToastPrimitive,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  ToastAction,
} from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { X, AlertCircle, CheckCircle, Info, AlertTriangle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast as toastFunction } from "@/hooks/use-toast";

export function Toaster() {
  const { toasts, dismiss } = useToast();
  const [mountedToasts, setMountedToasts] = useState<Toast[]>([]);
  const dismissAllTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    const handleToast = (e: Event) => {
      const customEvent = e as CustomEvent;
      const options = customEvent.detail;
      
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = { 
        id,
        ...options,
        duration: options.duration || 5000,
      };
      
      setMountedToasts(prev => {
        if (prev.length >= 3) {
          return [...prev, newToast];
        }
        return [...prev, newToast];
      });
      
      if (!options.important && options.duration !== Infinity) {
        setTimeout(() => {
          setMountedToasts(prev => prev.filter(toast => toast.id !== id));
        }, options.duration || 5000);
      }
    };
    
    const handleDismiss = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { toastId } = customEvent.detail;
      
      if (toastId) {
        setMountedToasts(prev => prev.filter(toast => toast.id !== toastId));
      } else {
        setMountedToasts([]);
      }
    };
    
    document.addEventListener("toast", handleToast);
    document.addEventListener("toast-dismiss", handleDismiss);
    
    return () => {
      document.removeEventListener("toast", handleToast);
      document.removeEventListener("toast-dismiss", handleDismiss);
    };
  }, []);
  
  useEffect(() => {
    setMountedToasts(toasts);
  }, [toasts]);
  
  useEffect(() => {
    const resetDismissTimer = () => {
      if (dismissAllTimeoutRef.current) {
        clearTimeout(dismissAllTimeoutRef.current);
      }

      dismissAllTimeoutRef.current = setTimeout(() => {
        mountedToasts.forEach(toast => {
          if (!toast.important) {
            dismiss(toast.id);
          }
        });
      }, 30000);
    };

    if (mountedToasts.length > 0) {
      resetDismissTimer();
      window.addEventListener('mousemove', resetDismissTimer);
      window.addEventListener('keydown', resetDismissTimer);
      window.addEventListener('click', resetDismissTimer);
    }

    return () => {
      if (dismissAllTimeoutRef.current) {
        clearTimeout(dismissAllTimeoutRef.current);
      }
      window.removeEventListener('mousemove', resetDismissTimer);
      window.removeEventListener('keydown', resetDismissTimer);
      window.removeEventListener('click', resetDismissTimer);
    };
  }, [mountedToasts, dismiss]);

  const getIconForVariant = (variant?: string) => {
    switch (variant) {
      case "destructive":
      case "error":
        return <AlertCircle className="h-4 w-4" />;
      case "success":
        return <CheckCircle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "info":
        return <Info className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  const getVariantClasses = (variant?: string): string => {
    switch (variant) {
      case "destructive":
      case "error":
        return "destructive";
      case "success":
        return "border-green-500 bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-300";
      case "warning":
        return "border-yellow-500 bg-yellow-50 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300";
      case "info":
        return "border-blue-500 bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300";
      default:
        return "";
    }
  };

  return (
    <ToastProvider>
      {mountedToasts.slice(0, 3).map(function (toast, index) {
        const { id, title, description, action, variant, aiSuggestion, contextualHelp, ...props } = toast;
        
        return (
          <ToastPrimitive 
            key={id} 
            className={cn(
              getVariantClasses(variant),
              "data-[swipe=move]:transition-none grow-1 group relative pointer-events-auto", 
              index === 0 ? "animate-fade-in" : 
              index === 1 ? "animate-fade-in delay-150" : 
              "animate-fade-in delay-300"
            )}
            {...props}
          >
            <div className="flex">
              {getIconForVariant(variant) && (
                <div className="flex-shrink-0 mr-2 pt-1">
                  {getIconForVariant(variant)}
                </div>
              )}
              
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
                
                {aiSuggestion && (
                  <div className="mt-2 text-sm border-l-2 border-blue-500 pl-2 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-blue-500" />
                    <p className="text-muted-foreground">{aiSuggestion}</p>
                  </div>
                )}
                
                {contextualHelp && (
                  <Button 
                    variant="link" 
                    className="p-0 h-auto mt-1 text-xs justify-start"
                    onClick={() => {
                      toastFunction({
                        title: "Help",
                        description: contextualHelp,
                        variant: "info",
                        duration: 10000
                      });
                    }}
                  >
                    Need more help?
                  </Button>
                )}
              </div>
            </div>
            
            {action}
            <ToastClose 
              onClick={() => {
                if (toast.onDismiss) {
                  toast.onDismiss();
                }
                dismiss(id);
              }}
            />
          </ToastPrimitive>
        );
      })}
      <ToastViewport className="gap-2" />
    </ToastProvider>
  );
}
