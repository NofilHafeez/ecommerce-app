const express = require('express');
const router = express.Router();
const { addingToCart, updatingFromCarts, removingFromCarts } = require('../controllers/cartController');
const authenticateUser = require('../middlewares/authMiddleware');
const cartModel = require('../models/Cart');

router.get("/", ((req, res) => {
    res.send('Cart Route is Working');
}));

router.get("/get-cart-products", authenticateUser, async (req, res) => {
    try {
        const cart = await cartModel
            .findOne({ user: req.user._id })
            .populate("cartItems.product"); // ✅ Populate product details

        if (!cart || cart.cartItems.length === 0) {
            return res.status(404).json({ success: false, message: "No products found in cart" });
        }

        res.status(200).json({ success: true, cart });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});


// Adding, updating, removing produsts in carts.
router.post("/adding-to-carts/:id", authenticateUser, addingToCart);

router.post("/updating-from-carts/:id", authenticateUser, updatingFromCarts);

router.post("/removing-from-carts/:id", authenticateUser, removingFromCarts);




module.exports = router;