import React, { useState, useEffect } from 'react'; // For useState and useEffect
import { Row, Col, Card as AntCard, message, Typography, Button, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons'; // For search icon
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../utils/AuthContext';
import { useCart } from '../cart/CartContext'; // Import CartContext
import LayoutNew from '../../Layout';
import { Grid } from 'antd';

const { Title, Text } = Typography;
const { Search } = Input; // Ant Design Search component

const ProductsList = () => {
  const { categoryId } = useParams(); // Get categoryId from URL
  const [products, setProducts] = useState([]); // useState
  const [loading, setLoading] = useState(true); // useState
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // State to hold the search query
  const navigate = useNavigate();
  const { addToCart } = useCart(); // Access addToCart function
  const { authenticated } = useContext(AuthContext); // Access authenticated state
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);


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

  // Fetch products without filtering by categoryId
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();

        let allProducts = data.products;

        if (selectedCategoryId) {
          allProducts = allProducts.filter(
            (product) => Number(product.categoryId) === selectedCategoryId
          );
        }


        // Also filter with current search query if any
        if (searchQuery) {
          allProducts = allProducts.filter(product =>
            product.itemName.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        setProducts(allProducts);
        setLoading(false);
      } catch (error) {
        message.error('Error fetching products');
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategoryId, searchQuery]);


  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  

  // Sync selectedCategoryId with categoryId from URL
useEffect(() => {
  if (categoryId) {
    setSelectedCategoryId(Number(categoryId));
  }
}, [categoryId]);


  // Find category name based on categoryId
  const categoryName = categories.find(category => Number(category.categoryId) === Number(categoryId))?.categoryName;


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


  return (
    <LayoutNew>
      <div style={{ padding: '20px' }}>
        {/* Row for title and search bar */}
        <Row justify="space-between" align="middle" style={{ width: '100%' }}>
          <Col xs={24} sm={18} md={10} lg={14} style={{ display: 'flex', justifyContent: screens.lg ? 'flex-end' : 'center' }}>
            <Title
              level={2}
              style={{
                marginBottom: '5%',
                textAlign: screens.lg ? 'right' : 'center',
                width: '100%',
              }}
            >
              {categoryName || 'All Products'}
            </Title>
          </Col>
          <Col xs={24} sm={6} md={6} lg={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Search
              placeholder="Search products..."
              enterButton="Search"
              size="large"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)} // Update search query
              style={{ width: '100%', marginBottom: screens.xs ? '30px' : '0px' }} // Make it responsive
            />
          </Col>
        </Row>
        <Row gutter={[8, 8]} style={{ marginBottom: '20px' }} justify="center">
          <Col>
            <Button
              type={!selectedCategoryId ? 'primary' : 'default'}
              onClick={() => setSelectedCategoryId(null)}
            >
              All
            </Button>
          </Col>
          {categories.map((category) => (
            <Col key={category.categoryId}>
              <Button
                type={selectedCategoryId === category.categoryId ? 'primary' : 'default'}
                onClick={() => setSelectedCategoryId(Number(category.categoryId))}

              >
                {category.categoryName}
              </Button>
            </Col>
          ))}
        </Row>


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
    </LayoutNew>
  );
};

export default ProductsList;
