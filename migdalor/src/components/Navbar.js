import React from 'react';
import { RiHome4Line } from "react-icons/ri";
import { PiClockClockwise } from "react-icons/pi";
import { LuUsers } from "react-icons/lu";
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";

import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

const Navbar = () => {
 return (
  <nav className="bg-gray-100 flex items-center justify-between p-2">
   <img src="/migdalorLogo.png" alt="logo" height={60} width={60} className="ml-4"/>
   <ul className="flex  justify-center space-x-4 list-none">
    <li className='hover:bg-[#246B35] rounded-[7px] hover:text-white'><Link className="px-3 py-2 rounded flex items-center space-x-2" to="/">
     <RiHome4Line />
     <span>דף הבית</span>
     </Link></li>
     <li className='hover:bg-[#246B35] rounded-[7px] hover:text-white'><Link className="px-3 py-2 rounded flex items-center space-x-2" to="/">
      <PiClockClockwise />
      <span>
      שיבוץ עמדות
      </span>
     </Link></li>
     <li className='hover:bg-[#246B35] rounded-[7px] hover:text-white'><Link className="px-3 py-2 rounded flex items-center space-x-2" to="/">
     <LuUsers />
     <span>
     עובדים
     </span>
     </Link></li>
     <li className='hover:bg-[#246B35] rounded-[7px] hover:text-white'><Link className="px-3 py-2 rounded flex items-center space-x-2" to="/">
      <HiOutlineClipboardDocumentCheck />
      <span>
     דוחות
     </span>
     </Link></li>

   </ul>
  </nav>
 )
}

export default Navbar;
