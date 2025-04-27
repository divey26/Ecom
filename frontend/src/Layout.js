import React, { useState, useEffect } from "react";
import {
  ShoppingCartOutlined,
  EnvironmentOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Layout, Button, Badge, Select, Input } from "antd";
import { FloatButton } from "antd";
import { useNavigate } from "react-router-dom";
import imageSrc from "./Images/logo.png";
import styled from 'styled-components';
import { useCart } from './common/cart/CartContext';

const { Header, Content, Footer } = Layout;
const { Option } = Select;

const App = ({ children, userType }) => {
  const navigate = useNavigate();
  const [isBackTopVisible, setIsBackTopVisible] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const { cart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      setIsBackTopVisible(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearch = (value) => {
    setSearchLoading(true);
    setTimeout(() => {
      console.log("Search:", value);
      setSearchLoading(false);
    }, 1000); // Simulate search loading
  };

  const handleNavigateToCart = () => {
    navigate("/cart");
  };
  
  const handleNavigateToFeed = () => {
    navigate("/feed");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Header
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "60px",
            backgroundColor: "#004f9a",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 5,
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          {/* Logo and HALO text on the left */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <a href="/home" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
              <img
                src={imageSrc}
                alt="Logo"
                style={{ marginLeft: "10px", width: "45px", height: "45px" }}
              />
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  marginLeft: "8px",
                  color: "#F3C623",
                }}
              >
                HALO
              </span>
            </a>
          </div>

          {/* Delivery text */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "white",
              fontSize: "13px",
              marginLeft: "80px", // Adjusted margin to make room for the search bar
            }}
          >
            <EnvironmentOutlined style={{ color: "#F3C623", fontSize: "25px", marginRight:"5px" }} />
            Delivery to SRILANKA
          </div>

          {/* Search Bar in the middle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#004f9a",
              padding: "5px",
              borderRadius: "30px",
              width: "100%",
              maxWidth: "900px",
            }}
          >
            <Input
              placeholder="Search everything at HALO"
              allowClear
              size="large"
              onPressEnter={(e) => handleSearch(e.target.value)}
              style={{
                border: "none",
                borderRadius: "30px",
                width: "90%",
                fontSize: "16px",
                height: "40px",
              }}
            />
            <Button
              type="primary"
              shape="circle"
              icon={<SearchOutlined />}
              onClick={() => handleSearch()}
              style={{
                marginLeft: "-40px",
                backgroundColor: "#ffc221",
                border: "none",
                width: "30px",
                height: "30px",
              }}
            />
          </div>

          {/* Cart Icon on the right */}
          <div style={{ textAlign: "right", marginTop: "10px", marginRight: "5px", cursor: "pointer" }} onClick={handleNavigateToCart}>
            <Badge count={cart.length}>
              <ShoppingCartOutlined style={{ fontSize: "34px",marginRight:"10px", marginLeft:"10px" ,color:" white"}} />
            </Badge>
          </div>

        </Header>

        <Content style={{ marginTop: 64, padding: 24 }}>
          <div
            style={{
              padding: 0,
              minHeight: 360,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {isBackTopVisible && (
              <FloatButton.Group shape="circle" style={{ right: 24 }}>
                <FloatButton.BackTop visibilityHeight={0} />
              </FloatButton.Group>
            )}
            {children}
          </div>
        </Content>

        <StyledFooter>
          <div>
            We’d love to hear what you think!
            <br /><br />
            <Button style={{ color: "#004f9a", borderColor: "#004f9a", borderRadius: "50px" }} onClick={handleNavigateToFeed}>
              Give feedback
            </Button>
          </div>
        </StyledFooter>

        <Footer
          style={{
            textAlign: "center",
            backgroundColor: "#004f9a",
            color: "white",
            padding: "20px",
            fontSize: "14px",
          }}
        >
          <p>&copy; 2024 HALO. All rights reserved.</p>
          <p>Powered by Dvenoph</p>
        </Footer>
      </Layout>
    </Layout>
  );
};

const StyledFooter = styled(Header)`
  background-color: rgb(224, 245, 249);
  color: black;
  height: 130px !important;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0;
  line-height: 1;
`;

export default App;
