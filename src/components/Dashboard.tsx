
import React, { useState } from 'react';
import Header from './Header';
import UrlInput from './UrlInput';
import ComponentPreview from './ComponentPreview';
import CodeGeneration from './CodeGeneration';
import AIAssistant from './AIAssistant';
import { Toaster } from "@/components/ui/toaster";

const Dashboard: React.FC = () => {
  const [websiteUrl, setWebsiteUrl] = useState<string | null>(null);
  const [selectedComponentId, setSelectedComponentId] = useState<number | null>(null);
  const [components, setComponents] = useState<Array<{id: number, name: string, type: string}>>([]);
  
  const handleUrlSubmit = (url: string) => {
    setWebsiteUrl(url);
    // Simulate component detection with sample data
    setComponents([
      { id: 1, name: 'Hero Section', type: 'layout' },
      { id: 2, name: 'Navbar', type: 'navigation' },
      { id: 3, name: 'Feature Cards', type: 'cards' },
      { id: 4, name: 'Contact Form', type: 'form' },
      { id: 5, name: 'Footer', type: 'footer' },
    ]);
  };
  
  const handleComponentSelect = (componentId: number) => {
    setSelectedComponentId(componentId);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 px-4 py-6 md:px-8 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-blue">
            Design Automator
          </h1>
          <p className="text-xl text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Clone any website with AI precision, extract components, and generate code in seconds
          </p>
        </div>
        
        <UrlInput onUrlSubmit={handleUrlSubmit} />
        
        <ComponentPreview 
          websiteUrl={websiteUrl} 
          components={components}
          selectedComponentId={selectedComponentId}
          onComponentSelect={handleComponentSelect}
        />
        
        {websiteUrl && (
          <CodeGeneration 
            websiteUrl={websiteUrl}
            selectedComponentId={selectedComponentId}
            components={components}
          />
        )}
      </main>
      
      <AIAssistant 
        websiteUrl={websiteUrl} 
        selectedComponentId={selectedComponentId}
        components={components}
      />
      
      <Toaster />
    </div>
  );
};

export default Dashboard;
