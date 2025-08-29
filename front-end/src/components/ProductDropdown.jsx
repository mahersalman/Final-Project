import { useState, useEffect } from "react";
import axios from "axios";
import serverUrl from "@config/api";

const ProductDropdown = ({
  value,
  onChange,
  includeAllOption = false,
  className = "",
}) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/products`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        console.log("Error details:", error.response);
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
        <option key={product._id} value={product.product_name}>
          {product.product_name}
        </option>
      ))}
    </select>
  );
};

export default ProductDropdown;
