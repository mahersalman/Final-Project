import React, { useState, useEffect } from 'react';

const ProductDropdown = ({ value, onChange, includeAllOption = false, className = '' }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        console.log('data: ',data);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <select
      value={value}
      onChange={onChange}
      className={`border rounded ${className}`}
    >
      {includeAllOption && <option value="all">כל המוצרים</option>}
      {products.map((product) => (
        <option key={product} value={product}>
          {product}
        </option>
      ))}
    </select>
  );
};

export default ProductDropdown;