
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface ComponentSelectorProps {
  components: Array<{id: number, name: string, type: string}>;
  selectedComponentId: number | null;
  onComponentSelect: (id: number) => void;
}

const ComponentSelector: React.FC<ComponentSelectorProps> = ({ 
  components, 
  selectedComponentId, 
  onComponentSelect 
}) => {
  if (!components.length) return null;

  // Get badge color based on component type
  const getBadgeColor = (type: string) => {
    switch(type) {
      case 'layout': return 'bg-blue-500';
      case 'navigation': return 'bg-purple-500';
      case 'cards': return 'bg-green-500';
      case 'form': return 'bg-orange-500';
      case 'footer': return 'bg-gray-500';
      default: return 'bg-slate-500';
    }
  };

  // Create component thumbnail placeholder
  const getThumbnailBackground = (type: string) => {
    switch(type) {
      case 'layout': 
        return 'bg-gradient-to-br from-blue-400 to-blue-600';
      case 'navigation': 
        return 'bg-gradient-to-br from-purple-400 to-purple-600';
      case 'cards': 
        return 'bg-gradient-to-br from-green-400 to-green-600';
      case 'form': 
        return 'bg-gradient-to-br from-orange-400 to-orange-600';
      case 'footer': 
        return 'bg-gradient-to-br from-gray-400 to-gray-600';
      default: 
        return 'bg-gradient-to-br from-slate-400 to-slate-600';
    }
  };

  return (
    <Card className="mb-6 shadow-lg">
      <CardContent className="p-4">
        <h2 className="text-lg font-medium mb-3">Detected Components</h2>
        <ScrollArea className="h-[130px] pr-4">
          <div className="flex gap-4 pb-2">
            {components.map((component) => (
              <div 
                key={component.id}
                onClick={() => onComponentSelect(component.id)}
                className={`
                  relative cursor-pointer flex flex-col w-28 rounded-lg border-2 
                  transition-all duration-200 
                  ${selectedComponentId === component.id 
                    ? 'border-brand-indigo scale-105 shadow-md' 
                    : 'border-transparent hover:border-gray-200 hover:shadow-sm'
                  }
                `}
              >
                <div 
                  className={`
                    h-20 w-full rounded-t-md flex items-center justify-center
                    ${getThumbnailBackground(component.type)}
                  `}
                >
                  <div className="text-white text-opacity-70 text-sm font-medium">
                    {component.type}
                  </div>
                </div>
                <div className="px-2 py-2 flex flex-col">
                  <span className="text-xs font-medium truncate">{component.name}</span>
                  <Badge 
                    variant="outline" 
                    className={`mt-1 text-[10px] py-0 h-4 ${getBadgeColor(component.type)} text-white`}
                  >
                    {component.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ComponentSelector;
