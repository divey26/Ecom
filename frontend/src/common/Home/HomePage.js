import React, { useState, useContext, useEffect } from 'react'; // For useState and useEffect
import { Layout, Col, Row, Card as AntCard, message, Button, Badge, Carousel, Typography } from 'antd'; // Added Typography and Drawer here
import LayoutNew from '../../Layout';
import axios from 'axios'; 
import styled from 'styled-components';
import ReactPlayer from 'react-player';
import { useNavigate } from 'react-router-dom';
import videoSrc from '../../Video/video.mp4';
import { useCart } from '../cart/CartContext';
import SecondLayout from './Layouts/SecondaryBanner'
import PrimaryLayout from './Layouts/PrimaryBanner'
import Categories from './Layouts/categories'
import p1 from "../../Images/p1.jpg";
import p2 from "../../Images/p2.jpg";
import p3 from "../../Images/p3.jpg";
import p4 from "../../Images/p4.jpg";
import prod1 from "../../Images/prod1.png"
import banner1 from "../../Images/valBanner.jpg"
import RatedPro from "./Layouts/RatedPro"
import Banner from "./banner" 
import Shorts from "./Layouts/ProShorts"
import TopRated from "./Layouts/TopRated" 
import Drawer from "./Drawer"; // Import the Drawer component
import { AuthContext } from '../../utils/AuthContext'; // Import the context
import {
  BarsOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";

const { Header, Content } = Layout;
const { Title } = Typography;

const HomePage = () => {
  const [visible, setVisible] = useState(false);  // Drawer visibility state
  const { logout } = useContext(AuthContext); // Access the logout function from context
  const navigate = useNavigate();
  const { reloadCart } = useCart();
  
  useEffect(() => {
    // Reload cart data when the component mounts
    reloadCart && reloadCart(); // Optional if reloadCart is defined in useCart
  }, []);

  const headerItem = [
    { key: "1", text: "Category", icon: <BarsOutlined /> },
    { key: "2", text: "Profile" },
    { key: "3", text: "All Products" },
    { key: "4", text: "Try-on" },
    { key: "5", text: "log out" },
    { key: "6", text: "Sign up", icon: <UserSwitchOutlined /> },
  ];

  const handleHeaderClick = (key) => {
    if (key === "3") {
      navigate("/all");
    }
    else if (key === "2") {
      navigate("/profile");
    }
    else if (key === "4") {
      navigate("/try");
    }
    else if (key === '5') {// Clear localStorage and update context state
      navigate("/");
    }
    else if (key === "6") {
      navigate("/sign");
    }
  };

  const showSlider = () => setVisible(true);
  const closeSlider = () => setVisible(false);

  return (
    <LayoutNew>
      <Layout>
        {/* Header Section */}
        <StyledHeader1>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <Button
                key="1"
                type="text"
                style={{
                  color: "#004f9a",
                  fontSize: "18px",
                  height: "20px",
                  padding: "20px",
                }}
                onClick={showSlider}
              >
                <BarsOutlined /> All
              </Button>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              {headerItem
                .filter((item) => item.key !== "1") // Exclude the "Category" button
                .map((item) => (
                  <Button
                    key={item.key}
                    type="text"
                    icon={item.icon}
                    style={{ color: "#004f9a", fontSize: "18px", height: "20px", padding: "20px" }}
                    onClick={() => handleHeaderClick(item.key)}
                  >
                    {item.text}
                  </Button>
                ))}
            </div>
          </div>
        </StyledHeader1>

        <div> {/* Discount and Banner Section */}
          <StyledHeader>
            <h1>
              UP TO 40% DISCOUNT FOR THE PURCHASE BEFORE 5.00 PM (12.02.2024) - Hurry, grab your favorite items now!
              <span style={{ marginLeft: '300px' }}>FREE DELIVERY for purchase above 100$</span>
            </h1>
          </StyledHeader>

          <Banner />
        </div>

        <br />
        <PrimaryLayout />
        <br />

        {/* Banner Section */}
        <div>
          <img src={banner1} style={{ width: "100%", height: "10%" }} />
        </div>

        <Categories />

        <TopRated />

        <SecondLayout />

        {/* Video and Image Side by Side */}
        <VideoAndImageContainer>
          <div className="video-container">
            <ReactPlayer
              url={videoSrc}
              width="100%"
              height="auto"
              muted
              playing
              loop
            />
          </div>
          <div className="image-container">
            <img src={prod1} alt="p2" style={{ width: "100%", height: "10%" }} />
          </div>
        </VideoAndImageContainer>

        <Shorts />

        <RatedPro />

        {/* Carousel Component */}
        <Carousel autoplay dotPosition="bottom" autoplaySpeed={2000}>
          <div>
            <img src={p1} alt="p1" style={{ width: "100%", height: "600px", objectFit: "cover" }} />
          </div>
          <div>
            <img src={p2} alt="p2" style={{ width: "100%", height: "600px", objectFit: "cover" }} />
          </div>
          <div>
            <img src={p3} alt="p3" style={{ width: "100%", height: "600px", objectFit: "cover" }} />
          </div>
          <div>
            <img src={p4} alt="p4" style={{ width: "100%", height: "600px", objectFit: "cover" }} />
          </div>
        </Carousel>

        {/* Drawer for Slider Navigation */}
        <Drawer visible={visible} onClose={closeSlider} />
      </Layout>
    </LayoutNew>
  );
};

// Styled Components
const StyledHeader = styled(Header)`
  background-color: #ffc221 !important;
  color: rgb(244, 65, 0);
  height: auto !important;
  padding: 5px 0 !important;
  margin-bottom: 15px;
  line-height: 1;
  overflow: hidden;
  position: relative;

  h1 {
    margin: 0 !important;
    font-size: 18px !important;
    font-weight: 650 !important;
    padding: 0 !important;
    line-height: 1.2 !important;
    white-space: nowrap;
    animation: scrollText 28s linear infinite;
  }

  @keyframes scrollText {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(-100%);
    }
  }
`;

const StyledHeader1 = styled(Header)`
  background-color: rgb(224, 245, 249);
  color: white;
  height: 40px !important;
  margin-bottom: 5px;
  line-height: 1;

  button {
    border: none; /* Default border style */
    border-radius: 4px; /* Adjust this value for reduced curvature */
    transition: border 0.3s ease; /* Smooth transition for border and radius */

    &:hover {
      border: 1px solid #004f9a; /* Add black border on hover */
      border-radius: 0px; /* Slightly reduce the curve on hover */
    }
  }
`;

const VideoAndImageContainer = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #4DA1A9 !important;
  padding: 20px;
  margin-top: 40px;

  .video-container {
    width: 63%;
  }

  .image-container {
    width: 35.5%;
    height: 50%;
    margin-right: 10px;
  }
`;

const StyledCard = styled(AntCard)`
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 250px;
  padding: 5px;

  .ant-card-cover img {
    height: 140px;
    object-fit: cover;
    width: 100%;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  .ant-card-body {
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 10px;
  }
`;

const TitleStyle = styled(Title)`
  text-align: center;
  margin-top: 1px;
  font-size: 20px;
  font-weight: bold;
  color: #333;
`;

export default HomePage;
