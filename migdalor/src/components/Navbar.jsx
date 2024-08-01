import React, { useState, useEffect } from 'react';
import { IoMdMenu } from "react-icons/io";
import { TbLogout2 } from "react-icons/tb";
import { Link } from 'react-router-dom';
import NavItems from './NavItems';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-gray-100 p-2">
      <div className="flex items-center justify-between">
        <img src="/migdalorLogo.png" alt="logo" height={60} width={60} className="ml-4"/>
        {isMobile ? (
          <button onClick={toggleMenu} className="text-2xl">
            <IoMdMenu />
          </button>
        ) : (
          <ul className="flex justify-center space-x-4 list-none">
            <NavItems isMobile={isMobile} />
          </ul>
        )}
        {!isMobile && (
          <Link className="px-3 py-2 flex items-center space-x-2 hover:bg-[#246B35] rounded-[7px] hover:text-white" to="/">
            <TbLogout2 />
            <span>התנתקות</span>
          </Link>
        )}
      </div>
      {isMobile && isOpen && (
        <div className="mt-4">
          <ul className="space-y-2 list-none">
            <NavItems isMobile={isMobile} closeMenu={closeMenu} />
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;