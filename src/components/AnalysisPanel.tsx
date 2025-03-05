import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface AnalysisPanelProps {
  title: string;
  mainText: string;
  description: string;
  icon: LucideIcon;
  image?: string;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({
  title,
  mainText,
  description,
  icon: Icon,
  image
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/40 
                    hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
      <div className="flex items-start gap-4">
        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
          {image ? (
            <>
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </>
          ) : (
            <div className="w-full h-full bg-[#007bff]/5 flex items-center justify-center rounded-lg">
              <Icon className="w-6 h-6 text-[#007bff]" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 flex items-center gap-2 mb-2">
            {title}
          </h3>
          <p className="text-lg font-medium text-gray-800 mb-2">{mainText}</p>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPanel;