import React, { useState, useEffect } from "react";
import { 
  TextField, Button, Typography, Box, Paper, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, IconButton, Grid, Card, 
  CardContent, AppBar, MenuItem,Toolbar,FormControl, InputLabel,
  Select,Menu,Badge
} from "@mui/material";
import { Delete, Edit, Notifications } from "@mui/icons-material";
import Avatar from "@mui/material/Avatar"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const [productData, setProductData] = useState({
    pname: "",
    category: "",
    price: "",
    productImage: null,
  });
  
  const [products, setProducts] = useState([]);
  const [editProductId, setEditProductId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [earnings, setEarnings] = useState({ total: 0, pending: 0, paid: 0 });
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [artist, setArtist] = useState({ name: "", email: "", profilePic: "" });
  const [showOrders, setShowOrders] = useState(true);
  const artistId = localStorage.getItem("artistId");
  const [artistProducts, setArtistProducts] = useState([]);
  const [currentArtistId, setCurrentArtistId] = useState(null);
  const statusOptions = ["Pending", "Shipped", "Delivered", "Cancelled"];
  const [userName, setUserName] = useState("");  // ✅ Define state
  const [productName, setProductName] = useState("");  // ✅ Define state
  const [loadingProducts, setLoadingProducts] = useState(true);
const userId = localStorage.getItem("userId");
const productId = localStorage.getItem("productId");
const [loading, setLoading] = useState(true);
// console.log("User ID from local storage:", userId);
// console.log("Product ID from local storage:", productId);
// const storedProductId = localStorage.getItem("productId");
// console.log("Product ID from local storage:", storedProductId);

// Ensure it's being set properly somewhere in your app:
const storedProductIds = JSON.parse(localStorage.getItem("productIds") || "[]");

if (storedProductIds.length === 0) {
  console.warn("⚠️ No product IDs found in local storage! Fetching from API...");
} else {
  console.log("✅ Product IDs from local storage:", storedProductIds);
}

localStorage.setItem("productIds", JSON.stringify(artistProducts.map(p => p._id)));
console.log("✅ Product IDs saved:", artistProducts.map(p => p._id));


  useEffect(() => {
    const loggedInArtistId = localStorage.getItem("artistId");
    if (loggedInArtistId) {
      fetchProducts(loggedInArtistId);
    } else {
      console.error("Artist ID not found. Please login again.");
      navigate("/login");
    }
  }, [artist]); // Include artist in dependencies to ensure updates
  

  const fetchProducts = async (artistId) => {
    try {
      const response = await axios.get(`https://artistry-backend-ss49.onrender.com/products/artist/${artistId}`);

      setProducts(response.data || []);
    } catch (error) {
      console.error("Error fetching products:", error.response?.data || error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductData((prevData) => ({ ...prevData, productImage: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loggedInArtistId = localStorage.getItem("artistId");
    if (!loggedInArtistId) {
      alert("Artist ID not found. Please login again.");
      return;
    }

    const formData = new FormData();
    formData.append("pname", productData.pname);
    formData.append("category", productData.category);
    formData.append("price", productData.price);
    formData.append("artistId", loggedInArtistId);
    if (productData.productImage) {
      formData.append("productImage", productData.productImage);
    }

    try {
      if (editProductId) {
       await axios.put(`https://artistry-backend-ss49.onrender.com/updateproduct/${editProductId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Product updated successfully!");
        setEditProductId(null);
      } else {
       await axios.post("https://artistry-backend-ss49.onrender.com/addproduct", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Product added successfully!");
      }
      setProductData({ pname: "", category: "", price: "", productImage: null });
      fetchProducts(loggedInArtistId);
    } catch (error) {
      console.error("Error saving product:", error.message);
      alert("Error: Something went wrong.");
    }
  };

  const handleEdit = (product) => {
    setProductData({
      pname: product.pname,
      category: product.category,
      price: product.price,
      productImage: null,
    });
    setEditProductId(product._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://artistry-backend-ss49.onrender.com/deleteproduct/${id}`);

      alert("Product deleted successfully!");
      fetchProducts(localStorage.getItem("artistId"));
    } catch (error) {
      console.error("Error deleting product:", error.message);
      alert("Error deleting product. Please try again.");
    }
  };
  
  const fetchArtistData = async () => {
    const artistId = localStorage.getItem("artistId");
    if (!artistId) {
        console.error("No artistId found in localStorage");
        return;
    }
    try {
        console.log("Fetching artist with ID:", artistId);
        const { data } = await axios.get(`https://artistry-backend-ss49.onrender.com/artists/${artistId}`);
 // Ensure correct API route

        console.log("Fetched Artist Data:", data);
        setArtist({ 
            name: data.username,  
            email: data.email,
            profilePic: data.profilePicture || "/default-avatar.png",
        });
    } catch (error) {
        console.error("Error fetching artist data:", error.response?.data || error.message);
    }
};

// Run on component mount
useEffect(() => {
    fetchArtistData();
}, []);

    const handleProfileClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleProfileClose = () => {
      setAnchorEl(null);
    };

   
  
   

    const fetchEarnings = async () => {
      try {
        const response = await axios.get(`https://artistry-backend-ss49.onrender.com/earnings/${artistId}`);
        console.log("Earnings Data:", response.data);
      } catch (error) {
        console.error("Error fetching earnings:", error.response?.data || error);
      }
    };
    
    
    const fetchNotifications = async () => {
      try {
     const response = await axios.get(`https://artistry-backend-ss49.onrender.com/notifications/${artistId}`);

        console.log("Notifications Data:", response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error.response?.data || error);
      }
    };
    
  
    const updateOrderStatus = async (orderId, status) => {
      try {
       await axios.put(`https://artistry-backend-ss49.onrender.com/orders/${orderId}`, { status });

        fetchOrders();
      } catch (error) {
        console.error("Error updating order status:", error);
      }
    };

    const isArtistProduct = (productId) => {
      return artistProducts.some(product => product._id === productId);
    };
    
    const getArtistId = (productId) => {
      const product = artistProducts.find(p => p._id === productId);
      return product ? product.artistId : null;
    };
    
    // const filteredOrders = orders.filter(order =>
    //   order.items.some(item =>
    //     item.productId &&
    //     isArtistProduct(item.productId) &&
    //     getArtistId(item.productId) === currentArtistId
    //   )
    // );
    

    useEffect(() => {
      fetch("https://artistry-backend-ss49.onrender.com/orders")

        .then((res) => res.json())
        .then((data) => setOrders(data))
        .catch((err) => console.error(err));
    }, []);
    
  
    useEffect(() => {
      const storedUserId = localStorage.getItem("userId");
      const storedProductId = localStorage.getItem("productId");
    
      console.log("User ID from local storage:", storedUserId);
      console.log("Product ID from local storage:", storedProductId);
    
      if (storedUserId) fetchUserName(storedUserId);
      if (storedProductId) fetchProductName(storedProductId);
    }, []);
    
  

  useEffect(() => {
  const fetchUser = async () => {
    if (!userId) return;  // Prevent API call if no userId

    try {
    const res = await fetch(`https://artistry-backend-ss49.onrender.com/api/user/${userId}`);
      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, [userId]);

  useEffect(() => {
    if (artistId) {
      fetchArtistProducts();
    }
  }, [artistId]);
  
  const fetchArtistProducts = async () => {
    try {
    const response = await axios.get(`https://artistry-backend-ss49.onrender.com/products/artist/${artistId}`);

      setArtistProducts(response.data || []);
    } catch (error) {
      console.error("Error fetching artist products:", error);
    }
    
  };
  

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedProductId = localStorage.getItem("productId");

    console.log("User ID from local storage:", storedUserId);
    console.log("Product ID from local storage:", storedProductId);

    if (storedUserId) fetchUserName(storedUserId);
    if (storedProductId) fetchProductName(storedProductId);
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    console.log("User ID from local storage:", storedUserId);
    if (storedUserId) fetchUserName(storedUserId);
  }, []);

  const fetchUserName = async (userId) => {
    if (!userId) return console.error("User ID is missing!");
    try {
     const res = await axios.get(`https://artistry-backend-ss49.onrender.com/users/${userId}`);

      console.log("User API Response:", res.data);
      setUserName(res.data.username); // Directly setting userName to a single username
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchProductName = async (productId) => {
    if (!productId) return console.error("Product ID is missing!");
    try {
   const res = await axios.get(`https://artistry-backend-ss49.onrender.com/products/${productId}`);

      
      console.log("Product API Response:", res.data);
      setProductName(res.data.pname);  // ✅ Use `pname` instead of `productName`
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };
  
  

  useEffect(() => {
    if (orders.items) {
      orders.items.forEach(item => {
        if (!productNames[item.productId]) {  // Avoid duplicate API calls
          fetchProductName(item.productId);
        }
      });
    }
  }, [orders]);
  


  

  // useEffect(() => {
  //   const fetchArtistProducts = async () => {
  //     try {
  //       const response = await axios.get('http://localhost:1011/products/artist');
  //       setArtistProducts(response.data);
  //       console.log("✅ Fetched Artist Products:", response.data);
  //     } catch (error) {
  //       console.error('Error fetching artist products:', error);
  //     }
  //   };
  
  //   fetchArtistProducts();
  // }, []);






  const fetchOrders = async () => {
    try {
      const response = axios.get(`https://artistry-backend-ss49.onrender.com/orders/artist/${artistId}`)

      setOrders(response.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  
  // Call this function where needed
  useEffect(() => {
    if (artistId) {
      fetchOrders();
    }
  }, [artistId]);
  
  
  const handleViewOrders = () => {
    setShowOrders((prev) => !prev);
    // Optionally, refetch orders if needed
    if (!showOrders) {
      const fetchOrders = async () => {
        try {
          const response = await fetch("https://artistry-backend-ss49.onrender.com/getorders")

  
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await response.json();
            setOrders(data);
          } else {
            const text = await response.text();
            console.error("Expected JSON but received:", text);
          }
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      };
      
    }
  };


  const handleStatusChange = async (orderId, newStatus) => {
    try {
      axios.put("https://artistry-backend-ss49.onrender.com/updateorder", { orderId, status: newStatus })

      alert("Order status updated successfully!");
      fetchOrders(); // Refresh the orders list after updating
    } catch (error) {
      console.error("Error updating order status:", error.response?.data || error.message);
      alert("Failed to update order status.");
    }
  };
  
  const getProductName = (productId) => {
    console.log("getProductName - Received productId:", productId);
    if (!products || products.length === 0 || !productId) return "N/A";
    const product = products.find(
      (p) => p._id && p._id.toString() === productId.toString()
    );
    console.log("getProductName - Found Product:", product);
    if (product) {
      console.log("getProductName - Type of product.pname:", typeof product.pname);
      console.log("getProductName - Value of product.pname:", product.pname);
      return product.pname;
    }
    return "N/A";
  };



  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`https://artistry-backend-ss49.onrender.com/products/artist/${artistId}`)

      if (response.data) {
        setProducts(response.data);
        console.log("Fetched Products Data:", response.data);
      }
    } catch (error) {
      console.error("Error fetching products in useEffect:", error.message);
    }
  };

  if (artistId) fetchProducts();
}, [artistId]);
// Or whatever dependency your fetch has
  
  console.log("Products State in Component:", products); // ADD THIS LINE (outside the useEffect)
  


  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "black" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, color: "white", fontWeight: "bold" }}>
          Artestry
        </Typography>
        <Button color="inherit" onClick={() => navigate("/artists")}>Add Product</Button>
       
        <IconButton onClick={handleProfileClick} sx={{ ml: 2 }}>
        <Avatar 
  src={artist.profilePicture || "/default-avatar.png"} 
  alt={artist.username || "Artist"} 
  sx={{ backgroundColor: 'white', color: "black" }} 
/>

        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleProfileClose}>
          <MenuItem disabled><strong>{artist.name}</strong></MenuItem>
          <MenuItem disabled>{artist.email}</MenuItem>
          <MenuItem onClick={() => { localStorage.clear(); sessionStorage.clear(); window.location.href = "/login" }}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>

      <Box sx={{ backgroundColor: "white", minHeight: "100vh", padding: 3 }}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={5}>
            <Card sx={{ backgroundColor: "white", border: "2px solid black", color: "black", padding: 3 }}>
              <CardContent>
                <Typography variant="h5" sx={{ color: "black", textAlign: "center", marginBottom: 2 }}>
                  {editProductId ? "Edit Product" : "Add New Product"}
                </Typography>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <TextField label="Product Name" name="pname" value={productData.pname} onChange={handleChange} fullWidth required sx={{ marginBottom: 2, input: { color: "black" } }} InputLabelProps={{ style: { color: "black" } }}  />
                  <TextField label="Category" name="category" value={productData.category} onChange={handleChange} fullWidth required sx={{ marginBottom: 2, input: { color: "black" } }} InputLabelProps={{ style: { color: "black" } }}  />
                  <TextField label="Price" name="price" type="number" value={productData.price} onChange={handleChange} fullWidth required sx={{ marginBottom: 2, input: { color: "black" } }} InputLabelProps={{ style: { color: "black" } }} />
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ marginBottom: "10px", color: "black" }} />
                  <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: "black" }}>
                    {editProductId ? "Update Product" : "Add Product"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <TableContainer component={Paper} sx={{ backgroundColor: "white", border: "2px solid black" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "black" }}>Product Name</TableCell>
                    <TableCell sx={{ color: "black" }}>Category</TableCell>
                    <TableCell sx={{ color: "black" }}>Price</TableCell>
                    <TableCell sx={{ color: "black" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell sx={{ color: "#32012F" }}>{product.pname}</TableCell>
                      <TableCell sx={{ color: "#32012F" }}>{product.category}</TableCell>
                      <TableCell sx={{ color: "#32012F" }}>{product.price}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(product)}><Edit sx={{ color: "black" }} /></IconButton>
                        <IconButton onClick={() => handleDelete(product._id)}><Delete sx={{ color: "red" }} /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
      
  <Box sx={{ margin: 2 }}>
  <Typography variant="h5" sx={{ marginBottom: 2, color: "black" }}>
    Orders List
  </Typography>
  <TableContainer component={Paper} sx={{ backgroundColor: "coffe", border: "2px solid black" }}>
    <Table>
      <TableHead>
        <TableRow>
          {[
            "Order ID",
            "User Name",
            "Phone",
            "Address",
            "City",
            "Postal Code",
            "Items",
            "Total Price",
            "Payment Method",
            "Status",
            "Created At"
          ].map((header) => (
            <TableCell key={header} sx={{ color: "black", textAlign: "center" }}>
              {header}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {orders.length > 0 ? (
          orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell sx={{ color: "black" }}>{order._id}</TableCell>
              <TableCell sx={{ color: "black" }}>
  {userName[order.userId] || "Loading..."}
</TableCell>
              <TableCell sx={{ color: "black" }}>{order.phone}</TableCell>
              <TableCell sx={{ color: "black" }}>{order.address}</TableCell>
              <TableCell sx={{ color: "black" }}>{order.city}</TableCell>
              <TableCell sx={{ color: "black" }}>{order.postalCode}</TableCell>
              <TableCell sx={{ color: "black" }}>
  {order.items
    .filter(item => item.productId)
    .map(
      (item) => `${getProductName(item.productId._id)} (x${item.quantity})`
    )
    .join(", ")}
</TableCell>


              <TableCell sx={{ color: "black" }}>${order.totalPrice}</TableCell>
              <TableCell sx={{ color: "black" }}>{order.paymentMethod}</TableCell>
              <TableCell>
                    <FormControl fullWidth size="small">
                      <InputLabel id={`status-label-${order._id}`}>
                        Status
                      </InputLabel>
                      <Select
                        labelId={`status-label-${order._id}`}
                        label="Status"
                        defaultValue={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        sx={{
                          color: "black",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "black",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "black",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "black",
                          },
                          "& .MuiSvgIcon-root": {
                            color: "black",
                          },
                        }}
                      >
                        {statusOptions.map((status) => (
                          <MenuItem key={status} value={status}>
                            {status}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
              <TableCell sx={{ color: "black" }}>{new Date(order.createdAt).toLocaleString()}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={11} align="center" sx={{ color: "black" }}>
              No orders found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
</Box>

{/* </Box>

)} */}


    </>
  );
};

export default AdminPanel;


