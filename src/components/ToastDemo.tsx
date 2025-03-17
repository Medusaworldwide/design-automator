
import React from 'react';
import { Button } from '@/components/ui/button';
import toastHelpers, { configureToasts } from '@/utils/toast-setup';
import { 
  AlertCircle, 
  CheckCircle, 
  Info, 
  AlertTriangle,
  Settings,
  RefreshCw
} from 'lucide-react';

export function ToastDemo() {
  // Example of how to configure toasts
  const configureLongToasts = () => {
    configureToasts({
      baseDuration: 10000,
      suggestionDetector: (message) => {
        if (message.includes("config")) {
          return "You can customize toast duration in settings";
        }
        return undefined;
      }
    });
    toastHelpers.info("Toast Configuration Updated", "Toasts will now display longer");
  };

  // Example of simulating an API call
  const simulateApiCall = () => {
    toastHelpers.apiRequest("Fetching data from server...");
    
    // Simulate API delay
    setTimeout(() => {
      // 80% chance of success
      if (Math.random() > 0.2) {
        toastHelpers.apiSuccess("Data successfully retrieved");
      } else {
        toastHelpers.apiError("Failed to fetch data from server");
      }
    }, 2000);
  };

  return (
    <div className="p-6 space-y-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-4">Toast Notification Demo</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <h3 className="font-medium mb-2">Basic Toasts</h3>
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => toastHelpers.success("Success", "Operation completed successfully")}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Success
            </Button>
            
            <Button 
              onClick={() => toastHelpers.error("Error", "Something went wrong")}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <AlertCircle className="h-4 w-4" />
              Error
            </Button>
            
            <Button 
              onClick={() => toastHelpers.warning("Warning", "Please review before continuing")}
              variant="outline"
              className="flex items-center gap-2 text-yellow-600 border-yellow-300 hover:bg-yellow-50"
            >
              <AlertTriangle className="h-4 w-4" />
              Warning
            </Button>
            
            <Button 
              onClick={() => toastHelpers.info("Information", "Your session expires in 10 minutes")}
              variant="outline"
              className="flex items-center gap-2 text-blue-600"
            >
              <Info className="h-4 w-4" />
              Info
            </Button>
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="font-medium mb-2">Advanced Features</h3>
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => toastHelpers.withHelp(
                "Need Assistance?", 
                "This action requires configuration", 
                "You can find detailed instructions in our documentation."
              )}
              variant="outline"
              className="flex items-center gap-2"
            >
              With Help
            </Button>
            
            <Button 
              onClick={simulateApiCall}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              API Call
            </Button>
            
            <Button 
              onClick={configureLongToasts}
              variant="ghost"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Configure
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          This demo showcases the different toast notifications available in the system.
          Try clicking the buttons to see the different toast types and features.
        </p>
      </div>
    </div>
  );
}

export default ToastDemo;
