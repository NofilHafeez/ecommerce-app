import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { IoBagOutline } from "react-icons/io5";
import { VscAccount } from "react-icons/vsc";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import profilePlaceholder from "../assets/profile.png";
import { AuthContext } from "../context/AuthContext.jsx";

const Header = ({ cart }) => {
  const { user, setUser, fetchUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    if (cart?.cartItems?.length) {
      const total = cart.cartItems.reduce((sum, item) => sum + item.quantity, 0);
      setTotalProducts(total);
    } else {
      setTotalProducts(0);
    }
  }, [cart]);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/api/auth/logout", {}, { withCredentials: true });
      setUser(null);
      navigate("/login-page");
    } catch (error) {
      console.error("Error Logging Out:", error);
    }
  };

  return (
    <div>
      <div className="bg-white fixed top-0 left-0 text-black z-[1000] flex w-full justify-between items-center h-16 px-5 shadow-md">
        {/* Mobile Menu Button */}
        <button className="md:hidden text-xl" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <HiX /> : <HiOutlineMenu />}
        </button>

        {/* Navigation Links (Hidden on Small Screens) */}
        <div className="hidden md:flex gap-5 text-md">
          <Link to="/mens" className="hover:underline">Mens</Link>
          <Link to="/shoes" className="hover:underline">Shoes</Link>
        </div>

        {/* Logo */}
        <div className="font-bold text-xl">
          <Link to="/">BCKWRD</Link>
        </div>

        {/* Icons */}
        <div className="flex gap-7 text-xl relative">
          <Link to="/search" className="hover:text-gray-500"><FiSearch /></Link>
          <Link to="/cart" className="hover:text-gray-500 relative">
            <span className="bg-red-500 text-white absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center rounded-full text-xs">{totalProducts}</span>
            <IoBagOutline className="text-black" />
          </Link>

          {/* Profile Icon with Hover Menu */}
          <div
            className="relative flex items-center"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            <VscAccount className="hover:text-gray-500 cursor-pointer" />
            {isOpen && (
              <div className="absolute right-2 top-3 mt-2 w-56 bg-white shadow-lg rounded-lg p-4 z-50" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
                <div className="flex flex-col items-center">
                  <img
                    src={user?.profileImage || profilePlaceholder}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border border-gray-300"
                  />
                  <p className="mt-2 text-md font-semibold">{user ? user.name : "Guest"}</p>
                </div>
                <div className="mt-4">
                  {!user ? (
                    <Link
                      to="/register-page"
                      className="block text-sm bg-blue-500 text-white text-center py-2 rounded-md mb-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Create Account
                    </Link>
                  ) : (
                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-500 text-white py-2 rounded-md text-sm"
                    >
                      Logout
                    </button>
                  )}
                  <Link to="/order" className="block text-sm text-center text-gray-700 mt-2">
                    View Orders
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full bg-white shadow-md p-5 flex flex-col gap-4 z-50">
          <Link to="/mens" className="hover:underline" onClick={() => setMenuOpen(false)}>Mens</Link>
          <Link to="/shoes" className="hover:underline" onClick={() => setMenuOpen(false)}>Shoes</Link>
        </div>
      )}
    </div>
  );
};

export default Header;
