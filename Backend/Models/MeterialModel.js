const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  ratings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String },
    },
  ],
});

const Material = mongoose.model("Material", materialSchema);

module.exports = Material;
