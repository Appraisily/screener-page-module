import React from 'react';
import { Bug, Microscope } from 'lucide-react';

interface DebugButtonProps {
  onDebug: (sessionId: string) => void;
}

const DebugButton: React.FC<DebugButtonProps> = ({ onDebug }) => {
  const defaultTestSessionId = '097f7cc5-81cb-4dfa-a41c-68838956a206';
  const specificTestSessionId = '097f7cc5-81cb-4dfa-a41c-68838956a206';

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-4 z-50">
      <button
        onClick={() => onDebug(specificTestSessionId)}
        className="bg-purple-600 text-white p-3 rounded-full shadow-lg 
                 hover:bg-purple-700 transition-all duration-200 group
                 hover:ring-2 hover:ring-offset-2 hover:ring-purple-600"
        title="Test specific session ID"
      >
        <Microscope className="w-5 h-5 group-hover:animate-bounce" />
      </button>
      
      <button
        onClick={() => onDebug(defaultTestSessionId)}
        className="bg-gray-900 text-white p-3 rounded-full shadow-lg 
                 hover:bg-gray-800 transition-all duration-200 group
                 hover:ring-2 hover:ring-offset-2 hover:ring-gray-900"
        title="Test with sample analysis"
      >
        <Bug className="w-5 h-5 group-hover:animate-bounce" />
      </button>
    </div>
  );
};

export default DebugButton;