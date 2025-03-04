import React, {useEffect, useState, useContext} from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";  
import Header from "./components/Header"; 
import CheckoutPage from "./pages/CheckoutPage";
import OrderPage from "./pages/OrderPage";
import AdminPage from "./pages/AdminPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import { AuthContext } from "./context/AuthContext";
import AdminRoute from "./protectedRoute/AdminRoute";
import Unauthorized from "./pages/Unauthorized";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";
import axios from "axios";

const AppContent = () => {
  const { user } = useContext(AuthContext); // ✅ Get user from context
  const location = useLocation(); // Get the current route
  const [cart, setCart] = useState(null);

  // Fetch Cart Products
  const fetchCartProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/cart/get-cart-products", {
        withCredentials: true,
      });
      setCart(res.data.cart);
    } catch (err) {
      console.error("Fetching cart failed", err);
    }
  };

  useEffect(() => {
    fetchCartProducts(); // Load cart when app starts
  }, []);

  return (
    <>
     {location.pathname !== "/register-page" && location.pathname !== "/login-page" && <Header cart={cart} />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductPage fetchCartProducts={fetchCartProducts} />} />
        <Route path="/cart" element={<CartPage cart={cart} setCart={setCart}/>} />
        <Route path="/checkout" element={<CheckoutPage cart={cart} setCart={setCart} />} />
        <Route path="/payment" element={<PaymentPage cart={cart} setCart={setCart} />} />
        <Route path="/orders" element={<OrderPage />} />
        <Route path="/admin-page" element={<AdminRoute><AdminPage /></AdminRoute>} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/register-page" element={<RegisterPage />} />
        <Route path="/login-page" element={<LoginPage />} />
        <Route path="/payment-success" element={<PaymentSuccess cart={cart} setCart={setCart} />} />
        <Route path="/payment-failed" element={<PaymentSuccess />} />

      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
