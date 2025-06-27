const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product"},
      materialId:{ type:mongoose.Schema.Types.ObjectId, ref:"Material"},
      quantity: { type: Number, default: 1 },
    },
  ],
  shippingFee: { type: Number, default: 5 }, 
  deliveryTime: { type: String, default: "5-7 days" },
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
