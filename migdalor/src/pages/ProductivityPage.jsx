import React from 'react';
import ShlokerCheck from '../components/reports/ShlokerCheck'
import Navbar from '../components/Navbar';
import ReportGenerator from '../components/reports/ReportGenerator';

const ProductivityPage = () => {
 return (
  <div>
   <Navbar />
   <ShlokerCheck />
   <ReportGenerator />
   <button className="my-4 bg-[#1F6231] border-none relative pointer hover:bg-[#309d49] text-white font-bold py-2 px-4 rounded">
          יצירת דוח
   </button>
  </div>
 )
};

export default ProductivityPage;

