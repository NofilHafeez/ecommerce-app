import React, { useEffect, useRef } from "react";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import axios from "axios";

const CartPage = ({ cart, setCart }) => {
  const scrollRef = useRef(null);
  const scrollInstance = useRef(null);

  useEffect(() => {
    scrollInstance.current = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      lerp: 0.1,
    });

    setTimeout(() => {
      scrollInstance.current.update();
    }, 500);

    return () => {
      if (scrollInstance.current) {
        scrollInstance.current.destroy();
      }
    };
  }, []);

  const cartItems = cart?.cartItems || [];

  // Update quantity
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setCart((prevCart) => ({
      ...prevCart,
      cartItems: prevCart?.cartItems?.map((item) =>
        item.product._id === productId ? { ...item, quantity: newQuantity } : item
      ),
    }));
  };

  // Remove item
  const handleRemoveItem = async (productId) => {
    try {
      await axios.post(`http://localhost:3000/api/cart/removing-from-carts/${productId}`, {}, { withCredentials: true });

      setCart((prevCart) => ({
        ...prevCart,
        cartItems: prevCart?.cartItems?.filter((item) => item.product._id !== productId),
      }));

      setTimeout(() => {
        if (scrollInstance.current) {
          scrollInstance.current.update();
        }
      }, 300);
    } catch (err) {
      console.error("deleting product failed", err);
    }
  };

  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <>
      <div ref={scrollRef} data-scroll-container className="w-full min-h-screen pt-20 flex flex-col bg-[#ededed]">
        <div data-scroll-section className="p-4 md:p-20 pb-10 flex flex-col gap-10">
          {cartItems.length === 0 ? (
            <h1 className="text-center text-2xl">Your cart is empty 🛒</h1>
          ) : (
            cartItems.map((item) => (
              <div key={item.product._id} className="flex flex-wrap md:flex-nowrap justify-between items-center border-b pb-4">
                {/* ✅ Product Details */}
                <div className="flex flex-wrap md:flex-nowrap items-center w-full">
                  <div className="w-24 h-24 md:w-48 md:h-48 shrink-0 bg-amber-200">
                    <img
                      src={item.product.image || "https://via.placeholder.com/150"}
                      className="w-full h-full object-cover object-top"
                      alt={item.product.name}
                    />
                  </div>
                  <div className="ml-4 mt-2 md:mt-0">
                    <h1 className="text-lg md:text-2xl mb-2">{item.product.name}</h1>
                    <div className="flex gap-3 items-center">
                      <h2 className="font-bold">${item.product.price}</h2>

                      {/* ✅ Quantity Controls */}
                      <div className="flex items-center border rounded-md">
                        <button
                          className="px-2 border-r"
                          onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <input
                          className="w-10 text-center border-0 outline-none"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.product._id, Number(e.target.value))}
                          type="number"
                          min="1"
                        />
                        <button
                          className="px-2 border-l"
                          onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ✅ Subtotal & Remove Button */}
                <div className="border-t md:border-t-0 md:border-l border-gray-400 w-full md:w-auto px-4 py-4 md:py-0 flex justify-between md:flex-col font-bold">
                  <div>
                    <h1 className="text-xl">SUBTOTAL:</h1>
                    <h2>${item.product.price * item.quantity}</h2>
                  </div>
                  <button onClick={() => handleRemoveItem(item.product._id)} className="text-red-500 outline-none">
                    Remove Item
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ✅ Checkout Section */}
        <div data-scroll-section className="w-full flex flex-wrap md:flex-nowrap justify-between items-center bg-[#ededed] gap-3 p-4 md:p-10">
          <div className="flex text-lg">
            <h1 className="mr-2">Total Price:</h1>
            <h1>${totalPrice}</h1>
          </div>
          <Link to="/checkout" className="w-full md:w-auto">
            <button className="py-2 px-5 bg-gray-500 text-white outline-none w-full md:w-auto">
              Proceed To Checkout
            </button>
          </Link>
        </div>

        <div data-scroll-section>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default CartPage;
