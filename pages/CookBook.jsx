import React, { useState } from 'react';
import { Menu, Heart } from 'lucide-react';

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
  return (
    <div className="min-h-screen w-full bg-[#FDF0D5] fixed inset-0 overflow-auto">
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <nav className="flex justify-between items-center mb-8 relative">
          <button className="p-2 absolute top-0 left-0">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#003049] font-['Fira_Sans_Extra_Condensed'] mx-auto">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <RecipeCard variant="blue" showHeart={false} />
            <RecipeCard variant="pink" showHeart={false} />
            <RecipeCard variant="blue" showHeart={false} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default CookBook;