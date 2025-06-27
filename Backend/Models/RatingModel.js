const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Rating schema
const ratingSchema = new Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Referencing the User model
    required: true 
  },
  itemId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  itemType: { 
    type: String, 
    enum: ['product', 'material'], // To differentiate between product and material
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  review: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the Rating model
const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;


