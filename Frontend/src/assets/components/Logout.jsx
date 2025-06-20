import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear all stored tokens
        localStorage.removeItem("userToken");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("producerToken");
        localStorage.removeItem("wholeSalerToken");
        
        // Redirect to login page after logout
        navigate("/login");
    }, [navigate]);

    return null; // No UI needed
};

export default Logout;