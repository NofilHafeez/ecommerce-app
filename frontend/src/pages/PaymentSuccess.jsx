import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = ({ setCart }) => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const navigate = useNavigate();
  const requestSent = useRef(false); // ✅ Prevent duplicate requests

  useEffect(() => {
    if (sessionId && !requestSent.current) {
      requestSent.current = true; // ✅ Mark request as sent

      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

      axios
        .post(
          "http://localhost:3000/api/order/adding-to-order",
          { productIds: cartItems.map((item) => item.product._id), sessionId },
          { withCredentials: true }
        )
        .then(() => {
          setCart({ cartItems: [] });
          localStorage.removeItem("cartItems");
          navigate("/orders");
        })
        .catch((err) => console.error("Order creation failed", err));
    }
  }, [sessionId, setCart, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <h1 className="text-2xl font-bold">Payment Successful! 🎉</h1>
      <a href="/orders">View Orders.</a>
    </div>
  );
};

export default PaymentSuccess;
