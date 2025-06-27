import React from "react";
import "../components/AboutPage.css";

const AboutPage = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <h1>About Us</h1>
        <p>Your one-stop destination for art materials and creative products.</p>
      </section>

      <section className="about-mission">
        <h2>Our Mission</h2>
        <p>
          At ArtWorld, we aim to inspire creativity by providing premium art supplies, 
          unique art products, and a platform to connect artists and art enthusiasts. 
          Our mission is to make art accessible and enjoyable for everyone.
        </p>
      </section>

      <section className="about-team">
        <h2>Meet the Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <img
              src="https://via.placeholder.com/150"
              alt="Team Member"
              className="team-image"
            />
            <h3>Jane Doe</h3>
            <p>Founder & CEO</p>
          </div>
          <div className="team-member">
            <img
              src="https://via.placeholder.com/150"
              alt="Team Member"
              className="team-image"
            />
            <h3>John Smith</h3>
            <p>Lead Designer</p>
          </div>
          <div className="team-member">
            <img
              src="https://via.placeholder.com/150"
              alt="Team Member"
              className="team-image"
            />
            <h3>Emily Brown</h3>
            <p>Marketing Head</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
