import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Grid,
  useMediaQuery
} from "@mui/material";
import Navbar from "./Navbar";
import Footeruser from "./Footeruser";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const navigate = useNavigate();
  const isSmall = useMediaQuery("(max-width:600px)");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://artistry-backend-ss49.onrender.com/contact", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Thank you for contacting us!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Navbar />

      <Box
        sx={{
          backgroundColor: "#ffffff",
          minHeight: "100vh",
          p: isSmall ? 2 : 4,
          color: "black",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant={isSmall ? "h4" : "h3"}
            gutterBottom
            sx={{ color: "#05081C", fontWeight: "bold" }}
          >
            Contact Us
          </Typography>
          <Typography variant="h6">
            We're here to assist you with any inquiries or feedback.
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {/* Form Section */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                border: "2px solid black",
                backgroundColor: "transparent",
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{ color: "#05081C", fontWeight: "bold" }}
              >
                Get in Touch
              </Typography>

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Your Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  sx={{
                    mb: 2,
                    input: { color: "black" },
                    fieldset: { borderColor: "black" },
                    label: { color: "black" },
                  }}
                />
                <TextField
                  fullWidth
                  label="Your Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  sx={{
                    mb: 2,
                    input: { color: "black" },
                    fieldset: { borderColor: "black" },
                    label: { color: "black" },
                  }}
                />
                <TextField
                  fullWidth
                  label="Your Message"
                  name="message"
                  multiline
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  sx={{
                    mb: 2,
                    input: { color: "black" },
                    fieldset: { borderColor: "black" },
                    label: { color: "black" },
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "#05081C",
                    color: "white",
                    textTransform: "none",
                    "&:hover": {  color: "#9ABDDC" },
                  }}
                >
                  Send Message
                </Button>
              </form>
            </Paper>
          </Grid>

          {/* Contact Info Section */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                border: "2px solid black",
                backgroundColor: "transparent",
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{ color: "#05081C", fontWeight: "bold" }}
              >
                Contact Information
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> support@artstry.com
              </Typography>
              <Typography variant="body1">
                <strong>Phone:</strong> +1 123 456 7890
              </Typography>
              <Typography
                variant="h6"
                sx={{ mt: 2, color: "#05081C", fontWeight: "bold" }}
              >
                Follow Us
              </Typography>
              <Box>
                <Typography
                  component="a"
                  href="https://facebook.com"
                  target="_blank"
                  sx={{ color: "#9ABDDC", display: "block", mb: 0.5 }}
                >
                  Facebook
                </Typography>
                <Typography
                  component="a"
                  href="https://instagram.com"
                  target="_blank"
                  sx={{ color: "#9ABDDC", display: "block", mb: 0.5 }}
                >
                  Instagram
                </Typography>
                <Typography
                  component="a"
                  href="https://twitter.com"
                  target="_blank"
                  sx={{ color: "#9ABDDC", display: "block" }}
                >
                  Twitter
                </Typography>
              </Box>
            </Paper>

            <motion.div
              className="review-button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1 }}
            />
          </Grid>
        </Grid>
      </Box>

      <Footeruser />
    </>
  );
};

export default ContactPage;
