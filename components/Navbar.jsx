import { useState } from "react";
import { Menu } from "lucide-react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative z-50">
      <button className="p-8" onClick={toggleMenu}>
        <Menu />
      </button>

      {isOpen && (
        <div className=" absolute bg-secondary bg-opacity-55 p-16 top-5 left-5 z-50 rounded-2xl">
          <ul className="font-fira-sans-condensed font-bold text-xl text-accent flex flex-col gap-y-5 w-28 space-y-7 items-center">
            <li>
              <NavLink to={"/explore"} onClick={closeMenu} className="block">
                Explore
              </NavLink>
            </li>
            <li>
              <NavLink to={"/decode"} onClick={closeMenu} className="block">
                Decode
              </NavLink>
            </li>
            <li>
              <NavLink to={"/cookbook"} onClick={closeMenu} className="block">
                My CookBook
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
