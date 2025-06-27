import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, IconButton, Button, Drawer, List, ListItem, ListItemText, useMediaQuery, Menu, MenuItem, Avatar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useTheme } from "@mui/material/styles";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

import Badge from "@mui/material/Badge";
import axios from "axios";
import logo from "/src/assets/logo.png";

const UserNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [user, setUser] = useState({ name: "", email: "", profilePic: "" });

  useEffect(() => {
    fetchNotifications();
    fetchUserData();
  }, []);

  const fetchNotifications = async () => {
    const userId = localStorage.getItem("userId");
    console.log("Fetching notifications for user:", userId); // Debugging
  
    if (!userId) {
      console.error("User ID not found in localStorage!");
      return;
    }
  
    try {
      const { data } = await axios.get(`http://localhost:1011/orders/user/${userId}`);
      console.log("Notifications received:", data); // Debugging
  
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error.response?.data || error.message);
    }
  };
  

  const fetchUserData = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
  
    try {
      const { data } = await axios.get(`http://localhost:1011/users/${userId}`);
      setUser({ uname: data.uname, email: data.email, profilePic: data.profilePic || "" });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleProfileClick = (event) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchor(null);
  };


   const menuLinks = [
    { label: "Home", path: "/user" },
    { label: "Shop", path: "/shop" },
    { label: "Artists", path: "/artprofil" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/ucontact" },
  ];

  return (
    <AppBar position="static" sx={{ background: "#05081C", height: "80px" }}>
      <Toolbar>
        {isMobile && (
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setMenuOpen(!menuOpen)}>
            <MenuIcon />
          </IconButton>
        )}
        
        <Typography variant="h6" sx={{ flexGrow: 1, overflow: "hidden" }}>
  <Link
    to="/"
    style={{
      textDecoration: "none",
      color: "white",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      paddingLeft: "10px",
    }}
  >
    <img src={logo} alt="Artistry Logo" style={{ width: "90px", height: "80px" }} />
    <span style={{ color: "white" ,marginLeft:"-35px",paddingTop:"15px"}}>rtistry</span>
  </Link>
</Typography>


        {!isMobile && (
  <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>

    <Button
      color="inherit"
      component={Link}
      to="/user"
      sx={{
        transition: "0.3s",
        "&:hover": { transform: "scale(1.1)", color: "#9ABDDC" },
      }}
    >
      Home
    </Button>
    <Button
      color="inherit"
      component={Link}
      to="/shop"
      sx={{
        transition: "0.3s",
        "&:hover": { transform: "scale(1.1)", color: "#9ABDDC" },
      }}
    >
      Shop
    </Button>
    <Button
      color="inherit"
      component={Link}
      to="/artprofil"
      sx={{
        transition: "0.3s",
        "&:hover": { transform: "scale(1.1)", color: "#9ABDDC" },
      }}
    >
      Artists
    </Button>
    <Button
      color="inherit"
      component={Link}
      to="/about"
      sx={{
        transition: "0.3s",
        "&:hover": { transform: "scale(1.1)", color: "#9ABDDC" },
      }}
    >
      About
    </Button>
    <Button
      color="inherit"
      component={Link}
      to="/ucontact"
      sx={{
        transition: "0.3s",
        "&:hover": { transform: "scale(1.1)", color: "#9ABDDC" },
      }}
    >
      Contact
    </Button>
  </div>
)}

        {/* Cart Icon */}
        <IconButton color="inherit" component={Link} to="/cart">
          <ShoppingCartIcon />
        </IconButton>

        {/* Notifications */}
        <IconButton color="inherit" onClick={(event) => setAnchorEl(event.currentTarget)}>
          <Badge badgeContent={notifications.length} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          {notifications.length > 0 ? (
            notifications.map((order) => (
            <MenuItem key={order._id}>
  {order.status.trim().toLowerCase() === "shipped"
    ? "Your order is on the way!"
    : order.status.trim().toLowerCase() === "delivered"
    ? "Your order has been delivered!"
    : order.status.trim().toLowerCase() === "pending"
    ? "Your order is pending, stay tuned!"
    : order.status.trim().toLowerCase() === "cancelled"
    ? "Your order has been canceled."
    : `Your order is ${order.status}.`}
</MenuItem>

            
            ))
          ) : (
            <MenuItem>No new notifications</MenuItem>
          )}
        </Menu>

        <IconButton color="inherit" component={Link} to="/orders">
  <LocalShippingIcon />
</IconButton>

        {/* User Profile */}
       
        <IconButton onClick={handleProfileClick} sx={{ ml: 2 }}>
          <Avatar src={user.profilePic || "/default-avatar.png"} alt={user.name} sx={{ backgroundColor:'#9ABDDC' ,color: "black" }}/>
        </IconButton>

        <Menu anchorEl={profileAnchor} open={Boolean(profileAnchor)} onClose={handleProfileClose}>
          <MenuItem disabled><strong>{user.uname}</strong></MenuItem>
          <MenuItem disabled>{user.email}</MenuItem>
          <MenuItem onClick={() => { localStorage.clear(); sessionStorage.clear(); window.location.href = "/login" }}>Logout</MenuItem>
        </Menu>
      </Toolbar>

     <Drawer anchor="left" open={menuOpen} onClose={() => setMenuOpen(false)}>
        <List>
          {menuLinks.map((item) => (
            <ListItem button key={item.label} component={Link} to={item.path} onClick={() => setMenuOpen(false)}>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
};

export default UserNavbar;


