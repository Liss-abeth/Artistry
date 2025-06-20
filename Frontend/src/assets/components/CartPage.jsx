import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Footer from "./Footer";
import UserNavbar from "./usernavbar";

const CartPage = () => {
  const [cart, setCart] = useState({ items: [] });
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const decode = jwtDecode(token);
        const res = await axios.get("http://localhost:1011/getcart", {
          headers: { userId: decode.id },
        });
        setCart(res.data.cart);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCart();
  }, [refresh]);

  const handleQuantityChange = async (item, delta) => {
    if (item.quantity + delta < 1) return;
    try {
      const token = localStorage.getItem("token");
      const decode = jwtDecode(token);
      await axios.put("http://localhost:1011/updatecart", {
        userId: decode.id,
        productId: item.productId?._id || null,
        materialId: item.materialId?._id || null,
        quantity: item.quantity + delta,
      });
      setRefresh((prev) => !prev);
    } catch (err) {
      console.error("Error updating cart:", err.response?.data || err.message);
    }
  };

  const handleRemoveItem = async (item) => {
    try {
      const token = localStorage.getItem("token");
      const decode = jwtDecode(token);
      await axios.delete("http://localhost:1011/removecartitem", {
        data: {
          userId: decode.id,
          productId: item.productId?._id || null,
          materialId: item.materialId?._id || null,
        },
      });
      setRefresh((prev) => !prev);
    } catch (err) {
      console.error("Error removing item:", err.response?.data || err.message);
    }
  };

  const subtotal = cart?.items?.reduce(
    (acc, item) =>
      acc +
      Number(item.productId?.price || item.materialId?.price || 0) *
        item.quantity,
    0
  );

  const shippingCharge = cart?.shippingFee || 5;
  const totalPrice = subtotal + shippingCharge;

  const handleCheckout = () => {
    localStorage.setItem("checkoutCart", JSON.stringify(cart.items));
    sessionStorage.setItem("totalamount", totalPrice);
    navigate("/checkout");
  };

  return (
    <>
      <UserNavbar />
      <div
        style={{
          padding: "20px",
          backgroundColor: "white",
          minHeight: "100vh",
          color: "black",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: "#05081C",
            marginBottom: "20px",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Shopping Cart
        </Typography>

        {cart.items.length === 0 ? (
          <Typography
            variant="h6"
            sx={{ color: "#05081C", marginTop: "20px", textAlign: "center" }}
          >
            Your cart is empty.
          </Typography>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            {/* Cart Items */}
            <div
              style={{
                flex: "2 1 500px",
                borderRight: "2px solid black",
                paddingRight: "20px",
                minWidth: "300px",
              }}
            >
              {cart.items.map((item) => (
                <div
                  key={item._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    border: "2px solid black",
                    padding: "10px",
                    borderRadius: "8px",
                    marginBottom: "10px",
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
                    alt={
                      item.productId?.pname ||
                      item.materialId?.name ||
                      "Unknown Item"
                    }
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      marginRight: "10px",
                      borderRadius: "5px",
                    }}
                  />

                  <div style={{ flexGrow: 1 }}>
                    <Typography>
                      {item.productId?.pname ||
                        item.materialId?.name ||
                        "Unknown"}{" "}
                      (x{item.quantity})
                    </Typography>
                    <Typography sx={{ color: "gray" }}>
                      ${item.productId?.price || item.materialId?.price || "N/A"}
                    </Typography>
                  </div>

                  <div>
                    <Button
                      onClick={() => handleQuantityChange(item, -1)}
                      sx={{ color: "#05081", fontWeight: "bold" }}
                    >
                      -
                    </Button>
                    <Button
                      onClick={() => handleQuantityChange(item, 1)}
                      sx={{ color: "#05081", fontWeight: "bold" }}
                    >
                      +
                    </Button>
                    <Button
                      onClick={() => handleRemoveItem(item)}
                      sx={{ color: "red", fontWeight: "bold" }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div
              style={{
                flex: "1 1 300px",
                padding: "20px",
                backgroundColor: "white",
                border: "2px solid black",
                borderRadius: "8px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                minWidth: "280px",
                maxWidth: "100%",
                marginTop: "20px",
                height: "fit-content",
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: "#05081C", marginBottom: "10px", fontWeight: "bold" }}
              >
                Order Summary
              </Typography>
              <Typography sx={{ marginBottom: "10px", color: "#5D455F" }}>
                Subtotal: ${subtotal.toFixed(2)}
              </Typography>
              <Typography sx={{ marginBottom: "10px", color: "#5D455F" }}>
                Shipping: ${shippingCharge.toFixed(2)}
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: "#05081C", marginBottom: "10px", fontWeight: "bold" }}
              >
                Total: ${totalPrice.toFixed(2)}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={handleCheckout}
                sx={{
                  backgroundColor: "#05081C",
                  color: "white",
                  fontWeight: "bold",
                  py: 1.5,
                  borderRadius: 2,
                  boxShadow: "0 3px 6px rgba(93, 69, 95, 0.4)",
                  "&:hover": {
                    backgroundColor: "#05081C",
                    boxShadow: "0 5px 10px rgba(74, 57, 74, 0.6)",
                  },
                }}
              >
                Checkout
              </Button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
