const productModel = require('../models/Product');
const cartModel = require('../models/Cart');
const checkoutModel = require('../models/Checkout');
const userModel = require('../models/User');


module.exports.addingToCheckout = async (req, res) => {
  try {
      const loggedUser = req.user; // User from auth middleware
      if (!loggedUser) {
          return res.status(400).send("User is not logged in");
      }

      const { productIds, paymentMethod } = req.body; // Selected product IDs
      const shippingAddress = {
          address: req.body.address,
          city: req.body.city,
          postalCode: req.body.postalCode,
          name: req.body.name,
      };

      // Validate shipping address
      if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.name) {
          return res.status(400).json({ message: "All shipping fields are required" });
      }

      // Get the user's cart
      const cart = await cartModel.findOne({ user: loggedUser._id }).populate("cartItems.product");
      if (!cart) {
          return res.status(404).send("Cart not found");
      }

      // Filter selected products from the cart
      const selectedProducts = cart.cartItems.filter((item) =>
          productIds.includes(item.product._id.toString())
      );

      if (selectedProducts.length === 0) {
          return res.status(400).send("No products selected for checkout");
      }

      // Check if user already has a checkout
      let checkout = await checkoutModel.findOne({ user: loggedUser._id });

      if (!checkout) {
          // Create a new checkout if none exists
          checkout = await checkoutModel.create({
              user: loggedUser._id,
              selectedProducts: selectedProducts.map((item) => ({
                  product: item.product._id,
                  name: item.product.name,
                  quantity: item.quantity,
                  productPrice: item.productPrice,
                  subTotal: item.subTotal,
              })),
              shippingAddress,
              paymentMethod,
              totalPrice: selectedProducts.reduce((total, item) => total + item.quantity * item.productPrice, 0),
          });

          return res.status(201).json({ message: "Checkout created successfully", checkout });
      }

      // Check for duplicate products
      const alreadyExists = selectedProducts.some((item) =>
          checkout.selectedProducts.some((p) => p.product.toString() === item.product._id.toString())
      );

      if (alreadyExists) {
          return res.status(400).json({ message: "Product is already stored in checkout" });
      }

      // Add new selected products (No duplicate products)
      selectedProducts.forEach((item) => {
          checkout.selectedProducts.push({
              product: item.product._id,
              name: item.product.name,
              quantity: item.quantity,
              productPrice: item.productPrice,
              subTotal: item.subTotal,
          });
      });

      // Recalculate total price
      checkout.totalPrice = checkout.selectedProducts.reduce((total, item) => total + item.quantity * item.productPrice, 0);

      await checkout.save();

      // Update user's shipping address
      await userModel.findByIdAndUpdate(loggedUser._id, { $set: { shippingAddress } }, { new: true });

      res.status(201).json({ message: "Checkout updated successfully", checkout });

  } catch (err) {
      res.status(500).send(err.message);
  }
};



module.exports.updatingFromCheckout = async (req, res) => {
    try {
        const { productId, quantity } = req.body; 
        const loggedUser = req.user;
     
      
        if (!loggedUser) {
          return res.status(400).send("User is not logged in.");
        }
      
        // Check if the product exists
        const product = await productModel.findById(productId);
        if (!product) {
          return res.status(404).send("Product not found.");
        }
      
        // Check if the user has a  checkout
        const  checkout = await checkoutModel.findOne({ user: loggedUser._id });
        if (!checkout) {
          return res.status(404).send(" checkout not found.");
        }
      
        // Find the product in the  checkout
        const selectedProductsIndex =  checkout.selectedProducts.findIndex(
          (item) => item.product.toString() === productId
        );
      
        if ( selectedProductsIndex === -1) {
          return res.status(404).send("Product not found in checkout.");
        }
      
        // Update or remove the product
        if (quantity !== undefined) {
          if (quantity <= 0) {
            // Remove product from  checkout if quantity is 0 or less
            checkout.selectedProducts.splice( selectedProductsIndex, 1);
          } else {
            // Update the product quantity and price
            checkout.selectedProducts[selectedProductsIndex].quantity = quantity;
            checkout.selectedProducts[ selectedProductsIndex].productPrice = product.price;
            checkout.selectedProducts[selectedProductsIndex].subTotal = quantity * product.price;

          }
        }
      
        // Recalculate the total price
        checkout.totalPrice = checkout.selectedProducts.reduce((total, item) => {
          return total + item.quantity * item.productPrice;
        }, 0);
      
        // Mark selectedProducts as modified
        checkout.markModified("selectedProducts");
      
        // Save the updated checkout
        await checkout.save();
      
        res.status(200).json({
          message: "checkout updated successfully.",
          checkout,
        });
      } catch (err) {
        res.status(500).send(err.message);
      }
      
  };

module.exports.removingFromCheckout = async (req, res) => {
    try {
        const { productId } = req.body; // Product ID passed in the URL
        const loggedUser = req.user;
      
        if (!loggedUser) {
          return res.status(400).send("User is not logged in");
        }
      
        // Find the checkout for the logged-in user
        const checkout = await checkoutModel.findOne({ user: loggedUser._id });
      
        if (!checkout) {
          return res.status(404).send("checkout not found");
        }
      
        // Find the product in the checkout to get its price and quantity
        const productIndex = checkout.selectedProducts.findIndex(
          (item) => item.product.toString() === productId
        );
      
        if (productIndex === -1) {
          return res.status(404).send("Product not found in checkout");
        }
      
        const removedItem = checkout.selectedProducts[productIndex];
      
        // Subtract the price of the removed product from the totalPrice
        checkout.totalPrice -= removedItem.productPrice * removedItem.quantity;
      
        // Ensure totalPrice doesn't go negative (optional safety check)
        if (checkout.totalPrice < 0) checkout.totalPrice = 0;
      
        // Remove the product from the selectedProducts array
        checkout.selectedProducts.splice(productIndex, 1);
      
        await checkout.save();
      
        res.status(200).json({
          message: "Product removed from checkout successfully",
          checkout,
        });
      } catch (err) {
        res.status(500).send(err.message);
      }
      
  }; 
  