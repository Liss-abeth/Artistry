import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Box,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footeruser from "./Footeruser";

const ArtistPage = () => {
  const [artists, setArtists] = useState([]);
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  useEffect(() => {
  axios.get("https://artistry-backend-ss49.onrender.com/artists")

      .then((response) => setArtists(response.data))
      .catch((error) => console.error("Error fetching artists:", error));
  }, []);

  return (
    <>
      <Navbar />
      <Box
        sx={{
          backgroundColor: "#ffffff",
          color: "black",
          px: 2,
          py: 4,
        }}
      >
        <Typography
          variant={isSmallScreen ? "h4" : "h3"}
          align="center"
          gutterBottom
          sx={{
            color: "#5D455F",
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
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={artist._id}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Card
                  sx={{
                    backgroundColor: "#ffffff",
                    border: "1px solid black",
                    borderRadius: 2,
                    textAlign: "center",
                    maxWidth: 300,
                    width: "100%",
                    boxShadow: "0px 4px 10px rgba(93, 69, 95, 0.1)",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={`http://localhost:1011/${artist.profilePicture.replace(
                      /\\/g,
                      "/"
                    )}`}
                    alt={artist.artistName}
                    sx={{
                      width: 140,
                      height: 140,
                      borderRadius: "50%",
                      objectFit: "cover",
                      mt: 2,
                      mx: "auto",
                    }}
                  />
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                      {artist.username}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", mb: 2, minHeight: 60 }}
                    >
                      {artist.artistBio}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      <Button
                        variant="outlined"
                        href={artist.portfolioLink}
                        target="_blank"
                        sx={{
                          color: "#5D455F",
                          borderColor: "#5D455F",
                          textTransform: "none",
                          "&:hover": {
                            backgroundColor: "#5D455F",
                            color: "#fff",
                          },
                        }}
                      >
                        Portfolio
                      </Button>
                      <Button
                        variant="outlined"
                        href={`mailto:${artist.email}`}
                        sx={{
                          color: "#5D455F",
                          borderColor: "#5D455F",
                          textTransform: "none",
                          "&:hover": {
                            backgroundColor: "#5D455F",
                            color: "#fff",
                          },
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
      <Footeruser />
    </>
  );
};

export default ArtistPage;
