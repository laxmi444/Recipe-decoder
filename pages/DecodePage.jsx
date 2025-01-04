import React, { useState } from 'react';
import { Utensils } from "lucide-react";
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import Navbar from "../components/Navbar";

const DecodePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [peopleCount, setPeopleCount] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleImageUpload = (event) => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  const handleIncrement = () => setPeopleCount((prevCount) => Math.min(Number(prevCount) + 1, 100));
  const handleDecrement = () => setPeopleCount((prevCount) => Math.max(Number(prevCount) - 1, 0));

  return (
    <div className="min-h-screen w-full bg-[#FDF0D5]">
      {/* Navigation Sidebar */}
      <div className={`fixed top-0 left-0 h-screen bg-[#EDC4B3] rounded-tr-3xl rounded-br-3xl p-8 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-72' : 'w-20'}`}>
        {/* Hamburger Menu */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="mt-8 flex flex-col space-y-1.5 cursor-pointer"
        >
          <span className="block w-8 h-0.5 bg-[#1B4965]"></span>
          <span className="block w-8 h-0.5 bg-[#1B4965]"></span>
          <span className="block w-8 h-0.5 bg-[#1B4965]"></span>
        </button>

        {/* Navigation Links */}
        <div className={`space-y-8 mt-8 whitespace-nowrap ${!isSidebarOpen ? 'opacity-0' : 'opacity-100 transition-opacity duration-300 delay-150'}`}>
          <Link to="/explore" className="text-[#1B4965] text-2xl font-['Fira_Sans_Extra_Condensed'] font-bold cursor-pointer hover:opacity-80 block">
            Explore
          </Link>
          <Link to="/" className="text-[#1B4965] text-2xl font-['Fira_Sans_Extra_Condensed'] font-bold cursor-pointer hover:opacity-80 block">
            Home
          </Link>
          <Link to="/cookbook" className="text-[#1B4965] text-2xl font-['Fira_Sans_Extra_Condensed'] font-bold cursor-pointer hover:opacity-80 block">
            My CookBook
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-72' : 'ml-20'} flex flex-col items-center justify-center min-h-screen`}>
        <div className="flex flex-col items-center -mt-32">
          <h1 className="text-[#1B4965] text-8xl font-['Fira_Sans_Extra_Condensed'] font-black mb-16 tracking-wider">
            DECODE
          </h1>

          <div className="relative mb-8">
            <span className="text-[#1B4965] text-2xl font-['Fira_Sans_Extra_Condensed'] font-bold text-center block">
              Upload the image,<br />
              let us decode it!
            </span>
            <Utensils 
              className="absolute -right-12 top-1/2 transform -translate-y-1/2" 
              color="#669BBC" 
              size={32}
            />
          </div>

          {/* Upload Button */}
          <label className="bg-[#669BBC] text-white px-8 py-2 rounded-md cursor-pointer hover:bg-opacity-90 transition-opacity mb-12 font-['Fira_Sans_Extra_Condensed']">
            Upload Image
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>

          {/* People Count Input with Increase/Decrease Buttons */}
          <div className="w-[500px] flex items-center justify-center space-x-4 mb-12">
            {/* Decrease Button */}
            <button
              onClick={handleDecrement}
              className="bg-[#C1121F] bg-opacity-30 border-2 border-[#C1121F] text-[#C1121F] px-6 py-4 rounded-full text-xl font-['Fira_Sans_Extra_Condensed'] hover:bg-[#C1121F] hover:text-white transition-all"
            >
              -
            </button>
            
            {/* People Count Input */}
            <input
              type="number"
              value={peopleCount}
              onChange={(e) => setPeopleCount(e.target.value)}
              placeholder="Estimate no. of people you're cooking for:"
              className="w-[150px] bg-[#669BBC] text-white placeholder-white px-8 py-3 rounded-full outline-none text-center font-['Fira_Sans_Extra_Condensed']"
            />

            {/* Increase Button */}
            <button
              onClick={handleIncrement}
              className="bg-[#C1121F] bg-opacity-30 border-2 border-[#C1121F] text-[#C1121F] px-6 py-4 rounded-full text-xl font-['Fira_Sans_Extra_Condensed'] hover:bg-[#C1121F] hover:text-white transition-all"
            >
              +
            </button>
          </div>

          {/* Loading Spinner */}
          {isLoading && (
            <div className="mt-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B4965]"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DecodePage;
