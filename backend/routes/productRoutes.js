const express = require('express');
const router = express.Router();
const { createProducts,
        updateProducts,
        deleteProducts,
        createReview,
        editReview,
        deleteReview 
    } = require('../controllers/productController');
const authenticateUser = require('../middlewares/authMiddleware');
const adminOnly = require('../middlewares/adminOnly')
const uploadSingle = require('../middlewares/uploadMiddleware');
const productModel = require('../models/Product');

router.get("/", ((req, res) => {
    res.send('Products Route is Working');
}));

router.get("/get-products", async (req, res) => {
    try {
        const products = await productModel.find({});
        
        if (products.length === 0) {
            return res.status(404).json({ success: false, message: "No products found" });
        }

        res.status(200).json({ success: true, products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});


// Admin creating the products
router.post("/create-product", authenticateUser, adminOnly, uploadSingle, createProducts);

router.post("/update-product/:id", authenticateUser, adminOnly, updateProducts);

router.post("/delete-product/:id", authenticateUser, adminOnly, deleteProducts);

// Reviews of Products
router.post("/create-review/:id", authenticateUser, createReview);

router.post("/edit-review/:id", authenticateUser, editReview);

router.post("/delete-review/:id", authenticateUser, deleteReview);


module.exports = router;