const express = require('express');
const { userRegister, userLogin,registerArtist,getArtists, addproduct,getProducts,addMaterial,getMaterials ,
  getProductsByArtist,addMessage,getMessages,addTestimonial,getTestimonials, addCart, getCart, addCartMaterial,
  updateCartItem,removeCartItem,removeProduct,placeOrder,getorders,updateOrderStatus,removeMaterial,updateMaterial,
  sendMail ,getUserById,getArtistById,getOrdersByArtist,getEarnings,getNotifications,getProductById,addRating,
  getProductRatings,getUserRatings,PRatings,MRatings,submitProductRating,submitMaterialRating, SubmitRating,getRatings,
  getRatingsForItem, getMaterialRatings,getMaterialOrders} = require('../Control/usercontrol');
const multer=require('multer')
const path =require('path')
const userRouter = express.Router();

const storage=multer.diskStorage({
  destination : (req,file,cb)=>{
    cb(null,'uploads/');
    // console.log("multer")
  },
  filename:(req,file,cb)=>{
    cb(null,Date.now()+path.extname(file.originalname))
  }
})

const upload = multer({storage:storage})

userRouter.route('/register').post(upload.single('profilePicture'),userRegister);
userRouter.route("/addproduct").post(upload.single('productImage'),addproduct);
userRouter.route("/products").get(getProducts);
userRouter.route("/register/artist").post(upload.single("profilePicture"), registerArtist);
userRouter.route("/artists").get(getArtists);
userRouter.route('/addmaterial').post(upload.single('image'), addMaterial);
userRouter.route('/materials').get(getMaterials);

userRouter.route("/contact").post(addMessage);
userRouter.route("/contact").get(getMessages);
userRouter.route("/products/artist/:artistId").get(getProductsByArtist);

userRouter.route("/add").post(addTestimonial);
userRouter.route("/all").get(getTestimonials);
userRouter.route('/login').post(userLogin);
userRouter.route("/addcart").post(addCart)
userRouter.route("/addcartmeterial").post(addCartMaterial)
userRouter.route("/getCart").get(getCart)
userRouter.route("/updatecart").put(updateCartItem);  // Change POST to PUT
userRouter.route("/removecartitem").delete(removeCartItem);  // Change POST to DELETE

userRouter.route("/products/artist/:artistId").get(getProductsByArtist);
userRouter.route("/updateproduct/:id").put(upload.single('productImage'), addproduct);
userRouter.route("/deleteproduct/:id").delete(removeProduct);
userRouter.route("/updatematerial/:id").put(upload.single('materialImage'), updateMaterial);
userRouter.route("/deletematerial/:id").delete(removeMaterial );

userRouter.route("/orders").post(placeOrder);
userRouter.route("/orders/user/:userId").get(getorders);
userRouter.route("/orders/materials/:userId?").get(getMaterialOrders);


userRouter.route("/updateorder").put(updateOrderStatus);
userRouter.route("/orders/artist/:artistId").get(getOrdersByArtist);

userRouter.route("/Send").post(sendMail);
userRouter.route("/users/:id").get(getUserById);
userRouter.route("/artists/:id").get(getArtistById);
userRouter.get("/earnings/:artistId", getEarnings);
// userRouter.get("/notifications/:artistId", getNotifications);
userRouter.get("/notifications/:userId", getNotifications);

userRouter.route("/products/:id").get(getProductById);
userRouter.post("/add", addRating); // Add a rating
userRouter.get("/ratings/product/:productId", getProductRatings);
userRouter.get("/ratings/material/:materialId", getMaterialRatings);

// userRouter.get("/user/:userId", getUserRatings); // Get ratings given by a user
userRouter.get("/Product/rate", PRatings);
userRouter.get("/material/rate", MRatings);
userRouter.post("/product/rate/:productId", submitProductRating);
userRouter.post("/material/rate/:materialId", submitMaterialRating);
userRouter.get("/ratings/:userId", getUserRatings);
// Route for submitting a rating for both products and materials
userRouter.post("/rate/:itemType/:itemId", SubmitRating);
userRouter.get("/ratings", getRatings);

userRouter.get("/ratings/:itemId/:itemType", getRatingsForItem);


// userRouter.get("/ratings/:userId", Rating);

// userRouter.route("/create-payment-intent").post(createPaymentIntent);




module.exports = userRouter;