const userModel = require("../Models/userSchema");
const Product = require("../Models/ProductSchema"); 
const Material = require("../Models/MeterialModel"); 
const Order = require("../Models/OrderModel"); 
const Cart=require('../Models/cartModel')
const Contact=require("../Models/ContactModel")
const Rating=require("../Models/RatingModel")
const Testimonial=require("../Models/TestimonialModel")
const nodemailer = require("nodemailer");
// const stripe = require("stripe")("your-stripe-secret-key"); // Replace with your Stripe Secret Key

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const path=require('path')
const userRegister = async (req, res) => {
  try {
      const { uname, username, email, password, role, artistBio, contactNumber, location, portfolioLink } = req.body;
      console.log(req.body);

      let userExists = await userModel.findOne({ email });
      if (userExists) {
          return res.status(400).json({ msg: "User already exists." });
      }

      let image = "";
      if (req.file) {
          image = req.file.path;
      }

      const salt = 10;
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new userModel({
          uname,
          username,
          email,
          password: hashedPassword,
          role,
          artistBio,
          contactNumber,
          location,
          profilePicture: image,
          portfolioLink
      });

      await newUser.save();

      const token = jwt.sign({ id: newUser._id, role: newUser.role }, "qwert", { expiresIn: "1h" });

      console.log(newUser);
      return res.status(201).json({ 
          msg: "User registration successful!", 
          token, 
          role: newUser.role, 
          artistId: newUser._id  // ✅ Include artistId
      });

  } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: "Registration failed." });
  }
};


const userLogin = async (req, res) => {
  try {
      const { email, password } = req.body;
      const user = await userModel.findOne({ email });

      if (!user) {
          return res.status(404).json({ msg: "User not found." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(401).json({ msg: "Incorrect password." });
      }

      const token = jwt.sign({ id: user._id, role: user.role }, "qwert", { expiresIn: "1h" });

      // ✅ Return artistId if the user is an artist
      return res.status(200).json({ 
          msg: "Login successful", 
          token, 
          userId: user._id,
          role: user.role,
          artistId: user.role === "artist" ? user._id : null  // Make sure _id is returned for artists
      });

  } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: "Login failed." });
  }
};


const registerArtist = async (req, res) => {
  try {
    const { artistName, artistBio, portfolio, contactNumber, location, email, password } = req.body;
    const profilePicture = req.file ? `http://localhost:1011/uploads/${req.file.filename}` : null;

    if (!artistName || !artistBio || !portfolio || !contactNumber || !location || !email || !password || !profilePicture) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newArtist = new Artist({ artistName,  artistBio, portfolio, contactNumber, location, email, password, profilePicture });
    await newArtist.save();

    res.status(201).json({ message: "Artist Registered!", artist: newArtist });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getArtists = async (req, res) => {
  try {
    console.log("Fetching artists...");

    const artists = await userModel.find({ role: "artist" }); 

    if (!artists || artists.length === 0) {
      console.log("No artists found");
      return res.status(404).json({ message: "No artists found" });
    }

    console.log("Artists found:", artists);
    res.status(200).json(artists);
  } catch (error) {
    console.error("Error fetching artists:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};



 
const addproduct = async (req, res) => {
  try {
    const { pname,
      category,
      price,
      artistId,
       } = req.body;
       console.log(req.body);
       
    const productImage = req.file ? `/uploads/${req.file.filename}` : "";
 console.log(productImage);
 
    const newArtist = new Product({
      pname,
      category,
      price,
      artistId,
      productImage,
    });

    await newArtist.save();
    res.status(201).json({ message: "ArtProduct added successfully!" });
  } catch (error) {
    console.error("ArtProduct Registration Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
};


const addMaterial = async (req, res) => {
  try {
    const { name, manufacturer, price } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    const newMaterial = new Material({ name, manufacturer, price, image: imageUrl });
    await newMaterial.save();

    res.status(201).json(newMaterial);
  } catch (error) {
    console.error("Error adding material:", error);
    res.status(500).json({ message: "Failed to add material" });
  }
};

// Get all materials
const getMaterials = async (req, res) => {
  try {
    const materials = await Material.find();
    res.status(200).json(materials);
  } catch (error) {
    console.error("Error fetching materials:", error);
    res.status(500).json({ message: "Failed to fetch materials" });
  }
};


const addMessage = async (req, res) => {
  try {
    console.log("📩 Received Contact Form Data:", req.body); // Debugging request data

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      console.log("⚠️ Missing fields in request.");
      return res.status(400).json({ message: "All fields are required." });
    }

    const newMessage = new Contact({ name, email, message });

    console.log("📝 Attempting to save message:", newMessage);

    const savedMessage = await newMessage.save(); // Save to DB

    console.log("✅ Message saved successfully:", savedMessage);
    res.status(201).json({ message: "Message sent successfully!", contact: savedMessage });
  } catch (error) {
    console.error("❌ Contact Form Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get all contact messages
const getMessages = async (req, res) => {
  try {
    console.log("Fetching contact messages...");

    const messages = await Contact.find().sort({ createdAt: -1 });

    if (!messages || messages.length === 0) {
      console.log("No contact messages found.");
      return res.status(404).json({ message: "No contact messages found" });
    }

    console.log("Contact messages found:", messages);
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};











const getProductsByArtist = async (req, res) => {
  try {
    const { artistId } = req.params; // Get artistId from URL params

    if (!artistId) {
      return res.status(400).json({ error: "Artist ID is required" });
    }

    console.log("Fetching products for artist:", artistId); // Debugging

    const products = await Product.find({ artistId });

    if (!products.length) {
      return res.status(404).json({ message: "No products found for this artist" });
    }

    res.json(products);
  } catch (error) {
    console.error("Error fetching artist products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};





const addTestimonial = async (req, res) => {
  try {
    const { name, review } = req.body;

    if (!name || !review) {
      return res.status(400).json({ message: "Name and review are required" });
    }

    const newTestimonial = new Testimonial({ name, review });
    await newTestimonial.save();

    res.status(201).json({ message: "Testimonial added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// Get all testimonials
const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ message: "Error fetching testimonials", error });
  }
};


const addCart = async (req, res) => {
  try {
      const { productId } = req.body;
      const userId = req.headers.userid; // Assuming userId is sent in headers

      if (!userId || !productId) {
          return res.status(400).json({ error: "User ID or Product ID is missing." });
      }

      console.log("Received User ID:", userId);
      console.log("Received Product ID:", productId);

      // Find the user's cart
      let cart = await Cart.findOne({ userId });

      if (!cart) {
          console.log("No cart found. Creating a new one...");
          cart = new Cart({ userId, items: [] });
      } else {
          console.log("Cart Found:", cart);
      }

      // Check if the product is already in the cart
      const existingItemIndex = cart.items?.findIndex(item => item.productId?.toString() === productId);

      if (existingItemIndex !== -1 && existingItemIndex !== undefined) {
          // If the product already exists, increase the quantity
          cart.items[existingItemIndex].quantity += 1;
      } else {
          // Otherwise, add a new product entry
          cart.items.push({ productId, quantity: 1 });
      }

      // Save the updated cart
      await cart.save();
      return res.status(200).json({ message: "Item added to cart successfully", cart });

  } catch (error) {
      console.error("Error in addCart:", error);
      return res.status(500).json({ error: "Internal Server Error" });
  }
};

const addCartMaterial = async (req, res) => {
  try {
    const userId = req.headers.userid; // Get user ID from headers
    const { materialId } = req.body;

    console.log(userId);
    if (!userId || !materialId) {
      return res.status(400).json({ message: "User ID and Material ID are required." });
    }

    // Check if cart exists for the user
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create a new cart if none exists
      cart = new Cart({
        userId,
        items: [
          {
            materialId,
            quantity: 1,
          },
        ],
      });
    } else {
      // Check if the material already exists in the cart
      const existingItemIndex = cart.items.findIndex((item) => item.materialId?.toString() === materialId);

      if (existingItemIndex !== -1) {
        // Increase quantity if the material exists
        cart.items[existingItemIndex].quantity += 1;
      } else {
        // Add new material to the cart
        cart.items.push({
          materialId,
          quantity: 1,
        });
      }
    }

    await cart.save(); // Save the cart
    return res.status(200).json({ message: "Material added to cart successfully.", cart });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};




const getCart = async (req, res) => {
  try {
    const userId = req.headers.userid;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Fetch the cart for the user and populate product and material details
    const cart = await Cart.findOne({ userId })
      .populate("items.productId", "pname price productImage category")
      .populate("items.materialId", "name price image category");

    if (!cart) {
      return res.status(404).json({ message: "Cart is empty." });
    }

    return res.status(200).json({ cart });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const updateCartItem = async (req, res) => {
  const { userId, productId, materialId, quantity } = req.body;

  if (!userId || quantity < 1) {
    return res.status(400).json({ message: "Invalid request data" });
  }

  try {
    const query = { userId };
    const update = {
      $set: { "items.$[elem].quantity": quantity }
    };
    
    const arrayFilters = materialId
      ? [{ "elem.materialId": materialId }]
      : [{ "elem.productId": productId }];

    const cart = await Cart.findOneAndUpdate(
      query,
      update,
      {
        new: true,
        arrayFilters
      }
    );

    if (!cart) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ error: error.message });
  }
};


const removeCartItem = async (req, res) => {
  const { userId, productId, materialId } = req.body;

  if (!userId || (!productId && !materialId)) {
    return res.status(400).json({ message: "Invalid request data" });
  }

  try {
    const query = { userId };
    const update = {
      $pull: {
        items: productId ? { productId } : { materialId }
      }
    };

    const cart = await Cart.findOneAndUpdate(query, update, { new: true });

    if (!cart) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({ error: error.message });
  }
};

  
const removeProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateMaterial = async (req, res) => {
  try {
    const materialId = req.params.id;
    
    // Build the update data object from req.body
    const updateData = {
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      price: req.body.price,
    };

    // If a new image file is uploaded, update the image field.
    // req.file.filename is used if you're storing the file name.
    if (req.file) {
      updateData.image = req.file.filename;
    }

    // Find the material by ID and update it.
    // { new: true } returns the updated document.
    const updatedMaterial = await Material.findByIdAndUpdate(
      materialId,
      updateData,
      { new: true }
    );

    if (!updatedMaterial) {
      return res.status(404).json({ message: "Material not found" });
    }

    res.json(updatedMaterial);
  } catch (error) {
    console.error("Error updating material:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const removeMaterial = async (req, res) => {
  try {
    // Delete material document based on the provided ID in the URL params.
    await Material.findByIdAndDelete(req.params.id);
    // If successful, send a JSON response with a success message.
    res.json({ message: "Material deleted successfully" });
  } catch (err) {
    // If an error occurs, send a 500 status code and the error message.
    res.status(500).json({ error: err.message });
  }
};


const placeOrder = async (req, res) => {
  try {
    const { userId, name, address, city, postalCode, phone, items, totalPrice, shippingCharge, paymentMethod, status } = req.body;

    if (!userId || !name || !address || !city || !postalCode || !phone || !items || !totalPrice) {
      return res.status(400).json({ message: "Missing order details" });
    }

    const newOrder = new Order({
      userId,
      name,
      address,
      city,
      postalCode,
      phone,
      items,
      totalPrice,
      shippingCharge,
      paymentMethod,
      status,
    });

    await newOrder.save();
    return res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Order placement error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getorders = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Received userId:", userId);

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // ✅ Correctly populate `productId` and `materialId` inside `items`
    const orders = await Order.find({ userId })
      .populate("items.productId") // Populate inside `items`
      .populate("items.materialId");

    console.log("Populated Orders:", orders);
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
  
};


const updateOrderStatus = async (req, res) => {
  try {
    // Expect the request body to contain both orderId and status
    const { orderId, status } = req.body;
    if (!orderId || !status) {
      return res.status(400).json({ message: "orderId and status are required" });
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.status = status;
    await order.save();
    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};







const sendMail = async (req, res) => {
  const { senderEmail, subject, message, artistEmail } = req.body;

  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,  // Your email
        pass: process.env.PASSWORD // Your email password or app password
      }
    });

    let mailOptions = {
      from: process.env.EMAIL, // Use your own email
      replyTo: senderEmail, // Allows the artist to reply to the sender
      to: artistEmail,
      subject: subject,
      text: message,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending email', error });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id); // ✅ Correct model name

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getArtistById = async (req, res) => {
  try {
    const { id } = req.params;
    const artist = await userModel.findOne({ _id: id, role: "artist" }); // ✅ Ensure role is "artist"

    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    res.status(200).json(artist);
  } catch (error) {
    console.error("Error fetching artist:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// const createPaymentIntent = async (req, res) => {
//   try {
//     const { amount } = req.body;

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amount * 100, // Convert to cents
//       currency: "usd",
//       payment_method_types: ["card"],
//     });

//     res.status(200).json({ clientSecret: paymentIntent.client_secret });
//   } catch (error) {
//     console.error("Stripe Error:", error);
//     res.status(500).json({ message: "Payment failed", error: error.message });
//   }
// };


const getOrdersByArtist = async (req, res) => {
  try {
    const { artistId } = req.params;

    if (!artistId) {
      return res.status(400).json({ message: "Artist ID is required." });
    }

    // 🖼️ Find all products by the artist
    const artistProducts = await Product.find({ artistId });

    if (artistProducts.length === 0) {
      return res.status(404).json({ message: "No products found for this artist." });
    }

    const artistProductIds = artistProducts.map(product => product._id.toString());

    // 🛒 Find all orders containing the artist's products
    const orders = await Order.find({
      "items.productId": { $in: artistProductIds }
    }).populate("items.productId", "name price");  // Optional: Populate product details

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this artist's products." });
    }

    res.status(200).json(orders);

  } catch (error) {
    console.error("Error fetching orders for artist:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




const getEarnings = async (req, res) => {
  try {
    const earnings = await Order.aggregate([
      { $match: { artistId: req.params.artistId, status: "Completed" } },
      { $group: { _id: "$artistId", totalEarnings: { $sum: "$amount" } } },
    ]);
    res.json(earnings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ artistId: req.params.artistId });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// In your backend controller (where getProductById is defined)
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ pname: product.name }); // ✅ Send back 'pname'
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// const rateProduct = async (req, res) => {
//   try {
//     const { orderId, productId, rating } = req.body;

//     if (!orderId || !productId || rating === undefined) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const order = await Order.findById(orderId);
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     const productIndex = order.products.findIndex(p => p.productId.toString() === productId);
//     if (productIndex === -1) {
//       return res.status(404).json({ message: "Product not found in order" });
//     }

//     order.products[productIndex].rating = rating; // ✅ Update rating
//     await order.save();

//     res.json({ message: "Rating submitted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };




// ⭐ Add a new rating
const addRating = async (req, res) => {
  try {
    const { userId, productId, rating, review } = req.body;

    if (!userId || !productId || !rating) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newRating = new Rating({ userId, productId, rating, review });
    await newRating.save();
    
    res.status(201).json({ message: "Rating added successfully", newRating });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 📌 Get ratings for a specific product
const getProductRatings = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId" });
    }

    const ratings = await Rating.find({ itemId: productId, itemType: 'product' });

    // Calculate average rating
    const totalUsersRated = ratings.length;
    const averageRating = totalUsersRated
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalUsersRated
      : 0;

    res.json({ averageRating, totalUsersRated });
  } catch (error) {
    console.error("Error fetching product ratings:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};









const getMaterialRatings = async (req, res) => {
  try {
    const { materialId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(materialId)) {
      return res.status(400).json({ message: "Invalid materialId" });
    }

    const ratings = await Rating.find({ itemId: materialId, itemType: 'material' });

    // Calculate average rating
    const totalUsersRated = ratings.length;
    const averageRating = totalUsersRated
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalUsersRated
      : 0;

    res.json({ averageRating, totalUsersRated });
  } catch (error) {
    console.error("Error fetching material ratings:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// 📌 Get ratings given by a specific user
const getUserRatings = async (req, res) => {
  try {
    const { userId } = req.params;
    const ratings = await Rating.find({ userId });
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching ratings", error });
  }
};



const SubmitRating = async (req, res) => {
  try {
    console.log("Received Data:", req.body);  // 🟢 Debugging

    const { userId, rating, review } = req.body;
    const { itemType, itemId } = req.params;

    if (!userId || !itemId || !itemType || !rating) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newRating = new Rating({ userId, itemId, itemType, rating, review });
    await newRating.save();

    res.status(201).json({ message: "Rating submitted successfully", rating: newRating });

  } catch (error) {
    console.error("❌ Error in SubmitRating:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
  console.log("Received Data:", req.body);
console.log("Received Params:", req.params);

};





const getRatings = async (req, res) => {
  try {
    const ratings = await Rating.aggregate([
      {
        $group: {
          _id: "$itemId",
          averageRating: { $avg: "$rating" },
          totalUsers: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
















const PRatings = async (req, res) => {
  try {
    const { productId } = req.query; // Get productId from query parameters

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ ratings: product.ratings });
  } catch (error) {
    res.status(500).json({ message: "Error fetching ratings", error });
  }
};


const MRatings = async (req, res) => {
  try {
    const { materialId } = req.query; // Get materialId from query parameters

    if (!materialId) {
      return res.status(400).json({ message: "Material ID is required" });
    }

    const material = await Material.findById(materialId);
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    // Calculate average rating
    const averageRating =
      material.ratings.length > 0
        ? material.ratings.reduce((acc, r) => acc + r.rating, 0) / material.ratings.length
        : 0;

    res.json({ ratings: material.ratings, averageRating });
  } catch (error) {
    res.status(500).json({ message: "Error fetching ratings", error });
  }
};


const submitProductRating = async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId, orderId, rating } = req.body;

    const existingRating = await Rating.findOne({ userId, productId });

    if (existingRating) {
      existingRating.rating = rating;
      await existingRating.save();
    } else {
      const newRating = new Rating({ userId, orderId, productId, rating });
      await newRating.save();
    }

    res.json({ message: "Rating submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error submitting rating", error });
  }
};


const submitMaterialRating = async (req, res) => {
  try {
    const { materialId } = req.params;
    const { userId, rating, review } = req.body;

    // Find the material and update its rating
    const material = await Material.findById(materialId);
    if (!material) return res.status(404).json({ message: "Material not found" });

    material.ratings.push({ user: userId, rating, review });
    await material.save();

    res.status(200).json({ message: "Rating submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// const Rating = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     // Fetch user ratings from orders
//     const orders = await Order.find({ userId });

//     if (!orders.length) {
//       return res.status(404).json({ message: "No ratings found" });
//     }

//     // Extract ratings from order items
//     const ratings = orders.flatMap(order =>
//       order.items
//         .filter(item => item.rating) // Include only rated items
//         .map(item => ({
//           orderId: order._id,
//           itemId: item.productId || item.materialId,
//           rating: item.rating,
//           type: item.productId ? "product" : "material",
//         }))
//     );

//     res.json(ratings);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
const getRatingsForItem = async (req, res) => {
  try {
    const { itemId, itemType } = req.params;
    
    // Ensure `itemId` is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ message: "Invalid itemId" });
    }

    // Fetch ratings
    const ratings = await Rating.find({ itemId, itemType });

    res.json(ratings);
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ message: "Server error while fetching ratings" });
  }
};


const getMaterialOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Fetching material orders for:", userId || "All Users");

    let query = userId
      ? { userId, "items.materialId": { $exists: true, $ne: null } }
      : { "items.materialId": { $exists: true, $ne: null } };

    const orders = await Order.find(query).populate("items.materialId");

    console.log("Material Orders:", orders);
    res.json(orders);
  } catch (error) {
    console.error("Error fetching material orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




module.exports = { userRegister, userLogin,registerArtist,getArtists,addproduct,getProducts,addMaterial,getMaterials,
  getProductsByArtist,addMessage,getMessages,addTestimonial,getTestimonials,addCart,getCart,addCartMaterial,updateCartItem,
  removeCartItem,getProductsByArtist,removeProduct,removeMaterial,placeOrder,getorders,
  updateOrderStatus,updateMaterial,sendMail,getUserById,getArtistById,getOrdersByArtist,getEarnings,getNotifications,getProductById,
  addRating, getProductRatings, getUserRatings,PRatings, MRatings,submitProductRating,submitMaterialRating, SubmitRating,getRatings,
  getRatingsForItem, getMaterialRatings, getMaterialOrders};
