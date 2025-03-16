
import { useEffect, useState } from "react";
import { useToast as useHookToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useHookToast();
  const [mountedToasts, setMountedToasts] = useState(toasts);
  
  // Listen for toast events from the direct toast function
  useEffect(() => {
    const handleToast = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { title, description, action, variant } = customEvent.detail;
      const id = Math.random().toString(36).substring(2, 9);
      
      setMountedToasts(prev => [...prev, { 
        id, 
        title, 
        description, 
        action, 
        variant 
      }]);
      
      // Auto dismiss after 5 seconds
      setTimeout(() => {
        setMountedToasts(prev => prev.filter(toast => toast.id !== id));
      }, 5000);
    };
    
    document.addEventListener("toast", handleToast);
    
    return () => {
      document.removeEventListener("toast", handleToast);
    };
  }, []);
  
  // Update mounted toasts when hook toasts change
  useEffect(() => {
    setMountedToasts(toasts);
  }, [toasts]);

  return (
    <ToastProvider>
      {mountedToasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
