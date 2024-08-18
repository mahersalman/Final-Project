import React from 'react';

const departments = [
  'הרכבות 1',
  'הרכבות 2',
  'טלפוניה',
  'הרכבות אלקטרוניקה',
  'פלקס',
  'פרמהספט'
];

const DepartmentDropdown = ({ value, onChange, includeAllOption = false, className = ''  }) => {
 return (
   <select
     value={value}
     onChange={onChange}
     className={`border rounded ${className}`}   
     >
     {includeAllOption && <option value="all">כל המחלקות</option>}
     {departments.map((dept) => (
       <option key={dept} value={dept}>
         {dept}
       </option>
     ))}
   </select>
 );
};

export default DepartmentDropdown;