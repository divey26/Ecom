import React, { useState, useEffect } from "react";
import {
  ShoppingCartOutlined,
  EnvironmentOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Layout, Button, Badge, Select, Input } from "antd";
import { FloatButton } from "antd";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import imageSrc from "./Images/logo.png";
import Flag from "react-world-flags"; // Import Flag component
import styled from 'styled-components';
import { useCart } from './common/cart/CartContext';
import './locales/i18n';  // Import the i18n configuration


const { Header, Content, Footer } = Layout;
const { Option } = Select;

const App = ({ children, userType }) => {
  const navigate = useNavigate();
  const [isBackTopVisible, setIsBackTopVisible] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [language, setLanguage] = useState("en"); // Default language is English
  const { cart } = useCart();
  const { i18n } = useTranslation(); // Initialize useTranslation hook

  const { t } = useTranslation();

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

  const handleLanguageChange = (value) => {
    setLanguage(value);
    i18n.changeLanguage(value);  // Change language dynamically
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
            height: "80px",
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
                style={{ marginLeft: "10px", width: "50px", height: "50px" }}
              />
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  marginLeft: "15px",
                  color: "#F3C623",
                }}
              >
                {t('HALO')}
              </span>
            </a>
          </div>

          {/* Delivery text */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "white",
              fontSize: "15px",
              marginLeft: "150px", // Adjusted margin to make room for the search bar
            }}
          >
            <EnvironmentOutlined style={{ color: "#F3C623", fontSize: "30px" }} />
            Delivery to SRILANKA
          </div>

          {/* Search Bar and Language Selector in the middle */}
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
                width: "100%",
                fontSize: "16px",
                height: "45px",
                paddingLeft: "20px",
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
                width: "35px",
                height: "35px",
              }}
            />
          </div>


          <div>
              {/* Language Selector */}
              <Select
              defaultValue={language}
              style={{
                width: 90,
                height: "40px",
                fontSize: "16px",
                marginLeft: "10px",
              }}
              onChange={handleLanguageChange}
            >
              <Option value="en" label="en">
                <Flag code="US" style={{ width: "20px", marginRight: "10px" }} />
                EN
              </Option>
              <Option value="ta" label="ta">
                <Flag code="IN" style={{ width: "20px", marginRight: "10px" }} />
                TAM
              </Option>
              <Option value="zh" label="zh">
                <Flag code="CN" style={{ width: "20px", marginRight: "10px" }} />
                ZH
              </Option>
              <Option value="fr" label="fr">
                <Flag code="FR" style={{ width: "20px", marginRight: "10px" }} />
                FR
              </Option>
              <Option value="si" label="si">
                <Flag code="LK" style={{ width: "20px", marginRight: "10px" }} />
                SI
              </Option>
              <Option value="de" label="de">
                <Flag code="DE" style={{ width: "20px", marginRight: "10px" }} />
                DE
              </Option>
              <Option value="es" label="es">
                <Flag code="ES" style={{ width: "20px", marginRight: "10px" }} />
                ES
              </Option>
              <Option value="it" label="it">
                <Flag code="IT" style={{ width: "20px", marginRight: "10px" }} />
                IT
              </Option>
            </Select>
          </div>

          {/* Cart Icon on the right */}
          <div style={{ textAlign: "right" }}>
            <Button
              type="default"
              onClick={handleNavigateToCart}
              style={{ marginTop: "10px", height: "60px", marginRight: "5px" }}
            >
              <Badge count={cart.length}>
                <ShoppingCartOutlined style={{ fontSize: "30px" }} />
              </Badge>
            </Button>
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
            {t('We’d love to hear what you think!')}
            <br /><br />
            <Button style={{ color: "#004f9a", borderColor: "#004f9a", borderRadius: "50px" }}>
              {t('Give feedback')}
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
          <p>&copy; {t('2024 HALO. All rights reserved.')}.</p>
          <p>{t('Powered by')} Dvenoph</p>
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
