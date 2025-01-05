import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Homepage";
import Auth from "./pages/Auth";
import DecodePage from "./pages/DecodePage"
import ExplorePage from "./pages/ExplorePage"
import CookBook from "./pages/CookBook";

function App() {
  return (
    <div className="flex">
      {/* <Navbar/> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/decode" element={<DecodePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/cookbook" element={<CookBook />} />


      </Routes>
    </div>
  )
}
 
export default App;
