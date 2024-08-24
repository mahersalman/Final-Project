import React from 'react';

const status = [
  'פעיל',
  'לא פעיל', 
  'מוקפא'
];

const StatusDropdown = ({ value, onChange, className = ''  }) => {
 return (
   <select
     value={value}
     onChange={onChange}
     className={`border rounded ${className}`}   
     >
     {status.map((sta) => (
       <option key={sta} value={sta}>
         {sta}
       </option>
     ))}
   </select>
 );
};

export default StatusDropdown;