import React from "react";
import { Box, Container, Grid, Typography, Link, IconButton, Divider } from "@mui/material";
import { Facebook, Instagram, Twitter } from "@mui/icons-material";

const Footeruser = () => {
  return (
    <Box
      sx={{
        background: "#05081C",
        color: "white",
        py: 4,
        borderTop: "3px solid white",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2">
              Your one-stop destination for art supplies, products, and creativity.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box>
              <Link href="/" color="inherit" underline="hover" display="block">Home</Link>
              <Link href="/artp" color="inherit" underline="hover" display="block">Artists</Link>
              <Link href="/contact" color="inherit" underline="hover" display="block">Contact</Link>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
            <Box>
              <IconButton href="https://facebook.com" target="_blank" color="inherit">
                <Facebook />
              </IconButton>
              <IconButton href="https://instagram.com" target="_blank" color="inherit">
                <Instagram />
              </IconButton>
              <IconButton href="https://twitter.com" target="_blank" color="inherit">
                <Twitter />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3, borderColor: "gold" }} />
        <Typography align="center" variant="body2">
          &copy; 2025 Artistry. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footeruser;
