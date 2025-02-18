import React, { useState, useEffect } from 'react'; // For useState and useEffect
import { Row, Col, Card as AntCard, message, Typography, Button } from 'antd';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../utils/AuthContext';
import { useCart } from '../cart/CartContext'; // Import CartContext

const { Title, Text } = Typography;

const ProductsList = () => {
  const { categoryId } = useParams(); // Get categoryId from URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { addToCart } = useCart(); // Access addToCart function
  const { authenticated } = useContext(AuthContext); // Access authenticated state

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/cat');
        setCategories(response.data); // Store categories from the API
      } catch (error) {
        console.error('Error fetching categories:', error.response ? error.response.data : error.message);
        message.error('Failed to fetch categories. Please try again.');
      }
    };
    fetchCategories();
  }, []);

  // Fetch products on category change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();

        // Filter products based on categoryId
        const filteredProducts = data.products.filter(product => {
          return product.category === categoryId;
        });

        setProducts(filteredProducts);
        setLoading(false);
      } catch (error) {
        message.error('Error fetching products');
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId]);

  // Find category name based on categoryId
  const categoryName = categories.find(category => category.categoryId === categoryId)?.categoryName;

  // Render product rating stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(i < rating ? '⭐' : '☆');
    }
    return stars.join(' ');
  };

  // Trim product description
  const trimDescription = (description, maxLength = 50) => {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + '...';
    }
    return description;
  };

  if (loading) return <Text>Loading products...</Text>;

  if (products.length === 0) {
    return <Text>No products available for this category.</Text>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>{categoryName || 'Products'}</Title> {/* Display category name or 'Products' */}
      <Row gutter={[16, 16]} justify="start" align="top">
        {products.map((product) => (
          <Col xs={24} sm={12} md={8} lg={4} xl={4} key={product.productId}>
            <AntCard
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
                          ${(
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
                    backgroundColor: '#004f9a',
                  }}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card onClick from being triggered
                    if (authenticated) {
                      addToCart(product);
                      message.success(`${product.itemName} added to the cart`);
                    }
                  }}
                >
                  + ADD
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
            </AntCard>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProductsList;
