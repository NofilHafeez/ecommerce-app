import React, { useEffect, useState, useRef } from "react";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";
import { CiCirclePlus } from "react-icons/ci";
import Footer from "../components/Footer";
import axios from "axios";
import { HiOutlineMenu } from "react-icons/hi";
import { RiCloseLine } from "react-icons/ri";
import { useLocation } from "react-router-dom";


const ProductPage = ({ fetchCartProducts }) => {
  const scrollRef = useRef(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromUrl = queryParams.get("category");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (categoryFromUrl) {
      setCategory(categoryFromUrl); 
      const filtered = products.filter((product) => product.category.toLowerCase() === categoryFromUrl);
      setFilteredProducts(filtered);
    }
  }, [categoryFromUrl, products]);
  

  const addProductCart = async (id) => {
    try {
      await axios.post(`${API_URL}/api/cart/adding-to-carts/${id}`, {}, { withCredentials: true });
      fetchCartProducts();
    } catch (err) {
      console.error("Error adding products:", err);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      const scroll = new LocomotiveScroll({
        el: scrollRef.current,
        smooth: true,
      });

      setTimeout(() => {
        scroll.update();
      }, 500);

      return () => {
        scroll.destroy();
      };
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/product/get-products`, { withCredentials: true });
      setProducts(res.data.products);
      setFilteredProducts(res.data.products);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    filterProducts(e.target.value, category);
  };

  const handleCategoryChange = (category) => {
    setCategory(category);
    filterProducts(searchTerm, category);
  };

  const filterProducts = (search, category) => {
    let filtered = products;

    if (search) {
      filtered = filtered.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()));
    }

    if (category) {
      filtered = filtered.filter((product) => product.category === category);
    }

    setFilteredProducts(filtered);
  };

  return (
    <>
      <div data-scroll-container ref={scrollRef}>
        <div className="p-5 pt-20 right-0 justify-end bg-white shadow-md sticky top-0 z-50 flex gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-1/3 p-2 border rounded-md"
          />
        </div>

        <button
          className="md:hidden fixed top-20 left-2 z-50 bg-black text-white p-2 rounded-full"
          onClick={() => setSidebarOpen(true)}
        >
          <HiOutlineMenu size={24} />
        </button>

        <div className="flex">
          <div
            className={`fixed top-0 left-0 w-[250px] h-full bg-white shadow-lg border-r z-50 p-5 transform transition-transform duration-300 
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
          >
            <button
              className="md:hidden absolute top-20 right-3 text-black text-2xl"
              onClick={() => setSidebarOpen(false)}
            >
              <RiCloseLine />
            </button>
            <h1 className="text-4xl">MENS/</h1>
            <h2 className="text-xl font-bold mb-3 mt-10">Categories</h2>
            <label className="flex items-center gap-3">
              <input type="radio" name="category" onChange={() => handleCategoryChange("")} checked={!category} />
              All
            </label>
            <label className="flex items-center gap-3">
              <input type="radio" name="category" onChange={() => handleCategoryChange("Shoes")} checked={category === "Shoes"} />
              Shoes
            </label>
            <label className="flex items-center gap-3">
              <input type="radio" name="category" onChange={() => handleCategoryChange("Jackets")} checked={category === "Jackets"} />
              Jackets
            </label>
            <label className="flex items-center gap-3">
              <input type="radio" name="category" onChange={() => handleCategoryChange("shirts")} checked={category === "shirts"} />
              Shirts
            </label>
          </div>

          <div data-scroll-section className="bg-[#ededed] w-full min-h-screen p-10 md:ml-[250px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredProducts.map((product, index) => (
                <div key={product._id || index} className="bg-white shadow-lg p-3 rounded-lg">
                  <div className="w-full h-64">
                    <img
                      src={product.image || "https://i.pinimg.com/736x/10/24/62/102462d008986c61821000f99a2ad634.jpg"}
                      className="w-full h-full object-cover object-top md:object-top rounded-lg"
                      alt={product.name || "Product Image"}
                    />
                  </div>
                  <div className="mt-3">
                    <h1 className="text-md font-semibold">{product.name || "Black Jacket With Trouser"}</h1>
                    <div className="flex justify-between items-center mt-2">
                      <h2 className="font-bold text-lg">${product.price || 100}</h2>
                      <button onClick={() => addProductCart(product._id)} className="text-2xl text-gray-700 hover:text-black">
                        <CiCirclePlus />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div  data-scroll-section>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default ProductPage;
