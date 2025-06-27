import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  useMediaQuery
} from "@mui/material";


export default function RegisterForm() {
  const [user, setUser] = useState({
    role: "user",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    artistName: "",
    artistBio: "",
    portfolio: "",
    contactNumber: "",
    location: "",
    profilePicture: null,
    adminName: "",
  });

  const navigate = useNavigate();
  const isSmall = useMediaQuery("(max-width:600px)");

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setUser({ ...user, profilePicture: e.target.files[0] });
    }
  };

  const handleRoleChange = (role) => {
    setUser({
      role,
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      address: "",
      artistName: "",
      artistBio: "",
      portfolio: "",
      contactNumber: "",
      location: "",
      profilePicture: null,
      adminName: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user.password !== user.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    const formData = new FormData();
    formData.append("role", user.role);
    formData.append("email", user.email);
    formData.append("password", user.password);

    if (user.role === "user") {
      formData.append("uname", user.name);
      formData.append("address", user.address);
    } else if (user.role === "artist") {
      formData.append("username", user.artistName);
      formData.append("artistBio", user.artistBio);
      formData.append("portfolioLink", user.portfolio);
      formData.append("contactNumber", user.contactNumber);
      formData.append("location", user.location);
      if (user.profilePicture) {
        formData.append("profilePicture", user.profilePicture);
      }
    }

    axios
      .post("http://localhost:1011/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        if (response.status === 201 || response.status === 200) {
          alert("Registration Successful!");
          if (response.data.role === "artist") {
            localStorage.setItem("artistId", response.data.artistId);
          }
          navigate("/login");
        }
      })
      .catch((error) => {
        console.error("Registration Failed:", error.response?.data || error.message);
        alert(error.response?.data?.message || "Registration Failed!");
      });
  };

  return (
    <Box
      sx={{
        backgroundColor: "white",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: isSmall ? 2 : 0,
      }}
    >
      <Card
        sx={{
          width: isSmall ? "100%" : 400,
          border: "1px solid black",
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <CardContent sx={{ position: "relative", p: 4 }}>
          <Link to="/login" style={{ position: "absolute", top: 16, left: 16 }}>
            <ArrowBackIosIcon sx={{ color: "black", fontSize: 20, cursor: "pointer" }} />
          </Link>

          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "#05081C", textAlign: "center", mb: 3 }}
          >
            Register
          </Typography>

          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <RadioGroup
              row
              value={user.role}
              onChange={(e) => handleRoleChange(e.target.value)}
            >
              <FormControlLabel
                value="user"
                control={<Radio sx={{ color: "#05081C", "&.Mui-checked": { color: "#05081C" } }} />}
                label="User"
              />
              <FormControlLabel
                value="artist"
                control={<Radio sx={{ color: "#05081C", "&.Mui-checked": { color: "#05081C" } }} />}
                label="Artist"
              />
            </RadioGroup>
          </FormControl>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {user.role === "user" && (
              <>
                <TextField name="name" placeholder="Full Name" required onChange={handleChange} />
                <TextField name="email" type="email" placeholder="Email" required onChange={handleChange} />
                <TextField name="password" type="password" placeholder="Password" required onChange={handleChange} />
                <TextField name="confirmPassword" type="password" placeholder="Confirm Password" required onChange={handleChange} />
                <TextField name="address" placeholder="Address" required onChange={handleChange} />
              </>
            )}
            {user.role === "artist" && (
              <>
                <TextField name="artistName" placeholder="Artist Name" required onChange={handleChange} />
                <TextField name="email" type="email" placeholder="Email" required onChange={handleChange} />
                <TextField name="password" type="password" placeholder="Password" required onChange={handleChange} />
                <TextField name="confirmPassword" type="password" placeholder="Confirm Password" required onChange={handleChange} />
                <Button
  variant="contained"
  component="label"
  sx={{
    textTransform: "none",
    backgroundColor: "#05081C",
    color: "#fff",
    px: 3,
    py: 1.5,
    borderRadius: 50,
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    fontWeight: 500,
    fontSize: "0.95rem",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#000",
      transform: "scale(1.03)",
    },
  }}
>
  📤 Upload Profile Picture
  <input type="file" name="profilePicture" hidden onChange={handleFileChange} required />
</Button>

                <TextField name="artistBio" placeholder="Short Artist Bio" multiline required onChange={handleChange} />
                <TextField name="portfolio" placeholder="Portfolio Link" required onChange={handleChange} />
                <TextField name="contactNumber" placeholder="Contact Number" required onChange={handleChange} />
                <TextField name="location" placeholder="Location" required onChange={handleChange} />
              </>
            )}

            <Button
              type="submit"
              variant="contained"
              sx={{
                mt: 2,
                backgroundColor: "#05081C",
                color: "#fff",
                textTransform: "none",
                "&:hover": { backgroundColor: "black" },
              }}
            >
              Register
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
