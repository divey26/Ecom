import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Spin, Alert, Collapse, Row, Col, Card, Tag, Button, Checkbox, Menu, Dropdown, Input, Form, Rate } from 'antd';
import { ShoppingCartOutlined, DollarCircleOutlined, MoreOutlined, CheckCircleOutlined, CloseCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import { Progress } from 'antd';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import Layout from '../../Layout';

const { Panel } = Collapse;

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]); // Track selected orders
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const loggedInUserId = localStorage.getItem('userId'); // Retrieve the logged-in userId from localStorage
        const response = await axios.get('http://localhost:5000/api/order/view');
        const ordersWithDetails = await Promise.all(response.data.orders.map(async (order) => {
          const updatedCartItems = await Promise.all(order.cartItems.map(async (item) => {
            try {
              const response = await axios.get(`http://localhost:5000/api/products/objectId/${item.productId._id}`);
              return {
                ...item,
                productDetails: response.data.product, // Store product details in each item
              };
            } catch (err) {
              console.error('Error fetching product details:', err);
              return item; // Return item without updates in case of error
            }
          }));
          return {
            ...order,
            cartItems: updatedCartItems, // Replace cartItems with updated items containing product details
          };
        }));
  
        // Filter orders based on the logged-in userId
        const filteredOrders = ordersWithDetails.filter(order => order.userId && order.userId._id === loggedInUserId);
        
        setOrders(filteredOrders); // Set filtered orders in the state
      } catch (err) {
        setError('Error fetching orders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrders();
  }, []);

  const handleCheckboxChange = (orderId, checked) => {
    setSelectedOrders(prevSelectedOrders => {
      if (checked) {
        return [...prevSelectedOrders, orderId];
      } else {
        return prevSelectedOrders.filter(id => id !== orderId);
      }
    });
  };

  const columns = [
    {
      title: 'Select',
      dataIndex: 'select',
      key: 'select',
      render: (_, order) => (
        <Checkbox onChange={e => handleCheckboxChange(order._id, e.target.checked)} />
      ),
    },
    {
      title: 'Order ID',
      dataIndex: '_id',
      key: '_id',
      render: (text) => <Tag color="purple">{text}</Tag>,
    },
    {
      title: 'User Details',
      key: 'userDetails',
      render: (order) => (
        <Collapse defaultActiveKey={[]} expandIconPosition="right">
          <Panel header="User Details" key="1" style={{ background: 'linear-gradient(to right, #4facfe, #00f2fe)', borderRadius: '10px' }}>
            <Row>
              <Col span={8}>
                <strong>Name: </strong>
                {order.userId ? `${order.userId.firstname} ${order.userId.lastname}` : 'N/A'}
              </Col>
              <Col span={8}>
                <strong>Email: </strong>
                {order.userId ? order.userId.email : 'N/A'}
              </Col>
              <Col span={8}>
                <strong>Phone: </strong>
                {order.userId ? order.userId.phone : 'N/A'}
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <strong>ID: </strong>
                {order.userId ? `${order.userId._id}` : 'N/A'}
              </Col>
            </Row>
          </Panel>
        </Collapse>
      ),
    },
    {
      title: 'Order Details',
      key: 'orderDetails',
      render: (order) => (
        <Collapse defaultActiveKey={[]} expandIconPosition="right">
          <Panel header="Order Details" key="2" style={{ background: '#e8e8e8', borderRadius: '10px' }}>
            <Row>
              <Col span={8}>
                <strong>Total Amount: </strong> <DollarCircleOutlined style={{ color: '#ffcc00' }} /> ${order.totalAmount}
              </Col>
              <Col span={8}>
                <strong>Payment Status: </strong>
                <Progress
                  type="circle"
                  width={40}
                  format={() => order.paymentStatus === 'succeeded' ? <CheckCircleOutlined style={{ color: 'green' }} /> : <CloseCircleOutlined style={{ color: 'red' }} />}
                />
              </Col>
              <Col span={8}>
                <strong>Order Date: </strong> {new Date(order.orderDate).toLocaleString()}
              </Col>
            </Row>
          </Panel>
        </Collapse>
      ),
    },
    {
      title: 'Shipping Address',
      key: 'shippingAddress',
      render: (order) => (
        <Collapse defaultActiveKey={[]} expandIconPosition="right">
          <Panel header="Shipping Address" key="3" style={{ background: 'linear-gradient(to right, #ff758c, #ff7eb3)', borderRadius: '10px' }}>
            {order.shippingAddress
              ? `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.country}`
              : 'N/A'}
          </Panel>
        </Collapse>
      ),
    },
    {
      title: 'Products',
      key: 'products',
      render: (order) => (
        <Collapse defaultActiveKey={[]} expandIconPosition="right">
          <Panel header={<span><ShoppingCartOutlined /> View Products</span>} key="4" style={{ background: 'linear-gradient(to right, #9d50bb, #6e48aa)', borderRadius: '10px' }}>
            {order.cartItems.map((item, index) => (
              <Card key={item._id || index} style={{ marginBottom: '15px', background: '#fff' }} >
                <Row>
                  <Col span={22}>
                    <strong>Product:</strong>
                    <br></br>
                    {item.productDetails ? item.productDetails.itemName : 'Loading...'}
                  </Col>
                  <Col span={2}>
                    <Checkbox />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <strong>Quantity:</strong> {item.quantity}
                  </Col>
                  <Col span={12}>
                    <strong>Price:</strong> ${item.price}
                  </Col>
                </Row>
              </Card>
            ))}
          </Panel>
        </Collapse>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (order) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="download">
                <PDFDownloadLink
                  document={<OrderPDF order={order} />}
                  fileName={`order_${order._id}.pdf`}
                >
                  {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
                </PDFDownloadLink>
              </Menu.Item>

              <Menu.Item >
                  Cancel Order
              </Menu.Item>
            </Menu>
          }
          trigger={['click']}
        >
          <Button icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  
  ];

  const OrderPDF = ({ order }) => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Order ID: {order._id}</Text>
        <Text>Payment Status: {order.paymentStatus}</Text>
        <Text>Order Date: {new Date(order.orderDate).toLocaleString()}</Text>
        <Text>Shipping Address: {order.shippingAddress ? `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.country}` : 'N/A'}</Text>
        <Text>User Details:</Text>
        <Text>Name: {order.userId ? `${order.userId.firstname} ${order.userId.lastname}` : 'N/A'}</Text>
        <Text>Email: {order.userId ? order.userId.email : 'N/A'}</Text>
        <Text>Phone: {order.userId ? order.userId.phone : 'N/A'}</Text>
        <Text style={styles.sectionHeader}>Products:</Text>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCell}>Product</Text>
          <Text style={styles.tableHeaderCell}>Quantity</Text>
          <Text style={styles.tableHeaderCell}>Price</Text>
        </View>

        {/* Table Body */}
        {order.cartItems.map((item, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={styles.tableCell}>{item.productDetails ? item.productDetails.itemName : 'Unknown Product'}</Text>
            <Text style={styles.tableCell}>{item.quantity}</Text>
            <Text style={styles.tableCell}>${item.price}</Text>
          </View>
        ))}
        <Text style={{ marginTop: 35, marginLeft: 300 }}>Total Amount: ${order.totalAmount}</Text>
      </Page>
    </Document>
  );

  const styles = StyleSheet.create({
    page: {
      padding: 20,
    },
    header: {
      fontSize: 18,
      marginBottom: 10,
      textAlign: 'center',
    },
    sectionHeader: {
      fontSize: 14,
      marginTop: 20,
      marginBottom: 10,
      fontWeight: 'bold',
    },
    tableHeader: {
      flexDirection: 'row',
      borderBottom: '1px solid #000',
      marginBottom: 5,
    },
    tableHeaderCell: {
      width: '33%',
      fontWeight: 'bold',
      textAlign: 'center',
      padding: 5,
    },
    tableRow: {
      flexDirection: 'row',
      marginBottom: 5,
    },
    tableCell: {
      width: '33%',
      textAlign: 'center',
      padding: 5,
    },
  });

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleSubmitFeedback = () => {
    console.log('Feedback submitted:', feedback);
    setFeedback(''); // Clear feedback after submission
  };

  return (
    <Layout>
      <div>
        {loading ? (
          <Spin size="large" />
        ) : error ? (
          <Alert message="Error" description={error} type="error" />
        ) : (
          <>
            <Table
              columns={columns}
              dataSource={orders}
              rowKey="_id"
              pagination={{ pageSize: 10 }}
            />
            {selectedOrders.map(orderId => {
              const order = orders.find(order => order._id === orderId);
              return (
                <Card key={orderId} style={{ marginTop: 20 }}>
                  <h3>Order Details</h3>
                  <p><strong>Order ID: </strong>{order._id}</p>
                  <p><strong>Total Amount: </strong>${order.totalAmount}</p>
                  <p><strong>Order Date: </strong>{new Date(order.orderDate).toLocaleString()}</p>
                  <p><strong>Shipping Address: </strong>{order.shippingAddress ? `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.country}` : 'N/A'}</p>
                  <h4>Products:</h4>
                  <ul>
                    {order.cartItems.map((item, index) => (
                      <li key={index}>
                        {item.productDetails ? item.productDetails.itemName : 'Unknown Product'} - ${item.price} (x{item.quantity})
                      </li>
                    ))}
                  </ul>
                </Card>
              );
            })}
            
            <div style={{ marginTop: '20px' }}>
              <h3>Feedback</h3>
              <Form onFinish={handleSubmitFeedback}>
                <Form.Item>
                  <Input.TextArea
                    rows={4}
                    value={feedback}
                    onChange={handleFeedbackChange}
                    placeholder="Leave your feedback here"
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">Submit Feedback</Button>
                </Form.Item>
              </Form>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default OrderList;
