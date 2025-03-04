import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PanelProps {
  title: string;
  description: string;
  image?: string;
  icon: LucideIcon;
  isActive?: boolean;
  isComplete?: boolean;
}

const Panel: React.FC<PanelProps> = ({
  title,
  description,
  image,
  icon: Icon,
  isActive = false,
  isComplete = false,
}) => {
  const getBorderColor = () => {
    if (isActive) return 'border-secondary-500 shadow-secondary-500/10 ring-2 ring-secondary-500/20';
    if (isComplete) return 'border-secondary-500 shadow-secondary-500/10';
    return 'border-slate-100 hover:border-secondary-500';
  };

  const getIconBackground = () => {
    if (isActive) return 'bg-secondary-500/10';
    if (isComplete) return 'bg-secondary-500/5';
    return 'bg-slate-50 group-hover:bg-secondary-500/5';
  };

  const getIconColor = () => {
    if (isActive) return 'text-primary-900 animate-pulse';
    if (isComplete) return 'text-primary-900';
    return 'text-slate-400 group-hover:text-primary-900';
  };

  return (
    <div
      className={`group relative bg-white rounded-xl shadow-sm border overflow-hidden
                 ${getBorderColor()} 
                 hover:shadow-lg hover:shadow-secondary-500/10 transition-all duration-300 transform hover:-translate-y-1`}
    >
      {image && (
        <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
          <img
            src={image}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
        </div>
      )}
      
      <div className="relative p-6">
        <div className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center ${getIconBackground()}`}>
          <Icon className={`w-6 h-6 ${getIconColor()}`} />
        </div>
        
        <h3 className="font-semibold text-primary-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
        
        {isActive && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-secondary-500">
            <div className="h-full bg-white/30 animate-[progress_2s_ease-in-out_infinite]" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Panel;