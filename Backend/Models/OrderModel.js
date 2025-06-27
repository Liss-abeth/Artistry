const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      materialId: { type: mongoose.Schema.Types.ObjectId, ref: "Material" },
      name: String,
      quantity: Number,
      price: Number,
    },
  ],
  totalPrice: { type: Number, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  phone: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  status: { type: String, default: "Pending" },
}, { timestamps: true });

// Export the model correctly:
module.exports = mongoose.model("Order", orderSchema);
