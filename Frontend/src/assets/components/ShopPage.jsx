import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Select, MenuItem, Grid, Card, CardMedia, CardContent, Typography } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BoltIcon from "@mui/icons-material/Bolt";
import { jwtDecode } from 'jwt-decode';
import Navbar from "./Navbar";
import UserNavbar from "./usernavbar";
import { useParams } from "react-router-dom";
import Rating from 'react-rating';


import Footer from "./Footer";
import Footeruser from "./Footeruser";

const ShopPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ category: "", minPrice: "", maxPrice: "" });
  const [products, setProducts] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [productRatings, setProductRatings] = useState({}); // Store { productId: { averageRating, totalUsersRated } }
  const [materialRatings, setMaterialRatings] = useState({}); // Store { materialId: { averageRating, totalUsersRated } }
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:1011/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get("http://localhost:1011/materials");
        setMaterials(response.data);
      } catch (error) {
        console.error("Error fetching materials:", error);
      }
    };
    fetchMaterials();
  }, []);

  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) {
      return { averageRating: 0, totalUsersRated: 0 };
    }
    const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = totalRating / ratings.length;
    const totalUsersRated = ratings.length;
    return { averageRating, totalUsersRated };
  };

  useEffect(() => {
    const fetchProductRatings = async (productId) => {
      try {
        const response = await axios.get(`http://localhost:1011/ratings/product/${productId}`);
        setProductRatings(prevState => ({ ...prevState, [productId]: response.data }));
      } catch (error) {
        console.error(`Error fetching ratings for product ${productId}:`, error);
        setProductRatings(prevState => ({ ...prevState, [productId]: { averageRating: 0, totalUsersRated: 0 } }));
      }
    };

    products.forEach(product => {
      fetchProductRatings(product._id);
    });
  }, [products]);

  useEffect(() => {
    const fetchMaterialRatings = async (materialId) => {
      try {
        const response = await axios.get(`http://localhost:1011/ratings/material/${materialId}`);
        setMaterialRatings(prevState => ({ ...prevState, [materialId]: response.data }));
      } catch (error) {
        console.error(`Error fetching ratings for material ${materialId}:`, error);
        setMaterialRatings(prevState => ({ ...prevState, [materialId]: { averageRating: 0, totalUsersRated: 0 } }));
      }
    };

    materials.forEach(material => {
      fetchMaterialRatings(material._id);
    });
  }, [materials]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredProducts = products.filter((product) => {
    const normalizedCategory = (product.category || '').toLowerCase();
    const isArtProduct = filters.category === "Art Products" && ["watercolor", "digitalart"].includes(normalizedCategory);
    const matchesCategory = !filters.category || isArtProduct || normalizedCategory === (filters.category || '').toLowerCase();
    const matchesPrice = (!filters.minPrice || product.price >= parseFloat(filters.minPrice)) && (!filters.maxPrice || product.price <= parseFloat(filters.maxPrice));
    const matchesSearch = !searchQuery || product.pname.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesPrice && matchesSearch;
  });

  const filteredMaterials = materials.filter((material) => {
    const normalizedCategory = (material.category || "").toLowerCase();
    const isArtMaterial = filters.category === "Art Supplies";
    const matchesMaterialCategory = !filters.category || isArtMaterial || normalizedCategory === (filters.category || "").toLowerCase();
    const matchesPrice = (!filters.minPrice || material.price >= parseFloat(filters.minPrice)) && (!filters.maxPrice || material.price <= parseFloat(filters.maxPrice));
    const matchesSearch = !searchQuery || material.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMaterialCategory && matchesPrice && matchesSearch;
  });

  const addToCart = (id, name) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to add items to the cart.");
      navigate("/login");
      return;
    }
    const decode = jwtDecode(token);
    axios
      .post("http://localhost:1011/addcart", { productId: id }, { headers: { userId: decode.id } })
      .then(() => {
        alert(`${name} added successfully!`);
      })
      .catch((err) => {
        console.log("Error adding to cart:", err);
      });
  };

  const addMaterialToCart = (id, name) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to add items to the cart.");
      navigate("/login");
      return;
    }
    const decode = jwtDecode(token);
    axios
      .post("http://localhost:1011/addcartmeterial", { materialId: id }, { headers: { userId: decode.id } })
      .then(() => {
        alert(`${name} added successfully!`);
      })
      .catch((err) => {
        console.log("Error adding material to cart:", err);
      });
  };

  const handleBuyNow = (item) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to proceed with the purchase.");
      navigate("/login");
      return;
    }
    localStorage.setItem("buyNowProduct", JSON.stringify({ ...item, quantity: 1 }));
    navigate("/checkout?buyNow=true");
  };

  return (
    <>
      <UserNavbar />
      <div style={{ padding: "20px", backgroundColor: "white", minHeight: "100vh", color: "black" }}>
        <Typography variant="h4" sx={{ textAlign: "center", color: "#05081C", fontWeight: "bold", marginBottom: "20px" }}>
          Explore & Shop Artistic Creations
        </Typography>
        {/* Search and Filters */}
        <div style={{ marginBottom: "20px", border: "2px solid black", padding: "10px", borderRadius: "8px" }}>
          <TextField
            label="Search products"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            sx={{ input: { color: "black" }, label: { color: "black" }, fieldset: { borderColor: "black" }, marginBottom: "10px" }}
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <Select label="Category" value={filters.category} onChange={handleFilterChange} name="category" fullWidth sx={{ color: "black", ".MuiOutlinedInput-notchedOutline": { borderColor: "black" } }}>
              <MenuItem value="">All Categories</MenuItem>
              <MenuItem value="Art Supplies">Art Supplies</MenuItem>
              <MenuItem value="Art Products">Art Products</MenuItem>
            </Select>
            <TextField label="Min Price" type="number" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} variant="outlined" fullWidth sx={{ input: { color: "black" }, label: { color: "black" }, fieldset: { borderColor: "black" } }} />
            <TextField label="Max Price" type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} variant="outlined" fullWidth sx={{ input: { color: "black" }, label: { color: "black" }, fieldset: { borderColor: "black" } }} />
          </div>
        </div>

        {/* Product Cards */}
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item xs={6} sm={6} md={3} lg={2} key={product._id}>
                       <Card sx={{ backgroundColor: "white", color: "black", border: "2px solid black" }}>
                <CardMedia
                  component="img"
                  height="150"
                  image={`http://localhost:1011${product.productImage.startsWith('/') ? product.productImage : '/uploads/' + product.productImage}`}
                  alt={product.pname}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ color: "#05081C" }}>{product.pname}</Typography>
                  <Typography variant="body2" sx={{ color: "black" }}>{product.category}</Typography>
                  <Typography variant="h6" sx={{ marginTop: 1, color: "gray" }}>${product.price}</Typography>
                  {productRatings[product._id] && (
  <div style={{ display: 'flex', alignItems: 'center', marginTop: 5 }}>
    <Rating
      initialRating={productRatings[product._id]?.averageRating || 0}
      readonly
      emptySymbol={<span style={{ fontSize: '20px', color: 'gray' }}>☆</span>}
      fullSymbol={<span style={{ fontSize: '20px', color: 'gold' }}>★</span>}
      fractions={2} // Allows half-star ratings
    />
    <Typography variant="body2" sx={{ marginLeft: 1, color: 'gray' }}>
      ({productRatings[product._id].totalUsersRated})
    </Typography>
  </div>
)}
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => addToCart(product._id, product.pname)}
                    sx={{ mt: 1, background: "#05081C", color: "white", fontWeight: "bold", borderRadius: "20px", '&:hover': { background: "white", color: "black" } }}
                  >
                    Add to Cart
                  </Button>
                  {/* <Button
                    variant="contained"
                    fullWidth
                    startIcon={<BoltIcon />}
                    onClick={() => handleBuyNow(product)}
                    sx={{ mt: 1, backgroundColor: "#06192c", color: "gold", fontWeight: "bold", borderRadius: "20px", '&:hover': { background: "linear-gradient(45deg, #FFD700, #FFC107)", color: "black" } }}
                  >
                    Buy Now
                  </Button> */}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Materials Cards */}
        <Grid container spacing={3} style={{ marginTop: "20px" }}>
          {filteredMaterials.map((material) => (
     <Grid item xs={6} sm={6} md={3} lg={2} key={material._id}>
                <Card sx={{ backgroundColor: " white", color: "black", border: "2px solid black" }}>
                <CardMedia
                  component="img"
                  height="150"
                  image={`http://localhost:1011/${material.image.replace(/\\/g, "/")}`}
                  alt={material.name}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ color: "#05081C" }}>{material.name}</Typography>
                  <Typography variant="body2" sx={{ color: "black" }}>{material.manufacturer}</Typography>
                  <Typography variant="h6" sx={{ marginTop: 1, color: "gray" }}>${material.price}</Typography>
                  {materialRatings[material._id] && (
  <div style={{ display: "flex", alignItems: "center", marginTop: 5 }}>
    <Rating
      initialRating={materialRatings[material._id]?.averageRating || 0}
      readonly
      emptySymbol={<span style={{ color: "gray", fontSize: "20px" }}>☆</span>}
      fullSymbol={<span style={{ color: "gold", fontSize: "20px" }}>★</span>}
      fractions={2}
    />
    <Typography variant="body2" sx={{ marginLeft: 1, color: "gray" }}>
      ({materialRatings[material._id]?.totalUsersRated || 0})
    </Typography>
  </div>
)}
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => addMaterialToCart(material._id, material.name)}
                    sx={{ mt: 1, background: "#05081C", color: "white", fontWeight: "bold", borderRadius: "20px", '&:hover': { background: "white", color: "black" } }}
                  >
                    Add to Cart
                  </Button>
                  {/* <Button
                    variant="contained"
                    fullWidth
                    startIcon={<BoltIcon />}
                    onClick={() => handleBuyNow(material)}
                    sx={{ mt: 1, backgroundColor: "#06192c", color: "gold", fontWeight: "bold", borderRadius: "20px", '&:hover': { background: "linear-gradient(45deg, #FFD700, #FFC107)", color: "black" } }}
                  >
                    Buy Now
                  </Button> */}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
      <Footer />
    </>
  );
};

export default ShopPage;