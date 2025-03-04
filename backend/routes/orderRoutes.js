const express = require('express');
const router = express.Router();
const { addingToOrder, updatingFromOrder, removingFromOrder } = require('../controllers/orderController');
const authenticateUser = require('../middlewares/authMiddleware');
const orderModel = require('../models/Order');

router.get("/", ((req, res) => {
    res.send('Order Route is Working');
}));

router.get("/get-orders", authenticateUser, async (req, res) => {
    try {
        const orders = await orderModel
            .find({ user: req.user._id }) // Fetch orders of the logged-in user
            .populate("orderItems.product"); // ✅ Populate product details

        if (!orders || orders.length === 0) {
            return res.status(404).json({ success: false, message: "No orders found" });
        }

        res.status(200).json({ success: true, orders });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});


// Adding, updating, removing produsts in carts.
router.post("/adding-to-order", authenticateUser, addingToOrder);

router.post("/updating-from-order", authenticateUser, updatingFromOrder);

router.post("/removing-from-order", authenticateUser, removingFromOrder);

module.exports = router;