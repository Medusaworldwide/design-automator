
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Download, Code, Layers, Check, Image } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ComponentPreviewProps {
  websiteUrl: string | null;
}

const ComponentPreview: React.FC<ComponentPreviewProps> = ({ websiteUrl }) => {
  const [activeTab, setActiveTab] = useState('components');
  const [copying, setCopying] = useState(false);
  const { toast } = useToast();
  
  // Mock component data for demonstration
  const components = [
    { id: 1, type: 'Hero Section', screenshot: 'hero' },
    { id: 2, type: 'Navigation Bar', screenshot: 'navbar' },
    { id: 3, type: 'Feature Card', screenshot: 'card' },
    { id: 4, type: 'Testimonial', screenshot: 'testimonial' },
    { id: 5, type: 'Contact Form', screenshot: 'form' },
    { id: 6, type: 'Footer', screenshot: 'footer' },
  ];
  
  if (!websiteUrl) {
    return (
      <div className="w-full mt-12 text-center">
        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
          <Image size={48} className="text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">
            Enter a website URL to get started
          </h3>
          <p className="mt-2 text-sm text-gray-500 max-w-md">
            Paste any website URL in the input above and our AI will automatically extract all UI components for you to customize.
          </p>
        </div>
      </div>
    );
  }
  
  const handleCopyComponent = (componentId: number) => {
    setCopying(true);
    
    // Simulate copy delay
    setTimeout(() => {
      setCopying(false);
      toast({
        title: "Component Copied",
        description: "The component has been copied to your clipboard",
      });
    }, 1000);
  };

  return (
    <div className="w-full mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Components from <span className="text-brand-indigo">{new URL(websiteUrl).hostname}</span>
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download size={16} />
            <span className="hidden sm:inline">Export All</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="components" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="components" onClick={() => setActiveTab('components')}>
            <Layers size={16} className="mr-2" />
            Components
          </TabsTrigger>
          <TabsTrigger value="styles" onClick={() => setActiveTab('styles')}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
            Styles
          </TabsTrigger>
          <TabsTrigger value="assets" onClick={() => setActiveTab('assets')}>
            <Image size={16} className="mr-2" />
            Assets
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="components" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {components.map((component) => (
              <Card key={component.id} className="overflow-hidden group hover:shadow-md transition-all duration-300">
                <CardHeader className="p-0 relative h-40 bg-gray-100 dark:bg-gray-800">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center animate-pulse-light">
                      <span className="text-sm text-gray-500">{component.type} Preview</span>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      onClick={() => handleCopyComponent(component.id)} 
                      variant="secondary" 
                      size="icon" 
                      className="h-8 w-8 bg-white dark:bg-gray-800 shadow-md"
                    >
                      {copying ? <Check size={14} /> : <Copy size={14} />}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{component.type}</h3>
                    <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                      UI
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Interactive {component.type.toLowerCase()} with responsive design</p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <Button variant="outline" size="sm" className="text-xs h-8">
                    <Code size={14} className="mr-1" />
                    View Code
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs h-8">
                    Customize
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="styles" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Color Palette */}
            <Card>
              <CardHeader>
                <CardTitle>Color Palette</CardTitle>
                <CardDescription>Extracted from the website</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {['#6366F1', '#A855F7', '#2563EB', '#111827', '#F9FAFB'].map((color, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="h-10 w-10 rounded-full mb-2 cursor-pointer hover:scale-110 transition-transform" 
                        style={{ backgroundColor: color }}
                      ></div>
                      <span className="text-xs">{color}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Typography */}
            <Card>
              <CardHeader>
                <CardTitle>Typography</CardTitle>
                <CardDescription>Font families and styles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Headings</h4>
                  <div className="pl-2 border-l-2 border-brand-indigo">
                    <p className="text-lg font-bold">Inter / 700</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Body</h4>
                  <div className="pl-2 border-l-2 border-brand-purple">
                    <p className="text-sm">Inter / 400</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="assets" className="mt-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((asset) => (
              <div 
                key={asset} 
                className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center group relative overflow-hidden"
              >
                <span className="text-gray-400">Image {asset}</span>
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button variant="secondary" size="sm">
                    <Download size={14} className="mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComponentPreview;
