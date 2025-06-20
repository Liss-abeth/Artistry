const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  pname: { type: String, required: true },
  category: { type: String },
  price: { type: String },
  productImage: { type: String },
  artistId: { type: String },
  ratings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String },
    },
  ],
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
