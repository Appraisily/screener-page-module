import React from 'react';
import { User, Fingerprint, MapPin, Calendar, Search, Stamp } from 'lucide-react';

interface Tool {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  image: string;
}

// Separate tools for Art and Antiques
const artTools: Tool[] = [
  {
    id: 'maker',
    title: 'Maker Analysis',
    description: 'Identify potential creator',
    icon: User,
    image: 'https://images.unsplash.com/photo-1581281863883-2469417a1668?w=300&h=300&fit=crop'
  },
  {
    id: 'signature',
    title: 'Signature Check',
    description: 'Analyze signatures',
    icon: Fingerprint,
    image: 'https://images.unsplash.com/photo-1581281863883-2469417a1668?w=300&h=300&fit=crop'
  },
  {
    id: 'visual',
    title: 'Visual Search',
    description: 'Find similar artworks',
    icon: Search,
    image: 'https://images.unsplash.com/photo-1581281863883-2469417a1668?w=300&h=300&fit=crop'
  }
];

const antiqueTools: Tool[] = [
  {
    id: 'marks',
    title: 'Marks Recognition',
    description: 'Identify maker marks',
    icon: Stamp,
    image: 'https://images.unsplash.com/photo-1581281863883-2469417a1668?w=300&h=300&fit=crop'
  },
  {
    id: 'origin',
    title: 'Origin Analysis',
    description: 'Determine likely origin',
    icon: MapPin,
    image: 'https://images.unsplash.com/photo-1581281863883-2469417a1668?w=300&h=300&fit=crop'
  },
  {
    id: 'age',
    title: 'Age Analysis',
    description: 'Estimate creation period',
    icon: Calendar,
    image: 'https://images.unsplash.com/photo-1581281863883-2469417a1668?w=300&h=300&fit=crop'
  }
];

interface ToolPanelProps {
  itemType: 'Art' | 'Antique' | null;
  sessionId: string | null;
}

const ToolPanel: React.FC<ToolPanelProps> = ({ itemType, sessionId }) => {
  if (!itemType || !sessionId) return null;

  const tools = itemType === 'Art' ? artTools : antiqueTools;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tools.map((tool) => (
        <div
          key={tool.id}
          className="bg-white rounded-xl shadow-sm border border-gray-100 hover:border-[#007bff] 
                     transition-all duration-200 overflow-hidden group cursor-pointer"
        >
          <div className="p-4 flex items-start gap-4">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={tool.image}
                alt={tool.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <tool.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 group-hover:text-gray-800 transition-colors">
                {tool.title}
              </h3>
              <p className="text-sm text-gray-500">{tool.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToolPanel;