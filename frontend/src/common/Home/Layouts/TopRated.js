import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography,Button, message } from 'antd';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../../utils/AuthContext';
import { useCart } from '../../cart/CartContext'; // Import CartContext


const { Title,Text } = Typography;

const TopRated = () => {
  const [topRatedProducts, setTopRatedProducts] = useState([]);
  const navigate = useNavigate();
  const { addToCart } = useCart(); // Access addToCart function
  const { authenticated } = useContext(AuthContext); // Access authenticated state
  

  useEffect(() => {
    const fetchTopRatedProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        const allProducts = response.data.products || [];
        const topRated = allProducts
          .filter((product) => product.rating === 5)
          .slice(0, 6); // Limit to 6 products
        setTopRatedProducts(topRated);
      } catch (error) {
        console.error('Error fetching products:', error);
        message.error('Failed to fetch top-rated products.');
      }
    };

    fetchTopRatedProducts();
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(i < rating ? '⭐' : '☆');
    }
    return stars.join(' ');
  };

  const trimDescription = (description, maxLength = 50) => {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + '...';
    }
    return description;
  };


  return (
    <div >
      {/* Other content of your HomePage */}

      <TopRatedSection>
        <Title level={2} style={{ textAlign: 'center', margin: '20px 0' }}>
          Top Rated Products
        </Title>
        <Row gutter={[16, 16]} justify="center">
          {topRatedProducts.map((product) => (
            <Col xs={24} sm={12} md={8} lg={4} xl={4} key={product.productId}>
              <Card
                hoverable
                cover={
                  <img
                    alt={product.itemName}
                    src={product.imageURL}
                    style={{
                      height: 200,
                      objectFit: 'scale-down',
                      width: '100%',
                      padding: '10px',
                    }}
                  />
                }
                style={{
                  width: '100%',
                  height: 420,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '10px',
                }}
                onClick={() => navigate(`/product/${product.productId}`)} // Navigate on card click

              >
                <div>
                  <Row align="middle" justify="start" style={{ marginBottom: '10px' }}>
                    {product.discount > 0 ? (
                      <>
                        <Col>
                          <Title level={4} style={{ color: 'Green', margin: 0 }}>
                            $
                            {(
                              product.price - (product.price * product.discount) / 100
                            ).toFixed(2)}
                          </Title>
                        </Col>
                        <Col style={{ marginLeft: '10px' }}>
                          <Text
                            style={{
                              textDecoration: 'line-through',
                              fontSize: '15px',
                              color: '#a0a0a0',
                            }}
                          >
                            ${product.price}
                          </Text>
                        </Col>
                      </>
                    ) : (
                      <Col>
                        <Title level={4} style={{ color: '#004f9a', margin: 0 }}>
                          ${product.price}
                        </Title>
                      </Col>
                    )}
                  </Row>

                  <p
                    style={{
                      fontSize: '12px',
                      height: '40px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {product.itemName} | {trimDescription(product.description)}
                  </p>

                  <Text style={{ fontSize: '15px' }}>
                    {renderStars(product.rating)} {product.rating}
                  </Text>
                </div>

            {authenticated ? (
                <Button
                    style={{
                        marginTop: 'auto',
                        borderRadius: '40px',
                        color: 'white',
                        backgroundColor: authenticated ? '#004f9a' : '#a0a0a0',
                    }}
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent card onClick from being triggered
                        if (authenticated) {
                        addToCart(product);
                        message.success(`${product.itemName} added to the cart`);
                        }
                    }}
                    disabled={!authenticated}
                    >
                    {authenticated ? '+ ADD' : 'Login to Add'}
                    </Button>

                ) : (
                  <Button
                    style={{
                      marginTop: 'auto',
                      borderRadius: '40px',
                      color: 'white',
                      backgroundColor: '#a0a0a0',
                    }}
                    disabled
                  >
                    Login to Add
                  </Button>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      </TopRatedSection>
    </div>
  );
};

// Styled Component for the section
const TopRatedSection = styled.div`
  background-color: #f8f8f8;
  padding: 20px;
  margin-top: 40px;
`;

export default TopRated;
