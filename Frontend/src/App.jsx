import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import "./index.css";
import Homepage from './assets/components/HomePage';
import ShopPage from './assets/components/ShopPage';
import CartPage from './assets/components/CartPage';
import CheckoutPage from './assets/components/CheckoutPage';
import Navbar from './assets/components/Navbar';
import Footer from './assets/components/Footer';
import ContactPage from './assets/components/ContactPage';
import LoginPage from './assets/components/LoginPage';
import RegisterPage from './assets/components/RegisterPage';

import AdminDashboard from './assets/components/AdminDashboard';
import ArtistDashboard from './assets/components/ArtistDashboard';
import ArtistProfilesPage from './assets/components/ArtistProfilesPage';
import AboutPage from './assets/components/AboutPage';
import { GlobalStyles } from "@mui/material";
// import ArtistProductsPage from './assets/components/ArtistProductsPage';
import UserHome from './assets/components/UserHome';
import { Logout } from '@mui/icons-material';
import ArtistPage from './assets/components/Artistpage';
import UserAbout from './assets/components/userAbout';
import Contact from './assets/components/userContact';
import TestimonialPage from './assets/components/TestimonialPage';
import TestimonialCarousel from './assets/components/TestimonialCarousel';
import ArtistHome from './assets/components/ArtistHome';
import UshopPage from './assets/components/user/userShop';
import OrderDetails from './assets/components/user/OrderDetails';
// import PaymentGateway from './assets/components/user/PaymentGateway';




// const ProtectedRoute = ({ element: Element, allowedRoles, role, ...rest }) => {
//   if (!role) {
    
//     return <Navigate to="/login" />;
//   }

//   if (allowedRoles && !allowedRoles.includes(role)) {
    
//     return <Navigate to="/" />;
//   }

 
//   return <Element {...rest} />;
// };

function App() {
  const userRole = localStorage.getItem('role');

  return (
    
    <Router>
       <GlobalStyles styles={{ body: { margin: 0, padding: 0, boxSizing: "border-box" } }} />
      {/* <Navbar /> */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/artists" element={<ArtistDashboard/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path='/admin'element={<AdminDashboard/>}/>
        <Route path='/artprofil'element={<ArtistProfilesPage/>}/>
        <Route path='/about'element={<AboutPage/>}/>
        {/* <Route path="/artist-products/:artistId" element={<ArtistProductsPage />} />  */}
        <Route path='/user' element={<UserHome/>}/>
        <Route path='/artp' element={<ArtistPage/>}/>
        <Route path='/uabout' element={<UserAbout/>}/>
        <Route path='/ucontact' element={<Contact/>}/>
        <Route path="/testimonials" element={<TestimonialPage/>} />
        <Route path="/testicursel" element={<TestimonialCarousel/>} />
        <Route path='/arthome' element={<ArtistHome/>}/>
        <Route path="/ushop" element={<UshopPage />} />
        <Route path="/orders" element={<OrderDetails />} />
        
        {/* <Route path="/payment-gateway" element={<PaymentGateway />} /> */}
        {/* <Route path="/uprofile" element={<UserProfile/>} /> */}
      </Routes>
      {/* <Footer /> */}
    </Router>
  );
}

export default App;