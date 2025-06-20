import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";
import logo from "/src/assets/logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const menuItems = [
    { text: "Home", path: "/" },
    { text: "Shop", path: "/ushop" },
    { text: "Artists", path: "/artp" },
    { text: "About", path: "/uabout" },
    { text: "Contact", path: "/contact" }
  ];

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#05081C", height: 80 }}>
        <Toolbar>
          {isMobile && (
            <IconButton color="inherit" onClick={toggleMenu}>
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <Link
              to="/"
              style={{
                textDecoration: "none",
                color: "white",
                display: "flex",
                alignItems: "center",
              
              }}
            >
              <img
                src={logo}
                alt="Artistry Logo"
                style={{ width: 90, height: 80 }}
               
              />
              <span style={{ color: "white" ,marginLeft:"-25px",paddingTop:"15px"}}>rtistry</span>
            </Link>
          </Typography>

          {!isMobile && (
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              {menuItems.map(({ text, path }) => (
                <Button
                  key={text}
                  color="inherit"
                  component={Link}
                  to={path}
                  sx={{
                    color: "white",
                    "&:hover": { color: "#9ABDDC" },
                    textTransform: "none"
                  }}
                >
                  {text}
                </Button>
              ))}
            </div>
          )}

          {/* <IconButton
            color="inherit"
            component={Link}
            to="/cart"
            sx={{ "&:hover": { backgroundColor: "#333" } }}
          >
            <ShoppingCartIcon />
          </IconButton> */}

          <IconButton
            color="inherit"
            component={Link}
            to="/login"
            sx={{ "&:hover": { backgroundColor: "#9ABDDC" } }}
          >
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={menuOpen}
        onClose={toggleMenu}
        ModalProps={{ keepMounted: true }}
      >
        <List>
          {menuItems.map(({ text, path }) => (
            <ListItem
              button
              key={text}
              component={Link}
              to={path}
              onClick={toggleMenu}
            >
              <ListItemText
                primary={text}
                primaryTypographyProps={{
                  sx: { color: "#05081C", fontWeight: "bold" }
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;
