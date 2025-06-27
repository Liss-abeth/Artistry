import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  useMediaQuery
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import UserNavbar from "../usernavbar";
import Footeruser from "../Footeruser";
import Navbar from "../Navbar";

const UshopPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ category: "", minPrice: "", maxPrice: "" });
  const [products, setProducts] = useState([]);
  const [materials, setMaterials] = useState([]);
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const resp = await axios.get("http://localhost:1011/products");
        setProducts(resp.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const resp = await axios.get("http://localhost:1011/materials");
        setMaterials(resp.data);
      } catch (err) {
        console.error("Error fetching materials:", err);
      }
    };
    fetchMaterials();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredProducts = products.filter((product) => {
    const cat = (product.category || "").toLowerCase();
    const searchMatch = !searchQuery || product.pname.toLowerCase().includes(searchQuery.toLowerCase());
    const minOk = !filters.minPrice || product.price >= parseFloat(filters.minPrice);
    const maxOk = !filters.maxPrice || product.price <= parseFloat(filters.maxPrice);
    const catOk =
      !filters.category ||
      (filters.category === "Art Products" && ["watercolor", "digitalart"].includes(cat)) ||
      cat === filters.category.toLowerCase();
    return catOk && minOk && maxOk && searchMatch;
  });

  const filteredMaterials = materials.filter((mat) => {
    const cat = (mat.category || "").toLowerCase();
    const searchMatch = !searchQuery || mat.name.toLowerCase().includes(searchQuery.toLowerCase());
    const minOk = !filters.minPrice || mat.price >= parseFloat(filters.minPrice);
    const maxOk = !filters.maxPrice || mat.price <= parseFloat(filters.maxPrice);
    const catOk =
      !filters.category ||
      (filters.category === "Art Supplies") ||
      cat === filters.category.toLowerCase();
    return catOk && minOk && maxOk && searchMatch;
  });

  const addToCart = (item) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const idx = cart.findIndex((ci) => ci._id === item._id);
    if (idx !== -1) {
      cart[idx].quantity += 1;
    } else {
      cart.push({
        _id: item._id,
        name: item.pname || item.name,
        price: item.price,
        image: item.productImage
          ? `http://localhost:1011${item.productImage.startsWith("/") ? item.productImage : "/uploads/" + item.productImage}`
          : `http://localhost:1011/${item.image.replace(/\\/g, "/")}`,
        quantity: 1
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${item.pname || item.name} added to cart!`);
  };

  return (
    <>
      <Navbar />
      <Box sx={{ p: 3, backgroundColor: "#ffffff", minHeight: "100vh" }}>
        <Typography
          variant={isSmallScreen ? "h5" : "h4"}
          sx={{ textAlign: "center", fontWeight: "bold", mb: 3, color: "#05081C" }}
        >
          Explore & Shop Artistic Creations
        </Typography>

        <Box
          sx={{
            mb: 3,
            border: "2px solid black",
            borderRadius: 2,
            p: 2,
            maxWidth: isSmallScreen ? "100%" : 800,
            mx: "auto"
          }}
        >
          <TextField
            label="Search products"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            sx={{
              mb: 2,
              input: { color: "black" },
              label: { color: "black" },
              fieldset: { borderColor: "black" }
            }}
          />

          <Box display="flex" gap={2} flexDirection={isSmallScreen ? "column" : "row"}>
            <Select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              fullWidth
              sx={{
                color: "black",
                fieldset: { borderColor: "black" }
              }}
            >
              <MenuItem value="">All Categories</MenuItem>
              <MenuItem value="Art Supplies">Art Supplies</MenuItem>
              <MenuItem value="Art Products">Art Products</MenuItem>
            </Select>

            <TextField
              name="minPrice"
              label="Min Price"
              type="number"
              value={filters.minPrice}
              onChange={handleFilterChange}
              variant="outlined"
              fullWidth
              sx={{
                input: { color: "black" },
                label: { color: "black" },
                fieldset: { borderColor: "black" }
              }}
            />

            <TextField
              name="maxPrice"
              label="Max Price"
              type="number"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              variant="outlined"
              fullWidth
              sx={{
                input: { color: "black" },
                label: { color: "black" },
                fieldset: { borderColor: "black" }
              }}
            />
          </Box>
        </Box>

        <Grid container spacing={3}>
          {filteredProducts.map((prod) => (
            <Grid item xs={6} sm={6} md={3} lg={2} key={prod._id}>
              <Card sx={{ backgroundColor: "#ffffff", border: "2px solid black", borderRadius: 2 }}>
                <CardMedia
                  component="img"
                  height="150"
                  image={`http://localhost:1011${prod.productImage.startsWith("/") ? prod.productImage : "/uploads/" + prod.productImage}`}
                  alt={prod.pname}
                />
                <CardContent>
                  <Typography variant="h6" color="black">
                    {prod.pname}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {prod.category}
                  </Typography>
                  <Typography variant="h6" sx={{ color: "gray", mt: 1 }}>
                    ${prod.price}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => addToCart(prod)}
                    sx={{
                      mt: 1,
                      backgroundColor: "#05081C",
                      color: "white",
                      fontWeight: "bold",
                      borderRadius: "20px",
                      textTransform: "none",
                      "&:hover": { backgroundColor: "black" }
                    }}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3} sx={{ mt: 4 }}>
          {filteredMaterials.map((mat) => (
            <Grid item xs={6} sm={6} md={3} lg={2} key={mat._id}>
              <Card sx={{ backgroundColor: "#ffffff", border: "2px solid black", borderRadius: 2 }}>
                <CardMedia
                  component="img"
                  height="150"
                  image={`http://localhost:1011/${mat.image.replace(/\\/g, "/")}`}
                  alt={mat.name}
                />
                <CardContent>
                  <Typography variant="h6" color="black">
                    {mat.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {mat.category}
                  </Typography>
                  <Typography variant="h6" sx={{ color: "gray", mt: 1 }}>
                    ${mat.price}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => addToCart(mat)}
                    sx={{
                      mt: 1,
                      backgroundColor: "#05081C",
                      color: "white",
                      fontWeight: "bold",
                      borderRadius: "20px",
                      textTransform: "none",
                      "&:hover": { backgroundColor: "black" }
                    }}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Footeruser />
    </>
  );
};

export default UshopPage;
