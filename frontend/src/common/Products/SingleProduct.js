import React, { useState, useEffect , useContext} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Typography, Skeleton, message, Card, Button } from 'antd';
import LayoutNew from '../../Layout';
import { AuthContext } from '../../utils/AuthContext';
import { useCart } from '../cart/CartContext'; // Import CartContext

import sell from "../../Images/sell.png";
import trolly from "../../Images/trolly.png";
import warrenty from "../../Images/warrenty.png";
import returned from "../../Images/14.png";


const { Title, Text } = Typography;

const SingleProduct = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userDetails,authenticated } = useContext(AuthContext);  // Access user details from the context
  const { addToCart } = useCart(); // Access addToCart function
  

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${productId}`);
        setProduct(response.data.product);
        setLoading(false);
      } catch (error) {
        message.error('Error fetching product details');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) return <Skeleton active />;
  if (!product) return <Text>No product found</Text>;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(i < rating ? '⭐' : '☆');
    }
    return stars.join(' ');
  };

  return (
    <LayoutNew>
      <div style={{ padding: '20px' }}>
        <Row gutter={16}>
          {/* Main Product Details Card */}
          <Col xs={24} md={16}>
            <Card>
              <Row gutter={16}>
                {/* Left Column: Product Image */}
                <Col xs={24} md={12}>
                  <img
                    alt={product.itemName}
                    src={product.imageURL}
                    style={{ width: '100%', height: '300px', objectFit: 'contain', marginBottom: '20px' }}
                  />
                </Col>

                {/* Right Column: Product Details */}
                <Col xs={24} md={12} style={{ textAlign: 'left' }}>
                <Title level={3}>{product.itemName}</Title>
                <Row align="middle" style={{ marginBottom: '20px' }}>
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
                <Text style={{ fontSize: '15px' }}>
                    {renderStars(product.rating)} {product.rating}
                </Text>

                <br/>

                <Text>{product.description}</Text>
                <div style={{ marginTop: '20px' }}>

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

                </div>
                </Col>

              </Row>
            </Card>
          </Col>

          {/* New Card on the Right */}
          <Col xs={24} md={8}>
            
              
         <div               
              style={{
                flex: 1,
                padding:'30px',
                border: '1px solid #ddd',
                borderRadius: '10px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                textAlign: 'left',
                backgroundColor: '#f8f9fa',
                height: 'fit-content',
              }}>

              
              {/* Displaying user address and phone */}
                <Text style={{ fontSize: '16px' }}><strong>Shipping Address:</strong></Text>
                <br/>
                <br/>
            <div style={{marginBottom:'10px'}}>
                <Text style={{  fontSize: '13px' }}>
                  {userDetails ? userDetails.address : 'N/A'}
                  <br/>
                  {userDetails ? userDetails.phone : 'N/A'}
                </Text>
            </div>
                

            <div style={{ borderTop: '1px solid #ddd',paddingTop:'10px',marginTop: '20px'}}>
                    <Text strong>Delivery Options :</Text>
                    </div>
            
            <br/>
                 <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={trolly}
                      alt="trolly Icon"
                      style={{ width: "30px", height: "30px", marginRight: "8px" }}
                    />
                    <span>Standard Delivery Rs. 250</span>
                  </div>

                  <br/>
                  
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={sell}
                      alt="Truck Icon"
                      style={{ width: "30px", height: "30px", marginRight: "8px" }}
                    />
                    <Text>Cash on Delivery Available</Text>
                    </div>

                    <div style={{ borderTop: '1px solid #ddd',paddingTop:'10px',marginTop: '20px'}}>
                    <Text strong>Return & Warranty:</Text>
                    </div>

                    <br/>

                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={returned}
                      alt="returned Icon"
                      style={{ width: "30px", height: "30px", marginRight: "8px" }}
                    />
                    <Text>14 days easy return</Text>
                    </div>

                    <br/>

                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={warrenty}
                      alt="warrenty Icon"
                      style={{ width: "30px", height: "30px", marginRight: "8px" }}
                    />
                    <Text>1 Year Warranty</Text>
                    </div>
                   </div>
                  
          </Col>
        </Row>
      </div>
    </LayoutNew>
  );
};

export default SingleProduct;
