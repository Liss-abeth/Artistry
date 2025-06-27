import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("your-stripe-public-key"); // Replace with your Stripe public key

const CheckoutForm = ({ order }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    // Get Payment Intent from Backend
    const res = await fetch("http://localhost:1011/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: order.totalPrice + order.shippingCharge }),
    });
    const { clientSecret } = await res.json();

    // Confirm Payment
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) },
    });

    if (result.error) {
      alert(result.error.message);
      setProcessing(false);
    } else {
      alert("Payment Successful!");

      // ✅ Save Order to Database
      await fetch("http://localhost:1011/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...order, status: "Paid" }),
      });

      sessionStorage.removeItem("pendingOrder");
      navigate("/order-confirmation");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ textAlign: "center", color: "white" }}>
      <h3>Enter Card Details</h3>
      <CardElement style={{ backgroundColor: "white", padding: "10px", borderRadius: "5px" }} />
      <button type="submit" disabled={!stripe || processing} style={{ marginTop: "20px", padding: "10px 20px", background: "gold", border: "none", cursor: "pointer" }}>
        {processing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

const PaymentGateway = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const pendingOrder = JSON.parse(sessionStorage.getItem("pendingOrder"));
    if (!pendingOrder) {
      alert("No pending order found!");
      navigate("/shop");
      return;
    }
    setOrder(pendingOrder);
  }, [navigate]);

  return (
    <Elements stripe={stripePromise}>
      <div style={{ textAlign: "center", padding: "50px", color: "white" }}>
        <h2>Complete Your Payment</h2>
        {order ? <CheckoutForm order={order} /> : <p>Loading payment details...</p>}
      </div>
    </Elements>
  );
};

export default PaymentGateway;
