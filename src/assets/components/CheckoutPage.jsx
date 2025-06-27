import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
} from "@mui/material";
import { motion } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import UserNavbar from "./usernavbar";
import Footer from "./Footer";

const CheckoutPage = () => {
  const [cart, setCart] = useState([]);
  const [userDetails, setUserDetails] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const shippingCharge = 5;

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("checkoutCart")) || [];
    setCart(storedCart);
  }, []);

  const totalPrice = sessionStorage.getItem("totalamount");

  const handleInputChange = (e) =>
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });

  const handlePlaceOrder = async () => {
    if (!userDetails.name || !userDetails.address || !userDetails.phone) {
      alert("Please fill in all required details.");
      return;
    }
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User not logged in. Please sign in.");
      return;
    }

    const orderData = {
      userId,
      ...userDetails,
      items: cart,
      totalPrice: Number(totalPrice) || 0,
      shippingCharge,
      paymentMethod,
      status: "Pending",
    };

    if (paymentMethod === "online-payment") {
      sessionStorage.setItem("pendingOrder", JSON.stringify(orderData));
      navigate("/payment-gateway");
      return;
    }

    try {
      const res = await fetch("https://artistry-backend-ss49.onrender.com/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      const result = await res.json();

      if (!res.ok) {
        alert("Order failed: " + (result.message || "Unknown error"));
        return;
      }

      setShowSuccess(true);
      localStorage.removeItem("checkoutCart");
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/shop");
      }, 3000);
    } catch (err) {
      alert("Something went wrong: " + err.message);
    }
  };

  return (
    <>
      <UserNavbar />
      <Box
        sx={{
          p: 2,
          backgroundColor: "white",
          minHeight: "100vh",
          color: "black",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: ["column", "row"],
            justifyContent: "center",
            gap: 3,
            maxWidth: 1200,
            mx: "auto",
          }}
        >
          {/* Billing & Payment Section */}
          <Box flex="1 1 300px">
            <Typography
              variant="h5"
              sx={{ color: "#05081C", mb: 2, fontWeight: "bold" }}
            >
              Checkout
            </Typography>

            <Box
              sx={{
                border: "2px solid black",
                p: 2,
                borderRadius: 2,
                mb: 2,
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                Billing Details
              </Typography>
              {["name", "address", "city", "postalCode", "phone"].map(
                (field) => (
                  <TextField
                    key={field}
                    fullWidth
                    label={field.replace(/([A-Z])/g, " $1")}
                    name={field}
                    value={userDetails[field]}
                    onChange={handleInputChange}
                    sx={{
                      mb: 2,
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "black" },
                        "&:hover fieldset": { borderColor: "#5D455F" },
                        "&.Mui-focused fieldset": { borderColor: "#5D455F" },
                      },
                      "& .MuiInputLabel-root": { color: "#5D455F" },
                      input: { color: "black" },
                    }}
                  />
                )
              )}
            </Box>

            <Box
              sx={{
                border: "2px solid black",
                p: 2,
                borderRadius: 2,
                mb: 2,
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                Payment Method
              </Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  {[
                    "credit-card",
                    "paypal",
                    "cash-on-delivery",
                  ].map((method) => (
                    <FormControlLabel
                      key={method}
                      value={method}
                      control={<Radio sx={{ color: "black" }} />}
                      label={method.replace(/-/g, " ").toUpperCase()}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>

            {showSuccess && (
              <Box
                sx={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  backgroundColor: "black",
                  textAlign: "center",
                  py: 2,
                  zIndex: 1000,
                }}
              >
                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <CheckCircleIcon
                    sx={{ color: "white", fontSize: 30 }}
                  />
                  <Typography
                    variant="h6"
                    sx={{ color: "white", fontWeight: "bold" }}
                  >
                    Order Placed Successfully!
                  </Typography>
                </motion.div>
              </Box>
            )}

            <Button
              fullWidth
              variant="contained"
              onClick={handlePlaceOrder}
              sx={{
                mt: 2,
                backgroundColor: "#05081C",
                color: "white",
                fontWeight: "bold",
                py: 1.5,
                borderRadius: 2,
                "&:hover": {
                  color: "#9ABDDC",
                },
              }}
            >
              Place Order
            </Button>
          </Box>

          {/* Order Summary Section */}
          <Card
            component={Box}
            flex="1 1 300px"
            sx={{
              p: 2,
              border: "2px solid black",
              borderRadius: 2,
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              backgroundColor: "white",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: "#05081C" }}>
                Order Summary
              </Typography>

              {cart.length === 0 ? (
                <Typography sx={{ color: "black", mb: 2 }}>
                  Your cart is empty.
                </Typography>
              ) : (
                cart.map((item, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1,
                      pb: 1,
                      borderBottom: "1px solid black",
                    }}
                  >
                    <img
                      src={
                        item.productId?.productImage
                          ? `http://localhost:1011${
                              item.productId.productImage.startsWith("/") 
                                ? item.productId.productImage 
                                : "/uploads/" + item.productId.productImage
                            }`
                          : item.materialId?.image
                          ? `http://localhost:1011/${item.materialId.image.replace(
                              /\\/g,
                              "/"
                            )}`
                          : "https://via.placeholder.com/80"
                      }
                      alt={item.name}
                      style={{
                        width: 60,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 4,
                        marginRight: 12,
                      }}
                    />
                    <Typography sx={{ color: "black" }}>
                      {item.name} (x{item.quantity})
                    </Typography>
                  </Box>
                ))
              )}

              <Typography variant="h6" sx={{ mt: 2, color: "black" }}>
                Shipping: ${shippingCharge}
              </Typography>
              <Typography variant="h6" sx={{ mt: 1, color: "black" }}>
                Total: ${totalPrice}
              </Typography>

              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  border: "2px solid black",
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" sx={{ mb: 1, color: "black" }}>
                  Need Help?
                </Typography>
                <Typography sx={{ color: "black", mb: 1 }}>
                  Facing any issues with your order, shipping, cancellation, or
                  refunds? Call our 24/7 support at:
                </Typography>
                <Typography variant="h6" sx={{ color: "#05081C" }}>
                  📞 +1 (800) 123‑4567
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default CheckoutPage;
