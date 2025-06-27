import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Box,
  useMediaQuery,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

export default function LoginPage() {
  const [user, setUser] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const isSmall = useMediaQuery("(max-width:600px)");

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("https://artistry-backend-ss49.onrender.com/login", user)

      .then((response) => {
        const { token, userId, role, artistId } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        if (role === "admin") navigate("/admin");
        else if (role === "artist") {
          localStorage.setItem("artistId", artistId);
          navigate("/arthome");
        } else if (role === "user") navigate("/user");
        else navigate("/");
      })
      .catch(() => alert("Invalid credentials"));
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "white",
        p: isSmall ? 2 : 0,
      }}
    >
      <Card
        sx={{
          width: isSmall ? "100%" : 380,
          position: "relative",
          p: 2,
          borderRadius: 2,
          border: "1px solid black",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <CardContent>
          <Link to="/" style={{ position: "absolute", top: 16, left: 16 }}>
            <ArrowBackIcon sx={{ fontSize: 25, color: "black" }} />
          </Link>

          <LockOutlinedIcon sx={{ fontSize: 40, color: "black", mb: 1 }} />

          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#05081C" }}>
            Welcome Back!
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: "black", mb: 2 }}
          >
            Please login to your account
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <EmailOutlinedIcon sx={{ color: "black", mr: 1 }} />
              <TextField
                name="email"
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                required
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root fieldset": { borderColor: "black" },
                }}
              />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <LockOutlinedIcon sx={{ color: "black", mr: 1 }} />
              <TextField
                name="password"
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                required
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root fieldset": { borderColor: "black" },
                }}
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#05081C",
                color: "#fff",
                fontWeight: "bold",
                py: 1.5,
                textTransform: "none",
                "&:hover": { backgroundColor: "#05081C" },
              }}
            >
              Login
            </Button>
          </form>

          <Typography variant="body2" sx={{ mt: 2, color: "black" }}>
            Don't have an account?
            <Link to="/register" style={{ color: "#9ABDDC", ml: 1, textDecoration: "none" }}>
              Register
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
