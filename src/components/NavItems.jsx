import React from "react";
import { Link } from "react-router-dom";
import { RiHome4Line } from "react-icons/ri";
import { PiClockClockwise } from "react-icons/pi";
import { LuUsers } from "react-icons/lu";
import { AiOutlineProduct } from "react-icons/ai";
import { TbLogout2 } from "react-icons/tb";
import { LuSettings } from "react-icons/lu";

const NavItems = ({ isMobile, closeMenu }) => {
  const handleClick = () => {
    if (isMobile && closeMenu) {
      closeMenu();
    }
  };

  return (
    <>
      <li className="hover:bg-[#246B35] rounded-[7px] hover:text-white">
        <Link
          className="px-3 py-2 rounded flex items-center space-x-2"
          to="/home"
          onClick={handleClick}
        >
          <RiHome4Line />
          <span>דף הבית</span>
        </Link>
      </li>
      <li className="hover:bg-[#246B35] rounded-[7px] hover:text-white">
        <Link
          className="px-3 py-2 rounded flex items-center space-x-2"
          to="/station"
          onClick={handleClick}
        >
          <PiClockClockwise />
          <span>שיבוץ עמדות</span>
        </Link>
      </li>
      <li className="hover:bg-[#246B35] rounded-[7px] hover:text-white">
        <Link
          className="px-3 py-2 rounded flex items-center space-x-2"
          to="/employees"
          onClick={handleClick}
        >
          <LuUsers />
          <span>עובדים</span>
        </Link>
      </li>
      <li className="hover:bg-[#246B35] rounded-[7px] hover:text-white">
        <Link
          className="px-3 py-2 rounded flex items-center space-x-2"
          to="/productivity"
          onClick={handleClick}
        >
          <AiOutlineProduct />
          <span>מעקב תפוקות</span>
        </Link>
      </li>
      <li className="hover:bg-[#246B35] rounded-[7px] hover:text-white">
        <Link
          className="px-3 py-2 rounded flex items-center space-x-2"
          to="/my-account"
          onClick={handleClick}
        >
          <LuSettings />
          <span>החשבון שלי</span>
        </Link>
      </li>
      {isMobile && (
        <li className="hover:bg-[#246B35] rounded-[7px] hover:text-white">
          <Link
            className="px-3 py-2 rounded flex items-center space-x-2"
            to="/"
            onClick={handleClick}
          >
            <TbLogout2 />
            <span>התנתקות</span>
          </Link>
        </li>
      )}
    </>
  );
};

export default NavItems;
