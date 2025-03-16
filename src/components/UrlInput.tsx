
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Wand2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface UrlInputProps {
  onUrlSubmit: (url: string) => void;
}

const UrlInput: React.FC<UrlInputProps> = ({ onUrlSubmit }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast({
        title: "Please enter a URL",
        description: "Enter a valid website URL to extract components",
        variant: "destructive",
      });
      return;
    }

    // Validate URL format
    try {
      const urlObj = new URL(url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        throw new Error('Invalid protocol');
      }
    } catch (error) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL starting with http:// or https://",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate processing delay for the demo
    setTimeout(() => {
      onUrlSubmit(url);
      setIsLoading(false);
      toast({
        title: "Website Analyzed",
        description: "Components have been successfully extracted",
      });
    }, 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="glass-effect rounded-xl p-1 border border-gray-200 dark:border-gray-800 shadow-lg">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL (e.g., https://airbnb.com)"
              className="pl-10 pr-4 py-6 rounded-lg border-0 shadow-none focus-visible:ring-1 focus-visible:ring-brand-indigo"
            />
          </div>
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-brand-indigo to-brand-purple hover:from-brand-purple hover:to-brand-indigo text-white py-6 px-8 rounded-lg transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="h-5 w-5 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <Wand2 className="mr-2" size={18} />
                Clone Website
              </>
            )}
          </Button>
        </form>
      </div>
      <div className="mt-3 text-center text-sm text-gray-500">
        Instantly extract UI components from any website with AI-powered precision
      </div>
    </div>
  );
};

export default UrlInput;
