import React from "react";
import { Box, Typography, Grid, Card, CardMedia, CardContent, Container, Button, useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Footeruser from "./Footeruser";
import logo from "/src/assets/alogo.png";
import { useNavigate } from "react-router-dom";

const UserAbout = () => {
  const navigate = useNavigate();
  const isSmall = useMediaQuery("(max-width:600px)");

  return (
    <>
      <Navbar />

      <Box
        sx={{
          backgroundColor: "white",
          color: "black",
          minHeight: "100vh",
          py: 6,
        }}
      >
        <Container>
          {/* Header Section */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant={isSmall ? "h4" : "h2"} fontWeight="bold" gutterBottom sx={{ color: "#05081C" }}>
                  About Us
                </Typography>

                <Typography variant="h6" sx={{ lineHeight: 1.8, mb: 3 }}>
                  Welcome to Artistry, your ultimate destination for premium art materials and creative products.
                  We are passionate about empowering artists with high‑quality supplies, innovative tools, and a
                  thriving community to inspire creativity.
                </Typography>

                <Button
                  onClick={() => navigate("/contact")}
                  variant="contained"
                  sx={{
                    backgroundColor: "#05081C",
                    color: "#fff",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "black" },
                  }}
                >
                  Contact Us
                </Button>
              </Grid>

              <Grid item xs={12} md={6}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Card
                    sx={{
                      overflow: "hidden",
                      borderRadius: "20px",
                      border: "1px solid black",
                    }}
                  >
                    <CardMedia component="img" height="350" image={logo} alt="Artistic Creativity" sx={{ objectFit: "cover" }} />
                  </Card>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>

          {/* Mission Section */}
          <motion.div initial={{ x: -100 }} animate={{ x: 0 }} transition={{ duration: 1 }}>
            <Box
              sx={{
                border: "2px solid black",
                borderRadius: 2,
                p: 4,
                mt: 6,
              }}
            >
              <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: "#05081C" }}>
                Our Mission
              </Typography>

              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                At Artistry, we aim to ignite creativity by offering top‑tier art supplies and a seamless
                platform for artists to showcase their talents. Our mission is to make high‑quality artistic tools
                accessible to everyone, from beginners to professionals.
              </Typography>
            </Box>
          </motion.div>

          {/* Features Section */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
            <Box sx={{ mt: 6 }}>
              <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom sx={{ color: "#05081C" }}>
                Artistry in Motion
              </Typography>

              <Grid container spacing={4} justifyContent="center">
                {[
                  {
                    title: "Expressive Art",
                    img: "https://images.fineartamerica.com/images/artworkimages/mediumlarge/2/1-creation-of-adam-michelangelo.jpg",
                    desc: "Unleash your creativity with high-quality supplies and expert guidance.",
                  },
                  {
                    title: "Quality Materials",
                    img: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/28d97355-26cd-433a-ba0f-2e12c2db20b9.jpg",
                    desc: "We provide the best materials sourced from leading manufacturers.",
                  },
                  {
                    title: "Inspiring Community",
                    img: "https://www.sananto.org/uploads/1/4/5/0/14508672/published/img-6438_1.jpg",
                    desc: "Connect with fellow artists and grow your artistic journey.",
                  },
                ].map((item, i) => (
                  <Grid item xs={12} sm={6} md={4} key={i}>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Card
                        sx={{
                          backgroundColor: "#05081C",
                          border: "1px solid black",
                          borderRadius: "20px",
                          overflow: "hidden",
                        }}
                      >
                        <CardMedia component="img" height="200" image={item.img} alt={item.title} sx={{ objectFit: "cover" }} />
                        <CardContent sx={{ textAlign: "center" }}>
                          <Typography variant="h6" fontWeight="bold" sx={{ color: "#9ABDDC" }}>
                            {item.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "white", mt: 1 }}>
                            {item.desc}
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </motion.div>
        </Container>
      </Box>

      <Footeruser />
    </>
  );
};

export default UserAbout;
