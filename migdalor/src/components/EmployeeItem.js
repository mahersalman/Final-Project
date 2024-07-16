import React from 'react';

const EmployeeItem = ({ name, isSelected, onClick }) => {
  return (
    <div
      className={`flex items-center p-2 rounded-md cursor-pointer mb-1 ${
        isSelected ? 'bg-[#246B35] text-white' : 'bg-white'
      }`}
      onClick={onClick}
    >
      {/* <div className="w-2 h-2 bg-[#246B35] rounded-full mr-2"></div> */}
      <span>{name}</span>
    </div>
  );
};

export default EmployeeItem;