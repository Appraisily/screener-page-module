import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const examples = [
  {
    id: 1,
    url: 'https://ik.imagekit.io/appraisily/WebPage/Appraisal%20Example%20Free/a1.PNG',
    alt: 'Example appraisal 1'
  },
  {
    id: 2,
    url: 'https://ik.imagekit.io/appraisily/WebPage/Appraisal%20Example%20Free/avon.JPG',
    alt: 'Example appraisal 2'
  },
  {
    id: 3,
    url: 'https://ik.imagekit.io/appraisily/WebPage/Appraisal%20Example%20Free/c4.PNG',
    alt: 'Example appraisal 3'
  },
  {
    id: 4,
    url: 'https://ik.imagekit.io/appraisily/WebPage/Appraisal%20Example%20Free/cs_live_a1rYnWWcwxd6dmA20smaDrpUKQoTLmeVA9JAmUXrQA0w211wUaupB9bTL8_main-1737144157220.jpg',
    alt: 'Example appraisal 4'
  },
  {
    id: 5,
    url: 'https://ik.imagekit.io/appraisily/WebPage/Appraisal%20Example%20Free/front.JPG',
    alt: 'Example appraisal 5'
  },
  {
    id: 6,
    url: 'https://ik.imagekit.io/appraisily/WebPage/Appraisal%20Example%20Free/images.jpg',
    alt: 'Example appraisal 6'
  }
];

const ExampleCarousel: React.FC = () => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Recent Appraisals</h2>
        <p className="mt-2 text-lg text-gray-600">
          Examples of items we've analyzed
        </p>
      </div>

      <div className="relative group">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 
                   w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center
                   text-gray-700 hover:text-[#007bff] transition-colors duration-200
                   opacity-0 group-hover:opacity-100 focus:outline-none"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide gap-4 pb-4 -mx-4 px-4"
          style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
        >
          {examples.map((example) => (
            <div
              key={example.id}
              className="flex-none w-72 h-48 relative rounded-xl overflow-hidden shadow-lg
                       transition-transform duration-300 hover:scale-[1.02]"
              style={{ scrollSnapAlign: 'start' }}
            >
              <img
                src={example.url}
                alt={example.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 
                   w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center
                   text-gray-700 hover:text-[#007bff] transition-colors duration-200
                   opacity-0 group-hover:opacity-100 focus:outline-none"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ExampleCarousel;