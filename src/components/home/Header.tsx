import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="mx-auto max-w-3xl text-center mb-16">
      <div className="flex flex-col items-center justify-center gap-8">
        <div className="space-y-2">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900">
            Fast, Free Screening for Art & Antiques
          </h1>
          <p className="text-xl text-[#007bff]">
            Expert Art & Antique Analysis
          </p>
        </div>

        <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
          Discover what your art or antique is truly worth with a free, no-strings-attached image appraisal.
        </p>
        
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#007bff]" />
            <span className="text-gray-600">Free instant analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#007bff]" />
            <span className="text-gray-600">No sign-up required</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#007bff]" />
            <span className="text-gray-600">Professional insights</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;