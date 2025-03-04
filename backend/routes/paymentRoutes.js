const express = require('express');
const router = express.Router();
const Stripe = require("stripe");
const authenticateUser = require('../middlewares/authMiddleware');

const stripe = new Stripe("sk_test_51QmySuFLiCAMHXQDQDphJMLFyii49u4cVKvIXdAqsbneiscbMrGYkNwyJ4N0HXlE98NpwSNG8DXCKltmWYOnlNiN00OuWaWvsU");

// Create a Payment Session
router.post("/create-checkout-session", authenticateUser, async (req, res) => {
    try {
        const { cartItems } = req.body; // Get cart items from frontend

        const line_items = cartItems.map((item) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.product.name,
                    images: [item.product.image],
                },
                unit_amount: item.product.price * 100, // Convert to cents
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            success_url: "http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: "http://localhost:5173/payment-failed",
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error("Stripe Checkout Error:", error);
        res.status(500).json({ error: error.message });
    }
});



module.exports = router;