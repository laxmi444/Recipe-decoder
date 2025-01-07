import React, { useState } from 'react';
import { Menu, Heart } from 'lucide-react';

// Navigation Component
const Sidebar = ({ isOpen, onClose }) => {
  return (
    <div 
      className={`fixed inset-y-0 -left-4 w-64 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } z-40`}
    >
      <div className="h-full ml-4 bg-[rgba(193,18,31,0.25)] rounded-r-3xl p-6">
        <nav className="mt-16">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#003049] font-['Fira_Sans_Extra_Condensed']">
              Explore
            </h2>
          </div>
          <ul className="space-y-4">
            <li>
              <a 
                href="/decode" 
                className="text-2xl font-bold text-[#003049] font-['Fira_Sans_Extra_Condensed'] hover:text-[#003049]/80"
              >
                Decode
              </a>
            </li>
            <li>
              <a 
                href="/" 
                className="text-2xl font-bold text-[#003049] font-['Fira_Sans_Extra_Condensed'] hover:text-[#003049]/80"
              >
                Home
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

const RecipeCard = ({ variant = 'blue', name, imageSrc, initialLiked = true, showHeart = true }) => {
  const [isLiked, setIsLiked] = useState(initialLiked);

  return (
    <div className={`w-full rounded-lg overflow-hidden shadow-sm`}>
      <div className={`aspect-square ${
        variant === 'blue' ? 'bg-[#d5dfe2]' : 'bg-[#e7b5b5]'
      } relative`}>
        {imageSrc && (
          <img 
            src={imageSrc}
            alt={name}
            className="w-full h-full object-cover"
          />
        )}
        {showHeart && (
          <button 
            className="absolute top-2 right-2 p-1 bg-white rounded-full"
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
          </button>
        )}
      </div>
      {name && (
        <p className="mt-2 text-center font-['Fira_Sans_Extra_Condensed'] text-[#003049] text-sm sm:text-base md:text-lg">{name}</p>
      )}
    </div>
  );
};

const CookBook = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#FDF0D5] fixed inset-0 overflow-auto">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Menu button positioned over the nav bar */}
      <button 
        className="fixed top-6 left-6 z-50 p-2"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu className="w-6 h-6 text-[#003049]" />
      </button>

      {/* Main content with transition */}
      <div 
        className={`transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-12' : 'translate-x-0'
        }`}
      >
        <main className="container mx-auto px-4 py-6 max-w-6xl">
          <nav className="flex justify-between items-center mb-8 relative">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-[#003049] font-['Fira_Sans_Extra_Condensed'] mx-auto">
  My CookBook
</h1>

          </nav>
          
          <div className="flex justify-center mb-8 sm:mb-12">
            <button className="bg-[#003049] text-white px-4 sm:px-6 py-2 rounded-md font-['Fira_Sans_Extra_Condensed'] text-sm sm:text-base">
              Create own!
            </button>
          </div>

          <section className="mb-8 sm:mb-12">
            <h2 className="text-lg sm:text-xl mb-4 font-['Fira_Sans_Extra_Condensed']">Liked Recipes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <RecipeCard 
                variant="blue"
                name="Biryani"
                imageSrc="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=2070&auto=format&fit=crop"
              />
              <RecipeCard 
                variant="pink"
                name="Idli Sambhar"
                imageSrc="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=2940&auto=format&fit=crop"
              />
              <RecipeCard 
                variant="blue"
                name="Dosa"
                imageSrc="https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=2940&auto=format&fit=crop"
              />
            </div>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl mb-4 font-['Fira_Sans_Extra_Condensed']">Own Recipes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <RecipeCard variant="blue" showHeart={false} />
              <RecipeCard variant="pink" showHeart={false} />
              <RecipeCard variant="blue" showHeart={false} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default CookBook;
