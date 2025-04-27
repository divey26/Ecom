import React, { useState, useEffect } from "react";
import truck from "../../Images/truck-.png";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [deadline, setDeadline] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const navigate= useNavigate();
  
  // Fetch deadline from the backend
  useEffect(() => {
    const fetchDeadline = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/deadline");
        if (response.ok) {
          const data = await response.json();
          const parsedDeadline = new Date(data.deadline);
          setDeadline(parsedDeadline);

          // Show banner if current time is before the deadline
          setShowBanner(new Date() < parsedDeadline);
        }
      } catch (error) {
        console.error("Error fetching deadline:", error);
      }
    };

    fetchDeadline();

    // Timer to update current time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer); // Cleanup interval
  }, []);

  return (
    <>
      {showBanner && deadline ? (
        <div
          style={{
            backgroundColor: "black",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "15px 30px",
            fontFamily: "Arial, sans-serif",
            color: "white",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", marginRight: "20px" }}>
            <img
              src={truck}
              alt="Truck Icon"
              style={{ width: "30px", height: "30px", marginRight: "10px" }}
            />
            <p style={{ margin: 0, fontSize: "16px" }}>
              <strong>Get 20% for all purchases on </strong>
              {deadline.toLocaleDateString()}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#fff",
              }}
            >
              You got this! Order before:{" "}
              <span style={{ fontSize: "18px", color: "white" }}>
                {formatTimeRemaining(deadline - currentTime)}
              </span>
            </span>
            <button
              style={{
                backgroundColor: "#fff",
                color: "#000",
                border: "1px solid #000",
                borderRadius: "20px",
                padding: "5px 15px",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/all-pro`)}            >
              Shop Now
            </button>
          </div>
        </div>
      ) : (
       <></> 
      )}
    </>
  );
};

// Helper Function to Format Time Remaining
const formatTimeRemaining = (ms) => {
  if (ms <= 0) return "Expired";

  const seconds = Math.floor((ms / 1000) % 60)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((ms / (1000 * 60)) % 60)
    .toString()
    .padStart(2, "0");
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
    .toString()
    .padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
};

export default Banner;
