import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, Typography, TextField, Button, Box } from "@mui/material";
import UserNavbar from "./usernavbar";
import axios from "axios";
import Footer from "./Footer";

const TestimonialPage = () => {
  const [testimonials, setTestimonials] = useState([
    { name: "John Doe", review: "Amazing platform! Love the artworks." },
    { name: "Emma Smith", review: "A great place to find unique art pieces!" }
  ]);
  const [name, setName] = useState("");
  const [review, setReview] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send JSON instead of FormData
      const response = await axios.post("http://localhost:1011/add", {
        name,
        review,
      });

      if (response.status === 201) {
        alert("Testimonial submitted successfully!");
        setTestimonials([...testimonials, { name, review }]);
        setName("");
        setReview("");
      }
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      alert(error.response?.data?.message || "Failed to submit review. Try again.");
    }
  };

  return (
    <>
      <UserNavbar />
      <Box
        sx={{
          textAlign: "center",
          p: 3,
          backgroundColor: "white",
          minHeight: "100vh",
          color: "#5D455F",
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            color: "#05081C",
            fontSize: "2rem",
            marginBottom: "20px",
            fontWeight: "bold",
          }}
        >
          Testimonials
        </motion.h1>

        {/* Review Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ marginBottom: "30px" }}
        >
          <Card
            sx={{
              maxWidth: 500,
              margin: "auto",
              p: 3,
              backgroundColor: "white",
              border: "2px solid black",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
              borderRadius: 2,
              "@media (max-width:600px)": {
                maxWidth: "90%",
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: "bold", color: "#05081C" }}
            >
              Leave a Review
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Your Name"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{
                  mb: 2,
                  backgroundColor: "white",
                  borderRadius: "5px",
                  "& .MuiInputBase-input": { color: "#05081C" },
                  "& .MuiInputLabel-root": { color: "#05081C" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "black" },
                    "&:hover fieldset": { borderColor: "#05081C" },
                    "&.Mui-focused fieldset": { borderColor: "#05081C" },
                  },
                }}
              />
              <TextField
                fullWidth
                label="Your Review"
                variant="outlined"
                multiline
                rows={3}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                sx={{
                  mb: 2,
                  backgroundColor: "white",
                  borderRadius: "5px",
                  "& .MuiInputBase-input": { color: "#05081C" },
                  "& .MuiInputLabel-root": { color: "#05081C" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "black" },
                    "&:hover fieldset": { borderColor: "#05081C" },
                    "&.Mui-focused fieldset": { borderColor: "#05081C" },
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#05081C",
                  color: "white",
                  fontWeight: "bold",
                  py: 1.5,
                  px: 4,
                  borderRadius: 2,
                  boxShadow: "0 3px 6px rgba(93, 69, 95, 0.4)",
                  "&:hover": {
                    backgroundColor: "#4a394a",
                    boxShadow: "0 5px 10px rgba(74, 57, 74, 0.6)",
                  },
                  width: "100%",
                }}
              >
                Submit
              </Button>
            </form>
          </Card>
        </motion.div>

        {/* You can add Testimonials section here if needed */}

      </Box>
      <Footer />
    </>
  );
};

export default TestimonialPage;
