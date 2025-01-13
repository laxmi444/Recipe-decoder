import React, { useState } from 'react';
import axios from 'axios';
import { Utensils } from "lucide-react";
import { Link } from 'react-router-dom';

const DecodePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [peopleCount, setPeopleCount] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [response, setResponse] = useState(null);

  // const handleImageUpload = async (event) => {
  //   const file = event.target.files[0];
  //   if (!file) {
  //     alert("Please select an image.");
  //     return;
  //   }

  //   setIsLoading(true);
  //   const formData = new FormData();
  //   formData.append('photo', file);

  //   try {
  //     const backendUrl = 'http://127.0.0.1:5000/upload'; // Replace with your Flask server's URL
  //     const result = await axios.post(backendUrl, formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });

  //     setResponse(result.data);
  //   } catch (error) {
  //     console.error("Error uploading image:", error);
  //     alert("Error uploading image. Please try again.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setError('');
      const response = await axios.post('http://127.0.0.1:5174/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPrediction(response.data.predicted_class);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while processing your request.');
    }
  };

  const handleIncrement = () => setPeopleCount((prevCount) => Math.min(Number(prevCount) + 1, 100));
  const handleDecrement = () => setPeopleCount((prevCount) => Math.max(Number(prevCount) - 1, 0));

  return (
    <div className="min-h-screen w-full bg-[#FDF0D5]">
      <div className={`fixed top-0 left-0 h-screen bg-[#EDC4B3] rounded-tr-3xl rounded-br-3xl p-8 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-72' : 'w-20'}`}>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="mt-8 flex flex-col space-y-1.5 cursor-pointer"
        >
          <span className="block w-8 h-0.5 bg-[#1B4965]"></span>
          <span className="block w-8 h-0.5 bg-[#1B4965]"></span>
          <span className="block w-8 h-0.5 bg-[#1B4965]"></span>
        </button>
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

          {/* <label className="bg-[#669BBC] text-white px-8 py-2 rounded-md cursor-pointer hover:bg-opacity-90 transition-opacity mb-12 font-['Fira_Sans_Extra_Condensed']">
            Upload Image
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label> */}

          <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileChange} accept=".jpg,.jpeg,.png" />
            <button type="submit">Submit</button>
          </form>
          {prediction && <p>Predicted Class: {prediction}</p>}
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}

          <div className="w-[500px] flex items-center justify-center space-x-4 mb-12">
            <button
              onClick={handleDecrement}
              className="bg-[#C1121F] bg-opacity-30 border-2 border-[#C1121F] text-[#C1121F] px-6 py-4 rounded-full text-xl font-['Fira_Sans_Extra_Condensed'] hover:bg-[#C1121F] hover:text-white transition-all"
            >
              -
            </button>

            <input
              type="number"
              value={peopleCount}
              onChange={(e) => setPeopleCount(e.target.value)}
              placeholder="Estimate no. of people you're cooking for:"
              className="w-[150px] bg-[#669BBC] text-white placeholder-white px-8 py-3 rounded-full outline-none text-center font-['Fira_Sans_Extra_Condensed']"
            />

            <button
              onClick={handleIncrement}
              className="bg-[#C1121F] bg-opacity-30 border-2 border-[#C1121F] text-[#C1121F] px-6 py-4 rounded-full text-xl font-['Fira_Sans_Extra_Condensed'] hover:bg-[#C1121F] hover:text-white transition-all"
            >
              +
            </button>
          </div>

          {isLoading && (
            <div className="mt-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B4965]"></div>
            </div>
          )}

          {response && (
            <div className="mt-8 p-4 bg-gray-100 rounded shadow">
              <h2 className="text-xl font-bold mb-2">Recipe Details:</h2>
              <pre className="text-sm">{JSON.stringify(response, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DecodePage;
