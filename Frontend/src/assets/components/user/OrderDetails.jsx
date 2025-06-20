import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Box,
  Stack,
  LinearProgress,
  Rating,
  Menu,
} from "@mui/material";
import axios from "axios";
import UserNavbar from "../usernavbar";
import { Support } from "@mui/icons-material";

const OrderDetails = () => {
  const [orders, setOrders] = useState([]);
  const [ratings, setRatings] = useState({});
  const userId = localStorage.getItem("userId");
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (!userId) return;
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`http://localhost:1011/orders/user/${userId}`);
        setOrders(data);

        const ratingsResponse = await axios.get(`http://localhost:1011/ratings/user/${userId}`);
        const ratingsData = ratingsResponse.data;

        const ratingsMap = {};
        ratingsData.forEach((rating) => {
          ratingsMap[`${rating.orderId}-${rating.itemId}`] = rating.rating;
        });

        setRatings(ratingsMap);
      } catch (error) {
        console.error("Error fetching orders or ratings:", error);
      }
    };
    fetchOrders();
  }, [userId]);

  const handleRatingChange = async (orderId, item, rating) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const itemId = item?.productId?._id || item?.materialId?._id;
    if (!itemId) return;

    const itemType = item?.productId ? "product" : "material";
    const payload = { userId, orderId, itemId, rating };

    setRatings((prev) => ({ ...prev, [`${orderId}-${itemId}`]: rating }));

    try {
      await axios.post(`http://localhost:1011/rate/${itemType}/${itemId}`, payload, {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error submitting rating:", error.response?.data || error.message);
      setRatings((prev) => ({
        ...prev,
        [`${orderId}-${itemId}`]: prev[`${orderId}-${itemId}`] || 0,
      }));
    }
  };

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  return (
    <>
      <UserNavbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          sx={{ color: "#05081C", textAlign: "center" }}
        >
          Order Summary
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2, textAlign: "center", bgcolor: "#fff", border: "1px solid black" }}>
              <Typography sx={{ color: "#05081C" }}>Total Orders</Typography>
              <Typography variant="h5">{orders.length}</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2, textAlign: "center", bgcolor: "#fff", border: "1px solid black" }}>
              <Typography sx={{ color: "#05081C" }}>Avg Order Value</Typography>
              <Typography variant="h5">
                ₹{(orders.reduce((sum, o) => sum + o.totalPrice, 0) / (orders.length || 1)).toFixed(2)}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2, textAlign: "center", bgcolor: "#fff", border: "1px solid black" }}>
              <Typography sx={{ color: "#05081C" }}>Average Rating</Typography>
              <Typography variant="h5">5.0 / 5.0</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2, textAlign: "center", bgcolor: "#fff", border: "1px solid black" }}>
              <Typography sx={{ color: "#05081C" }}>On-time Delivery</Typography>
              <Typography variant="h5">98%</Typography>
            </Card>
          </Grid>
        </Grid>

        {orders.map((order) => (
          <Card
            key={order._id}
            sx={{
              mb: 3,
              p: 2,
              borderRadius: 3,
              bgcolor: "#fff",
              border: "1px solid black",
              boxShadow: 3,
            }}
          >
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ color: "#05081C" }}>
                    {order._id}
                  </Typography>
                  <Typography variant="body2">
                    Ordered on: {new Date(order.createdAt).toDateString()}
                  </Typography>
                  <Typography fontWeight="bold">₹{order.totalPrice}</Typography>
                </Grid>
                <Grid item xs={12} md={6} textAlign={{ xs: "left", md: "right" }}>
                  <Chip
                    label={order.status}
                    color={
                      order.status === "Delivered"
                        ? "success"
                        : order.status === "Shipped"
                        ? "primary"
                        : "warning"
                    }
                    sx={{ mb: 1 }}
                  />
                  <LinearProgress
                    variant="determinate"
                    value={
                      order.status === "Processing"
                        ? 45
                        : order.status === "Shipped"
                        ? 75
                        : 100
                    }
                    sx={{ height: 8, borderRadius: 5 }}
                  />
                  <Stack direction="row" justifyContent={{ xs: "flex-start", md: "flex-end" }} spacing={1} mt={1}>
                    <Button
                      variant="outlined"
                      startIcon={<Support />}
                      onClick={handleOpenMenu}
                      sx={{
                        color: "#05081C",
                        borderColor: "#05081C",
                        "&:hover": {
                          backgroundColor: "#05081C",
                          color: "#9ABDDC",
                        },
                      }}
                    >
                      Support
                    </Button>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu} sx={{ mt: 1 }}>
                      <Box sx={{ padding: 2, minWidth: "250px" }}>
                        <Typography variant="h6" sx={{ color: "black" }}>
                          Need Help?
                        </Typography>
                        <Typography sx={{ color: "black", marginTop: 1 }}>
                          Facing issues with your order, shipping, cancellation, or refunds? Call our{" "}
                          <strong>24/7 customer support</strong> at:
                        </Typography>
                        <Typography variant="h6" sx={{ color: "blue", marginTop: 1 }}>
                          📞 +1 (800) 123-4567
                        </Typography>
                      </Box>
                    </Menu>
                  </Stack>
                </Grid>
              </Grid>

              <Box mt={2}>
                {order?.items?.map((item) => {
                  const itemId = item?.productId?._id || item?.materialId?._id || item?._id;
                  const itemName = item?.productId?.pname || item?.materialId?.name || "Unknown Item";

                  if (!itemId) {
                    return (
                      <Typography key={Math.random()} sx={{ color: "red" }}>
                        ⚠️ Item missing ID
                      </Typography>
                    );
                  }

                  return (
                    <Box
                      key={itemId}
                      sx={{
                        mt: 2,
                        p: 2,
                        border: "1px solid black",
                        borderRadius: 2,
                        bgcolor: "#fff",
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#05081C" }}>
                        🖼️ {itemName}
                      </Typography>
                      <Typography variant="body2">
                        Category: {item?.productId ? "Product" : item?.materialId ? "Material" : "Unknown"}
                      </Typography>
                      <Rating
                        name={`rating-${order._id}-${itemId}`}
                        value={ratings[`${order._id}-${itemId}`] || 0}
                        onChange={(event, newValue) =>
                          handleRatingChange(order._id, item, newValue)
                        }
                      />
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Container>
    </>
  );
};

export default OrderDetails;
