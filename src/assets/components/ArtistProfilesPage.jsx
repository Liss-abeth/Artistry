import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Box,
  useMediaQuery
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import UserNavbar from "./usernavbar";
import Footer from "./Footer";

const ArtistProfilesPage = () => {
  const [artists, setArtists] = useState([]);
  const [open, setOpen] = useState(false);
  const [emailData, setEmailData] = useState({ senderEmail: "", subject: "", message: "", artistEmail: "" });
  const navigate = useNavigate();
  const isSmall = useMediaQuery("(max-width:600px)");

  useEffect(() => {
   axios.get("https://artistry-backend-ss49.onrender.com/artists")

      .then(res => setArtists(res.data))
      .catch(err => console.error("Error fetching artists:", err));
  }, []);

  const handleOpen = (artistEmail) => {
    setEmailData(prev => ({ ...prev, artistEmail }));
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleChange = (e) => setEmailData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    const { senderEmail, subject, message } = emailData;
    if (!senderEmail || !subject || !message) return alert("Please fill in all fields.");

    try {
      const res = awaitfetch("https://artistry-backend-ss49.onrender.com/Send", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailData),
      });
      const text = await res.text();
      const data = JSON.parse(text);
      alert(data.message);
      handleClose();
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email");
    }
  };

  return (
    <>
      <UserNavbar />
      <Box
        sx={{
          backgroundColor: "#ffffff",
          color: "black",
          p: 3,
          minHeight: "100vh",
        }}
      >
        <Typography
          variant={isSmall ? "h4" : "h3"}
          align="center"
          gutterBottom
          sx={{
            color: "#05081C",
            fontWeight: "bold",
            borderBottom: "2px solid black",
            pb: 1,
            mb: 4,
          }}
        >
          Featured Artists
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {artists.length > 0 ? (
            artists.map((artist) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={artist._id}>
                <Card
                  sx={{
                    backgroundColor: "white",
                    border: "1px solid black",
                    borderRadius: 2,
                    textAlign: "center",
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                    p: 2,
                  }}
                >
                  <CardMedia
                    component="img"
                    height="120"
                    image={`http://localhost:1011/${artist.profilePicture.replace(/\\/g, "/")}`}
                    alt={artist.artistName}
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      objectFit: "cover",
                      mx: "auto",
                      mb: 2,
                    }}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ color: "#5D455F" }}>
                      {artist.username}
                    </Typography>
                    <Typography variant="body2" sx={{ minHeight: 60, color: "text.secondary" }}>
                      {artist.artistBio}
                    </Typography>
                    <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 1 }}>
                      <Button
                        variant="outlined"
                        href={artist.portfolioLink}
                        target="_blank"
                        sx={{
                          color: "black",
                          borderColor: "black",
                          textTransform: "none",
                          "&:hover": { backgroundColor: "#f5f5f5" },
                        }}
                      >
                        Portfolio
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => handleOpen(artist.email)}
                        sx={{
                          color: "black",
                          borderColor: "black",
                          textTransform: "none",
                          "&:hover": { backgroundColor: "#f5f5f5" },
                        }}
                      >
                        Contact
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="h6" align="center">
              No artists found
            </Typography>
          )}
        </Grid>
      </Box>

      <Footer />

      {/* Contact Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ color: "#05081CF" }}>Contact Artist</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Your Email"
            name="senderEmail"
            margin="dense"
            required
            onChange={handleChange}
            sx={{ "& .MuiOutlinedInput-root fieldset": { borderColor: "black" } }}
          />
          <TextField
            fullWidth
            label="Subject"
            name="subject"
            margin="dense"
            required
            onChange={handleChange}
            sx={{ "& .MuiOutlinedInput-root fieldset": { borderColor: "black" } }}
          />
          <TextField
            fullWidth
            label="Message"
            name="message"
            multiline
            rows={4}
            margin="dense"
            required
            onChange={handleChange}
            sx={{ "& .MuiOutlinedInput-root fieldset": { borderColor: "black" } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: "#05081C" }}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ backgroundColor: "#05081C", "&:hover": { backgroundColor: "whitr" } }}>
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ArtistProfilesPage;
