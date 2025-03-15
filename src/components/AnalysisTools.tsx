import { User, Fingerprint, MapPin, Stamp, Calendar, Search } from 'lucide-react';

const tools = [
  {
    id: 'visual',
    name: 'Visual Search',
    description: 'Find similar artworks',
    icon: Search,
    image: 'https://images.unsplash.com/photo-1581281863883-2469417a1668?w=300&h=300&fit=crop'
  },
  {
    id: 'origin',
    name: 'Origin Analysis',
    description: 'Determine likely origin',
    icon: MapPin,
    image: 'https://images.unsplash.com/photo-1581281863883-2469417a1668?w=300&h=300&fit=crop'
  },
  {
    id: 'maker',
    name: 'Maker Analysis',
    description: 'Identify potential creator',
    icon: User,
    image: 'https://images.unsplash.com/photo-1581281863883-2469417a1668?w=300&h=300&fit=crop'
  },
  {
    id: 'signature',
    name: 'Signature Check',
    description: 'Analyze signatures',
    icon: Fingerprint,
    image: 'https://images.unsplash.com/photo-1581281863883-2469417a1668?w=300&h=300&fit=crop'
  },
  {
    id: 'age',
    name: 'Age Analysis',
    description: 'Estimate creation period',
    icon: Calendar,
    image: 'https://images.unsplash.com/photo-1581281863883-2469417a1668?w=300&h=300&fit=crop'
  }
];

interface AnalysisToolsProps {
  onToolSelect?: (toolId: string) => void;
}

const AnalysisTools: React.FC<AnalysisToolsProps> = ({ onToolSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((tool) => {
        const IconComponent = tool.icon;
        return (
          <div
            key={tool.id}
            onClick={() => onToolSelect?.(tool.id)}
            className="group cursor-pointer"
          >
            <div className="relative bg-white rounded-lg border border-gray-100 hover:border-[#007bff] p-6 
                        shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={tool.image}
                    alt={tool.name}
                    className="w-full h-full object-cover transform transition-transform duration-300 
                             group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    {tool.name}
                    <IconComponent className="h-5 w-5 text-[#007bff]" aria-hidden="true" />
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {tool.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AnalysisTools;