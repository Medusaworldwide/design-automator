
import { useReducer, useCallback, useEffect, useRef } from "react";

export type ToastVariant = "default" | "destructive" | "success" | "warning" | "info" | "error";

export type Toast = {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: ToastVariant;
  duration?: number;
  important?: boolean;
  onDismiss?: () => void;
  aiSuggestion?: string;
  contextualHelp?: string;
};

export interface ToastOptions {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: ToastVariant;
  duration?: number;
  important?: boolean;
  onDismiss?: () => void;
  aiSuggestion?: string;
  contextualHelp?: string;
}

type ToastAction =
  | { type: 'ADD_TOAST'; toast: Toast }
  | { type: 'UPDATE_TOAST'; toast: Partial<Toast> & { id: string } }
  | { type: 'DISMISS_TOAST'; toastId: string }
  | { type: 'REMOVE_TOAST'; toastId: string };

interface ToastState {
  toasts: Toast[];
  queue: Toast[];
  maxVisible: number;
}

const getDefaultDuration = (variant?: ToastVariant): number => {
  switch (variant) {
    case "destructive":
    case "error":
      return 8000;
    case "warning":
      return 6000;
    case "success":
      return 4000;
    case "info":
    case "default":
    default:
      return 5000;
  }
};

const toastReducer = (state: ToastState, action: ToastAction): ToastState => {
  switch (action.type) {
    case 'ADD_TOAST': {
      const { maxVisible, toasts, queue } = state;
      
      if (toasts.length < maxVisible) {
        return {
          ...state,
          toasts: [...toasts, action.toast],
        };
      } 
      return {
        ...state,
        queue: [...queue, action.toast],
      };
    }

    case 'UPDATE_TOAST': {
      return {
        ...state,
        toasts: state.toasts.map(t => 
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
        queue: state.queue.map(t => 
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };
    }

    case 'DISMISS_TOAST': {
      return {
        ...state,
        toasts: state.toasts.filter(t => t.id !== action.toastId),
      };
    }

    case 'REMOVE_TOAST': {
      const nextQueue = [...state.queue];
      const nextToast = nextQueue.shift();
      
      return {
        ...state,
        toasts: state.toasts.filter(t => t.id !== action.toastId).concat(
          nextToast ? [nextToast] : []
        ),
        queue: nextQueue,
      };
    }

    default:
      return state;
  }
};

const generateId = () => Math.random().toString(36).substring(2, 9);

export function useToast() {
  const [state, dispatch] = useReducer(toastReducer, {
    toasts: [],
    queue: [],
    maxVisible: 3,
  });
  
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  
  const detectUserIssues = useCallback((action: string): string | undefined => {
    if (action.includes("error") || action.includes("fail")) {
      return "I noticed an error. Would you like help troubleshooting this issue?";
    }
    return undefined;
  }, []);

  const toast = useCallback((options: ToastOptions) => {
    const id = generateId();
    const variant = options.variant || "default";
    const duration = options.duration || getDefaultDuration(variant);
    
    const aiSuggestion = options.aiSuggestion || 
      (options.description ? detectUserIssues(options.description) : undefined);
    
    const newToast: Toast = { 
      id, 
      ...options,
      variant,
      duration,
      aiSuggestion
    };
    
    dispatch({ type: 'ADD_TOAST', toast: newToast });
    
    if (!options.important && duration !== Infinity) {
      const timeout = setTimeout(() => {
        dismiss(id);
      }, duration);
      
      timeoutsRef.current.set(id, timeout);
    }
    
    return id;
  }, [detectUserIssues]);

  const update = useCallback((id: string, options: Partial<ToastOptions>) => {
    dispatch({ 
      type: 'UPDATE_TOAST', 
      toast: { id, ...options } 
    });
  }, []);

  const dismiss = useCallback((id: string) => {
    dispatch({ type: 'DISMISS_TOAST', toastId: id });
    
    setTimeout(() => {
      dispatch({ type: 'REMOVE_TOAST', toastId: id });
      
      if (timeoutsRef.current.has(id)) {
        clearTimeout(timeoutsRef.current.get(id)!);
        timeoutsRef.current.delete(id);
      }
    }, 300);
  }, []);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && state.toasts.length > 0) {
        state.toasts.forEach(toast => dismiss(toast.id));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [state.toasts, dismiss]);

  return {
    toasts: state.toasts,
    toast,
    dismiss,
    update
  };
}

let listeners: ((options: ToastOptions) => void)[] = [];

// Fixed toast function declaration to match the ToastFunction interface
export const toast = ((options: ToastOptions) => {
  const event = new CustomEvent("toast", { detail: options });
  document.dispatchEvent(event);
  listeners.forEach(listener => listener(options));
  return generateId();
}) as ToastFunction;

interface ToastFunction {
  (options: ToastOptions): string;
  success: (options: Omit<ToastOptions, "variant">) => string;
  error: (options: Omit<ToastOptions, "variant">) => string;
  warning: (options: Omit<ToastOptions, "variant">) => string;
  info: (options: Omit<ToastOptions, "variant">) => string;
  dismiss: (toastId?: string) => void;
  subscribe: (listener: (options: ToastOptions) => void) => () => void;
}

toast.success = (options) => toast({ ...options, variant: "success" });
toast.error = (options) => toast({ ...options, variant: "destructive" }); // Using "destructive" for error
toast.warning = (options) => toast({ ...options, variant: "warning" });
toast.info = (options) => toast({ ...options, variant: "info" });

toast.dismiss = (toastId?: string) => {
  const event = new CustomEvent("toast-dismiss", { 
    detail: { toastId } 
  });
  document.dispatchEvent(event);
};

toast.subscribe = (listener) => {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
};
