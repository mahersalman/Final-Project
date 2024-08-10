import React, { useState } from 'react';
import EmployeeItem from '../components/employees/EmployeeItem';
import Navbar from '../components/Navbar';
import ProductivityPage from './ProductivityPage';

const WorkersPage = () => {
 return (
  <div>
   <Navbar />
   <EmployeeItem />
  </div>
 )
};

export default WorkersPage;
