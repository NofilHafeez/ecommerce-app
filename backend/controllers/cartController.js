const productModel = require('../models/Product');
const userModel = require('../models/User');
const cartModel = require('../models/Cart');

module.exports.addingToCart = async (req, res) => {
    try {
        const productId = req.params.id; // Product ID passed in the URL
        const loggedUser = req.user; // Assuming `req.user` contains the logged-in user
      
        if (!loggedUser) {
          return res.status(400).send("User is not logged in");
        }
      
        // Check if the product exists
        const product = await productModel.findById(productId);
        if (!product) {
          return res.status(404).send("Product not found");
        }
      
        // Check if the user already has a cart
        let cart = await cartModel.findOne({ user: loggedUser._id });
      
        if (!cart) {
          // Create a new cart if it doesn't exist
          cart = await cartModel.create({
            user: loggedUser._id,
            cartItems: [
              {
                product: product._id,
                quantity: 1, // Default quantity when adding the product
                productPrice: product.price,
                subTotal: product.price, // Add the product's price
              },
            ],
            totalPrice: product.price, // Initialize total price with the first product's price
          });
        } else {
          // Check if the product is already in the cart
          const existingItem = cart.cartItems.find((item) =>
            item.product.equals(product._id)
          );
      
          if (existingItem) {
            return res.status(400).send("Product is already in the cart");
          }
      
          // Add the product to the cart
          cart.cartItems.push({
            product: product._id,
            quantity: 1, // Default quantity
            productPrice: product.price,
          });
      
          // Update the total price
          cart.totalPrice += product.price;
        }
      
        // Save the updated cart
        await cart.save();
      
        res.status(201).json({ message: "Product added to cart", cart });
      } catch (err) {
        res.status(500).send(err.message);
      }
      
  };

module.exports.updatingFromCarts = async (req, res) => {
    try {
        const { quantity } = req.body;
        const productId = req.params.id; // Product ID from URL
        const loggedUser = req.user;
      
        if (!loggedUser) {
          return res.status(400).send("User is not logged in.");
        }
      
        // Check if the product exists
        const product = await productModel.findById(productId);
        if (!product) {
          return res.status(404).send("Product not found.");
        }
      
        // Check if the user has a cart
        const cart = await cartModel.findOne({ user: loggedUser._id });
        if (!cart) {
          return res.status(404).send("Cart not found.");
        }
      
        // Find the product in the cart
        const cartItemIndex = cart.cartItems.findIndex(
          (item) => item.product.toString() === productId
        );
      
        if (cartItemIndex === -1) {
          return res.status(404).send("Product not found in cart.");
        }
      
        // Update or remove the product
        if (quantity !== undefined) {
          if (quantity <= 0) {
            // Remove product from cart if quantity is 0 or less
            cart.cartItems.splice(cartItemIndex, 1);
          } else {
            // Update the product quantity and price
            cart.cartItems[cartItemIndex].quantity = quantity;
            const productPrice = cart.cartItems[cartItemIndex].productPrice;
            cart.cartItems[cartItemIndex].subTotal = quantity * productPrice;
          }
        }
      
        // Recalculate the total price
        cart.totalPrice = cart.cartItems.reduce((total, item) => {
          return total + item.quantity * item.productPrice;
        }, 0);

        cart.subTotal = cart.cartItems.quantity * cart.cartItems.productPrice;
        console.log(cart.quantity)
      
        // Mark cartItems as modified
        cart.markModified("cartItems");
      
        // Save the updated cart
        await cart.save();
      
        res.status(200).json({
          message: "Cart updated successfully.",
          cart,
        });
      } catch (err) {
        res.status(500).send(err.message);
      }
      
  };

module.exports.removingFromCarts = async (req, res) => {
    try {
        const productId = req.params.id; // Product ID passed in the URL
        const loggedUser = req.user;
      
        if (!loggedUser) {
          return res.status(400).send("User is not logged in");
        }
      
        // Find the cart for the logged-in user
        const cart = await cartModel.findOne({ user: loggedUser._id });
      
        if (!cart) {
          return res.status(404).send("Cart not found");
        }
      
        // Find the product in the cart to get its price and quantity
        const productIndex = cart.cartItems.findIndex(
          (item) => item.product.toString() === productId
        );
      
        if (productIndex === -1) {
          return res.status(404).send("Product not found in cart");
        }
      
        const removedItem = cart.cartItems[productIndex];
      
        // Subtract the price of the removed product from the totalPrice
        cart.totalPrice -= removedItem.productPrice * removedItem.quantity;
      
        // Ensure totalPrice doesn't go negative (optional safety check)
        if (cart.totalPrice < 0) cart.totalPrice = 0;
      
        // Remove the product from the cartItems array
        cart.cartItems.splice(productIndex, 1);
      
        await cart.save();
      
        res.status(200).json({
          message: "Product removed from cart successfully",
          cart,
        });
      } catch (err) {
        res.status(500).send(err.message);
      }
      
  };    

