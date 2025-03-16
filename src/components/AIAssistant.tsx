
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, MessageSquare, X, Send, PlusCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface AIAssistantProps {
  websiteUrl: string | null;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ websiteUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'assistant', content: string}[]>([
    {
      role: 'assistant',
      content: 'Hello! I can help you customize components, generate code, or improve your design. What would you like to do?'
    }
  ]);
  
  if (!websiteUrl) return null;

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message to chat
    setChatHistory([...chatHistory, { role: 'user', content: message }]);
    
    // Simulate AI response
    setTimeout(() => {
      let response = '';
      
      if (message.toLowerCase().includes('responsive')) {
        response = "I've analyzed the components and can help make them fully responsive. Would you like me to update the code with media queries for mobile, tablet, and desktop views?";
      } else if (message.toLowerCase().includes('color') || message.toLowerCase().includes('palette')) {
        response = "I can adjust the color scheme. Based on design trends, I recommend using a primary color of #6366F1 with #A855F7 as an accent. Would you like to see a preview with this palette?";
      } else if (message.toLowerCase().includes('accessibility') || message.toLowerCase().includes('a11y')) {
        response = "I've analyzed the components for accessibility. I recommend improving contrast ratios and adding proper ARIA labels. Would you like me to generate accessibility-enhanced code?";
      } else {
        response = "I can help customize this component. Would you like me to modify the layout, colors, or generate alternative variations?";
      }
      
      setChatHistory([...chatHistory, { role: 'user', content: message }, { role: 'assistant', content: response }]);
    }, 1000);
    
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderChatBubble = (item: {role: 'user' | 'assistant', content: string}, index: number) => {
    const isUser = item.role === 'user';
    
    return (
      <div 
        key={index} 
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div 
          className={`max-w-[80%] rounded-lg px-4 py-2 ${
            isUser 
              ? 'bg-brand-indigo text-white' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
          }`}
        >
          {item.content}
        </div>
      </div>
    );
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-12 h-12 shadow-lg bg-brand-indigo hover:bg-brand-purple"
      >
        <Sparkles size={20} />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-80 sm:w-96 shadow-xl">
      <CardHeader className="p-4 flex flex-row items-center justify-between bg-gradient-to-r from-brand-indigo to-brand-purple text-white">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Sparkles size={16} />
          AI Assistant
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 text-white hover:bg-white/10">
          <X size={16} />
        </Button>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="h-72 overflow-y-auto mb-4 pt-2 chat-container">
          {chatHistory.map(renderChatBubble)}
        </div>
        
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about the components..."
            className="flex-1"
          />
          <Button size="sm" onClick={handleSendMessage} disabled={!message.trim()} className="bg-brand-indigo hover:bg-brand-purple">
            <Send size={16} />
          </Button>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="text-xs py-1 h-auto" onClick={() => setMessage("Make this component fully responsive")}>
            Make responsive
          </Button>
          <Button variant="outline" size="sm" className="text-xs py-1 h-auto" onClick={() => setMessage("Suggest a better color palette")}>
            Color palette
          </Button>
          <Button variant="outline" size="sm" className="text-xs py-1 h-auto" onClick={() => setMessage("Improve accessibility")}>
            Accessibility
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAssistant;
