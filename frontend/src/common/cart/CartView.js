import React, { useContext,useEffect } from 'react';
import { Layout, Col, Row, Card, Button, Typography, InputNumber, List } from 'antd';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';
import LayoutNew from '../../Layout';
import { AuthContext } from '../../utils/AuthContext';
import { useDeadline } from "../DeadlineContext/DeadlineContext"; // Import Deadline Context
import truck from "../../Images/truck-.png";
import car from "../../Images/car.png";
import deliver from "../../Images/supplier.png";

const { Title, Text } = Typography;
const { Content } = Layout;

const CartView = () => {
  const { cart, removeFromCart, updateQuantity ,reloadCart} = useCart(); // Access cart context
  const { userDetails } = useContext(AuthContext);  // Access user details from the context
  const { deadline } = useDeadline(); // Access deadline from shared state
  const navigate = useNavigate();


  useEffect(() => {
    // Reload cart data when the component mounts
    reloadCart && reloadCart(); // Optional if reloadCart is defined in useCart
  }, []);
  



  
  const trimDescription = (description, maxLength = 50) => {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + '...';
    }
    return description;
  };


  // Calculate Subtotal and Savings based on quantity
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  const savings = cart.reduce((total, item) => total + (item.price * item.discount / 100) * item.quantity, 0).toFixed(2);

  const Total = cart.reduce(
    (total, item) => total + (item.price - (item.price * item.discount / 100)) * item.quantity,
    0
  );

  // Apply additional 12% increase if deadline is true
  const flashOfferIncrease = deadline ? Total * 0.12 : 0;
  const newTotal = (Total - flashOfferIncrease).toFixed(2);

  return (
    <LayoutNew>
      <Layout>
        <div style={{ display: 'flex', paddingRight: '90px' }}>
          <div style={{ flex: 1, marginRight: '50px' }}>
            <Title level={2}>Your Cart</Title>
            {cart.length === 0 ? (
              <Text>No items in the cart</Text>
            ) : (
              <div style={{ width: "830px", height: "250px", marginLeft: "100px", paddingTop: "23px" }}>
                <Row gutter={[16, 16]} justify="center">
                  <Col xs={24} sm={12} md={8} lg={8} style={{ display: "flex", justifyContent: "center" }}>
                    <Card
                      style={{
                        backgroundColor: "#f8f9fa",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        height: "200px",
                        width: "300px",
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <img
                        src={truck}
                        alt="Shipping Icon"
                        style={{ width: "100px", height: "100px", marginBottom: "10px" }}
                      />
                      <Text strong>Shipping</Text>
                    </Card>
                  </Col>

                  <Col xs={24} sm={12} md={8} lg={8} style={{ display: "flex", justifyContent: "center" }}>
                    <Card
                      style={{
                        backgroundColor: "#f8f9fa",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        height: "200px",
                        width: "300px",
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        boxShadow: "0 2px 4px rgba(251, 54, 54, 0.1)",
                      }}
                    >
                      <img
                        src={car}
                        alt="Pickup Icon"
                        style={{ width: "100px", height: "100px", marginBottom: "10px" }}
                      />
                      <Text strong>Pickup</Text>
                    </Card>
                  </Col>

                  <Col xs={24} sm={12} md={8} lg={8} style={{ display: "flex", justifyContent: "center" }}>
                    <Card
                      style={{
                        backgroundColor: "#f8f9fa",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        height: "200px",
                        width: "300px",
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <img
                        src={deliver}
                        alt="Delivery Icon"
                        style={{ width: "100px", height: "100px", marginBottom: "10px" }}
                      />
                      <Text strong>Delivery</Text>
                    </Card>
                  </Col>
                </Row>
              </div>
            )}

            {cart.length === 0 ? (
              <Text>No items in the cart</Text>
            ) : (
              <List
                dataSource={cart}
                renderItem={(item) => (
                  <List.Item
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      padding: '20px',
                      width: "830px",
                      marginLeft: "100px",
                      marginBottom: "2px",
                    }}
                  >
                    <div style={{ marginRight: '20px' }}>
                      <img
                        src={item.imageURL}
                        alt={item.itemName}
                        style={{
                          height: "120px",
                          objectFit: 'scale-down',
                          width: '120px',
                          padding: '10px',
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <Text strong style={{ fontSize: '18px' }}>{item.itemName}</Text>
                      <br />
                      <Text type="secondary" style={{ display: 'block', marginTop: '5px' }}>
                        {trimDescription(item.description)}
                      </Text>
                      <Text style={{ color: 'green', fontSize: '18px', display: 'block', marginTop: '10px' }}>
                        {item.discount > 0 ? (
                          `$${(item.price - (item.price * item.discount) / 100).toFixed(2)}`
                        ) : (
                          `$${item.price.toFixed(2)}`
                        )}
                      </Text>
                      <Text type="secondary" style={{ fontSize: '16px', display: 'block', marginTop: '5px' }}>
                        Standard Delivery within 7 Days
                      </Text>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <InputNumber
                        min={1}
                        value={item.quantity}
                        onChange={(value) => updateQuantity(item.productId, value)} // Directly calling updateQuantity
                        style={{ marginBottom: '10px', width: '60px' }}
                      />
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <Button
                        style={{
                          backgroundColor: 'red',
                          color: 'white',
                          borderRadius: '5px',
                          marginBottom: '10px',
                        }}
                        onClick={() => removeFromCart(item.productId)} // Directly calling removeFromCart
                      >
                        Remove
                      </Button>
                    </div>
                  </List.Item>
                )}
              />
            )}
          </div>

          {cart.length === 0 ? (
            <div />
          ) : (
            <div
              style={{
                flex: 1,
                padding: '20px',
                border: '1px solid #ddd',
                borderRadius: '10px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                textAlign: 'left',
                backgroundColor: '#f8f9fa',
                height: 'fit-content',
                marginTop: "103px"
              }}
            >
              <Title level={3} style={{ textAlign: 'center' }}>Order Summary</Title>

              {/* Displaying user address and phone */}
              <div style={{ marginBottom: '20px' }}>
                <Text style={{ fontSize: '16px' }}><strong>Shipping Address:</strong></Text>
                <Text style={{ float: 'right', fontSize: '16px' }}>
                  {userDetails ? userDetails.address : 'N/A'}
                  {userDetails ? userDetails.phone : 'N/A'}
                </Text>
              </div>
              <br />

              <div style={{ marginBottom: '20px', marginTop: "40px" }}>
                <Text style={{ fontSize: '16px' }}><strong>Subtotal ({cart.length} items)</strong></Text>
                <span style={{ float: 'right', textDecoration: 'line-through', color: 'gray' }}>
                  ${subtotal}
                </span>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <Text style={{ fontSize: '16px', color: 'green' }}><strong>Savings</strong></Text>
                <span style={{ float: 'right', color: 'green' }}>
                  -${savings}
                </span>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <span style={{ float: 'right', color: 'green', fontSize: '15px' }}>
                  ${cart.reduce((total, item) => total + (item.price - (item.price * item.discount) / 100) * item.quantity, 0).toFixed(2)}
                </span>
                <br />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <Text style={{ fontSize: '16px', color: 'grey' }}><strong>Shipping</strong></Text>
                <span style={{ float: 'right', color: 'green' }}>
                  Free
                </span>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <Text style={{ float: "left", fontSize: '16px', color: 'black' }}><strong>Taxes</strong></Text>
                <span style={{ float: 'right', color: 'grey', fontSize: "16px" }}>
                  Calculated at checkout
                </span>
                <br />
                <br />
                <br />
                {deadline && (
                  <div style={{ marginBottom: '10px' }}>
                    <Text><strong>Flash Offer Increase (12%)</strong></Text>
                    <span style={{ float: 'right', color: 'red' }}> -${flashOfferIncrease.toFixed(2)}</span>
                  </div>
                )}
              </div>
              <br />

              <div style={{ marginBottom: '20px', borderTop: '1px solid #ddd', paddingTop: '10px', marginTop: "20px" }}>
                <Text style={{ fontSize: '18px' }}><strong>Total</strong></Text>
                <span style={{ float: 'right', color: 'green', fontSize: '18px' }}>
                  ${newTotal}
                </span>
              </div>

              <Button
                type="primary"
                style={{ marginTop: '20px', width: '100%' }}
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </Button>
            </div>
          )}
        </div>
      </Layout>
    </LayoutNew>
  );
};

export default CartView;
