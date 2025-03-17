
import { toast, type ToastOptions, type ToastVariant } from "@/hooks/use-toast";

/**
 * Default durations in milliseconds for different toast variants
 */
export const defaultDurations = {
  success: 4000,
  info: 5000,
  warning: 6000,
  error: 8000,
  default: 5000,
};

/**
 * Configuration options for the toast system
 */
export interface ToastConfig {
  /** Max number of toasts to show at once */
  maxVisible?: number;
  /** Whether to auto-dismiss toasts on user activity */
  autoDismiss?: boolean;
  /** Base duration for toasts in milliseconds */
  baseDuration?: number;
  /** Function to detect AI suggestions based on message content */
  suggestionDetector?: (message: string) => string | undefined;
}

/**
 * Default global toast configuration
 */
const defaultConfig: ToastConfig = {
  maxVisible: 3,
  autoDismiss: true,
  baseDuration: 5000,
  suggestionDetector: (message: string): string | undefined => {
    if (message.toLowerCase().includes("error") || 
        message.toLowerCase().includes("fail")) {
      return "I noticed an issue. Would you like help troubleshooting?";
    }
    return undefined;
  }
};

// Current configuration
let currentConfig: ToastConfig = { ...defaultConfig };

/**
 * Configure global toast settings
 */
export function configureToasts(config: Partial<ToastConfig>): void {
  currentConfig = { ...currentConfig, ...config };
}

/**
 * Reset toast configuration to defaults
 */
export function resetToastConfig(): void {
  currentConfig = { ...defaultConfig };
}

/**
 * Get the current toast configuration
 */
export function getToastConfig(): ToastConfig {
  return { ...currentConfig };
}

/**
 * Helper to create consistent toast messages
 */
export function createToast(
  title: string,
  description?: string,
  variant: ToastVariant = "default",
  options: Partial<ToastOptions> = {}
): string {
  const duration = options.duration || 
    defaultDurations[variant as keyof typeof defaultDurations] || 
    defaultDurations.default;

  let aiSuggestion = options.aiSuggestion;
  
  // Only auto-generate suggestions if not explicitly provided and we have a detector
  if (aiSuggestion === undefined && 
      currentConfig.suggestionDetector && 
      description) {
    aiSuggestion = currentConfig.suggestionDetector(description);
  }

  return toast({
    title,
    description,
    variant,
    duration,
    aiSuggestion,
    ...options
  });
}

/**
 * Predefined toast helper functions
 */
export const toastHelpers = {
  /**
   * Show a success toast
   */
  success: (title: string, description?: string, options: Partial<Omit<ToastOptions, "variant">> = {}) =>
    createToast(title, description, "success", options),

  /**
   * Show an error toast
   */
  error: (title: string, description?: string, options: Partial<Omit<ToastOptions, "variant">> = {}) =>
    createToast(title, description, "error", options),

  /**
   * Show a warning toast
   */
  warning: (title: string, description?: string, options: Partial<Omit<ToastOptions, "variant">> = {}) =>
    createToast(title, description, "warning", options),

  /**
   * Show an info toast
   */
  info: (title: string, description?: string, options: Partial<Omit<ToastOptions, "variant">> = {}) =>
    createToast(title, description, "info", options),

  /**
   * Show a notification when an API request is started
   */
  apiRequest: (message: string) =>
    createToast("Processing", message, "info", { 
      duration: Infinity, 
      important: true
      // Removed the 'id' property since it's not in the ToastOptions type
    }),

  /**
   * Update the API request toast when the request succeeds
   */
  apiSuccess: (message: string) => {
    toast.dismiss("api-request");
    return createToast("Success", message, "success");
  },

  /**
   * Update the API request toast when the request fails
   */
  apiError: (error: string) => {
    toast.dismiss("api-request");
    return createToast("Error", error, "error", { 
      important: true,
      contextualHelp: "Check your network connection or try again later."
    });
  },

  /**
   * Show a toast with contextual help
   */
  withHelp: (title: string, description: string, helpText: string) =>
    createToast(title, description, "info", { contextualHelp: helpText }),
};

// Initialize toast system with default configuration
resetToastConfig();

export default toastHelpers;
