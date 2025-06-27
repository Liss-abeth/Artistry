import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Card, CardContent, Typography } from "@mui/material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";

const TestimonialCarousel = ({ testimonials }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
  };

  return (
    <div style={{ width: "80%", margin: "40px auto" }}>
      <Slider {...settings}>
        {testimonials.map((testimonial, index) => (
          <Card key={index} sx={{ maxWidth: 600, margin: "auto", backgroundColor: "#05081C", color: "white", textAlign: "center", p: 3, border: "2px solid gold" }}>
            <CardContent>
              <FormatQuoteIcon sx={{ fontSize: 40, color: "gold" }} />
              <Typography variant="h6" sx={{ fontStyle: "italic", mb: 1 }}>
                "{testimonial.review}"
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "gold" }}>
                - {testimonial.name}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Slider>
    </div>
  );
};

export default TestimonialCarousel;
