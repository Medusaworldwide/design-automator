
import { configureToasts, resetToastConfig } from './toast-setup';
import { toast } from '@/hooks/use-toast';

/**
 * Application configuration options
 */
export interface AppConfig {
  /** Whether the app is in development mode */
  isDevelopment: boolean;
  /** Whether to enable verbose logging */
  enableDebugLogs: boolean;
  /** Theme for the application (light, dark, system) */
  theme: 'light' | 'dark' | 'system';
  /** Toast configuration */
  toastConfig: {
    /** Max number of toasts to show at once */
    maxVisible: number;
    /** Whether to auto-dismiss toasts on user activity */
    autoDismiss: boolean;
    /** Base duration for toasts in milliseconds */
    baseDuration: number;
  };
}

// Default configuration
const defaultConfig: AppConfig = {
  isDevelopment: import.meta.env.DEV,
  enableDebugLogs: import.meta.env.DEV,
  theme: 'system',
  toastConfig: {
    maxVisible: 3,
    autoDismiss: true,
    baseDuration: 5000,
  }
};

// Current application configuration
let currentConfig: AppConfig = { ...defaultConfig };

/**
 * Log messages to console based on current debug settings
 */
export const logDebug = (message: string, data?: any): void => {
  if (currentConfig.enableDebugLogs) {
    console.log(`[Debug] ${message}`, data || '');
  }
};

/**
 * Configure the application with the given options
 */
export function configureApp(config: Partial<AppConfig>): void {
  // Apply partial configuration updates
  currentConfig = {
    ...currentConfig,
    ...config,
    // Handle nested objects correctly
    toastConfig: {
      ...currentConfig.toastConfig,
      ...(config.toastConfig || {})
    }
  };

  // Configure toasts based on app configuration
  configureToasts({
    maxVisible: currentConfig.toastConfig.maxVisible,
    autoDismiss: currentConfig.toastConfig.autoDismiss,
    baseDuration: currentConfig.toastConfig.baseDuration,
  });

  logDebug('Application configured', currentConfig);
}

/**
 * Reset app configuration to defaults
 */
export function resetAppConfig(): void {
  currentConfig = { ...defaultConfig };
  resetToastConfig();
  logDebug('Application reset to default configuration', currentConfig);
}

/**
 * Get the current application configuration
 */
export function getAppConfig(): AppConfig {
  return { ...currentConfig };
}

/**
 * Initialize the application
 */
export function initializeApp(): void {
  logDebug('Initializing application...');
  
  // Reset configuration to defaults
  resetAppConfig();
  
  // Apply any stored configuration from localStorage
  try {
    const storedConfig = localStorage.getItem('app_config');
    if (storedConfig) {
      const parsedConfig = JSON.parse(storedConfig);
      configureApp(parsedConfig);
      logDebug('Loaded configuration from storage', parsedConfig);
    }
  } catch (error) {
    console.error('Failed to load stored configuration:', error);
  }

  // Setup error handling
  setupErrorHandling();
  
  // Initialize theme
  applyTheme(currentConfig.theme);
  
  logDebug('Application initialized successfully');
  
  // Notify of successful initialization
  toast({
    title: "Application Ready",
    description: "Setup completed successfully",
    variant: "success",
    duration: 3000
  });
}

/**
 * Set up global error handling
 */
function setupErrorHandling(): void {
  const originalConsoleError = console.error;
  
  // Override console.error to show toast for errors
  console.error = (...args) => {
    // Call original implementation first
    originalConsoleError.apply(console, args);
    
    // Extract error message
    const errorMessage = args.map(arg => 
      arg instanceof Error 
        ? `${arg.name}: ${arg.message}` 
        : String(arg)
    ).join(' ');
    
    // Show toast for errors in development mode
    if (currentConfig.isDevelopment) {
      toast({
        title: "Error Detected",
        description: errorMessage.substring(0, 200) + (errorMessage.length > 200 ? '...' : ''),
        variant: "error",
        duration: 8000
      });
    }
  };
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logDebug('Unhandled promise rejection:', event.reason);
    
    if (currentConfig.isDevelopment) {
      const errorMessage = event.reason instanceof Error 
        ? event.reason.message 
        : String(event.reason);
        
      toast({
        title: "Unhandled Promise Rejection",
        description: errorMessage.substring(0, 200) + (errorMessage.length > 200 ? '...' : ''),
        variant: "error",
        duration: 8000
      });
    }
  });
}

/**
 * Apply theme to the application
 */
function applyTheme(theme: 'light' | 'dark' | 'system'): void {
  const root = window.document.documentElement;
  
  // Remove existing theme classes
  root.classList.remove('light', 'dark');
  
  // Apply theme based on selection
  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    root.classList.add(systemTheme);
    logDebug(`Applied system theme: ${systemTheme}`);
  } else {
    root.classList.add(theme);
    logDebug(`Applied theme: ${theme}`);
  }
  
  // Store theme preference
  localStorage.setItem('theme', theme);
}

/**
 * Toggle between light and dark themes
 */
export function toggleTheme(): void {
  const currentTheme = currentConfig.theme;
  let newTheme: 'light' | 'dark' | 'system';
  
  if (currentTheme === 'light') newTheme = 'dark';
  else if (currentTheme === 'dark') newTheme = 'system';
  else newTheme = 'light';
  
  currentConfig.theme = newTheme;
  applyTheme(newTheme);
  
  // Save configuration
  const updatedConfig = { ...currentConfig };
  localStorage.setItem('app_config', JSON.stringify(updatedConfig));
  
  toast({
    title: "Theme Changed",
    description: `Theme set to ${newTheme}`,
    variant: "info",
    duration: 3000
  });
}

/**
 * Utility to measure performance
 */
export function measurePerformance(label: string, operation: () => void): void {
  if (!currentConfig.enableDebugLogs) {
    operation();
    return;
  }
  
  console.time(label);
  try {
    operation();
  } finally {
    console.timeEnd(label);
  }
}

// Export a setup utility object with all functions
export const AppSetup = {
  initialize: initializeApp,
  configure: configureApp,
  reset: resetAppConfig,
  getConfig: getAppConfig,
  toggleTheme,
  debug: logDebug,
  measurePerformance,
};

// Export default for convenience
export default AppSetup;
