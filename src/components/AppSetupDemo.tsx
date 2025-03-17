
import { useState } from 'react';
import AppSetup, { type AppConfig } from '@/utils/app-setup';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toastHelpers } from '@/utils/toast-setup';

const AppSetupDemo = () => {
  const [config, setConfig] = useState<AppConfig>(AppSetup.getConfig());

  const handleInitialize = () => {
    AppSetup.initialize();
    setConfig(AppSetup.getConfig());
    toastHelpers.success('App initialized', 'The application has been initialized with the current settings');
  };

  const handleToggleTheme = () => {
    AppSetup.toggleTheme();
    setConfig(AppSetup.getConfig());
  };

  const handleReset = () => {
    AppSetup.reset();
    setConfig(AppSetup.getConfig());
    toastHelpers.info('Configuration reset', 'All settings have been reset to defaults');
  };

  const handleThemeChange = (value: string) => {
    const newConfig = { 
      ...config, 
      theme: value as 'light' | 'dark' | 'system' 
    };
    AppSetup.configure(newConfig);
    setConfig(AppSetup.getConfig());
  };

  const handleDebugChange = (checked: boolean) => {
    const newConfig = { ...config, enableDebugLogs: checked };
    AppSetup.configure(newConfig);
    setConfig(AppSetup.getConfig());
  };

  const handleToastDurationChange = (value: string) => {
    const duration = parseInt(value, 10);
    if (isNaN(duration)) return;
    
    const newConfig = { 
      ...config, 
      toastConfig: {
        ...config.toastConfig,
        baseDuration: duration
      }
    };
    AppSetup.configure(newConfig);
    setConfig(AppSetup.getConfig());
  };

  const handleMaxVisibleChange = (value: string) => {
    const maxVisible = parseInt(value, 10);
    if (isNaN(maxVisible)) return;
    
    const newConfig = { 
      ...config, 
      toastConfig: {
        ...config.toastConfig,
        maxVisible
      }
    };
    AppSetup.configure(newConfig);
    setConfig(AppSetup.getConfig());
  };

  const testToasts = () => {
    toastHelpers.success('Success Toast', 'This is a success message');
    setTimeout(() => {
      toastHelpers.error('Error Toast', 'This is an error message');
    }, 1000);
    setTimeout(() => {
      toastHelpers.warning('Warning Toast', 'This is a warning message');
    }, 2000);
    setTimeout(() => {
      toastHelpers.info('Info Toast', 'This is an info message');
    }, 3000);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Application Setup</CardTitle>
        <CardDescription>Configure your application settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="theme">Theme</Label>
          <Select value={config.theme} onValueChange={handleThemeChange}>
            <SelectTrigger id="theme">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="debug" 
            checked={config.enableDebugLogs} 
            onCheckedChange={handleDebugChange} 
          />
          <Label htmlFor="debug">Enable Debug Logs</Label>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <Label htmlFor="toastDuration">Toast Duration (ms)</Label>
          <Input
            id="toastDuration"
            type="number"
            value={config.toastConfig.baseDuration}
            onChange={(e) => handleToastDurationChange(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="maxVisible">Max Visible Toasts</Label>
          <Input
            id="maxVisible"
            type="number"
            min="1"
            max="10"
            value={config.toastConfig.maxVisible}
            onChange={(e) => handleMaxVisibleChange(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="flex flex-wrap gap-2 w-full">
          <Button onClick={handleInitialize} variant="default">Initialize App</Button>
          <Button onClick={handleToggleTheme} variant="outline">Toggle Theme</Button>
          <Button onClick={handleReset} variant="secondary">Reset Config</Button>
        </div>
        <Button onClick={testToasts} variant="outline" className="w-full mt-2">
          Test Toasts
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AppSetupDemo;
