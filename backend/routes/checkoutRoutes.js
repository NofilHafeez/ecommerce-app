const express = require('express');
const router = express.Router();
const { addingToCheckout, updatingFromCheckout, removingFromCheckout } = require('../controllers/checkoutController');
const authenticateUser = require('../middlewares/authMiddleware');
const checkoutModel = require('../models/Checkout')

router.get("/", ((req, res) => {
    res.send('Checkout Route is Working');
}));

router.get("/get-checkout-products", authenticateUser, async (req, res) => {
    try {
        const checkout = await checkoutModel
            .findOne({ user: req.user._id })
            .populate("selectedProducts.product", "name price image");  // ✅ Populate product details

        if (!checkout || checkout.selectedProducts.length === 0) {
            return res.status(404).json({ success: false, message: "No products found in checkout" });
        }

        res.status(200).json({ success: true, checkout });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Adding, updating, removing produsts in carts.
router.post("/adding-to-checkout", authenticateUser, addingToCheckout);

router.post("/updating-from-checkout", authenticateUser, updatingFromCheckout);

router.post("/removing-from-checkout", authenticateUser, removingFromCheckout);







module.exports = router;