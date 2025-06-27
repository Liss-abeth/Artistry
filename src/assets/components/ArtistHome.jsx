import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Box, Card, CardContent,IconButton,Avatar,Menu, MenuItem, CardMedia, Container,Grid } from "@mui/material";
import { motion } from "framer-motion";
import BrushIcon from "@mui/icons-material/Brush";
import StoreIcon from "@mui/icons-material/Store";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import axios from "axios";
import bannerImage from "../../assets/banner2.jpg"; // 
const ArtistHome = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [artist, setArtist] = useState({ name: "", email: "", profilePic: "" });

  useEffect(() => {
    fetchArtistData();
  }, []);

  const fetchArtistData = async () => {
    const artistId = localStorage.getItem("artistId");
    if (!artistId) {
        console.error("No artistId found in localStorage");
        return;
    }
    try {
        console.log("Fetching artist with ID:", artistId);
     const { data } = await axios.get(`https://artistry-backend-ss49.onrender.com/artists/${artistId}`);


        console.log("Fetched Artist Data:", data);
        setArtist({ 
            name: data.username,  
            email: data.email,
            profilePic: data.profilePicture || "/default-avatar.png",
        });
    } catch (error) {
        console.error("Error fetching artist data:", error.response ? error.response.data : error.message);
    }
};

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };


  return (
    <>
      {/* Navbar */}
      <AppBar position="static" sx={{ backgroundColor: "black" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, color: "white", fontWeight: "bold" }}>
          Artistry
        </Typography>
        <Button color="inherit" onClick={() => navigate("/artists")}>Add Product</Button>
        <IconButton onClick={handleProfileClick} sx={{ ml: 2 }}>
          <Avatar src={artist.profilePic || "/default-avatar.png"} alt={artist.name} sx={{ backgroundColor:'white' ,color: "black" }}/>
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleProfileClose}>
          <MenuItem disabled><strong>{artist.name}</strong></MenuItem>
          <MenuItem disabled>{artist.email}</MenuItem>
          <MenuItem onClick={() => { localStorage.clear(); sessionStorage.clear(); window.location.href = "/login" }}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>

      {/* Hero Section */}
      <Box
  sx={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    p: 5,
    // backgroundColor: "#0a2239",
    minHeight: "80vh",
    backgroundImage: `url(${bannerImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",

  }}
>
  <motion.h1
    initial={{ opacity: 0, scale: 1.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 1.5 }}
    style={{ color: "Black", fontWeight: "bold", marginTop: "-230px" }}
  >
    Welcome, Artists!
  </motion.h1>
  <Typography variant="h6" sx={{ color: "Black", maxWidth: "600px" }}>
    Showcase your artwork, connect with buyers, and sell your materials.
  </Typography>
</Box>



      {/* Featured Artworks */}
      <Box sx={{ textAlign: "center", p: 4, backgroundColor: "#FAF1E6" }}>
  <Typography
    variant="h4"
    sx={{ color: "Black", mb: 3, fontWeight: "bold" }}
  >
    Featured Artworks
  </Typography>

  <Box sx={{ display: "flex", justifyContent: "center", gap: 3, flexWrap: "wrap" }}>
    {[
      {
        id: 1,
        image: "https://i.pinimg.com/564x/ff/ab/4a/ffab4acefa466c7e2598d574580eb7ec.jpg",
        title: "Mystic Portrait",
        description: "A surreal blend of emotions and colors, capturing the soul within.",
      },
      {
        id: 2,
        image: "https://as2.ftcdn.net/v2/jpg/05/73/11/05/1000_F_573110522_cNhZ9NoZvPesV7v9x5EnV1RobZY59qxy.jpg",
        title: "Dreamy Landscape",
        description: "Nature’s beauty reimagined through vibrant strokes of imagination.",
      },
      {
        id: 3,
        image: "https://i0.wp.com/www.thepoeticfy.com/wp-content/uploads/2024/03/sunset-poem.jpg?w=726&ssl=1",
        title: "Abstract Sunset",
        description: "A mesmerizing fusion of light and shadows that tells its own story.",
      },
    ].map((art) => (
      <Card
        key={art.id}
        sx={{
          maxWidth: 300,
          backgroundColor: "white",
          border: "2px solid black",
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "scale(1.02)",
          },
        }}
      >
        <CardMedia component="img" height="200" image={art.image} alt={art.title} />
        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="h6" sx={{ color: "black", fontWeight: "bold" }}>
            {art.title}
          </Typography>
          <Typography variant="body2" sx={{ color: "Black" }}>
            {art.description}
          </Typography>
        </CardContent>
      </Card>
    ))}
  </Box>
</Box>

<Box sx={{ backgroundColor: "#FAF1E6", py: 6 }}>
      <Container>
        <Typography
          variant="h4"
          sx={{ color: "black", fontWeight: "bold", textAlign: "center", mb: 4 }}
        >
          Let Your Artwork Find Its Perfect Home
        </Typography>
        <Typography variant="body1" sx={{ color: "black", textAlign: "center", mb: 5 }}>
          Every masterpiece deserves an audience. Share your creativity and sell your artwork to collectors worldwide.
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {[
            {
              icon: <BrushIcon sx={{ fontSize: 50, color: "white" }} />,
              title: "Create with Passion",
              description: "Let your imagination flow and bring unique artworks to life.",
            },
            {
              icon: <StoreIcon sx={{ fontSize: 50, color: "white" }} />,
              title: "Showcase Your Art",
              description: "Upload and display your artwork to a global audience effortlessly.",
            },
            {
              icon: <MonetizationOnIcon sx={{ fontSize: 50, color: "white" }} />,
              title: "Earn from Your Talent",
              description: "Sell your artwork and get paid securely with ease.",
            },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ backgroundColor: "black", textAlign: "center", p: 3, border: "2px solid black" }}>
                <CardContent>
                  {item.icon}
                  <Typography variant="h6" sx={{ color: "white", fontWeight: "bold", mt: 2 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "white", mt: 1 }}>
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: "center", mt: 5 }}>
        <Button
      variant="contained"
      sx={{ backgroundColor: "black", color: "white", fontWeight: "bold" }}
      onClick={() => navigate("/artists")}
    >
      Start Selling Your Art
    </Button>
        </Box>
      </Container>
    </Box>
    </>
  );
};

export default ArtistHome;
