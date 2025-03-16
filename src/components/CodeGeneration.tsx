import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Copy, Check, Download, Code, Sparkles, RefreshCw
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CodeGenerationProps {
  websiteUrl: string | null;
  selectedComponentId?: number | null;
  components?: Array<{id: number, name: string, type: string}>;
}

const CodeGeneration: React.FC<CodeGenerationProps> = ({ 
  websiteUrl, 
  selectedComponentId,
  components = []
}) => {
  const [framework, setFramework] = useState('react');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  
  const [componentCode, setComponentCode] = useState<Record<string, Record<string, string>>>({});
  
  if (!websiteUrl) return null;
  
  useEffect(() => {
    if (selectedComponentId && !componentCode[selectedComponentId]) {
      generateComponentCode(selectedComponentId);
    }
  }, [selectedComponentId]);

  const generateComponentCode = (componentId: number) => {
    setIsGenerating(true);
    
    const selectedComponent = components.find(c => c.id === componentId);
    if (!selectedComponent) return;
    
    setTimeout(() => {
      let reactCode = '';
      let cssCode = '';
      let vueCode = '';
      
      switch (selectedComponent.type) {
        case 'layout':
          reactCode = `import React from 'react';

const HeroSection = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center bg-gradient-to-r from-indigo-500 to-purple-600">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
        Transform your designs into code instantly
      </h1>
      <p className="text-xl text-white/80 max-w-2xl mb-8">
        AI-powered tool that extracts components from any website 
        with pixel-perfect accuracy and converts them to your 
        preferred framework.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button className="px-8 py-3 rounded-lg bg-white text-indigo-600 font-medium hover:bg-opacity-95 transition">
          Get Started
        </button>
        <button className="px-8 py-3 rounded-lg bg-transparent border border-white text-white font-medium hover:bg-white/10 transition">
          Learn More
        </button>
      </div>
    </div>
  );
};

export default HeroSection;`;
          cssCode = `.hero-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 0 1rem;
  text-align: center;
  background: linear-gradient(to right, #6366F1, #A855F7);
}

.hero-section h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .hero-section h1 {
    font-size: 3rem;
  }
}

.hero-section p {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 42rem;
  margin-bottom: 2rem;
}

.hero-section .buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 640px) {
  .hero-section .buttons {
    flex-direction: row;
  }
}

.hero-section .primary-button {
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  background-color: white;
  color: #6366F1;
  font-weight: 500;
  transition: background-color 0.2s;
}

.hero-section .primary-button:hover {
  background-color: rgba(255, 255, 255, 0.95);
}

.hero-section .secondary-button {
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  background-color: transparent;
  border: 1px solid white;
  color: white;
  font-weight: 500;
  transition: background-color 0.2s;
}

.hero-section .secondary-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}`;
          break;
          
        case 'navigation':
          reactCode = `import React, { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img src="/logo.svg" alt="Logo" className="h-8 w-auto mr-4" />
          <span className="font-bold text-indigo-600 text-xl">Design Automator</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-gray-700 hover:text-indigo-600 transition">Features</a>
          <a href="#" className="text-gray-700 hover:text-indigo-600 transition">Pricing</a>
          <a href="#" className="text-gray-700 hover:text-indigo-600 transition">Documentation</a>
          <button className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition">
            Sign Up
          </button>
        </div>
        
        <button 
          className="md:hidden rounded-md p-2 text-gray-700 hover:bg-gray-100"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden pt-2 pb-4 px-4">
          <a href="#" className="block py-2 text-gray-700 hover:text-indigo-600">Features</a>
          <a href="#" className="block py-2 text-gray-700 hover:text-indigo-600">Pricing</a>
          <a href="#" className="block py-2 text-gray-700 hover:text-indigo-600">Documentation</a>
          <button className="mt-2 w-full px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition">
            Sign Up
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;`;
          break;
          
        case 'form':
          reactCode = `import React, { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Us</h2>
      
      {isSubmitted ? (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 text-green-700">
          Thank you for your message! We'll respond shortly.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ContactForm;`;
          break;
          
        default:
          reactCode = `// Generated code for ${selectedComponent.name}`;
      }
      
      vueCode = `<template>
  <!-- ${selectedComponent.name} component -->
  <div class="${selectedComponent.type.toLowerCase()}-component">
    <!-- Component content would be here -->
    <h2>${selectedComponent.name}</h2>
    <p>Generated Vue component for ${selectedComponent.type}</p>
  </div>
</template>

<script setup>
// Component logic here
</script>

<style scoped>
.${selectedComponent.type.toLowerCase()}-component {
  /* Styles would be here */
  padding: 1.5rem;
  border-radius: 0.5rem;
  background-color: #f9fafb;
}
</style>`;
      
      setComponentCode(prev => ({
        ...prev,
        [componentId]: {
          react: reactCode,
          css: cssCode,
          vue: vueCode
        }
      }));
      
      setIsGenerating(false);
      
      toast({
        title: "Code Generated",
        description: `Code for ${selectedComponent.name} has been generated successfully`,
      });
    }, 1500);
  };

  const getDisplayCode = () => {
    if (!selectedComponentId) {
      return `// Please select a component to view its code`;
    }
    
    const componentCodes = componentCode[selectedComponentId];
    if (!componentCodes) {
      return `// Generating code for the selected component...`;
    }
    
    return componentCodes[framework] || '// Code not available for this framework';
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getDisplayCode());
    setCopied(true);
    
    toast({
      title: "Code Copied",
      description: "The code has been copied to your clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const getSelectedComponentName = () => {
    if (!selectedComponentId) return "Component";
    
    const component = components.find(c => c.id === selectedComponentId);
    return component ? component.name : "Component";
  };

  const regenerateCode = () => {
    if (selectedComponentId) {
      generateComponentCode(selectedComponentId);
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Code size={20} className="text-brand-indigo" />
          {selectedComponentId ? `${getSelectedComponentName()} Code` : "Generated Code"}
        </CardTitle>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={regenerateCode}
            disabled={!selectedComponentId || isGenerating}
          >
            {isGenerating ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <Sparkles size={14} className="text-brand-purple" />
            )}
            {isGenerating ? "Generating..." : "Regenerate"}
          </Button>
          <Button 
            onClick={handleCopyCode} 
            variant="outline" 
            size="sm" 
            className="gap-1"
            disabled={isGenerating || !selectedComponentId}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            disabled={isGenerating || !selectedComponentId}
          >
            <Download size={14} />
            Download
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="react" className="w-full" onValueChange={setFramework}>
          <TabsList className="mb-4">
            <TabsTrigger value="react">React/JSX</TabsTrigger>
            <TabsTrigger value="vue">Vue</TabsTrigger>
            <TabsTrigger value="css">CSS</TabsTrigger>
          </TabsList>
          
          <div className={`relative ${isGenerating ? 'opacity-50' : ''}`}>
            <TabsContent value="react" className="mt-0">
              <pre className="p-4 rounded-md bg-gray-950 text-gray-100 overflow-x-auto text-sm h-[400px] overflow-y-auto">
                <code>{getDisplayCode()}</code>
              </pre>
            </TabsContent>
            
            <TabsContent value="vue" className="mt-0">
              <pre className="p-4 rounded-md bg-gray-950 text-gray-100 overflow-x-auto text-sm h-[400px] overflow-y-auto">
                <code>{getDisplayCode()}</code>
              </pre>
            </TabsContent>
            
            <TabsContent value="css" className="mt-0">
              <pre className="p-4 rounded-md bg-gray-950 text-gray-100 overflow-x-auto text-sm h-[400px] overflow-y-auto">
                <code>{getDisplayCode()}</code>
              </pre>
            </TabsContent>
            
            <div className="absolute top-3 right-3 flex gap-2">
              <span className="text-xs font-mono px-2 py-1 rounded bg-gray-800 text-gray-400">
                {framework === 'react' ? 'jsx' : framework}
              </span>
            </div>
            
            {isGenerating && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 rounded-md">
                <div className="bg-white p-3 rounded-md shadow-lg flex items-center gap-2">
                  <RefreshCw size={18} className="text-brand-indigo animate-spin" />
                  <span>Generating code...</span>
                </div>
              </div>
            )}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CodeGeneration;
