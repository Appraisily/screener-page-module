import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from './SimpleIcons';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: 'https://appraisily.com/about' },
    { name: 'Services', href: 'https://appraisily.com/services' },
    { name: 'Expertise', href: 'https://appraisily.com/expertise' },
    { name: 'Team', href: 'https://appraisily.com/team' }
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-elegant border-b border-gray-200' 
        : 'bg-white/80 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="https://appraisily.com" className="flex items-center gap-3 group">
              <div className="relative">
                <img 
                  src="https://ik.imagekit.io/appraisily/WebPage/logo_new.png?updatedAt=1731919266638" 
                  alt="Appraisily Logo" 
                  className="h-10 w-auto transition-transform duration-200 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-semibold text-gray-900 tracking-tight">Appraisily</span>
                <span className="text-xs text-gray-600 font-medium">Professional Appraisals</span>
              </div>
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 
                         hover:bg-gray-50 rounded-lg transition-all duration-200"
              >
                {link.name}
              </a>
            ))}
            <div className="ml-4">
              <a
                href="https://appraisily.com/start"
                className="btn-primary group"
              >
                Start Appraisal 
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            <a
              href="https://appraisily.com/start"
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 
                       rounded-lg transition-colors duration-200 shadow-sm"
            >
              Start
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-50 
                       transition-colors duration-200 focus:outline-none focus:ring-2 
                       focus:ring-gray-900 focus:ring-offset-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 
                         hover:bg-gray-50 rounded-lg transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="pt-2 mt-2 border-t border-gray-200">
              <a
                href="https://appraisily.com/start"
                className="btn-primary w-full justify-center"
                onClick={() => setIsOpen(false)}
              >
                Start Full Appraisal
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}