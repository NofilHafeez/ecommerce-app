import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";
import Footer from "../components/Footer";

const PaymentPage = () => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const [checkout, setCheckout] = useState([]);

  // Fetch Cart Products
  const fetchCheckoutProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/checkout/get-checkout-products", {
        withCredentials: true,
      });
      setCheckout(res.data.selectedProducts || []); // Ensure it's an array
    } catch (err) {
      console.error("Fetching cart failed", err);
    }
  };
  

  useEffect(() => {
    fetchCheckoutProducts(); // Load cart when app starts
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      const scroll = new LocomotiveScroll({
        el: scrollRef.current,
        smooth: true,
      });
      return () => scroll.destroy();
    }
  }, []);

  const [paymentDetails, setPaymentDetails] = useState({
    name: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  // Calculate total price safely
  const totalPrice = checkout?.reduce((total, item) => total + (item.product.price * item.quantity), 0) || 0;

  // Handle input change
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  // Handle form submission
  const handlePaymentSubmit = (e) => {
    e.preventDefault();

    // Basic Validation
    if (!paymentDetails.name || !paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv) {
      alert("Please fill out all payment details.");
      return;
    }

    if (!/^\d{16}$/.test(paymentDetails.cardNumber)) {
      alert("Enter a valid 16-digit card number");
      return;
    }

    if (!/^\d{3}$/.test(paymentDetails.cvv)) {
      alert("Enter a valid 3-digit CVV");
      return;
    }

    alert("Payment successful!");
    setCheckout([]); // Clear cart after successful payment
    navigate("/order-confirmation");
  };

  return (
    <div ref={scrollRef} data-scroll-container className="w-full min-h-screen flex flex-col bg-[#ededed]">
      <div data-scroll-section className="p-20 pb-10 pt-30 flex flex-col gap-10">
        <div className="flex gap-10">
          {/* Left Section: Selected Products */}
          <div className="w-2/3 flex flex-col gap-6">
            {checkout.length === 0 ? (
              <h2 className="text-center text-xl font-semibold">Your checkout is empty</h2>
            ) : (
              checkout.map((item) => (
                <div key={item._id} className="flex justify-between items-center border-b py-4">
                  <div className="flex">
                    <div className="w-32 h-32 bg-amber-200">
                      <img src={item.product.image} className="w-full h-full object-cover object-top" alt={item.product.name} />
                    </div>
                    <div className="ml-4">
                      <h1 className="text-xl">{item.product.name}</h1>
                      <div className="flex gap-3">
                        <h2 className="font-bold">${item.product.price}</h2>
                        <h2 className="font-bold">x {item.quantity}</h2>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <h2 className="text-xl font-bold">${item.product.price * item.quantity}</h2>
                  </div>
                </div>
              ))
            )}
            <div className="flex justify-between items-center mt-4 p-4 border-t">
              <h1 className="text-2xl font-bold">Total:</h1>
              <h1 className="text-2xl font-bold">${totalPrice}</h1>
            </div>
          </div>

          {/* Right Section: Payment Form */}
          <div className="w-1/3 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl mb-6 font-bold">Payment Details</h2>
            <form onSubmit={handlePaymentSubmit}>
              <div className="mb-4">
                <label className="block mb-2" htmlFor="name">Cardholder Name</label>
                <input type="text" id="name" name="name" className="w-full p-2 border rounded" value={paymentDetails.name} onChange={handlePaymentChange} required />
              </div>
              <div className="mb-4">
                <label className="block mb-2" htmlFor="cardNumber">Card Number</label>
                <input type="text" id="cardNumber" name="cardNumber" className="w-full p-2 border rounded" value={paymentDetails.cardNumber} onChange={handlePaymentChange} required />
              </div>
              <div className="flex gap-4">
                <div className="mb-4 w-1/2">
                  <label className="block mb-2" htmlFor="expiryDate">Expiry Date</label>
                  <input type="text" id="expiryDate" name="expiryDate" placeholder="MM/YY" className="w-full p-2 border rounded" value={paymentDetails.expiryDate} onChange={handlePaymentChange} required />
                </div>
                <div className="mb-4 w-1/2">
                  <label className="block mb-2" htmlFor="cvv">CVV</label>
                  <input type="text" id="cvv" name="cvv" className="w-full p-2 border rounded" value={paymentDetails.cvv} onChange={handlePaymentChange} required />
                </div>
              </div>
              <button type="submit" className="w-full py-2 px-5 bg-gray-500 text-white rounded mt-4">
                Confirm Payment
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Checkout Summary */}
      <div data-scroll-section className="w-full flex justify-end items-center bg-[#ededed] gap-3 p-10">
        <div className="flex">
          <h1 className="mr-2">Total Price:</h1>
          <h1>${totalPrice}</h1>
        </div>
      </div>

      <div data-scroll-section>
        <Footer />
      </div>
    </div>
  );
};

export default PaymentPage;
