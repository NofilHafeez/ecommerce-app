import React, { useState, useEffect, useRef } from "react";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

const CheckoutPage = ({ cart, setCart }) => {
  const scrollRef = useRef(null);
  const locoScroll = useRef(null);
  const cartItems = cart?.cartItems || [];
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;


  const makePayment = async () => {
    const stripe = await loadStripe("pk_test_51QmySuFLiCAMHXQDPLrrqt8D0snwDv1QXOuB4khESKT2iMiNKw8sIU8G0x6CsVIuqQhoHwxj8EJfanWSc5JriSfN001DpSZOo9");

    const res = await axios.post(
      `${API_URL}/api/payment/create-checkout-session`,
      { cartItems },
      { withCredentials: true }
    );
    localStorage.setItem("cartItems", JSON.stringify(cart?.cartItems || []));
    const session = res.data;
    const result = await stripe.redirectToCheckout({ sessionId: session.id });

    if (result.error) {
      console.error(result.error);
    }
  };

  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("");

  // ✅ Initialize Locomotive Scroll
  useEffect(() => {
    if (!scrollRef.current) return;

    locoScroll.current = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      lerp: 0.04, // Adjust for smoother scrolling
    });

    return () => {
      if (locoScroll.current) {
        locoScroll.current.destroy();
        locoScroll.current = null;
      }
    };
  }, []);

  // ✅ Update Locomotive when cart changes
  useEffect(() => {
    setTimeout(() => {
      if (locoScroll.current) {
        locoScroll.current.update();
      }
    }, 500);
  }, [cart]);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;

    setCart((prevCart) => {
      const updatedCart = {
        ...prevCart,
        cartItems: prevCart.cartItems.map((item) =>
          item.product._id === id ? { ...item, quantity: newQuantity } : item
        ),
      };
      return updatedCart;
    });
  };

  const handleRemoveItem = async (productId) => {
    try {
      await axios.post(`${API_URL}/api/cart/removing-from-carts/${productId}`, {}, { withCredentials: true });

      setCart((prevCart) => {
        const updatedCart = {
          ...prevCart,
          cartItems: prevCart.cartItems.filter((item) => item.product._id !== productId),
        };
        return updatedCart;
      });
    } catch (err) {
      console.error("Deleting product failed", err);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    const requestBody = {
      productIds: cartItems.map((item) => item.product._id),
      address: shippingAddress.address,
      city: shippingAddress.city,
      postalCode: shippingAddress.postalCode,
      name: shippingAddress.name,
      paymentMethod: paymentMethod,
    };

    try {
      await axios.post(`${API_URL}/api/checkout/adding-to-checkout`, requestBody, { withCredentials: true });
    } catch (err) {
      console.error("Checkout failed", err);
    }
  };

  const handleShippingChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <div ref={scrollRef} data-scroll-container className="w-full min-h-screen pt-20 bg-[#ededed]">
      <div data-scroll-section className="p-4 md:p-20 pb-10">
        {cartItems.length === 0 ? (
          <h1 className="text-center text-2xl">Your cart is empty 🛒</h1>
        ) : (
          <div className="flex flex-wrap md:flex-nowrap gap-6">
            {/* Cart Items */}
            <div className="w-full md:w-2/3 flex flex-col gap-6">
              {cartItems.map((item) => (
                <div key={item.product._id} className="flex flex-wrap md:flex-nowrap justify-between items-center border-b pb-4">
                  <div className="flex flex-wrap md:flex-nowrap items-center w-full">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-200">
                      <img src={item.product.image} className="w-full h-full object-cover object-top" alt={item.product.name} />
                    </div>
                    <div className="ml-4 mt-2 md:mt-0">
                      <h1 className="text-lg md:text-xl">{item.product.name}</h1>
                      <div className="flex gap-3 mt-2">
                        <h2 className="font-bold">${item.product.price}</h2>
                        <div className="flex items-center border rounded">
                          <button className="px-2 border-r" onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}>
                            -
                          </button>
                          <input
                            className="w-10 text-center border-0 outline-none"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.product._id, Number(e.target.value))}
                            type="number"
                            min="1"
                          />
                          <button className="px-2 border-l" onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}>
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-auto text-right">
                    <h2 className="text-lg md:text-xl font-bold">${item.product.price * item.quantity}</h2>
                    <button className="text-red-500 mt-2" onClick={() => handleRemoveItem(item.product._id)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping Form */}
            <div className="w-full md:w-1/3 p-4 bg-white rounded-lg shadow-lg">
              <h2 className="text-xl md:text-2xl mb-6 font-bold">Shipping Details</h2>
              <form onSubmit={handleCheckout}>
                {["name", "address", "city", "postalCode"].map((field) => (
                  <div className="mb-4" key={field}>
                    <label className="block mb-2 capitalize">{field}</label>
                    <input
                      type="text"
                      name={field}
                      className="w-full p-2 border rounded"
                      value={shippingAddress[field]}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                ))}

                <div className="mb-4">
                  <label className="block mb-2">Payment Method</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select Payment Method</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Cash on Delivery">Cash on Delivery</option>
                  </select>
                </div>

                <button onClick={makePayment} type="submit" className="w-full py-2 bg-gray-500 text-white rounded">
                  Proceed to Order Payment
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      <div  data-scroll-section>
          <Footer />
        </div>
    </div>
  );
};

export default CheckoutPage;
