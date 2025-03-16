
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Copy, Check, Download, Code, Sparkles
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CodeGenerationProps {
  websiteUrl: string | null;
  selectedComponentId?: number | null;
}

const CodeGeneration: React.FC<CodeGenerationProps> = ({ 
  websiteUrl, 
  selectedComponentId 
}) => {
  const [framework, setFramework] = useState('react');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  if (!websiteUrl) return null;
  
  // Sample React code to display
  const reactCode = `import React from 'react';

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

  // Sample CSS code
  const cssCode = `.hero-section {
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

  // Sample Vue code
  const vueCode = `<template>
  <div class="hero-section">
    <h1>Transform your designs into code instantly</h1>
    <p>
      AI-powered tool that extracts components from any website 
      with pixel-perfect accuracy and converts them to your 
      preferred framework.
    </p>
    <div class="buttons">
      <button class="primary-button">Get Started</button>
      <button class="secondary-button">Learn More</button>
    </div>
  </div>
</template>

<script setup>
// Component logic here
</script>

<style scoped>
.hero-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 0 1rem;
  text-align: center;
  background: linear-gradient(to right, #6366F1, #A855F7);
}

/* Additional styles... */
</style>`;

  const getDisplayCode = () => {
    switch (framework) {
      case 'react':
        return reactCode;
      case 'vue':
        return vueCode;
      case 'css':
        return cssCode;
      default:
        return reactCode;
    }
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

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Code size={20} className="text-brand-indigo" />
          Generated Code
        </CardTitle>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Sparkles size={14} className="text-brand-purple" />
            Enhance
          </Button>
          <Button onClick={handleCopyCode} variant="outline" size="sm" className="gap-1">
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
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
          
          <div className="relative">
            <TabsContent value="react" className="mt-0">
              <pre className="p-4 rounded-md bg-gray-950 text-gray-100 overflow-x-auto text-sm">
                <code>{reactCode}</code>
              </pre>
            </TabsContent>
            
            <TabsContent value="vue" className="mt-0">
              <pre className="p-4 rounded-md bg-gray-950 text-gray-100 overflow-x-auto text-sm">
                <code>{vueCode}</code>
              </pre>
            </TabsContent>
            
            <TabsContent value="css" className="mt-0">
              <pre className="p-4 rounded-md bg-gray-950 text-gray-100 overflow-x-auto text-sm">
                <code>{cssCode}</code>
              </pre>
            </TabsContent>
            
            <div className="absolute top-3 right-3 flex gap-2">
              {/* Language indicator */}
              <span className="text-xs font-mono px-2 py-1 rounded bg-gray-800 text-gray-400">
                {framework === 'react' ? 'jsx' : framework}
              </span>
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CodeGeneration;
