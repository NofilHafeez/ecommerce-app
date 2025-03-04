import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css"; // Import Locomotive CSS

const OrderPage = () => {
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sessionId = searchParams.get("sessionId");
  const scrollRef = useRef(null);
  const API_URL = process.env.REACT_API;
  
  useEffect(() => {
    if (!scrollRef.current) return; // Ensure ref exists before initializing Locomotive
    
    const locoScroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      multiplier: 0.75, // Adjust for better scroll feel
      smartphone: { smooth: true },
      tablet: { smooth: true }
    });
  
    setTimeout(() => {
      locoScroll.update(); // Ensure it updates after DOM renders
    }, 1000); // Delay to avoid layout shift issues
  
    return () => {
      locoScroll.destroy();
    };
  }, []);
  

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let response;
        
        // ✅ If a session ID exists, fetch the order related to that session
        if (sessionId) {
          response = await axios.get(`${API_URL}/api/payment/check-payment/${sessionId}`);
          setOrders([response.data.order]); // Convert single object to array for consistency
        } else {
          // ✅ Fetch all orders for the logged-in user
          response = await axios.get(`${API_URL}/api/order/get-orders`, {
            withCredentials: true,
          });
          setOrders(response.data.orders);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [sessionId]);

  return (
    <div ref={scrollRef} className="min-h-screen bg-gray-100 p-6" data-scroll-container>
  <section data-scroll-section>
    <h1 className="text-3xl font-bold text-center mb-6">
      Your Orders
    </h1>

    {loading ? (
      <p className="text-center text-gray-700">Loading orders...</p>
    ) : error ? (
      <p className="text-center text-red-500">{error}</p>
    ) : orders.length === 0 ? (
      <p className="text-center text-gray-700">No orders found.</p>
    ) : (
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        {orders.map((order) => (
          <div key={order._id} className="mb-6 border-b pb-4">
            <h2 className="text-xl font-semibold">Order ID: {order._id}</h2>
            <p className="text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <p className={`mt-2 font-medium ${order.isDelivered ? "text-green-600" : "text-yellow-600"}`}>
              Status: {order.isDelivered ? "Delivered" : "Processing"}
            </p>

            <div className="mt-4">
                {order.orderItems.map((item) => (
                  <div key={item.product._id} className="flex items-center border p-3 mb-2 rounded-lg" data-scroll>
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-top object-cover rounded"                      
                    />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">{item.product.name}</h3>
                    <p className="text-gray-700">Quantity: {item.quantity}</p>
                    <p className="text-gray-900 font-medium">${item.productPrice * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="text-right text-xl font-bold mt-4">Total: ${order.totalPrice}</h3>
          </div>
        ))}
      </div>
    )}
  </section>
</div>

  );
};

export default OrderPage;
