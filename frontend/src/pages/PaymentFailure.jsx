import React from 'react'
import { Link } from "react-router-dom";

const PaymentFailure = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
    <h1 className="text-3xl font-bold text-red-600">Your Payment Failed!</h1>
    <p className="text-lg mt-2">Go to checkout</p>
    <Link to="/checkout">
        <button className="mt-4 px-6 py-2 bg-gray-500 text-white rounded">View Orders</button>
    </Link>
</div>
  )
}

export default PaymentFailure