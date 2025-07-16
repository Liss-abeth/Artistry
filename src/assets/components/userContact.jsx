import React, { useState } from "react";
import { TextField, Button, Box, Typography, Paper, Grid } from "@mui/material";
import UserNavbar from "./usernavbar";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    try {
      const response = await fetch("https://artistry-backend-ss49.onrender.com/contact"
, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Thank you for contacting us!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const navigate = useNavigate();

  return (
    <>
      <UserNavbar />
      <Box
        sx={{
          backgroundColor: "white",
          minHeight: "100vh",
          p: 4,
          color: "#05081C",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h3" gutterBottom color="#05081C" fontWeight="bold">
            Contact Us
          </Typography>
          <Typography variant="h6" color="#05081C">
            We're here to assist you with any inquiries or feedback.
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 4,
                backgroundColor: "white",
                border: "2px solid black",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
              }}
              elevation={3}
            >
              <Typography
                variant="h5"
                gutterBottom
                color="#05081C"
                fontWeight="bold"
              >
                Get in Touch
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Your Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  sx={{
                    mb: 2,
                    input: { color: "#05081C" },
                    fieldset: { borderColor: "black" },
                    label: { color: "#05081CF" },
                  }}
                  InputLabelProps={{ style: { color: "#05081C" } }}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Your Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  sx={{
                    mb: 2,
                    input: { color: "#05081C" },
                    fieldset: { borderColor: "black" },
                    label: { color: "#05081C" },
                  }}
                  InputLabelProps={{ style: { color: "#05081C" } }}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Your Message"
                  name="message"
                  multiline
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  sx={{
                    mb: 2,
                    input: { color: "#05081C" },
                    fieldset: { borderColor: "black" },
                    label: { color: "#05081C" },
                  }}
                  InputLabelProps={{ style: { color: "#05081C" } }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: "#05081C",
                    color: "white",
                    "&:hover": { color: "#9ABDDC" },
                  }}
                  fullWidth
                >
                  Send Message
                </Button>
              </form>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 4,
                backgroundColor: "white",
                border: "2px solid black",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
              }}
              elevation={3}
            >
              <Typography
                variant="h5"
                gutterBottom
                color="#05081C"
                fontWeight="bold"
              >
                Contact Information
              </Typography>
              <Typography variant="body1" color="#05081C" sx={{ mb: 1 }}>
                <strong>Email:</strong> support@artistry.com
              </Typography>
              <Typography variant="body1" color="#05081C" sx={{ mb: 2 }}>
                <strong>Phone:</strong> +1 123 456 7890
              </Typography>

              <Typography
                variant="h6"
                sx={{ mt: 2, mb: 1 }}
                color="#05081C"
                fontWeight="bold"
              >
                Follow Us
              </Typography>
              <Box>
                <Typography
                  component="a"
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "#9ABDDC",
                    display: "block",
                    textDecoration: "none",
                    mb: 0.5,
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Facebook
                </Typography>
                <Typography
                  component="a"
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "#9ABDDC",
                    display: "block",
                    textDecoration: "none",
                    mb: 0.5,
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Instagram
                </Typography>
                <Typography
                  component="a"
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "#9ABDDC",
                    display: "block",
                    textDecoration: "none",
                    mb: 0.5,
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Twitter
                </Typography>
              </Box>
            </Paper>

            <motion.div
              className="hero-buttons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1 }}
              style={{ marginTop: "20px", textAlign: "center" }}
            >
              <button
                onClick={() => navigate("/testimonials")}
                className="review-button"
                style={{
                  backgroundColor: "#05081C",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#4a394a")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#05081C")
                }
              >
                Leave a Review
              </button>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </>
  );
};

export default Contact;
