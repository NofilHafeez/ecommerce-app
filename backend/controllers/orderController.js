const productModel = require('../models/Product');
const userModel = require('../models/User');
const orderModel = require('../models/Order');
const checkoutModel = require('../models/Checkout');


module.exports.addingToOrder = async (req, res) => {
  try {
    const loggedUser = req.user;
    if (!loggedUser) {
      return res.status(400).json({ message: "User is not logged in" });
    }

    const { productIds, paymentMethod, sessionId } = req.body; // Stripe session ID included

     // Check if the order with this sessionId already exists
     const existingOrder = await orderModel.findOne({ sessionId });
     if (existingOrder) {
       return res.status(400).json({ message: "Order already placed." });
     }

    const shippingAddress = {
      address: req.body.address,
      city: req.body.city,
      postalCode: req.body.postalCode,
      country: req.body.country,
    };

    // ✅ **Check if selected products exist**
    const products = await productModel.find({ _id: { $in: productIds } });

    if (!products.length) {
      return res.status(400).json({ message: "No valid products found" });
    }

    // ✅ **Get user's checkout data**
    const checkout = await checkoutModel.findOne({ user: loggedUser._id }).populate("selectedProducts.product");

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    // ✅ **Filter only selected products for the order**
    const orderItems = checkout.selectedProducts
      .filter((item) => productIds.includes(item.product._id.toString()))
      .map((item) => ({
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        productPrice: item.productPrice,
        subTotal: item.subTotal,
      }));

    if (orderItems.length === 0) {
      return res.status(400).json({ message: "No products selected for Order" });
    }

    // ✅ **Calculate total price**
    const totalPrice = orderItems.reduce((total, item) => total + item.quantity * item.productPrice, 0);

    // ✅ **Check if user already has an order**
    let order = await orderModel.findOne({ user: loggedUser._id });

    if (!order) {
      // ✅ **Create a new order if none exists**
      order = await orderModel.create({
        user: loggedUser._id,
        orderItems,
        shippingAddress,
        paymentMethod,
        totalPrice,
        isPaid: true,
        isDelivered: false, // Ensure status is marked as Paid
        stripeSessionId: sessionId, // Save Stripe Session ID
      });

      // ✅ **Update the user model with the new order**
      await userModel.findByIdAndUpdate(
        loggedUser._id,
        { 
          $push: { orders: order._id }, 
          $set: { shippingAddress } 
        },
        { new: true, runValidators: true }
      );

      return res.status(201).json({ message: "Order created successfully", order });
    }

    // ✅ **Prevent duplicate products in the existing order**
    const alreadyExists = orderItems.some((item) =>
      order.orderItems.some((p) => p.product.toString() === item.product.toString())
    );

    if (alreadyExists) {
      return res.status(400).json({ message: "Product is already in the order." });
    }

    // ✅ **Add only new products to the existing order**
    order.orderItems.push(...orderItems);
    order.totalPrice += totalPrice;
    order.shippingAddress = shippingAddress;
    order.paymentMethod = paymentMethod;
    order.stripeSessionId = sessionId;

    // ✅ **Save updated order**
    await order.save();

    res.status(201).json({ message: "New products added to order", order });
  } catch (err) {
    console.error("Order creation failed:", err);
    res.status(500).json({ message: "Order creation failed", error: err.message });
  }
};


module.exports.updatingFromOrder = async (req, res) => {
    try {
        const { quantity, productId } = req.body;
        const loggedUser = req.user;
      
        if (!loggedUser) {
          return res.status(400).send("User is not logged in.");
        }
      
        // Check if the product exists
        const product = await productModel.findById(productId);
        if (!product) {
          return res.status(404).send("Product not found.");
        }
      
        // Check if the user has a order
        const order = await orderModel.findOne({ user: loggedUser._id });
        if (!order) {
          return res.status(404).send("order not found.");
        }
      
        // Find the product in the order
        const orderItemIndex = order.orderItems.findIndex(
          (item) => item.product.toString() === productId
        );
      
        if (orderItemIndex === -1) {
          return res.status(404).send("Product not found in order.");
        }
      
        // Update or remove the product
        if (quantity !== undefined) {
          if (quantity <= 0) {
            // Remove product from order if quantity is 0 or less
            order.orderItems.splice(orderItemIndex, 1);
          } else {
            // Update the product quantity and price
            order.orderItems[orderItemIndex].quantity = quantity;
            order.orderItems[orderItemIndex].productPrice = product.price;
            order.orderItems[orderItemIndex].subTotal = quantity * product.price;
          }
        }
      
        // Recalculate the total price
        order.totalPrice = order.orderItems.reduce((total, item) => {
          return total + item.quantity * item.productPrice;
        }, 0);
      
        // Mark orderItems as modified
        order.markModified("orderItems");
      
        // Save the updated order
        await order.save();
      
        res.status(200).json({
          message: "order updated successfully.",
          order,
        });
      } catch (err) {
        res.status(500).send(err.message);
      }
      
  };

module.exports.removingFromOrder = async (req, res) => {
    try {
      const { productId } = req.body; // Product ID passed in the URL
        const loggedUser = req.user;
      
        if (!loggedUser) {
          return res.status(400).send("User is not logged in");
        }
      
        // Find the order for the logged-in user
        const order = await orderModel.findOne({ user: loggedUser._id });
      
        if (!order) {
          return res.status(404).send("order not found");
        }
      
        // Find the product in the order to get its price and quantity
        const productIndex = order.orderItems.findIndex(
          (item) => item.product.toString() === productId
        );
      
        if (productIndex === -1) {
          return res.status(404).send("Product not found in order");
        }
      
        const removedItem = order.orderItems[productIndex];
      
        // Subtract the price of the removed product from the totalPrice
        order.totalPrice -= removedItem.productPrice * removedItem.quantity;
      
        // Ensure totalPrice doesn't go negative (optional safety check)
        if (order.totalPrice < 0) order.totalPrice = 0;
      
        // Remove the product from the orderItems array
        order.orderItems.splice(productIndex, 1);
      
        await order.save();
      
        res.status(200).json({
          message: "Product removed from order successfully",
          order,
        });
      } catch (err) {
        res.status(500).send(err.message);
      }
      
  };    

