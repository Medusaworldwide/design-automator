
import React from 'react';
import { Button } from "@/components/ui/button";
import { Menu, Zap, UserCircle, Settings } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="w-full py-4 px-6 border-b bg-white dark:bg-gray-900 backdrop-blur-sm bg-opacity-80 z-50 flex items-center justify-between">
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-brand-indigo to-brand-purple flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-indigo to-brand-purple">
            Design Automator
          </h1>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" className="hidden md:flex gap-2">
          <UserCircle size={16} />
          <span>Sign In</span>
        </Button>
        <Button variant="ghost" size="sm" className="hidden md:flex">
          <Settings size={16} />
        </Button>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu size={20} />
        </Button>
      </div>
    </header>
  );
};

export default Header;
