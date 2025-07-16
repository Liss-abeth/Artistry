import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import bannerImage from "../../assets/banner.jpg"; // 
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import { motion } from "framer-motion";
import { useEffect, useState,useRef} from "react";
import Navbar from './Navbar';
import UserNavbar from './usernavbar';
import Footer from './Footer';
import Footeruser from './Footeruser';
import useMediaQuery from '@mui/material/useMediaQuery';
const UserHome = () => {
  const navigate = useNavigate();
  const [showFullText, setShowFullText] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
      setTimeout(() => {
          setShowFullText(true);
      }, 2000); // Delay before transforming text
  }, []);

  const artworks = [
    "https://i.pinimg.com/736x/56/bf/41/56bf41fa2122daeb9d2f7de16e2bfa7a.jpg",
    "https://i.pinimg.com/736x/43/f7/ca/43f7ca87f9bda4dd77cacd5f820f62c4.jpg",
    "https://i.pinimg.com/736x/89/2a/3c/892a3c4cf63b623e654cd77f7c39220a.jpg",
    "https://i.pinimg.com/736x/e9/7d/82/e97d826efaeabccc8abd3f8820887a8a.jpg",
    "https://i.pinimg.com/736x/24/ad/b0/24adb02b47990772b409244036d421d9.jpg",
    "https://i.pinimg.com/736x/44/1b/54/441b54c54f70ab492ea45a79a2844d1a.jpg",
    "https://i.pinimg.com/736x/49/e2/07/49e207af9cfd72594c6788c1c5589c2d.jpg",
    "https://i.pinimg.com/736x/5c/fb/a7/5cfba7e3f5b28cda1c1e21951803f6a6.jpg"
  ];

  // useEffect(() => {
  //   const fetchTestimonials = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:1011/all");
  //       setTestimonials(response.data);
  //     } catch (error) {
  //       console.error("Error fetching testimonials:", error);
  //     }
  //   };

  //   fetchTestimonials();
  // }, []);
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get("https://artistry-backend-ss49.onrender.com/all");

        // Duplicate testimonials for seamless looping
        setTestimonials([...response.data, ...response.data]);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };
    fetchTestimonials();
  }, []);
  


  const categories = [
  {
    title: "Art Material",
    description: "Explore a wide range of materials for all your art needs.",
    img: "https://img.freepik.com/free-photo/view-vintage-paint-brushes-easel_23-2150315227.jpg",
  },
  {
    title: "Art Product",
    description: "Find unique and high-quality art products here.",
    img: "https://img.freepik.com/free-vector/watercolor-forest-landscape_52683-77216.jpg",
  },
  {
    title: "Artist",
    description: "Discover talented artists and their masterpieces.",
    img:"https://readdy.ai/api/search-image?query=Contemporary%20portrait%20painting%20with%20expressive%20brushwork%20and%20emotional%20depth%2C%20showcasing%20human%20features%20with%20artistic%20interpretation.%20The%20portrait%20has%20a%20modern%20aesthetic%20with%20attention%20to%20light%20and%20shadow%2C%20creating%20a%20compelling%20character%20study%20against%20a%20simple%20background%20that%20emphasizes%20the%20subject.&width=400&height=400&seq=3&orientation=squarish",
  },
];

   const isSmallScreen = useMediaQuery('(max-width:600px)');
    return (
      <>
      <UserNavbar/>
                <div>
            {/* Main Homepage Section */}
                 <Box
      className="homepage"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: isSmallScreen ? "center" : "flex-start",
        height: "90vh",
        px: 4,
        //  backgroundImage: `url("https://readdy.ai/api/search-image?query=Artistic%20abstract%20background%20with%20soft%20blended%20colors%20and%20low%20contrast%20overlay%2C%20featuring%20fluid%20shapes%20and%20gentle%20color%20transitions%20in%20muted%20tones%20of%20blue%2C%20purple%2C%20and%20gold.%20The%20composition%20creates%20a%20dreamy%20atmospheric%20effect%20with%20subtle%20artistic%20textures%20and%20flowing%20elements%2C%20perfect%20for%20a%20creative%20website%20hero%20section%20background.&width=1440&height=600&seq=1&orientation=landscape&quot")`,
         backgroundImage: `
             linear-gradient(
               to bottom,
               rgba(255, 255, 255, 0) 70%,
               rgba(255, 255, 255, 1) 100%
             ),
             url(${bannerImage})
           `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Box
        className="hero-text"
        sx={{
          maxWidth: isSmallScreen ? "100%" : "400px",
          textAlign: isSmallScreen ? "center" : "left",
          padding: isSmallScreen ? 2 : 3,
          borderRadius: 2,
          // backgroundColor: "rgba(255,255,255,0.75)", // to enhance text visibility
        }}
      >
        <Typography
          variant={isSmallScreen ? "h5" : "h3"}
          fontWeight="bold"
          color="#05081C"
          width={isSmallScreen ? "100%" : "auto"}
          whiteSpace={isSmallScreen ? "normal" : "nowrap"}
        >
          Welcome to Artistry
        </Typography>

        {showFullText && (
          <>
            <Typography
              variant="body2"
              sx={{ mt: 1, color: "#05081C" }}
            >
              Discover and shop exclusive artworks and materials from talented artists worldwide.
            </Typography>

            <Box
              mt={2}
              display="flex"
              gap={1}
              justifyContent={isSmallScreen ? "center" : "flex-start"}
              flexWrap="wrap"
            >
              <Button
                variant="outlined"
                color="#05081C"
                size="small"
                onClick={() => navigate("/shop")}
              >
                Shop Now
              </Button>
              <Button
                variant="outlined"
                color="#05081C"
                size="small"
                onClick={() => navigate("/about")}
              >
                About
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Box>
            {/* Category Section */}
    <Box
  sx={{
    backgroundColor: "white",
    py: 6,
    px: isSmallScreen ? 2 : 8,
    textAlign: "center",
  }}
>
  <Typography
    variant={isSmallScreen ? "h5" : "h4"}
    fontWeight="bold"
    mb={4}
    color="#05081C"
  >
    Explore Categories
  </Typography>

  <Box
    display="flex"
    flexDirection={isSmallScreen ? "column" : "row"}
    gap={4}
    justifyContent="center"
    alignItems="stretch"
    flexWrap="wrap"
  >
    {categories.map((cat, index) => (
      <Box
        key={index}
        sx={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.05)",
          overflow: "hidden",
          maxWidth: 320,
          width: "100%",
          minWidth: 260,
          flexGrow: 1,
          mx: "auto",
          textAlign: "left",
          border: "1px solid black",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          component="img"
          src={cat.img}
          alt={cat.title}
          sx={{
            width: "100%",
            height: { xs: "180px", sm: "200px" },
            objectFit: "cover",
            borderBottom: "1px solid black",
          }}
        />
        <Box p={3} flexGrow={1} display="flex" flexDirection="column">
          <Typography variant="h6" fontWeight="bold" color="black" mb={1}>
            {cat.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            mb={2}
            sx={{ flexGrow: 1 }}
          >
            {cat.description}
          </Typography>
          <Button
            onClick={() => navigate("/shop")}
            variant="outlined"
            sx={{
              alignSelf: "flex-start",
              borderColor: "#05081C",
              color: "#05081C",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#05081C",
                color: "white",
              },
            }}
          >
            Explore
          </Button>
        </Box>
      </Box>
    ))}
  </Box>
</Box>




       <Box
      component="section"
      sx={{
        px: 4,
        py: 6,
        backgroundColor: "#ffffff",
        textAlign: "center",
      }}
    >
      <Typography
        variant={isSmallScreen ? "h5" : "h4"}
        sx={{
          color: "#05081C",
          fontWeight: "bold",
          mb: 4,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        Discover Stunning Artworks
      </Typography>

 <Box
  sx={{
    display: { xs: "block", sm: "flex" }, // block for mobile (scrollable container), flex for larger
    overflowX: { xs: "auto", sm: "unset" }, // enable horizontal scroll on mobile
    whiteSpace: { xs: "nowrap", sm: "normal" }, // make children stay in line
    gap: 3,
  }}
>
  {artworks.map((image, index) => (
    <Card
      key={index}
      sx={{
        display: "inline-block", // for horizontal scroll on mobile
        width: { xs: 160, sm: 160, md: 200 },
        height: 250,
        backgroundColor: "#000000",
        border: "2px solid black",
        borderRadius: 3,
        overflow: "hidden",
        transition: "transform 0.4s, box-shadow 0.4s",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: "0 6px 20px rgba(93, 69, 95, 0.4)",
        },
      }}
    >
      <CardMedia
        component="img"
        alt={`Artwork ${index + 1}`}
        height="100%"
        image={image}
        sx={{ objectFit: "cover" }}
      />
    </Card>
  ))}
</Box>
    </Box>



            <Box
  sx={{
    textAlign: "center",
    backgroundColor: "#ffffff",
    py: 5,
    position: "relative",
    overflow: "hidden",
    px: { xs: 2, md: 0 }, // responsive padding
  }}
>
  {/* Section Heading */}
  <Typography
    variant="h4"
    sx={{
      color: "#05081CF",
      mb: 3,
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: 1,
    }}
  >
    What Our Customers Say
  </Typography>

  {/* Auto-Scrolling Testimonials */}
  <Box
    sx={{
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      position: "relative",
      width: "100%",
    }}
  >
    <Box
      sx={{
        display: "flex",
        gap: 3,
        animation: "scrollLoop 20s linear infinite",
        minWidth: "200%",
        "@keyframes scrollLoop": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      }}
    >
      {testimonials.map((t, idx) => (
        <Card
          key={idx}
          sx={{
            minWidth: { xs: "80%", sm: 300 },
            backgroundColor: "#ffffff",
            border: "2px solid black",
            p: 2,
          }}
        >
          <CardContent sx={{ textAlign: "center" }}>
            <Typography variant="h6" sx={{ color: "black", mb: 1 }}>
              {t.name}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "black",
                fontStyle: "italic",
                whiteSpace: "normal",
                wordWrap: "break-word",
              }}
            >
              “{t.review}”
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  </Box>

  <Button
    onClick={() => navigate("/testimonials")}
    sx={{
      mt: 4,
      backgroundColor: "#05081C",
      color: "white",
      textTransform: "none",
      fontWeight: "bold",
      px: 4,
      py: 1.5,
      "&:hover": { backgroundColor: "black" },
    }}
  >
    Leave a Review
  </Button>
</Box>

            {/* </div> */}
        </div>
        <Footer/>
        </>
    );
};

export default UserHome;
