const mongoose = require('mongoose');

const checkoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    selectedProducts: [
          {
            product: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Product',
              required: true,
            },
            name: {
              type: String,
              required: true,
            },
            quantity: {
              type: Number,
              required: true,
              default: 1,
            },
            productPrice: {
              type: Number,
              required: true,
            },
            subTotal: {
              type: Number
            },
          },
        ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      name: { type: String, required: true },
    },  
    paymentMethod: {
      type: String,
      required: true,
      enum: ['Credit Card', 'PayPal', 'nayapay', 'Cash on Delivery'], // Add more payment methods as needed
    },
    paymentStatus: {
      type: String,
      default: 'Pending', // Other statuses: 'Completed', 'Failed'
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Checkout = mongoose.model('Checkout', checkoutSchema);

module.exports = Checkout;
