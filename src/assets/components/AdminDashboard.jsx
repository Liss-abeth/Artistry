import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";

import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  MenuItem,
  MenuList,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  FormControl,
  Grid,

  InputLabel,
  Select, 
  TextField,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import { Container } from '@mui/material';
import { List } from '@mui/material';
import { Delete, Edit } from "@mui/icons-material";

import "chart.js/auto";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("all");
  const [openModal, setOpenModal] = useState(false);
  const [newMaterial, setNewMaterial] = useState({ name: "", image: "", manufacturer: "", price: "" });
  const [messages, setMessages] = useState([]); 
  const navigate = useNavigate();
  const [editModalOpen, setEditModalOpen] = useState(false);
const [editingUser, setEditingUser] = useState(null);
const [orders, setOrders] = useState([]);
const [editMaterialModalOpen, setEditMaterialModalOpen] = useState(false);
const [editingMaterial, setEditingMaterial] = useState(null);
const [materials, setMaterials] = useState([]);
const statusOptions = ["Pending", "Shipped", "Delivered", "Cancelled"];
const [products, setProducts] = useState([]);

const [showOrders, setShowOrders] = useState(false);


  const handleLogout = () => {
    // Clear user session (optional)
    localStorage.removeItem("userToken"); // If using authentication

    // Navigate to login page
    navigate("/login");
  };


  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://artistry-backend-ss49.onrender.com/users");

      setUsers(response.data);
      filterUsers(response.data, selectedRole);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const filterUsers = (users, role) => {
    setFilteredUsers(role === "all" ? users : users.filter(user => user.role === role || user.artistRole === role));
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    filterUsers(users, role);
  };

  const handleDeleteUser = async (id) => {
    try {
     await axios.delete(`https://artistry-backend-ss49.onrender.com/users/${id}`);

      setUsers(users.filter(user => user._id !== id));
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const userRoleChart = {
    labels: ["Users", "Admins", "Artists"],
    datasets: [{
      label: "User Roles",
      data: [
        users.filter(user => user.role === "user").length,
        users.filter(user => user.role === "admin").length,
        users.filter(user => user.role === "artist").length,
      ],
      backgroundColor: ["#4caf50", "#ff9800", "#2196f3"],
    }],
  };

  const handleAddMaterial = async (event) => {
    event.preventDefault();
  
    const formData = new FormData();
    formData.append("name", newMaterial.name);
    formData.append("manufacturer", newMaterial.manufacturer);
    formData.append("price", newMaterial.price);
    formData.append("image", newMaterial.image); // File upload
  
    try {
      const response = await axios.post("https://artistry-backend-ss49.onrender.com/addmaterial", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      alert("Material added successfully!");
      setOpenModal(false);
      setNewMaterial({ name: "", manufacturer: "", price: "", image: "" });
  
    } catch (error) {
      console.error("Error adding material:", error);
      alert("Failed to add material.");
    }
  };

  const handleEditMaterial = (material) => {
    setEditingMaterial(material);
    setEditMaterialModalOpen(true);
  };

  
  useEffect(() => {
    fetchMessages();
}, []);

const fetchMessages = async () => {
  try {
      const response =await axios.get("https://artistry-backend-ss49.onrender.com/contact");
 
      console.log(response.data);
      setMessages(response.data);
  } catch (error) {
      console.error("Error fetching messages:", error.message);
  }
};

const openEditModal = (user) => {
  setEditingUser(user);
  setEditModalOpen(true);
};

const handleUpdateUser = async (event) => {
  event.preventDefault();
  
  try {
  await axios.put(`https://artistry-backend-ss49.onrender.com/users/${editingUser._id}`, editingUser);

    alert("User updated successfully!");
    setEditModalOpen(false);
    fetchUsers(); // Refresh user list
  } catch (error) {
    console.error("Error updating user:", error);
    alert("Failed to update user.");
  }
};
const handleEditUser = (user) => {
  if (!user) return; // Prevent null values
  setEditingUser({ 
    uname: user.uname || "", 
    email: user.email || "", 
    role: user.role || "", 
    contactNumber: user.contactNumber || "",
    location: user.location || "" 
  });
  setEditModalOpen(true);
};

useEffect(() => {
  fetchOrders();  // Call the fetchOrders function on page load
}, []);
const fetchOrders = async () => {
  try {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error("User ID is not available");
      return;
    }

    const response =await axios.get(`https://artistry-backend-ss49.onrender.com/orders/user/${userId}`);

    const data = response.data;
    console.log("API Response:", data);
    setOrders(data); // Store the orders in the state
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};


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

const handleUpdateMaterial = async (event) => {
  event.preventDefault();

  const formData = new FormData();
  formData.append("name", editingMaterial.name);
  formData.append("manufacturer", editingMaterial.manufacturer);
  formData.append("price", editingMaterial.price);
  
  // Append image only if a new file is selected.
  if (editingMaterial.image instanceof File) {
    formData.append("image", editingMaterial.image);
  }

  try {
    // Update endpoint URL should include material id if needed
    const response = await axios.put(`https://artistry-backend-ss49.onrender.com/updatematerial/${editingMaterial._id}`, formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    alert("Material updated successfully!");
    setEditMaterialModalOpen(false);
    // Optionally, refresh your materials list here.
  } catch (error) {
    console.error("Error updating material:", error);
    alert("Failed to update material.");
  }
};



// useEffect(() => {
//   fetchMaterials().then((data) => setMaterials(data));
// }, []);

// const fetchMaterials = async () => {
//   try {
//     const response = await fetch("http://localhost:1011/materials"); // Adjust URL if needed
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching materials:", error);
//     return [];
//   }
// };




const getUserName = (userId) => {
  const user = users.find((u) => u._id === userId);
  return user ? user.uname : "N/A";
};

useEffect(() => {
  fetchProducts().then((data) => setProducts(data));
}, []);


const fetchProducts = async () => {
  try {
    const response = await fetch("https://artistry-backend-ss49.onrender.com/products")

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

const getProductName = (productId) => {
  if (!products || products.length === 0 || !productId) return "N/A";
  const product = products.find(
    (p) => p._id && p._id.toString() === productId.toString()
  );
  return product ? product.pname : "N/A";
};


useEffect(() => {
  fetchMaterials().then((data) => setMaterials(data));
}, []);

const fetchMaterials = async () => {
  try {
    const response = await fetch("https://artistry-backend-ss49.onrender.com/materials")

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching materials:", error);
    return [];
  }
};

useEffect(() => {
  fetchMaterialOrders();
}, []);

const fetchMaterialOrders = async () => {
  try {
    const response = await fetch("https://artistry-backend-ss49.onrender.com/orders/materials")


    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Fetched Orders:", data);
    setOrders(data);
  } catch (error) {
    console.error("Error fetching material orders:", error);
  }
};



const getMaterialName = (materialId) => {
  if (!materialId) return "N/A"; // Ensure materialId exists
  return materialId.name || "N/A"; // Directly return the name
};



const handleStatusChange = async (orderId, newStatus) => {
  try {
    await axios.put("https://artistry-backend-ss49.onrender.com/updateorder", { orderId, status: newStatus })

    alert("Order status updated successfully!");
    fetchOrders(); // Refresh the orders list after updating
  } catch (error) {
    console.error("Error updating order status:", error.response?.data || error.message);
    alert("Failed to update order status.");
  }
};


const handleDeleteMaterial = async (materialId) => {
  try {
    await axios.delete(`https://artistry-backend-ss49.onrender.com/deletematerial/${materialId}`)

    alert("Material deleted successfully!");
    // Optionally, update your local state or refresh the materials list.
  } catch (error) {
    console.error("Error deleting material:", error.response?.data || error.message);
    alert("Failed to delete material.");
  }
};



  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "black", borderBottom: "2px solid gold" }}>
      <Toolbar>
        <IconButton size="large" edge="start" color="inherit" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, color: "white" }}>
          Admin Dashboard
        </Typography>
        <Button color="inherit" onClick={handleLogout}>Logout</Button>
      </Toolbar>
    </AppBar>

     <Stack
  direction={{ xs: 'column', md: 'row' }}
  spacing={2}
  sx={{ margin: 2 }}
>

       <Paper
  sx={{
    backgroundColor: "black",
    padding: 2,
    border: "2px solid gray",
    width: { xs: '100%', md: '200px' },
  }}
>

          <MenuList>
            <MenuItem onClick={() => handleRoleChange("user")} sx={{ color: "white" }}>Users</MenuItem>
            <MenuItem onClick={() => handleRoleChange("admin")} sx={{ color: "white" }}>Admins</MenuItem>
            <MenuItem onClick={() => handleRoleChange("artist")} sx={{ color: "white" }}>Artists</MenuItem>
          </MenuList>
        </Paper>

        <Box sx={{ flexGrow: 1, padding: 2 }}>
          <Typography variant="h4" sx={{ color: "#7D0633", marginBottom: 2 }}>User Statistics</Typography>
          <Bar data={userRoleChart} />

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ marginY: 2, backgroundColor: "black", color: "white", marginRight:'10px' }}
            onClick={() => setOpenModal(true)}
          >
            Add Material
          </Button>

          
          <Button
  variant="contained"
  sx={{ marginY: 2, backgroundColor: "black", color: "white" }}
  onClick={handleViewOrders}
>
  View Orders
</Button>



{showOrders && (
  <Box sx={{ margin: 2 }}>
    {/* <Typography variant="h5" sx={{ marginBottom: 2, color: "Black" }}>
      Art Orders
    </Typography> */}
    {/* <TableContainer
      component={Paper}
      sx={{ backgroundColor: "#06192c", border: "2px solid white" }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: "gold" }}>Order ID</TableCell>
            <TableCell sx={{ color: "gold" }}>User Name</TableCell>
            <TableCell sx={{ color: "gold" }}>Products</TableCell>
            <TableCell sx={{ color: "gold" }}>Total Price</TableCell>
            <TableCell sx={{ color: "gold" }}>Status</TableCell>
            <TableCell sx={{ color: "gold" }}>Update Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders && orders.length > 0 ? (
            orders
              .filter(order => order.items.some(item => item.productId))
              .map((order) => (
                <TableRow key={order._id}>
                  <TableCell sx={{ color: "white" }}>{order._id}</TableCell>
                  <TableCell sx={{ color: "white" }}>
                    {getUserName(order.userId)}
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>
                    {order.items
                      .filter(item => item.productId)
                      .map(
                        (item) =>
                          `${getProductName(item.productId)} (x${item.quantity})`
                      )
                      .join(", ")}
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>
                    ${order.totalPrice}
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>{order.status}</TableCell>
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
                          color: "white",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "white",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "white",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "white",
                          },
                          "& .MuiSvgIcon-root": {
                            color: "white",
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
                </TableRow>
              ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ color: "white" }}>
                No art orders found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer> */}

    <Typography variant="h5" sx={{ marginTop: 4, marginBottom: 2, color: "Black" }}>
      Material Orders
    </Typography>
  <TableContainer
  component={Paper}
  sx={{
    backgroundColor: "#06192c",
    border: "2px solid white",
    overflowX: "auto",
  }}
>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: "gold" }}>Order ID</TableCell>
            <TableCell sx={{ color: "gold" }}>User Name</TableCell>
            <TableCell sx={{ color: "gold" }}>Material Name</TableCell>
            <TableCell sx={{ color: "gold" }}>Total Price</TableCell>
            <TableCell sx={{ color: "gold" }}>Status</TableCell>
            <TableCell sx={{ color: "gold" }}>Update Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders && orders.length > 0 ? (
            orders
              .filter(order => order.items.some(item => item.materialId))
              .map((order) => (
                <TableRow key={order._id}>
                  <TableCell sx={{ color: "white" }}>{order._id}</TableCell>
                  <TableCell sx={{ color: "white" }}>
                    {getUserName(order.userId)}
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>
  {order.items
    .filter(item => item.materialId)
    .map(item => `${getMaterialName(item.materialId)} (x${item.quantity})`)
    .join(", ")}
</TableCell>

                  <TableCell sx={{ color: "white" }}>
                    ${order.totalPrice}
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>{order.status}</TableCell>
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
                          color: "white",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "white",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "white",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "white",
                          },
                          "& .MuiSvgIcon-root": {
                            color: "white",
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
                </TableRow>
              ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ color: "white" }}>
                No material orders found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
)}
          <Box sx={{ margin: 2 }}>
    <Typography variant="h5" sx={{ marginBottom: 2, color: "Black" }}>
      Materials
    </Typography>

    <TableContainer component={Paper} sx={{ backgroundColor: "#06192c", border: "2px solid gold" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: "gold" }}>Name</TableCell>
            <TableCell sx={{ color: "gold" }}>Manufacturer</TableCell>
            <TableCell sx={{ color: "gold" }}>Price</TableCell>
            {/* <TableCell sx={{ color: "gold" }}>Image</TableCell> */}
            <TableCell sx={{ color: "gold" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {materials && materials.length > 0 ? (
            materials.map((material) => (
              <TableRow key={material._id}>
                <TableCell sx={{ color: "white" }}>{material.name}</TableCell>
                <TableCell sx={{ color: "white" }}>{material.manufacturer}</TableCell>
                <TableCell sx={{ color: "white" }}>${material.price}</TableCell>
                {/* <TableCell>
                  {material.image ? (
                    <img
                      src={material.image}
                      alt={material.name}
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                    />
                  ) : (
                    "No Image"
                  )}
                </TableCell> */}
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => handleEditMaterial(material)}
                    sx={{ color: "gold" }}
                  >
                    Edit
                  </Button>
                  <Button
          variant="outlined"
          color="error"
          onClick={() => handleDeleteMaterial(material._id)}
        >
          Delete
        </Button>
                </TableCell>

              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ color: "white" }}>
                No materials found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>

    {/* Edit Material Modal (if needed) */}
    <Modal
  open={editMaterialModalOpen}
  onClose={() => setEditMaterialModalOpen(false)}
>
  <Box
    sx={{
      width: { xs: '90%', sm: 400 },
      backgroundColor: "white",
      padding: 3,
      margin: "auto",
      marginTop: 10,
      borderRadius: 2,
    }}
  >

        <Typography variant="h6">Edit Material</Typography>
        {editingMaterial && (
          <form onSubmit={handleUpdateMaterial}>
            <TextField
              fullWidth
              label="Name"
              margin="normal"
              value={editingMaterial.name}
              onChange={(e) =>
                setEditingMaterial({
                  ...editingMaterial,
                  name: e.target.value,
                })
              }
            />
            <TextField
              fullWidth
              label="Manufacturer"
              margin="normal"
              value={editingMaterial.manufacturer}
              onChange={(e) =>
                setEditingMaterial({
                  ...editingMaterial,
                  manufacturer: e.target.value,
                })
              }
            />
            <TextField
              fullWidth
              label="Price"
              margin="normal"
              value={editingMaterial.price}
              onChange={(e) =>
                setEditingMaterial({
                  ...editingMaterial,
                  price: e.target.value,
                })
              }
            />

            <Button
              variant="contained"
              component="label"
              sx={{ marginTop: 2 }}
            >
              Upload New Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) =>
                  setEditingMaterial({
                    ...editingMaterial,
                    image: e.target.files[0],
                  })
                }
              />
            </Button>
            {editingMaterial.image && editingMaterial.image.name && (
              <Typography variant="body2" sx={{ marginTop: 1 }}>
                Selected File: {editingMaterial.image.name}
              </Typography>
            )}

            <Button type="submit" variant="contained" sx={{ marginTop: 2 }}>
              Update Material
            </Button>
          </form>
        )}
      </Box>
    </Modal>
  </Box>




{/* 
  <Typography variant="h5" sx={{ marginBottom: 2, color: "Black" }}>
      Art Products
    </Typography>



<Grid item xs={12}>
            <TableContainer component={Paper} sx={{ backgroundColor: "#06192c", border: "2px solid gold" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "gold" }}>Product Name</TableCell>
                    <TableCell sx={{ color: "gold" }}>Category</TableCell>
                    <TableCell sx={{ color: "gold" }}>Price</TableCell>
                    <TableCell sx={{ color: "gold" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell sx={{ color: "white" }}>{product.pname}</TableCell>
                      <TableCell sx={{ color: "white" }}>{product.category}</TableCell>
                      <TableCell sx={{ color: "white" }}>{product.price}</TableCell>
                      <TableCell>

                        <IconButton onClick={() => handleDelete(product._id)}><Delete sx={{ color: "red" }} /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>




  <Typography variant="h5" sx={{ color: "Black", textAlign: "center", marginBottom: 2 }}>
  {selectedRole === "artist" ? "Artists" : selectedRole === "admin" ? "Admins" : "Users"}
</Typography> */}






<TableContainer component={Paper} sx={{ backgroundColor: "#06192c", border: "2px solid gold" }}>

            <Table>
            <TableHead>
            <TableRow>
  <TableCell sx={{ color: "gold" }}>Name</TableCell>
  <TableCell sx={{ color: "gold" }}>Email</TableCell>
  <TableCell sx={{ color: "gold" }}>Role</TableCell>
  {/* <TableCell sx={{ color: "gold" }}>Phone</TableCell> */}
  <TableCell sx={{ color: "gold" }}>Address</TableCell>

  {selectedRole === "artist" ? (
    <>  <TableCell sx={{ color: "gold" }}>Phone</TableCell>
      <TableCell sx={{ color: "gold" }}>Bio</TableCell>
      <TableCell sx={{ color: "gold" }}>Portfolio</TableCell>
      <TableCell sx={{ color: "gold" }}>ProfilePic</TableCell>
    </>
  ) : (
    <>
      <TableCell sx={{ color: "gold" }}>Edit</TableCell>
      <TableCell sx={{ color: "gold" }}>Delete</TableCell>
    </>
  )}
</TableRow>

</TableHead>
<TableBody>
  {filteredUsers.map(user => (
    <TableRow key={user._id}>
      <TableCell sx={{ color: "white" }}>{user.uname || user.username || "N/A"}</TableCell>
      <TableCell sx={{ color: "white" }}>{user.email}</TableCell>
      <TableCell sx={{ color: "white" }}>{user.role}</TableCell>
      {/* <TableCell sx={{ color: "white" }}>{user.contactNumber || "N/A"}</TableCell> */}
      <TableCell sx={{ color: "white" }}>{user.location || "N/A"}</TableCell>
      
      {selectedRole === "artist" && (
        <>
        <TableCell sx={{ color: "white" }}>{user.contactNumber || "N/A"}</TableCell>
          <TableCell sx={{ color: "white" }}>{user.artistBio || "No bio"}</TableCell>
          <TableCell sx={{ color: "white" }}>
            <a href={user.portfolioLink} target="_blank" rel="noopener noreferrer" style={{ color: "gold" }}>
              View Portfolio
            </a>
          </TableCell>
          <TableCell>
            {user.profilePicture ? (
              <img src={`/uploads/${user.profilePicture.split("\\").pop()}`} alt="Profile" width="50" style={{ borderRadius: "50%" }} />

            ) : (
              <Typography sx={{ color: "white" }}>No Image</Typography>
            )}
          </TableCell>
        </>
      )}

      {/* Hide Edit/Delete for artists */}
      {user.role !== "artist" && (
        <>
          <TableCell>
          <Button sx={{ color: "gold" }} onClick={() => openEditModal(user)}>Edit</Button>

          </TableCell>
          <TableCell>
            <Button sx={{ color: "red" }} onClick={() => handleDeleteUser(user._id)}>Delete</Button>
          </TableCell>
        </>
      )}
    </TableRow>
  ))}
</TableBody>



            </Table>
            
          </TableContainer>
        </Box>
      </Stack>
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
  <Box sx={{ width: 400, backgroundColor: "white", padding: 3, margin: "auto", marginTop: 10, borderRadius: 2 }}>
    <Typography variant="h6">Edit User</Typography>
    <form onSubmit={handleUpdateUser}>
    <TextField 
  fullWidth 
  label="Username" 
  margin="normal" 
  value={editingUser ? editingUser.uname || editingUser.username || "" : ""}
  onChange={(e) => setEditingUser({ ...editingUser, uname: e.target.value })}
/>
<TextField 
  fullWidth 
  label="Email" 
  margin="normal" 
  value={editingUser ? editingUser.email || "" : ""}
  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
/>
<TextField 
  fullWidth 
  label="Role" 
  margin="normal" 
  value={editingUser ? editingUser.role || "" : ""}
  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
/>

<TextField 
  fullWidth 
  label="Contact Number" 
  margin="normal" 
  value={editingUser ? editingUser.contactNumber || "" : ""}
  onChange={(e) => setEditingUser({ ...editingUser, contactNumber: e.target.value })}
/>
<TextField 
  fullWidth 
  label="Location" 
  margin="normal" 
  value={editingUser ? editingUser.location || "" : ""}
  onChange={(e) => setEditingUser({ ...editingUser, location: e.target.value })}
/>

      <Button type="submit" variant="contained" sx={{ marginTop: 2 }}>Update</Button>
    </form>
  </Box>
</Modal>



<Modal open={openModal} onClose={() => setOpenModal(false)}>
  <Box
    sx={{
      width: 400,
      backgroundColor: "white",
      padding: 3,
      margin: "auto",
      marginTop: 10,
      borderRadius: 2,
    }}
  >
    <Typography variant="h6">Add Material</Typography>
    <form onSubmit={handleAddMaterial}>
      <TextField
        fullWidth
        label="Name"
        margin="normal"
        value={newMaterial.name}
        onChange={(e) =>
          setNewMaterial({ ...newMaterial, name: e.target.value })
        }
      />
      <TextField
        fullWidth
        label="Manufacturer"
        margin="normal"
        value={newMaterial.manufacturer}
        onChange={(e) =>
          setNewMaterial({ ...newMaterial, manufacturer: e.target.value })
        }
      />
      <TextField
        fullWidth
        label="Price"
        margin="normal"
        value={newMaterial.price}
        onChange={(e) =>
          setNewMaterial({ ...newMaterial, price: e.target.value })
        }
      />

      {/* Replace the URL upload with a file input */}
      <Button
        variant="contained"
        component="label"
        sx={{ marginTop: 2 }}
      >
        Upload Image
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={(e) =>
            setNewMaterial({
              ...newMaterial,
              image: e.target.files[0],
            })
          }
        />
      </Button>

      {/* Optionally display the selected file name */}
      {newMaterial.image && (
        <Typography variant="body2" sx={{ marginTop: 1 }}>
          Selected File: {newMaterial.image.name}
        </Typography>
      )}

      <Button type="submit" variant="contained" sx={{ marginTop: 2 }}>
        Add Material
      </Button>
    </form>
  </Box>
</Modal>




<Modal
  open={editMaterialModalOpen}
  onClose={() => setEditMaterialModalOpen(false)}
>
  <Box
    sx={{
      width: 400,
      backgroundColor: "white",
      padding: 3,
      margin: "auto",
      marginTop: 10,
      borderRadius: 2,
    }}
  >
    <Typography variant="h6">Edit Material</Typography>
    {editingMaterial && (
      <form onSubmit={handleUpdateMaterial}>
        <TextField
          fullWidth
          label="Name"
          margin="normal"
          value={editingMaterial.name}
          onChange={(e) =>
            setEditingMaterial({
              ...editingMaterial,
              name: e.target.value,
            })
          }
        />
        <TextField
          fullWidth
          label="Manufacturer"
          margin="normal"
          value={editingMaterial.manufacturer}
          onChange={(e) =>
            setEditingMaterial({
              ...editingMaterial,
              manufacturer: e.target.value,
            })
          }
        />
        <TextField
          fullWidth
          label="Price"
          margin="normal"
          value={editingMaterial.price}
          onChange={(e) =>
            setEditingMaterial({
              ...editingMaterial,
              price: e.target.value,
            })
          }
        />

        <Button
          variant="contained"
          component="label"
          sx={{ marginTop: 2 }}
        >
          Upload New Image
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) =>
              setEditingMaterial({
                ...editingMaterial,
                image: e.target.files[0],
              })
            }
          />
        </Button>
        {editingMaterial.image && editingMaterial.image.name && (
          <Typography variant="body2" sx={{ marginTop: 1 }}>
            Selected File: {editingMaterial.image.name}
          </Typography>
        )}

        <Button type="submit" variant="contained" sx={{ marginTop: 2 }}>
          Update Material
        </Button>
      </form>
    )}
  </Box>
</Modal>

<Container maxWidth="md" >
    <Paper elevation={3} sx={{ padding: 3, marginTop: 4, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
            Feedback Messages
        </Typography>
        {/* <Button variant="contained" color="primary" onClick={fetchMessages} sx={{ marginBottom: 2 }}>
            Fetch Feedback
        </Button> */}

        {/* Feedback Messages Table */}
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Message</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {messages.length > 0 ? (
                        messages.map((msg) => (
                            <TableRow key={msg._id}>
                                <TableCell>{msg.name}</TableCell>
                                <TableCell>{msg.email}</TableCell>
                                <TableCell>{msg.message}</TableCell>
                                <TableCell>{new Date(msg.createdAt).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} align="center">
                                No messages found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    </Paper>
</Container>

<Box>
<Box sx={{ display: "flex", flexDirection: "column", minHeight: "10vh" }}>
  <Box sx={{ flexGrow: 1 }}>
    {/* Your existing AdminDashboard content here */}
  </Box>

  <Box 
  component="footer" 
  sx={{ 
    backgroundColor: "#06192c", 
    color: "gold", 
    textAlign: "center", 
    padding: { xs: 2, sm: 3 }, 
    borderTop: "2px solid gold",
    position: "relative", 
    bottom: 0, 
    width: "100%",
    minHeight: "10vh"
  }}
>
  <Container maxWidth="lg">
    <Typography variant="body2" sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}>
      &copy; {new Date().getFullYear()} Artstry | All Rights Reserved
    </Typography>  
  </Container>
</Box>

</Box>

</Box>
 
      

    </>
  );
}
