import { User, Fingerprint, MapPin, Stamp, Calendar, Search } from 'lucide-react';

const IMAGEKIT_URL = 'https://ik.imagekit.io/appraisily/WebPage';

const tools = [
  {
    id: 'maker',
    name: 'Maker Analysis',
    description: 'Identify potential creator',
    icon: User,
    image: `${IMAGEKIT_URL}/maker?tr=w-64,h-64,q-60`,
  },
  {
    id: 'signature',
    name: 'Signature Check',
    description: 'Analyze signatures',
    icon: Fingerprint,
    image: `${IMAGEKIT_URL}/signature?tr=w-64,h-64,q-60`,
  },
  {
    id: 'origin',
    name: 'Origin Analysis',
    description: 'Determine likely origin',
    icon: MapPin,
    image: `${IMAGEKIT_URL}/origin?tr=w-64,h-64,q-60`,
  },
  {
    id: 'marks',
    name: 'Marks Recognition',
    description: 'Identify maker marks',
    icon: Stamp,
    image: `${IMAGEKIT_URL}/marks?tr=w-64,h-64,q-60`,
  },
  {
    id: 'age',
    name: 'Age Analysis',
    description: 'Estimate creation period',
    icon: Calendar,
    image: `${IMAGEKIT_URL}/age?tr=w-64,h-64,q-60`,
  },
  {
    id: 'visual',
    name: 'Visual Search',
    description: 'Find similar artworks',
    icon: Search,
    image: `${IMAGEKIT_URL}/visual?tr=w-64,h-64,q-60`
  }
];

interface AnalysisToolsProps {
  className?: string;
  onToolSelect?: (toolId: string) => void;
}

export default function AnalysisTools({ className, onToolSelect }: AnalysisToolsProps) {
  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const IconComponent = tool.icon;
          const isVisualSearch = tool.id === 'visual';

          return (
            <div
              key={tool.id}
              onClick={() => onToolSelect?.(tool.id)}
              className={`group cursor-pointer relative ${isVisualSearch ? 'md:col-span-2 lg:col-span-3' : ''}`}
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
                      loading="lazy"
                      width="64"
                      height="64"
                    />
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
    </div>
  );
}